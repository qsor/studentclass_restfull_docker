#!/bin/sh
set -e

python wait_for_db.py

python manage.py migrate --noinput

python manage.py seed_db

exec "$@"
