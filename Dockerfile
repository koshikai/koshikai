# Build stage with Bun
FROM oven/bun:1.3.13 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile

COPY . .
RUN bun run build

# Runner stage with Node.js (dist/server is self-contained via ssr.noExternal)
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs appuser

COPY package.json ./
COPY server.mjs ./
COPY --from=builder /app/dist ./dist

USER appuser

EXPOSE 3000

CMD ["node", "server.mjs"]
