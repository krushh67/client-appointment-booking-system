# ==============================================================================
# frontend/Dockerfile - React + Vite Frontend Containerization
# Multi-stage build with Node.js builder and minimal Nginx Alpine web server.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production distribution
COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Nginx Server
# ------------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration supporting SPA routing and reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web port
EXPOSE 80

# Health check for web server
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
