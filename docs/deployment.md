# Deployment

## 概要

`main` への push を起点に、GitHub Actions が検証、Docker image build、GHCR への push、Proxmox 上の self-hosted runner での Docker Compose 更新を行います。

`docs/**`、Markdown、`.gitignore`、`.dockerignore` のみの変更では workflow は起動しません。手動実行には `workflow_dispatch` を使います。

## CI/CD jobs

### `lint-test`

- Bun 1.3.13
- `bun install --frozen-lockfile`
- `bun run lint`
- `bun run test --run`
- `package.json` または `bun.lock` 変更時と手動実行時のみ `bun audit`

### `changes`

MCP image の再buildが必要かを判定します。対象は `Dockerfile.mcp`、`docker-compose.internal.yaml`、`src/mcp/**`、`src/lib/mathkb/**`、`package.json`、`bun.lock` です。

### `build-app`

検証成功後、Web image を常に build / push します。

- `ghcr.io/koshikai/koshikai:latest`
- `ghcr.io/koshikai/koshikai:{commit-sha}`

### `build-mcp`

MCP 関連変更時または手動実行時のみ build / push します。

- `ghcr.io/koshikai/koshikai-mcp:latest`
- `ghcr.io/koshikai/koshikai-mcp:{commit-sha}`

### `deploy`

app build が成功し、MCP build が成功またはskipされた場合に self-hosted runner で実行します。

1. compose files を `$HOME/deploy/koshikai` に同期
2. `/opt/home/.env.prod` と `/opt/home/.env.mathkb` があれば symlink
3. 公開 portfolio を pull / restart
4. `.env.mathkb` があれば内部 compose stack を pull / restart
5. 24時間より古い未使用 image を削除

同一ブランチの古い実行は concurrency 設定によりcancelされます。

## Compose

### 公開: `docker-compose.prod.yaml`

| 項目 | 値 |
|---|---|
| service / container | `app` / `koshikai-app` |
| image | `ghcr.io/koshikai/koshikai:latest` |
| port | `3002:3000` |
| env file | `.env.prod` |
| health check | `GET /healthz` |

### 内部: `docker-compose.internal.yaml`

| Service | Port | 現在の実体 |
|---|---:|---|
| `mathkb-mcp` | `3104:3004` | MathKB MCP HTTP server |

現在の compose に NocoDB service は定義されていません。外部管理の NocoDB を使う場合は、この compose とは別に管理します。

`mathkb-mcp` は `MATHKB_ENABLE_EMBEDDINGS=false` で起動するため、全文検索・取得・作成・更新は利用できますが、セマンティック検索は無効です。

## 必要なサーバー環境

- Docker Engine と Docker Compose plugin
- Docker を実行できる self-hosted GitHub Actions runner
- GitHub / GHCR への outbound 接続
- `/opt/home/.env.prod`（公開 deploy に必須）
- `/opt/home/.env.mathkb`（内部 deploy を行う場合。テンプレートは `.env.mathkb.example`）

`scripts/setup_server.sh` は `/opt/home` と `/opt/actions-runner-home` を作成します。env files と runner 本体は別途設定します。

## セキュリティ

- MCP は認証を持たないため、`3104` をインターネット公開しない
- 現行 `ports` は全interfaceへbindするため、host firewallでLANまたはVPNからの接続だけを許可する
- より安全にする場合は `127.0.0.1:3104:3004` に変更し、認証付きreverse proxy、VPN、SSH tunnelを利用する
- `MCP_ALLOWED_HOSTS` はHost header対策であり、利用者認証の代替ではない
- MCP の用途に応じて `mcp_reader` または `mcp_writer` を使う
- `.env.*` とDBパスワードをrepositoryへcommitしない

## Health check

- Web: `http://127.0.0.1:3000/healthz`
- MCP: `http://127.0.0.1:3004/healthz`

MCP health check は常に `SELECT 1` を実行します。DB未設定時はserver自体が起動せず、接続失敗時は503を返します。

## 既知の改善事項

1. MCP portをLAN firewallで許可元限定する
2. image tagを`latest`だけでなくcommit SHAに固定し、rollbackを容易にする

## Troubleshooting

### `.env.prod` がない

公開deployは失敗します。`/opt/home/.env.prod` または `$HOME/deploy/koshikai/.env.prod` に配置してください。

### `.env.mathkb` がない

内部compose deployはskipされます。公開portfolioには影響しません。テンプレートは `.env.mathkb.example` にあります。

### `mathkb-mcp` が起動直後に落ちる

`docker-compose.internal.yaml` は `NODE_ENV=production` かつ HTTP transport で起動するため、`MCP_ALLOWED_HOSTS` が未設定だとserverが例外を投げて終了します。compose の `environment` には含まれないため、`.env.mathkb` で必ず指定してください。`MCP_DATABASE_URL` も同様に必須です。

### MCPのsemantic searchが失敗する

本番composeではembeddingが無効です。`MATHKB_ENABLE_EMBEDDINGS=true` にするとmodel読み込みと追加memoryが必要になります。
