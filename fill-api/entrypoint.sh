#! /bin/sh

# //script to wait for the PostgreSQL service to be ready
# ---
# echo "Waiting for form-psql to be ready..."

# until nc -z form-psql 5432; do   # //can be used in both Docker and Kubernetes with default namespace    # until nc -z form-psql.default.svc.cluster.local 5432; do   # //Uncomment this full hostname if using Kubernetes only
#     echo "form-psql is not ready yet. Retrying in 3 seconds..."
#     sleep 3
# done

# echo "form-psql is up! - continuing..."
# ---

echo "Running Prisma migration..."
npx prisma migrate deploy

echo "Starting app with: $@"
exec "$@"