# Build vite
FROM node:24-alpine AS build

# Label
LABEL version="1.1.0"

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# //Copy current dir contents into the container current dir (/app)
COPY . .
RUN pnpm run build

# Serve with nginx
FROM nginx:1.27-alpine

# //Working directory is / (root directory) by default in nginx image, blank = WORKDIR /
# WORKDIR /

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# //Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# //Copy vite build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# //Install cloudflared
# RUN apk add --no-cache curl
# RUN curl -L https://github.com/cloudflare/cloudflared/releases/download/2025.4.2/cloudflared-linux-amd64 -o /usr/bin/cloudflared 
# RUN chmod +x /usr/bin/cloudflared

# //Copy run-tunnel script
# COPY run-tunnel.sh /run-tunnel.sh

# //Copy start script to handle api proxy connection
# COPY start.sh /start.sh

# //Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Install dos2unix to convert shell script line endings (CRLF to LF)
RUN apk add --no-cache dos2unix
# //Fix line endings for shell script (start.sh = /start.sh, now current dir = root)

# Install netcat:nc
# RUN apk add --no-cache netcat-openbsd

# RUN dos2unix /run-tunnel.sh /start.sh /entrypoint.sh
# RUN dos2unix start.sh entrypoint.sh
RUN dos2unix entrypoint.sh

# //Add execute permissions to scripts
# RUN chmod +x /run-tunnel.sh /start.sh /entrypoint.sh
# RUN chmod +x /start.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint to run the start script
ENTRYPOINT ["/entrypoint.sh"]



# podman build -t form-vite:v6 .
# podman build -t form-vite:v6 --no-cache .

# //to specify a network name  (network name = my-network), 
# //in this setting(use container name to connect) form-psql, form-api, form-vite need to be in the same network(my-network) 

# podman run --name form-vite --network my-network -p 80:80 -d form-vite:v6


# to push image to ghcr.io     :1 != :v1
# podman login ghcr.io
# podman tag form-vite:1 ghcr.io/conicuznhm/form-vite:1
# podman push ghcr.io/conicuznhm/form-vite:1


# //to pull image
# podman login ghcr.io
# podman pull ghcr.io/conicuznhm/form-vite:1