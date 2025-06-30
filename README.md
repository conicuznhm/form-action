for run docker or podman container, use tag version v_     i.e => form-vite:v7  form-api:v7
that images are set check dependency availability logic('until nc -z container-name (or service-name in k8s)' in imgae) 
to check if dependency app container ready, then run the next app container (psql --> form-api --> form-vite)

for run pod in k8s, use version 1.0._    i.e => form-vite:1.0.8   form-api:1.0.8
that images are removed check dependency availability logic('until nc -z' in images)
for flexible use in k8s service name
in k8s definition file yaml, implemented initContainer instead of 'until nc -z', to check if app service in pod available
then apply next pod (psql --> form-api --> form-vite)   
recommend to use tag version at least >= 1.0.8  for clean from in-image check logic


Back-end (form-api)  and  database psql

//for build image api
podman build -t form-api:v6 --no-cache .
podman build -t form-api:v6 .

podman network create my-network
podman network create --driver bridge --subnet 10.89.0.0/24 --gateway 10.89.0.1 my-network

//for run api
podman run --name form-api --env-file .env.local --network my-network -p 8899:8899 -d form-api:1

podman run --name form-api \
 -e DATABASE_URL=postgresql://postgres:password@form-psql:5432/form_db \
 -e PORT=8899 \
 -e NODE_ENV=development \
 --network my-network \
 -p 8899:8899 \
 -d form-api:1

for NODE_ENV, if need to allow reset-rate-limit api => NODE_ENV=development
              if not allow reset-rate-limit api     => NODE_ENV=deploy or anything except development  

//to push image to ghcr.io
podman login ghcr.io
podman tag form-api:1  ghcr.io/conicuznhm/form-api:1
podman push ghcr.io/conicuznhm/form-api:1

//to pull image
podman pull ghcr.io/conicuznhm/form-api:1

//for database connect to postgres by using DNS resolver from container name, vite,api,psql are in the same network

podman volume create form-data
podman run --name form-psql -e POSTGRES_PASSWORD=password -e POSTGRES_DB=form_db -v form-data:/var/lib/postgresql/data --network my-network -p 5432:5432 -d postgres:17.5
//or
podman run --name form-psql \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=form_db \
-v form-data:/var/lib/postgresql/data \
--network my-network \
-p 5432:5432 \
-d postgres:17.5



For run container with specifically connect to container ip address
demo lab for learn .env and .env.local are expose to public
in production .env, .env.local, .env* will be in gitignore

in .env file or .env.local file
do not use "" for url postgresql://..., don't use "postgresql://postgres:password@10.88.0.35:5432/form_db"

//for api run that specific ip, and container connect by ip address
use fix ip for connection between api and database psql
podman run --name form-api --env-file .env.local -p 8899:8899 -d --ip 10.88.0.20 form-api:v1

//or for -e can use "" for url like "postgresql://postgres:password@10.88.0.35:5432/form_db" but not recommended
podman run --name form-api \
 -e DATABASE_URL=postgresql://postgres:password@10.88.0.35:5432/form_db \
 -e PORT=8899 \
 -p 8899:8899 \
 --ip 10.88.0.20 \
 -d form-api:v1

:1 != :v1

//for database connect to postgres by using container ip, vite,api,psql can be in different network in podman machine(it auto route subnet to each other)
podman volume create form-data
podman run --name postgres-form -e POSTGRES_PASSWORD=password -e POSTGRES_DB=form_db -v form-data:/var/lib/postgresql/data -p 5432:5432 --ip 10.88.0.35 -d postgres:17.5

//or
podman run --name postgres-form \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=form_db \
-v form-data:/var/lib/postgresql/data \
-p 5432:5432 \
--ip 10.88.0.35 \
-d postgres:17.5




DATABASE_URL=postgresql://postgres:password@10.88.0.35:5432/form_db


Limit rate
to disable reset rate limit set NODE_ENV=deploy     or just delete NODE_ENV

demo lab for learn .env and .env.local are expose to public
in production .env, .env.local, .env* will be in gitignore



Front-end (form-vite)

podman build -t form-vite:1 .
podman build -t form-vite:1 --no-cache .

//to specify a network name  (network name = my-network), 
//in this setting(use container name to connect) form-psql, form-api, form-vite need to be in the same network(my-network) 

podman run --name form-vite --network my-network -p 80:80 -d form-vite:1

//to push image to ghcr.io
podman login ghcr.io
podman tag form-vite:1  ghcr.io/conicuznhm/form-vite:1
podman push ghcr.io/conicuznhm/form-vite:1

//to pull image
podman pull ghcr.io/conicuznhm/form-vite:1

:1 != :v1
podman run --name form-vite -p 80:80 -d form-vite:v1
podman run --name form-vite -p 9090:80 -d form-vite:v1








entrypoint.sh for not install and run cloudflared quick tunnel
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



//for podman in ubuntu
//to resolve docker service endpoint --> need to set  registries.conf

sudo vi /etc/containers/registries.conf

[registries.search]
registries = ['docker.io']


//or use full url to pull image
 docker.io/library/postgres:17.5