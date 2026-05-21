from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
import random

orchestrator_bp = Blueprint('orchestrator', __name__)

@orchestrator_bp.route('/cluster/status', methods=['GET'])
@jwt_required()
def get_cluster_status():
    """Simulated dynamic Kubernetes Pod & Docker Container telemetry matrix"""
    pods = [
        {
            "id": f"pod-df8{random.randint(100, 999)}-{i}",
            "name": f"frontend-node-0{i}",
            "namespace": "production",
            "status": random.choice(["RUNNING", "RUNNING", "RUNNING", "PENDING"]),
            "restarts": random.randint(0, 3),
            "cpu": f"{random.randint(15, 85)}m",
            "memory": f"{random.randint(128, 512)}Mi",
            "type": "Kubernetes Pod",
            "image": "nginx:stable-alpine"
        } for i in range(1, 4)
    ] + [
        {
            "id": f"container-id-{random.randint(10000, 99999)}",
            "name": "api-gateway",
            "namespace": "default",
            "status": "RUNNING",
            "restarts": 0,
            "cpu": f"{random.randint(50, 200)}m",
            "memory": "1Gi",
            "type": "Docker Container",
            "image": "node:18-slim"
        },
        {
            "id": f"pod-xcv{random.randint(100, 999)}",
            "name": "postgres-master",
            "namespace": "database",
            "status": "RUNNING",
            "restarts": 0,
            "cpu": "400m",
            "memory": "2Gi",
            "type": "StatefulSet",
            "image": "postgres:15-alpine"
        }
    ]

    metrics = {
        "nodes_active": random.randint(3, 5),
        "total_pods": len(pods),
        "cluster_health": "HEALTHY",
        "api_server_latency": f"{random.randint(5, 25)}ms",
        "pods": pods
    }
    return jsonify(metrics), 200
