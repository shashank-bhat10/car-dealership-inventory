"""Exercise the real migration path, without Base.metadata.create_all."""
import os
from pathlib import Path
import subprocess
import sys

import pytest


BACKEND = Path(__file__).resolve().parents[1]


def migration_environment(database_url):
    env = dict(os.environ)
    env.pop('NEW_DATABASE_URL', None)
    env.update(DATABASE_URL=database_url, TEST_DATABASE_URL=database_url,
               JWT_SECRET_KEY='migration-smoke-test-only')
    return env


def run_python(args, env):
    result = subprocess.run([sys.executable, *args], cwd=BACKEND, env=env,
                            capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    return result.stdout


DATABASES = ['sqlite']
if os.getenv('POSTGRES_MIGRATION_TEST_URL'):
    DATABASES.append('postgresql')


@pytest.mark.parametrize('database', DATABASES)
def test_fresh_migrations_support_auth_and_admin_vehicle_updates(tmp_path, database):
    url = (f'sqlite:///{tmp_path / "fresh.db"}' if database == 'sqlite'
           else os.environ['POSTGRES_MIGRATION_TEST_URL'])
    env = migration_environment(url)
    run_python(['-m', 'alembic', 'upgrade', 'head'], env)
    # Running the documented setup twice must be safe.
    run_python(['-m', 'alembic', 'upgrade', 'head'], env)
    run_python(['-c', '''
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy import inspect, text
from app.main import app
from app.database import engine

assert {'users', 'vehicles', 'alembic_version'} <= set(inspect(engine).get_table_names())
with TestClient(app) as client:
    email = f'{uuid4().hex}@example.com'
    payload = {'username': uuid4().hex, 'email': email, 'password': 'SmokeTest123!'}
    assert client.post('/api/auth/register', json=payload).status_code == 201
    login = client.post('/api/auth/login', json={'email': email, 'password': payload['password']})
    assert login.status_code == 200, login.text
    headers = {'Authorization': 'Bearer ' + login.json()['access_token']}
    with engine.begin() as db:
        db.execute(text("UPDATE users SET role = 'ADMIN' WHERE email = :email"), {'email': email})
    created = client.post('/api/vehicles', headers=headers, json={
        'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan', 'price': 20000, 'quantity': 5})
    assert created.status_code == 201, created.text
    vehicle_id = created.json()['id']
    changed = client.put(f'/api/vehicles/{vehicle_id}', headers=headers, json={'model': 'Corolla'})
    assert changed.status_code == 200, changed.text
    assert changed.json()['model'] == 'Corolla'
    with engine.begin() as db:
        db.execute(text("UPDATE users SET role = 'USER' WHERE email = :email"), {'email': email})
    denied = client.put(f'/api/vehicles/{vehicle_id}', headers=headers, json={'model': 'Forbidden'})
    assert denied.status_code == 403, denied.text
    assert client.get(f'/api/vehicles/{vehicle_id}', headers=headers).json()['model'] == 'Corolla'
'''], env)


def test_offline_migrations_use_database_url(tmp_path):
    env = migration_environment(f'sqlite:///{tmp_path / "offline.db"}')
    # The initial revision can be rendered without a live database connection.
    sql = run_python(['-m', 'alembic', 'upgrade', '8dc722f61ffc', '--sql'], env)
    assert 'CREATE TABLE users' in sql
    assert 'CREATE TABLE vehicles' in sql
