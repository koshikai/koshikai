# MathKB MCP Server

MathKB MCP server は、PostgreSQL に保存した数学ノートを AI client から検索・取得・編集するための独立サービスです。

## Transport

### Streamable HTTP

```bash
MATHKB_DATABASE_URL="postgresql://mcp_reader:change-me@localhost:5432/mathkb" bun run mcp:http
```

- endpoint: `POST http://0.0.0.0:3004/mcp`
- health: `GET http://0.0.0.0:3004/healthz`
- `GET /mcp` と `DELETE /mcp` は `405 Method Not Allowed`
- sessionを保持しないstateless transport
- IPごとに60 requests/minuteのin-memory rate limit

### stdio

```bash
MATHKB_DATABASE_URL="postgresql://mcp_reader:change-me@localhost:5432/mathkb" bun run mcp:stdio
```

CLI引数の代わりに `MCP_TRANSPORT=http|stdio` も使用できます。

## Tools

7 toolsが登録されています。

| Tool | 種別 | 主な引数 | 備考 |
|---|---|---|---|
| `list_fields` | read | なし | 分野とノート数 |
| `list_tags` | read | なし | タグとノート数 |
| `get_note` | read | `slug` | Markdown本文を含む詳細 |
| `search_notes` | read | `query?`, `field?`, `tag?`, `limit?` | `limit` は1–50、既定10。MCP inputにpageはない |
| `semantic_search_notes` | read | `query`, `limit?` | embedding有効時のみ。既定5、最大50 |
| `create_note` | write | `title`, `field`, `bodyMarkdown`, `summary?`, `isPublic?`, `tags?` | slugとタグを自動生成 |
| `update_note` | write | `slug` と任意の更新項目 | tags指定時は関連を置換 |

すべてのtoolはtext contentに加えてstructured contentを返し、入力・出力schemaはZodで定義されています。

## 権限

| Role | Table privilege | 利用可能な操作 |
|---|---|---|
| `mcp_reader` | SELECT | list / get / search。semantic searchはembedding設定も必要 |
| `mcp_writer` | SELECT / INSERT / UPDATE、`note_tags`のDELETE | 上記 + create / update / tags置換。ノート削除不可 |
| `mathkb_nocodb` | SELECT / INSERT / UPDATE / DELETE | 管理用途 |

`update_note` のtags置換に必要なDELETEは`note_tags`だけに限定しています。`notes`と`tags`本体のDELETEは許可しません。

## Embedding

- model: `Xenova/multilingual-e5-small`
- dimension: 384
- query prefix: `query: `
- note prefix: `passage: `
- pooling: mean、normalized vector
- storage/search: pgvector + cosine distance + HNSW index

`MATHKB_ENABLE_EMBEDDINGS=false` の場合:

- modelを読み込まない
- create時はembeddingなしで保存
- title / summary / body更新時は既存embeddingを`NULL`にする
- `semantic_search_notes`はerrorを返す

現行の `docker-compose.internal.yaml` はmemory節約のため無効化しています。

## Database setup

PostgreSQL serverで `pg_trgm` と `vector` extensionを利用可能にしてから実行します。

```bash
export MATHKB_ADMIN_DATABASE_URL="postgresql://postgres:change-me@localhost:5432/mathkb"
export MATHKB_APPLY_SEED=false
./scripts/apply_mathkb_schema.sh
```

このscriptは順に以下を適用します。

1. `db/mathkb.sql`
2. `db/migrations/20260712_remove_mathkb_app.sql`
3. `db/mathkb.roles.sql`
4. `MATHKB_APPLY_SEED=true` の場合のみ `db/mathkb.seed.sql`

`db/mathkb.roles.sql` の `change-me` は適用前に安全なpasswordへ変更してください。既存roleのpasswordはこのscriptでは更新されません。

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `MATHKB_DATABASE_URL` | `DATABASE_URL` fallback | PostgreSQL connection string |
| `MATHKB_DATABASE_SSL` | `disable` | `require` の場合productionでは証明書検証を有効化 |
| `MATHKB_POOL_MAX` | `10` | pool上限 |
| `MATHKB_ENABLE_EMBEDDINGS` | enabled | `false` / `0` / `no` / `off` で無効 |
| `MCP_BIND_HOST` | `0.0.0.0` | HTTP bind host |
| `MCP_PORT` | `3004` | HTTP port |
| `MCP_PATH` | `/mcp` | MCP endpoint |
| `MCP_ALLOWED_HOSTS` | production HTTPで必須 | Host allowlist |
| `MCP_TRANSPORT` | `http` | transport fallback |

## Security

MCP server自体に利用者認証はありません。HTTP endpointはLAN / VPN内に限定し、インターネットへ直接公開しないでください。`MCP_ALLOWED_HOSTS` はDNS rebinding対策の一部であり、認証ではありません。

書き込みが不要なら `mcp_reader` を使います。書き込みを許可する場合も、DB role、network境界、backupを組み合わせてください。

## Health checkの注意

serverはDB URL未設定時に起動を拒否します。`/healthz`は`SELECT 1`を実行し、失敗時に503を返します。
