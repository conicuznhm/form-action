#!/bin/sh
set -e

# //Wait for form-api to be ready
# //to use uncomment ./start.sh and in Dockerfile uncomment COPY start.sh /start.sh, RUN dos2unix start.sh entrypoint.sh, RUN chmod +x /start.sh /entrypoint.sh
# ./start.sh

# //Start the tunnel and wait for URL
# //Uncomment ./run-tunnel.sh if you want to run the tunnel script, need to install cloudflared and uncomment run-tunnel.sh in Dockerfile
# ./run-tunnel.sh

# //Start nginx in foreground
echo "Starting nginx..."
exec nginx -g 'daemon off;'