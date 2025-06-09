#!/bin/sh
set -e

# Wait for form-api to be ready
./start.sh

# Start the tunnel and wait for URL
# //Uncomment ./run-tunnel.sh if you want to run the tunnel script, need to install cloudflared and uncomment run-tunnel.sh in Dockerfile
# ./run-tunnel.sh

# Start nginx in foreground
echo "Starting nginx..."
exec nginx -g 'daemon off;'
