from flask import Flask, jsonify
from config import Config
from extensions import db, jwt, bcrypt, cors, socketio
from api.routes.auth import auth_bp
from api.routes.environment import env_bp
from api.routes.admin import admin_bp
from api.routes.metrics import metrics_bp
from api.routes.orchestration import orchestrator_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)
    socketio.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(env_bp, url_prefix='/api/environment')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(metrics_bp, url_prefix='/api')
    app.register_blueprint(orchestrator_bp, url_prefix='/api')

    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy"}), 200

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
