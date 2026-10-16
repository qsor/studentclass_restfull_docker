import os
import sys
import time

import psycopg2


def wait_for_db(timeout=60):
    host = os.environ.get('DB_HOST', 'db')
    port = os.environ.get('DB_PORT', '5432')
    user = os.environ.get('DB_USER', 'postgres')
    password = os.environ.get('DB_PASSWORD', 'postgres')
    dbname = os.environ.get('DB_NAME', 'studentclass')

    start = time.time()
    while True:
        try:
            psycopg2.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                dbname=dbname,
            )
            print('Database is ready')
            return
        except psycopg2.OperationalError:
            if time.time() - start > timeout:
                print('Timeout waiting for database')
                sys.exit(1)
            print('Waiting for database...')
            time.sleep(2)


if __name__ == '__main__':
    wait_for_db()
