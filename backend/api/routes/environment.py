from flask import Blueprint, request, jsonify, current_app
from extensions import db, socketio
from models.models import Environment, AuditLog
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta, timezone
import threading
import time
import os
import subprocess

env_bp = Blueprint('env', __name__)

# Helper to trigger local Terraform execution (bypassing Jenkins for local demo)
def trigger_jenkins_provision(env_id, user_name, instance_type):
    # Capture app reference before spawning thread
    app = current_app._get_current_object()

    def run_terraform():
        socketio.emit('log', {'env_id': env_id, 'message': 'Starting Native Terraform Execution...'}, namespace='/')
        
        # Path to terraform directory (3 levels up from backend/api/routes)
        tf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'terraform'))
        
        try:
            # Terraform Init
            socketio.emit('log', {'env_id': env_id, 'message': 'Running: terraform init'}, namespace='/')
            process_init = subprocess.Popen(['terraform', 'init'], cwd=tf_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            for line in iter(process_init.stdout.readline, ''):
                if line.strip(): socketio.emit('log', {'env_id': env_id, 'message': line.strip()}, namespace='/')
            process_init.stdout.close()
            process_init.wait()

            if process_init.returncode != 0:
                raise Exception("Terraform init failed")

            # Terraform Apply
            socketio.emit('log', {'env_id': env_id, 'message': f'Running: terraform apply -auto-approve (Provisioning {instance_type})'}, namespace='/')
            process_apply = subprocess.Popen(['terraform', 'apply', '-auto-approve'], cwd=tf_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            for line in iter(process_apply.stdout.readline, ''):
                if line.strip(): socketio.emit('log', {'env_id': env_id, 'message': line.strip()}, namespace='/')
            process_apply.stdout.close()
            process_apply.wait()

            if process_apply.returncode != 0:
                raise Exception("Terraform apply failed")

            with app.app_context():
                env = db.session.get(Environment, env_id)
                if env:
                    env.status = 'RUNNING'
                    env.estimated_cost = 1.20
                    env.metadata_json = {"ip_address": "Check AWS Console", "region": os.getenv('AWS_DEFAULT_REGION', 'us-east-1')}
                    db.session.commit()

            socketio.emit('log', {'env_id': env_id, 'message': 'Provisioning Complete!'}, namespace='/')
            socketio.emit('status_update', {'env_id': env_id, 'status': 'RUNNING'}, namespace='/')
            
        except Exception as e:
            socketio.emit('log', {'env_id': env_id, 'message': f'ERROR: {str(e)}'}, namespace='/')
            with app.app_context():
                env = db.session.get(Environment, env_id)
                if env:
                    env.status = 'FAILED'
                    db.session.commit()
            socketio.emit('status_update', {'env_id': env_id, 'status': 'FAILED'}, namespace='/')
        
    socketio.start_background_task(run_terraform)


@env_bp.route('/provision', methods=['POST'])
@jwt_required()
def provision_environment():
    current_user = get_jwt_identity()
    data = request.get_json()
    env_name = data.get('environment_name')
    instance_type = data.get('instance_type', 't2.micro')
    
    # Calculate expiry (24 hours from now)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    
    new_env = Environment(
        user_id=current_user['id'],
        environment_name=env_name,
        instance_type=instance_type,
        status='PROVISIONING',
        expires_at=expires_at
    )
    db.session.add(new_env)
    
    # Add audit log
    log = AuditLog(user_id=current_user['id'], action='PROVISION', resource=env_name, status='STARTED')
    db.session.add(log)
    
    db.session.commit()
    
    # Trigger CI/CD (mocked for now with socket stream)
    trigger_jenkins_provision(new_env.id, current_user['username'], instance_type)
    
    return jsonify({"msg": "Provisioning started", "environment_id": new_env.id}), 202

@env_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_environments():
    current_user = get_jwt_identity()
    if current_user['role'] == 'admin':
        envs = Environment.query.all()
    else:
        envs = Environment.query.filter_by(user_id=current_user['id']).all()
        
    result = []
    for env in envs:
        result.append({
            "id": env.id,
            "name": env.environment_name,
            "status": env.status,
            "instance_type": env.instance_type,
            "estimated_cost": env.estimated_cost,
            "created_at": env.created_at.isoformat() if env.created_at else None,
            "expires_at": env.expires_at.isoformat() if env.expires_at else None,
            "metadata": env.metadata_json
        })
    return jsonify(result), 200

@env_bp.route('/<int:env_id>', methods=['GET'])
@jwt_required()
def get_environment(env_id):
    env = db.get_or_404(Environment, env_id)
    return jsonify({
        "id": env.id,
        "name": env.environment_name,
        "status": env.status,
        "instance_type": env.instance_type,
        "created_at": env.created_at.isoformat() if env.created_at else None,
        "expires_at": env.expires_at.isoformat() if env.expires_at else None,
        "metadata": env.metadata_json
    }), 200

def trigger_jenkins_destroy(env_id, app):
    def run_terraform_destroy():
        socketio.emit('log', {'env_id': env_id, 'message': 'Starting Terraform Destroy...'}, namespace='/')
        tf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'terraform'))
        
        try:
            process_destroy = subprocess.Popen(['terraform', 'destroy', '-auto-approve'], cwd=tf_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            for line in iter(process_destroy.stdout.readline, ''):
                if line.strip(): socketio.emit('log', {'env_id': env_id, 'message': line.strip()}, namespace='/')
            process_destroy.stdout.close()
            process_destroy.wait()

            if process_destroy.returncode != 0:
                raise Exception("Terraform destroy failed")

            with app.app_context():
                env = db.session.get(Environment, env_id)
                if env:
                    env.status = 'DESTROYED'
                    env.destroyed_at = datetime.now(timezone.utc)
                    db.session.commit()

            socketio.emit('log', {'env_id': env_id, 'message': 'Environment Destroyed!'}, namespace='/')
            socketio.emit('status_update', {'env_id': env_id, 'status': 'DESTROYED'}, namespace='/')
            
        except Exception as e:
            socketio.emit('log', {'env_id': env_id, 'message': f'ERROR: {str(e)}'}, namespace='/')
            with app.app_context():
                env = db.session.get(Environment, env_id)
                if env:
                    env.status = 'FAILED_DESTROY'
                    db.session.commit()
            socketio.emit('status_update', {'env_id': env_id, 'status': 'FAILED_DESTROY'}, namespace='/')

    socketio.start_background_task(run_terraform_destroy)

@env_bp.route('/destroy', methods=['POST'])
@jwt_required()
def destroy_environment():
    current_user = get_jwt_identity()
    data = request.get_json()
    env_id = data.get('environment_id')

    env = db.get_or_404(Environment, env_id)
    if env.user_id != current_user['id'] and current_user['role'] != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403

    env.status = 'DESTROYING'

    log = AuditLog(user_id=current_user['id'], action='DESTROY', resource=env.environment_name, status='STARTED')
    db.session.add(log)
    db.session.commit()

    app = current_app._get_current_object()
    trigger_jenkins_destroy(env.id, app)

    return jsonify({"msg": "Destroy initiated"}), 202
