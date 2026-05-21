#!/bin/bash
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
until python -c "
import psycopg2, os, sys
try:
    psycopg2.connect(os.environ.get('DATABASE_URL', ''))
    print('✅ Database is ready.')
except Exception as e:
    sys.exit(1)
" 2>/dev/null; do
  echo "   → DB not ready yet, retrying in 2s..."
  sleep 2
done

echo "🔧 Creating database tables..."
python -c "
from app import app
from extensions import db
with app.app_context():
    db.create_all()
    print('✅ Tables created successfully.')
"

echo "🚀 Starting CloudForge backend..."
exec gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:5000 --timeout 120 --log-level info app:app
