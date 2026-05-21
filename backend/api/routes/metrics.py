from flask import Blueprint, jsonify, Response
from prometheus_client import generate_latest, Counter, Gauge, CONTENT_TYPE_LATEST
from models.models import Environment, User
from flask_jwt_extended import jwt_required

metrics_bp = Blueprint('metrics', __name__)

# Prometheus Metrics
ENV_CREATED_COUNTER = Counter('cloudforge_environments_created_total', 'Total environments created')
ENV_DESTROYED_COUNTER = Counter('cloudforge_environments_destroyed_total', 'Total environments destroyed')
ACTIVE_ENV_GAUGE = Gauge('cloudforge_active_environments', 'Number of currently active environments')

@metrics_bp.route('/metrics', methods=['GET'])
def get_prometheus_metrics():
    # Update gauge with current running env count
    active_count = Environment.query.filter_by(status='RUNNING').count()
    ACTIVE_ENV_GAUGE.set(active_count)
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST), 200

@metrics_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    total_envs = Environment.query.count()
    active_envs = Environment.query.filter_by(status='RUNNING').count()
    users = User.query.count()
    
    # Calculate estimated cost
    total_cost = sum([e.estimated_cost for e in Environment.query.all() if e.estimated_cost])
    
    return jsonify({
        "total_environments": total_envs,
        "active_environments": active_envs,
        "total_users": users,
        "monthly_estimated_cost": total_cost,
        "provision_success_rate": 98.5 # Mocked for now
    }), 200
