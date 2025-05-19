#!/bin/sh
set -e

# Wait for form-api to be ready
./start.sh

# Start the tunnel and wait for URL
./run-tunnel.sh

# Start nginx in foreground
echo "Starting nginx..."
exec nginx -g 'daemon off;'
