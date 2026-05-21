import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

db_uri = os.environ.get('DATABASE_URL')
if not db_uri:
    postgres_uri = 'postgresql://postgres:postgres@localhost:5432/cloudforge'
    try:
        import psycopg2
        # Short timeout to prevent blocking startup if postgres is not running
        conn = psycopg2.connect(
            dbname="cloudforge",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432",
            connect_timeout=1
        )
        conn.close()
        db_uri = postgres_uri
        print("Connected to local PostgreSQL successfully.")
    except Exception:
        db_uri = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'cloudforge.db')
        print(f"Local PostgreSQL not available. Falling back to local SQLite: {db_uri}")

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = db_uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # 1 day
    
    # AWS Settings
    AWS_REGION = os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
    
    # Jenkins Settings
    JENKINS_URL = os.environ.get('JENKINS_URL')
    JENKINS_USER = os.environ.get('JENKINS_USER')
    JENKINS_TOKEN = os.environ.get('JENKINS_TOKEN')
