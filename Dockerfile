# Base stage
FROM node:20-alpine AS base

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
# COPY prisma ./prisma/
RUN npm ci
COPY . .
# RUN npx prisma generate
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma

# Install only production dependencies (optional if npm ci included them, but good for cleanup if using npm install)
# Actually, node_modules from builder might have devDeps if we just did npm ci. 
# Better: separate install for prod, or prune. 
# For simplicity in this task, we'll copy node_modules and assume it's fine, or prune.
# Let's do a clean install for production to keep image small.
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
