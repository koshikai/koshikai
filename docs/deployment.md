# Deployment

このドキュメントでは、koshikai.dev のデプロイ構成について詳細に説明します。

## 概要

デプロイは **GitHub Actions → GHCR → Proxmox self-hosted runner → Docker Compose** の流れで行われます。

## CI/CD パイプライン

### GitHub Actions Workflow

`.github/workflows/deploy.yml` が `main` ブランチへの push 時に実行されます。

#### Build Job（`ubuntu-latest`）

1. アプリ用 Docker イメージのビルド・プッシュ
   - `ghcr.io/koshikai/koshikai:latest`
   - `ghcr.io/koshikai/koshikai:sha-{commit}`
2. MCP サーバー用 Docker イメージのビルド・プッシュ
   - `ghcr.io/koshikai/koshikai-mcp:latest`
   - `ghcr.io/koshikai/koshikai-mcp:sha-{commit}`

#### Deploy Job（`self-hosted` on Proxmox）

1. デプロイメントマニフェストの同期
   - `$HOME/deploy/koshikai` に compose ファイルをコピー
   - `/opt/home/.env.prod` → `$HOME/deploy/koshikai/.env.prod`（symlink）
   - `/opt/home/.env.mathkb` → `$HOME/deploy/koshikai/.env.mathkb`（symlink）
2. 公開ポートフォリオの再起動
   - `docker compose -p koshikai_public -f docker-compose.prod.yaml pull`
   - `docker compose -p koshikai_public -f docker-compose.prod.yaml up -d --remove-orphans`
3. 内部 KB / MCP / NocoDB の再起動（`.env.mathkb` が存在する場合のみ）
   - `docker compose -p koshikai_mathkb -f docker-compose.internal.yaml pull`
   - `docker compose -p koshikai_mathkb -f docker-compose.internal.yaml up -d --remove-orphans`
4. 古いイメージのクリーンアップ（24時間以上前）

## Docker 構成

### 公開ポートフォリオ（`docker-compose.prod.yaml`）

| 項目 | 値 |
|------|-----|
| サービス名 | `app` |
| コンテナ名 | `koshikai-app` |
| イメージ | `ghcr.io/koshikai/koshikai:latest` |
| ポート | `3002:3000` |
| 環境変数 | `.env.prod` |
| 固定環境変数 | `NODE_ENV=production`, `SITE_VARIANT=portfolio`, `SITE_URL=https://koshikai.dev` |
| ヘルスチェック | `GET /healthz` |

### 内部 KB スタック（`docker-compose.internal.yaml`）

| サービス | コンテナ名 | ポート | イメージ |
|----------|-----------|--------|----------|
| mathkb-app | `mathkb-app` | `3103:3000` | `ghcr.io/koshikai/koshikai:latest` |
| mathkb-mcp | `mathkb-mcp` | `3104:3004` | `ghcr.io/koshikai/koshikai-mcp:latest` |
| mathkb-nocodb | `mathkb-nocodb` | `8180:8080` | `nocodb/nocodb:latest` |

内部 KB スタックは `.env.mathkb` が存在する場合のみデプロイされます。

## Dockerfile

### アプリ用（`Dockerfile`）

マルチステージビルド：

1. **deps ステージ**: `oven/bun:1` で依存関係をインストール
2. **builder ステージ**: `node:22-slim` + Bun でビルド
   - `DOCKER_BUILD=true` で `output: "standalone"` を有効化
   - メモリ制限: `--max-old-space-size=2048`
3. **runner ステージ**: `node:22-slim` で実行
   - 非 root ユーザー (`nextjs:nodejs`) で実行
   - `.next/standalone` を利用して軽量化

### MCP 用（`Dockerfile.mcp`）

Bun ランタイムで MCP HTTP サーバーを実行します。

## サーバー前提条件

Proxmox 上の self-hosted runner で以下が必要です：

- Docker Engine + Docker Compose plugin
- runner ユーザーが `docker` グループに所属
- `ghcr.io` および GitHub への outbound 接続
- `/opt/home/.env.prod`（公開側の必須ファイル）
- `/opt/home/.env.mathkb`（内部側の任意ファイル）

### 初期セットアップ

`scripts/setup_server.sh` を実行すると：

- `/opt/home` を作成
- `/opt/actions-runner-home` を作成

env ファイルは手動で配置する必要があります。

## ネットワーク・セキュリティ

### LAN-only Operations Policy

内部 KB UI / MCP / NocoDB はインターネット公開を前提としていません：

- `3103`, `3104`, `8180` はルータでポート開放しない
- Firewall で許可元をプライベートセグメントに限定（`192.168.0.0/16`, `10.0.0.0/8`, `172.16.0.0/12`）
- 外部から使う場合は VPN を使用
- MCP は読み取り専用ツールのみ、`mcp_reader` ロール維持
- `SITE_URL` は内部 URL を設定

### 安全な運用のための推奨

`docker-compose.internal.yaml` の `ports` を `127.0.0.1:3103:3000` のように loopback bind に変更し、必要なものだけ reverse proxy や SSH port forward で中継することを推奨します。

## 監視

- `GET /healthz` on `mathkb-app`
- `GET /healthz` on `mathkb-mcp`
- Docker healthcheck により自動復旧

## トラブルシューティング

### `.env.prod` がない

```
Missing .env.prod. Place it in /opt/home/.env.prod or $DEPLOY_DIR/.env.prod before deploying.
```

→ `/opt/home/.env.prod` を作成してください。

### `.env.mathkb` がない

内部 KB / MCP / NocoDB のデプロイがスキップされます。意図的でない場合は env ファイルを配置してください。

### レガシーコンテナの移行

workflow 内で古いプロジェクト名のコンテナを検出・削除するロジックがあります。`koshikai-app` などのコンテナ名が競合する場合は自動的にクリーンアップされます。
