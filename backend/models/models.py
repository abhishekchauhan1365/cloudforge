from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='developer') # 'admin' or 'developer'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    environments = db.relationship('Environment', backref='owner', lazy=True)
    audit_logs = db.relationship('AuditLog', backref='user', lazy=True)

class Environment(db.Model):
    __tablename__ = 'environments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    environment_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='PENDING') # PENDING, PROVISIONING, RUNNING, FAILED, DESTROYING, DESTROYED
    instance_type = db.Column(db.String(50), nullable=False)
    estimated_cost = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    destroyed_at = db.Column(db.DateTime, nullable=True)
    
    # Optional metadata store like instance IP, etc
    metadata_json = db.Column(db.JSON, nullable=True)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    resource = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False)
