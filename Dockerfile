# syntax=docker/dockerfile:1
FROM oven/bun:1 AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client generation
RUN bunx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone build and public files
# Note: standalone output includes a server.js that doesn't require bun/node specifically, 
# but we run it with bun for consistency.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=bun:shared /app/.next/standalone ./
COPY --from=builder --chown=bun:shared /app/.next/static ./.next/static

# Use the pre-existing 'bun' user instead of creating a new one
USER bun

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
