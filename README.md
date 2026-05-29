# koshikai.dev

公開ポートフォリオと、内部限定の数学ナレッジベース / MCP サーバーを同じリポジトリで管理する構成です。

## App Modes

- `SITE_VARIANT=portfolio`
  公開ポートフォリオを表示します。既存の `koshikai.dev` 用です。
- `SITE_VARIANT=mathkb`
  内部限定の数学KB UI を表示します。ノート一覧、詳細、キーワード検索、分野フィルタ、タグ絞り込みに対応します。`robots.txt` は全拒否、`sitemap.xml` は空になります。

## Environment Variables

主に使う変数は以下です。

```bash
SITE_VARIANT=portfolio | mathkb
SITE_URL=variant ごとの canonical / metadata 用 URL
MATHKB_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MATHKB_APP_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MCP_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MATHKB_DATABASE_SSL=disable (default) | require
MATHKB_POOL_MAX=10 (default)
MCP_BIND_HOST=0.0.0.0
MCP_PORT=3004
MCP_PATH=/mcp
MCP_ALLOWED_HOSTS=comma-separated optional host allowlist
```

`SITE_URL` は `portfolio` では `https://koshikai.dev`、`mathkb` では `http://127.0.0.1:3103` など内部URLを設定します。DB 接続は `MATHKB_DATABASE_URL` を共通値として使えますが、Docker デプロイでは `MATHKB_APP_DATABASE_URL` と `MCP_DATABASE_URL` を分けると、内部UIを `mathkb_app`、MCP を `mcp_reader`（読み取り専用）または `mcp_writer`（書き込み・ベクトル検索対応）で動かせます。`MATHKB_DATABASE_URL` が未設定なら、内部UI / MCP は `DATABASE_URL` にもフォールバックします。`MCP_ALLOWED_HOSTS` を設定すると、MCP の `Host` ヘッダーを LAN 内の特定ホスト名 / IP に制限できます。

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

DB schema をまとめて適用する場合 (`sh` / `bash`):

```bash
export MATHKB_ADMIN_DATABASE_URL="postgresql://postgres:change-me@localhost:5432/mathkb"
export MATHKB_APPLY_SEED=true
./scripts/apply_mathkb_schema.sh
```

## Database Bootstrap

1. `mathkb` データベースを作成します。
2. ベクトル検索を利用するため、PostgreSQL に `pgvector` をインストールし、データベースで `CREATE EXTENSION vector;` を実行します。
3. [`db/mathkb.sql`](./db/mathkb.sql) を適用します。
4. [`db/mathkb.roles.sql`](./db/mathkb.roles.sql) を適用し、パスワードを差し替えます。
5. NocoDB は `mathkb_nocodb`、内部UI は `mathkb_app`、MCP は `mcp_reader`（読み取り専用）または `mcp_writer`（書き込み・セマンティック検索対応）を使って接続します。
6. 必要なら [`db/mathkb.seed.sql`](./db/mathkb.seed.sql) で初期サンプルを投入します。

`mathkb.sql` では `pg_trgm` / `vector` 拡張、全文検索用の `search_document`、`body_markdown` から `body_plain` を生成する trigger、セマンティック検索用の HNSW インデックスを定義します。

`notes` テーブルは以下のカラムを持ちます。

- `id`
- `slug`
- `title`
- `field`
- `summary`
- `body_markdown`
- `body_plain` (`body_markdown` から自動生成)
- `embedding` (384次元ベクトル / multilingual-e5-small)
- `is_public`
- `created_at`
- `updated_at`
- `search_document` (generated tsvector)

関連テーブル:

- `tags` (`id`, `slug`, `name`, `created_at`)
- `note_tags` (`note_id`, `tag_id`, `created_at`)

v1 は `notes`, `tags`, `note_tags` のみです。`concepts` 系は未実装です。

## Deployment

デプロイの詳細は [`docs/deployment.md`](./docs/deployment.md) を参照してください。

概要:

- `main` ブランチへの push で GitHub Actions 経由で自動デプロイ
- Proxmox 上の self-hosted runner で Docker Compose を実行
- 公開ポートフォリオ（`docker-compose.prod.yaml`）と内部KB（`docker-compose.internal.yaml`）を分離

## Architecture

システムアーキテクチャの詳細は [`docs/architecture.md`](./docs/architecture.md) を参照してください。

## MCP Tools

サーバーの役割、仕様、セットアップの詳細については [`docs/mcp.md`](./docs/mcp.md) を参照してください。

### 実装済みツール

**読み取り専用ツール:**
- `list_fields()`: 全分野の一覧取得
- `list_tags()`: 全タグの一覧取得
- `get_note(slug)`: 単一ノートの取得
- `search_notes(query, field, tag, limit, page)`: キーワード・カテゴリによる全文検索
- `semantic_search_notes(query, limit)`: **【新機能】** 完全ローカルモデルを用いたベクトル類似度検索

**書き込み・更新ツール:**
- `create_note(title, field, summary, bodyMarkdown, isPublic, tags)`: **【新機能】** 新規ノート作成（自動スラグ生成）
- `update_note(slug, title, field, summary, bodyMarkdown, isPublic, tags)`: **【新機能】** ノートの部分更新（自動ベクトル再計算）

MCP HTTP サーバーには、IP ごとに 60 req/min のレート制限を備えています。

未実装:

- `search_concepts(...)`
- `get_related_notes(...)`

## Verification

```bash
bun run lint
bun run test
bun run build
```

DB 接続がなくても公開ポートフォリオはビルドできます。`SITE_VARIANT=mathkb` で起動した場合は、DB 未設定時にセットアップ案内を表示します。
