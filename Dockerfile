
# Alpine 上の Bun build が不安定なため、Docker では glibc ベースを使う
FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./
# Use production flag if possible, but we need devDeps for build
RUN bun install --frozen-lockfile --ignore-scripts

# Rebuild the source code only when needed
# Bun 1.3.x may crash with SIGILL during Next.js build on some CPUs,
# so we use Node.js for the build stage while keeping Bun for runtime.
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV DOCKER_BUILD=true

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Debian 系の Bun image では groupadd/useradd を使う
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to 0.0.0.0 for accessibility inside container
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
