# koshikai.dev

公開ポートフォリオと、内部限定の数学ナレッジベース / MCP サーバーを同じリポジトリで管理する構成です。

## App Modes

- `SITE_VARIANT=portfolio`
  公開ポートフォリオを表示します。既存の `koshikai.dev` 用です。
- `SITE_VARIANT=mathkb`
  内部限定の数学KB UI を表示します。ノート一覧、詳細、キーワード検索、タグ絞り込みに対応します。

## Environment Variables

主に使う変数は以下です。

```bash
SITE_VARIANT=portfolio | mathkb
SITE_URL=https://koshikai.dev
MATHKB_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MATHKB_DATABASE_SSL=disable | require
MCP_BIND_HOST=0.0.0.0
MCP_PORT=3004
MCP_PATH=/mcp
```

内部KB用の例は [`.env.mathkb.example`](./.env.mathkb.example) を参照してください。

## Local Development

公開ポートフォリオ:

```bash
bun run dev
```

内部KB UI:

```bash
$env:SITE_VARIANT="mathkb"
$env:MATHKB_DATABASE_URL="postgresql://mathkb_app:change-me@localhost:5432/mathkb"
bun run dev
```

MCP サーバー:

```bash
$env:MATHKB_DATABASE_URL="postgresql://mcp_reader:change-me@localhost:5432/mathkb"
bun run mcp:http
```

ローカル stdio 連携用:

```bash
$env:MATHKB_DATABASE_URL="postgresql://mcp_reader:change-me@localhost:5432/mathkb"
bun run mcp:stdio
```

DB schema をまとめて適用する場合:

```bash
export MATHKB_ADMIN_DATABASE_URL="postgresql://postgres:change-me@localhost:5432/mathkb"
export MATHKB_APPLY_SEED=true
./scripts/apply_mathkb_schema.sh
```

## Database Bootstrap

1. `mathkb` データベースを作成します。
2. [`db/mathkb.sql`](./db/mathkb.sql) を適用します。
3. [`db/mathkb.roles.sql`](./db/mathkb.roles.sql) を適用し、パスワードを差し替えます。
4. NocoDB は `mathkb_nocodb`、内部UI は `mathkb_app`、MCP は `mcp_reader` を使って接続します。
5. 必要なら [`db/mathkb.seed.sql`](./db/mathkb.seed.sql) で初期サンプルを投入します。

`notes` テーブルは以下のカラムを持ちます。

- `slug`
- `title`
- `field`
- `summary`
- `body_markdown`
- `body_plain`
- `is_public`
- `created_at`
- `updated_at`

v1 は `notes`, `tags`, `note_tags` のみです。`concepts` 系は未実装です。

## Deployment

公開ポートフォリオ用 compose:

- [`docker-compose.prod.yaml`](./docker-compose.prod.yaml)

内部KB + MCP 用 compose:

- [`docker-compose.internal.yaml`](./docker-compose.internal.yaml)

内部KB は `Dockerfile`、MCP サーバーは [`Dockerfile.mcp`](./Dockerfile.mcp) を使います。`docker-compose.internal.yaml` には NocoDB も含まれており、管理UI としてそのまま起動できます。

想定ポート:

- `3002`: 公開ポートフォリオ
- `3003`: 内部KB UI
- `3004`: MCP HTTP
- `8080`: NocoDB

監視用:

- `GET /healthz` on `mathkb-app`
- `GET /healthz` on `mathkb-mcp`

## GitHub Actions Deploy

`main` への push で [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) が動きます。

- `ghcr.io/koshikai/koshikai:latest` を build / push
- `ghcr.io/koshikai/koshikai-mcp:latest` を build / push
- Proxmox 上の self-hosted runner で `$HOME/deploy/koshikai` に compose を同期して公開ポートフォリオを再起動
- `/opt/home/.env.mathkb` または `$HOME/deploy/koshikai/.env.mathkb` が存在する場合のみ、内部KB / MCP / NocoDB も再起動

公開側は `/opt/home/.env.prod`、内部側は `/opt/home/.env.mathkb` を置いておけば、そのまま symlink されて使われます。必要なら直接 `$HOME/deploy/koshikai` 側に置いても構いません。

## MCP Tools

実装済みの読み取り専用ツール:

- `search_notes(query, field, tag, limit)`
- `get_note(slug)`
- `list_fields()`
- `list_tags()`

未実装:

- `search_concepts(...)`
- `get_related_notes(...)`

## Verification

```bash
bun run lint
bun run build
```

DB 接続がなくても公開ポートフォリオはビルドできます。`SITE_VARIANT=mathkb` で起動した場合は、DB 未設定時にセットアップ案内を表示します。
