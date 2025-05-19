# Use a lightweight Node base image
FROM node:24-alpine

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.10.0

# Copy dependency files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN pnpm prisma generate

# Copy the rest of your application code
COPY . .

# Build your application
RUN pnpm run build

# Copy the entrypoint script
COPY entrypoint.sh .

# Make the entrypoint script executable 
# (necessary when using windows to build the image, if linux just chmod +x entrypoint.sh before build image)
RUN chmod +x entrypoint.sh

# Expose the port your app will run on
EXPOSE 8899

# Run the entrypoint script which handles migrations by ENTRYPOINT and starts the server by CMD
ENTRYPOINT ["sh", "entrypoint.sh"]
CMD ["pnpm", "start"]



# //for build image api
# podman build -t form-api:v1 --no-cache .
# podman build -t form-api:v1 .

# podman network create my-network
# podman network create --driver bridge --subnet 10.89.0.0/24 --gateway 10.89.0.1 my-network

# //for run api
# podman run --name form-api --env-file .env.local --network my-network -p 8899:8899 -d form-api:v3

# podman run --name form-api \
#  -e DATABASE_URL=postgresql://postgres:password@form-psql:5432/form_db \
#  -e PORT=8899 \
#  --network my-network \
#  -p 8899:8899 \
#  -d form-api:v3

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