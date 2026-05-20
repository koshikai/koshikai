# Alpine 上の Bun build が不安定なため、Docker では glibc ベースを使う
FROM oven/bun:1.3.13 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./
# Use production flag if possible, but we need devDeps for build
RUN bun install --frozen-lockfile --ignore-scripts --backend=copy

# Rebuild the source code only when needed
# Install Bun on Node.js image to ensure consistent build results
# with the local environment (bun.lock is the source of truth).
FROM node:22-slim AS builder
WORKDIR /app

# Install Bun binary for the build stage
RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    apt-get remove -y curl unzip && apt-get autoremove -y
ENV PATH="/root/.bun/bin:${PATH}"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV DOCKER_BUILD=true

RUN bun run build

# Production image, copy all the files and run next
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Debian 系の Node image では groupadd/useradd を使う
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to 0.0.0.0 for accessibility inside container
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
