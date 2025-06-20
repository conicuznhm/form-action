# Build vite
FROM node:24-alpine AS build

# Label
LABEL version="1.0.4"

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Serve with nginx
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy vite build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# //Install cloudflared
# RUN apk add --no-cache curl
# RUN curl -L https://github.com/cloudflare/cloudflared/releases/download/2025.4.2/cloudflared-linux-amd64 -o /usr/bin/cloudflared 
# RUN chmod +x /usr/bin/cloudflared

# //Copy run-tunnel script
# COPY run-tunnel.sh /run-tunnel.sh
# RUN chmod +x /run-tunnel.sh

# //Copy start script to handle api proxy connection
COPY start.sh /start.sh
RUN chmod +x /start.sh

# //Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]


# podman build -t form-vite:v6 .
# podman build -t form-vite:v6 --no-cache .

# //to specify a network name  (network name = my-network), 
# //in this setting(use container name to connect) form-psql, form-api, form-vite need to be in the same network(my-network) 

# podman run --name form-vite --network my-network -p 80:80 -d form-vite:v6


# to push image to ghcr.io     :1 != :v1
# podman login ghcr.io
# podman tag form-vite:1  ghcr.io/conicuznhm/form-vite:1
# podman push ghcr.io/conicuznhm/form-vite:1


# //to pull image
# podman pull ghcr.io/conicuznhm/form-vite:1


# podman run --name form-vite -p 80:80 -d form-vite:v1
# podman run --name form-vite -p 9090:80 -d form-vite:v1