# koshikai.dev

Next.js で構築した公開ポートフォリオと、数学ノートを操作する独立した MCP サーバーを同じリポジトリで管理しています。

Web アプリは `koshikai.dev` 向けのポートフォリオ専用です。MathKB は PostgreSQL データ層と MCP サーバーとして独立運用します。

## 構成

- `src/app/`: ポートフォリオの App Router ページ、メタデータ、ヘルスチェック
- `src/components/`: ポートフォリオ UI
- `src/content/cases/`: MDX ケーススタディ
- `src/mcp/server.ts`: MathKB MCP サーバー（Streamable HTTP / stdio）
- `src/lib/mathkb/`: PostgreSQL リポジトリ、型、embedding 生成
- `db/`: MathKB のスキーマ、ロール、サンプルデータ
- `docker-compose.prod.yaml`: 公開ポートフォリオ
- `docker-compose.internal.yaml`: MathKB MCP の内部スタック定義

## ローカル開発

前提: Bun 1.0 以上。

```bash
bun install
cp .env.example .env.local
bun run dev
```

ポートフォリオはデータベース接続なしで起動・ビルドできます。`SITE_URL` を省略した場合、canonical URL には `https://koshikai.dev` が使われます。

### MCP サーバー

HTTP:

```bash
MATHKB_DATABASE_URL="postgresql://mcp_reader:change-me@localhost:5432/mathkb" bun run mcp:http
```

stdio:

```bash
MATHKB_DATABASE_URL="postgresql://mcp_reader:change-me@localhost:5432/mathkb" bun run mcp:stdio
```

詳細は [`docs/mcp.md`](./docs/mcp.md) を参照してください。

## 環境変数

### Web アプリ

| 変数 | 必須 | 既定値 | 用途 |
|---|---:|---|---|
| `SITE_URL` | いいえ | `https://koshikai.dev` | metadata、canonical、sitemap のベース URL |

### MathKB / MCP

| 変数 | 必須 | 既定値 | 用途 |
|---|---:|---|---|
| `MATHKB_DATABASE_URL` | MCP 利用時 | `DATABASE_URL` にフォールバック | PostgreSQL 接続文字列 |
| `MATHKB_DATABASE_SSL` | いいえ | `disable` | `disable` または `require` |
| `MATHKB_POOL_MAX` | いいえ | `10` | DB 接続プール上限 |
| `MATHKB_ENABLE_EMBEDDINGS` | いいえ | 有効 | `false` の場合、embedding生成とセマンティック検索を無効化 |
| `MCP_BIND_HOST` | いいえ | `0.0.0.0` | HTTP bind host |
| `MCP_PORT` | いいえ | `3004` | HTTP port |
| `MCP_PATH` | いいえ | `/mcp` | Streamable HTTP endpoint |
| `MCP_ALLOWED_HOSTS` | production HTTP時 | 未設定 | 許可する Host のカンマ区切り一覧 |
| `MCP_TRANSPORT` | いいえ | `http` | CLI 引数を使わない場合の `http` / `stdio` 切り替え |

Docker Compose では `.env.mathkb` 内の `MCP_DATABASE_URL` を `MATHKB_DATABASE_URL` に渡します。本番HTTP起動では `MCP_ALLOWED_HOSTS` が必須です。

## MathKB データベース

PostgreSQL に `pg_trgm` と `vector`（pgvector）が必要です。管理者接続を設定して、次を実行します。

```bash
export MATHKB_ADMIN_DATABASE_URL="postgresql://postgres:change-me@localhost:5432/mathkb"
export MATHKB_APPLY_SEED=false
./scripts/apply_mathkb_schema.sh
```

スキーマは `notes`、`tags`、`note_tags` で構成され、全文検索用 GIN index、trigram index、384次元 embedding 用 HNSW index を作成します。ロール定義のプレースホルダーパスワードは、適用前に必ず変更してください。

## デプロイ

`main` への push で GitHub Actions が lint、test、Docker image build、GHCR への push、Proxmox 上の self-hosted runner でのデプロイを実行します。Markdown と `docs/**` だけの変更では workflow は起動しません。

詳細は [`docs/deployment.md`](./docs/deployment.md)、全体構成は [`docs/architecture.md`](./docs/architecture.md) を参照してください。

## 検証

```bash
bun run lint
bun run test -- --run
bun run build
bun audit
```
