from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'developer')
    
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400
        
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password_hash=pw_hash, role=role)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Bad email or password"}), 401
        
    access_token = create_access_token(identity={'id': user.id, 'role': user.role, 'username': user.username})
    return jsonify(access_token=access_token, user={'id': user.id, 'username': user.username, 'role': user.role}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real system, you'd add the JWT to a blocklist
    return jsonify({"msg": "Logged out successfully"}), 200

@auth_bp.route('/social-mock', methods=['POST'])
def social_mock_login():
    data = request.get_json()
    provider = data.get('provider', 'Google')
    
    mock_email = f"social_{provider.lower()}@cloudforge.io"
    mock_username = f"{provider}_User"
    
    # Ensure this special provisioned user exists so the JWT points to a real DB record!
    user = User.query.filter_by(email=mock_email).first()
    if not user:
        # Just inject random stub pw since it will never be used.
        stub_pw = bcrypt.generate_password_hash('dummy_key_override').decode('utf-8')
        user = User(username=mock_username, email=mock_email, password_hash=stub_pw, role='admin')
        db.session.add(user)
        db.session.commit()

    # Issue the REAL functioning secure token directly
    access_token = create_access_token(identity={'id': user.id, 'role': user.role, 'username': user.username})
    return jsonify(access_token=access_token, user={'id': user.id, 'username': user.username, 'role': user.role}), 200

@auth_bp.route('/google-verify', methods=['POST'])
def google_verify():
    import requests
    data = request.get_json()
    token = data.get('idToken')
    if not token: return jsonify({"msg": "No token"}), 400

    try:
        # Live reach-out to Google validation cluster
        verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        response = requests.get(verify_url, timeout=6)
        if response.status_code != 200:
            return jsonify({"msg": "Google identity could not be verified live."}), 401
            
        g_data = response.json()
        g_email = g_data.get('email')
        g_name = g_data.get('name', 'GoogleUser')
        
        if not g_email: return jsonify({"msg": "Authorized email identity missing"}), 400
        
        user = User.query.filter_by(email=g_email).first()
        if not user:
            # Register true external entity automatically
            user = User(username=g_name, email=g_email, password_hash="GOOGLE_TRUSTED_PROVIDER", role='developer')
            db.session.add(user)
            db.session.commit()

        final_token = create_access_token(identity={'id': user.id, 'role': user.role, 'username': user.username})
        return jsonify(access_token=final_token, user={'id': user.id, 'username': user.username, 'role': user.role}), 200
    except Exception as e:
        return jsonify({"msg": "Verification failure", "error": str(e)}), 500
