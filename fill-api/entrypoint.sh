#! /bin/sh

echo "Running Prisma migration..."
npx prisma migrate deploy

echo "Starting app with: $@"
exec "$@"