import functools
from flask import Blueprint, jsonify, request
from extensions import db
from models.models import User, Environment, AuditLog
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

admin_bp = Blueprint('admin', __name__)


def admin_required(fn):
    """Decorator that requires a valid JWT with admin role."""
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        if current_user.get('role') != 'admin':
            return jsonify({"msg": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "created_at": u.created_at.isoformat() if u.created_at else None
    } for u in users]), 200


@admin_bp.route('/environments', methods=['GET'])
@admin_required
def get_all_environments():
    envs = Environment.query.order_by(Environment.created_at.desc()).all()
    return jsonify([{
        "id": e.id,
        "user_id": e.user_id,
        "name": e.environment_name,
        "status": e.status,
        "instance_type": e.instance_type,
        "cost": e.estimated_cost,
        "created_at": e.created_at.isoformat() if e.created_at else None
    } for e in envs]), 200


@admin_bp.route('/audit/logs', methods=['GET'])
@admin_required
def get_audit_logs():
    limit = request.args.get('limit', 50, type=int)
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return jsonify([{
        "id": l.id,
        "user_id": l.user_id,
        "action": l.action,
        "resource": l.resource,
        "status": l.status,
        "timestamp": l.timestamp.isoformat() if l.timestamp else None
    } for l in logs]), 200
