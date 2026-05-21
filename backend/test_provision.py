import sys
import os
from datetime import datetime, timedelta, timezone

# Mock current_app and db to directly test logic
try:
    from app import create_app
    from extensions import db
    from models.models import User, Environment, AuditLog
    
    app = create_app()
    with app.app_context():
        # Fetch a test user
        u = User.query.first()
        if not u:
            print("No user in DB!")
            sys.exit(1)
        
        print(f"Testing logic with user: {u.username} (ID: {u.id})")
        
        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
        
        # Attempt constructing same objects
        new_env = Environment(
            user_id=u.id,
            environment_name="diag-test",
            instance_type="t2.micro",
            status='PROVISIONING',
            expires_at=expires_at
        )
        db.session.add(new_env)
        
        log = AuditLog(user_id=u.id, action='PROVISION', resource="diag-test", status='STARTED')
        db.session.add(log)
        
        print("Attempting Commit...")
        db.session.commit()
        print("COMMIT SUCCESSFUL! Logical error is NOT in DB commit.")
        
        # Clean up
        db.session.delete(new_env)
        db.session.delete(log)
        db.session.commit()
        
except Exception as e:
    import traceback
    traceback.print_exc()
    print("\nCaught Exception:", e)
