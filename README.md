# koshikai.dev

公開ポートフォリオと、内部限定の数学ナレッジベース / MCP サーバーを同じリポジトリで管理する構成です。

## App Modes

- `SITE_VARIANT=portfolio`
  公開ポートフォリオを表示します。既存の `koshikai.dev` 用です。
- `SITE_VARIANT=notes`
  内部限定の数学KB UI を表示します。ノート一覧、詳細、キーワード検索、タグ絞り込みに対応します。

## Environment Variables

主に使う変数は以下です。

```bash
SITE_VARIANT=portfolio | notes
SITE_URL=https://koshikai.dev
notes_DATABASE_URL=postgresql://user:password@host:5432/notes
notes_DATABASE_SSL=disable | require
MCP_BIND_HOST=0.0.0.0
MCP_PORT=3004
MCP_PATH=/mcp
```

内部KB用の例は [`.env.notes.example`](./.env.notes.example) を参照してください。

## Local Development

公開ポートフォリオ:

```bash
bun run dev
```

内部KB UI:

```bash
$env:SITE_VARIANT="notes"
$env:notes_DATABASE_URL="postgresql://notes_app:change-me@localhost:5432/notes"
bun run dev
```

MCP サーバー:

```bash
$env:notes_DATABASE_URL="postgresql://app_reader:change-me@localhost:5432/notes"
bun run mcp:http
```

ローカル stdio 連携用:

```bash
$env:notes_DATABASE_URL="postgresql://app_reader:change-me@localhost:5432/notes"
bun run mcp:stdio
```

DB schema をまとめて適用する場合:

```bash
export notes_ADMIN_DATABASE_URL="postgresql://postgres:change-me@localhost:5432/notes"
export notes_APPLY_SEED=true
./scripts/apply_notes_schema.sh
```

## Database Bootstrap

1. `notes` データベースを作成します。
2. [`db/notes.sql`](./db/notes.sql) を適用します。
3. [`db/notes.roles.sql`](./db/notes.roles.sql) を適用し、パスワードを差し替えます。
4. NocoDB は `notes_nocodb`、内部UI は `notes_app`、MCP は `app_reader` を使って接続します。
5. 必要なら [`db/notes.seed.sql`](./db/notes.seed.sql) で初期サンプルを投入します。

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

- `GET /healthz` on `notes-app`
- `GET /healthz` on `notes-mcp`

## GitHub Actions Deploy

`main` への push で [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) が動きます。

- `ghcr.io/koshikai/koshikai:latest` を build / push
- `ghcr.io/koshikai/koshikai-mcp:latest` を build / push
- Proxmox 上の self-hosted runner で `/opt/home/docker-compose.prod.yaml` を同期して公開ポートフォリオを再起動
- `/opt/home/.env.notes` が存在する場合のみ、`docker-compose.internal.yaml` を同期して内部KB / MCP / NocoDB も再起動

つまり、内部スタックを自動デプロイしたい場合は、先に `/opt/home/.env.notes` を置いておく必要があります。

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

DB 接続がなくても公開ポートフォリオはビルドできます。`SITE_VARIANT=notes` で起動した場合は、DB 未設定時にセットアップ案内を表示します。
