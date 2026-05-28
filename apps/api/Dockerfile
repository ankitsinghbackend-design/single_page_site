# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy the specific workspaces we need
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install all dependencies (devDependencies needed for build)
RUN npm install

# Build the shared package if needed (assuming tsc is used, or it might just be TS files)
# In this setup, shared might just be TS files consumed directly, or it might need building.
# We will build the api app.
WORKDIR /app/apps/api
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=4000

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspaces
COPY packages/shared ./packages/shared
COPY apps/api/package.json ./apps/api/package.json

# Install only production dependencies
RUN npm install --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose the port
EXPOSE 4000

# Start the server
WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
