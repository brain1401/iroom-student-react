# Multi-stage build for optimized React SSR application
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies stage
FROM base AS deps
# Copy package files for dependency installation
COPY package.json package-lock.json ./
# Install dependencies with npm for better compatibility with build cache optimization
RUN --mount=type=cache,target=/root/.npm npm ci

# Build stage
FROM base AS builder
# Copy all source files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application with Node.js for Vite compatibility
RUN npm run build

# Production stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3011

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tanstack

# Copy built application
COPY --from=builder --chown=tanstack:nodejs /app/.output ./.output
COPY --from=builder --chown=tanstack:nodejs /app/package.json ./package.json

# Switch to non-root user
USER tanstack

# Expose port
EXPOSE 3011

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3011/ || exit 1

# Start the application
CMD ["bun", "start"]