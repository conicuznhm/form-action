#!/bin/sh
set -e
# sh script only check for DNS reslover for form-api ip version
# not include(load) cloudflared and not auto run cloudflared tunnel --url
# to use this old.entrypoint.sh, 1st rename the previous entrypoint.sh to test.entrypoint.sh 
# 2nd rename old.entrypoint.sh to entrypoint.sh,

# Function to check if form-api is ready
wait_for_form_api() {
    echo "Waiting for form-api to be ready..."
    until nc -z form-api 8899 || nc -z 10.88.0.20 8899; do
        echo "form-api is not ready yet. Waiting..."
        sleep 2
    done
    echo "form-api is up - continuing..."
}

# wait for form-api
wait_for_form_api

# Start nginx with daemon off
echo "Starting nginx..."
nginx -g 'daemon off;'