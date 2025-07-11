# Build stage
FROM node:24-alpine AS builder

# Label
LABEL version="1.1.9"

# Set current working directory to /app for build
# Now current directory is /app, not root dir (/) 
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.10.0

# Copy dependency files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# //Copy current dir contents into the container current dir (/app)
COPY . .

# //Run Prisma generate to create the Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Runtime stage
FROM node:24-alpine

# Label
# LABEL version=""

# Set working directory for runtime
# Now current directory is /app, not root dir (/)
WORKDIR /app

# Install pnpm globally in the runtime image
RUN npm install -g pnpm@10.10.0

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh .

# Install dos2unix to convert shell script line endings (CRLF to LF)
RUN apk add --no-cache dos2unix

# Install netcat:nc
# RUN apk add --no-cache netcat-openbsd

# Fix line endings for shell script (full path /app/entrypoint.sh)
RUN dos2unix entrypoint.sh

# Make the entrypoint script executable (full path /app/entrypoint.sh)
RUN chmod +x entrypoint.sh

# Expose the port the app will run on
EXPOSE 8899

# Run the entrypoint script which handles migrations and starts the server
ENTRYPOINT ["./entrypoint.sh"]
CMD ["pnpm", "start"]



# //for build image api
# podman build -t form-api:v6 --no-cache .
# podman build -t form-api:v6 .

# podman network create my-network
# podman network create --driver bridge --subnet 10.89.0.0/24 --gateway 10.89.0.1 my-network

# //for run api
# podman run --name form-api --env-file .env.local --network my-network -p 8899:8899 -d form-api:v6

# podman run --name form-api \
#  -e DATABASE_URL=postgresql://postgres:password@form-psql:5432/form_db \
#  -e PORT=8899 \
#  -e NODE_ENV=development \
#  --network my-network \
#  -p 8899:8899 \
#  -d form-api:v6

# for NODE_ENV, if need to allow reset-rate-limit api => NODE_ENV=development
#               if not allow reset-rate-limit api     => NODE_ENV=deploy or <anything except development>  

# //for database connect to postgres by using DNS resolver from container name, vite,api,psql are in the same network

# podman volume create form-data
# podman run --name form-psql -e POSTGRES_PASSWORD=password -e POSTGRES_DB=form_db -v form-data:/var/lib/postgresql/data --network my-network -p 5432:5432 -d postgres:17.5
# //or
# podman run --name form-psql \
# -e POSTGRES_PASSWORD=password \
# -e POSTGRES_DB=form_db \
# -v form-data:/var/lib/postgresql/data \
# --network my-network \
# -p 5432:5432 \
# -d postgres:17.5


# //to push image to ghcr.io    :1 != :v1
# podman login ghcr.io
# podman tag form-api:1 ghcr.io/conicuznhm/form-api:1
# podman push ghcr.io/conicuznhm/form-api:1


# //to pull image
# podman login ghcr.io
# podman pull ghcr.io/conicuznhm/form-api:1