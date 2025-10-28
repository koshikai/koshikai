# syntax=docker/dockerfile:1
####################
# builder stage
####################
FROM node:20-alpine AS builder
WORKDIR /app

# 依存を先にコピーしてキャッシュを効かせる
COPY package*.json ./
RUN npm ci

# ソースをコピーしてビルド
COPY . .
RUN npm run build

####################
# production image
####################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Nextのビルド成果物と公開用ファイルをコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# 本番依存だけインストール（軽量化）
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["sh", "-c", "HOST=0.0.0.0 PORT=${PORT} npm run start"]
