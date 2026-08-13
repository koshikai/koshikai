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

#### Deploy Job（`self-hosted` on Proxmox）

1. デプロイメントマニフェストの同期
   - `$HOME/deploy/koshikai` に compose ファイルをコピー
   - `/opt/home/.env.prod` → `$HOME/deploy/koshikai/.env.prod`（symlink）
2. 公開ポートフォリオの再起動
   - `docker compose -p koshikai_public -f docker-compose.prod.yaml pull`
   - `docker compose -p koshikai_public -f docker-compose.prod.yaml up -d --remove-orphans`
3. 古いイメージのクリーンアップ（24時間以上前）

同一ブランチの古い実行は concurrency 設定により cancel されます。

## Docker 構成

### 公開ポートフォリオ（`docker-compose.prod.yaml`）

| 項目 | 値 |
|------|-----|
| サービス名 | `app` |
| コンテナ名 | `koshikai-app` |
| イメージ | `ghcr.io/koshikai/koshikai:latest` |
| ポート | `3002:3000` |
| 環境変数 | `.env.prod` |
| 固定環境変数 | `NODE_ENV=production`, `SITE_URL=https://koshikai.dev` |
| ヘルスチェック | `GET /healthz` |

## Dockerfile

マルチステージビルド：

1. **deps ステージ**: `oven/bun:1` で依存関係をインストール
2. **builder ステージ**: `node:22-slim` + Bun でビルド
   - `DOCKER_BUILD=true` で `output: "standalone"` を有効化
   - メモリ制限: `--max-old-space-size=2048`
3. **runner ステージ**: `node:22-slim` で実行
   - 非 root ユーザー (`nextjs:nodejs`) で実行
   - `.next/standalone` を利用して軽量化
   - MCP 用の onnxruntime 等は含めない（ポートフォリオのみの最小構成）

## サーバー前提条件

Proxmox 上の self-hosted runner で以下が必要です：

- Docker Engine + Docker Compose plugin
- runner ユーザーが `docker` グループに所属
- `ghcr.io` および GitHub への outbound 接続
- `/opt/home/.env.prod`（必須ファイル）

### 初期セットアップ

`scripts/setup_server.sh` を実行すると：

- `/opt/home` を作成
- `/opt/actions-runner-home` を作成

env ファイルは手動で配置する必要があります。

## 監視

- `GET /healthz` on `koshikai-app`
- Docker healthcheck により自動復旧

## トラブルシューティング

### `.env.prod` がない

```
Missing .env.prod. Place it in /opt/home/.env.prod or $DEPLOY_DIR/.env.prod before deploying.
```

→ `/opt/home/.env.prod` を作成してください。

### レガシーコンテナの移行

workflow 内で古いプロジェクト名のコンテナを検出・削除するロジックがあります。`koshikai-app` などのコンテナ名が競合する場合は自動的にクリーンアップされます。

## 関連リポジトリ

内部の数学ナレッジベース / MCP サーバーは **`koshikai/mathkb`**（private）に分離されました。そちらのデプロイは `koshikai/mathkb` の `docker-compose.yml`（mathkb-mcp サービス、`3104:3004`）を参照してください。
