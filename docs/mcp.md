# MathKB MCP Server Documentation

このドキュメントでは、数学ナレッジベース（MathKB）と連携する MCP（Model Context Protocol）サーバーの仕様、動作原理、およびセットアップ手順について説明します。

---

## 概要

MathKB MCP サーバー（`mathkb-mcp`）は、AIエージェントが個人の数学研究ノートを検索・参照するだけでなく、対話の中で新しいノートを追加したり、既存のノートを編集・更新したりすることを可能にするためのプロトコルインターフェースです。

---

## 提供ツール一覧

MCP サーバーでは、以下の 7 つのツールが実装されています。

### 読み取り専用ツール (Read-Only)

| ツール名 | 説明 | 主要引数 |
|:---|:---|:---|
| `list_fields` | 登録されているすべての数学分野とノート数を一覧取得します。 | なし |
| `list_tags` | 登録されているすべてのタグとノート数を一覧取得します。 | なし |
| `get_note` | スラグを指定して、単一ノートの詳細（Markdown本文、メタデータ、タグ）を取得します。 | `slug` (string) |
| `search_notes` | キーワード、分野、タグを用いた伝統的な全文検索・フィルタリングを行います。 | `query`, `field`, `tag`, `limit`, `page` |
| `semantic_search_notes` | **【新機能】** 自然言語クエリを用いた完全ローカルでのセマンティック（ベクトル）検索を行います。`MATHKB_ENABLE_EMBEDDINGS=false` の場合は無効です。 | `query` (string), `limit` (number) |

### 書き込み・編集ツール (Write/Update)
*※これらのツールを利用するには、MCPサーバーのDB接続が `mcp_writer` ロールである必要があります。*

| ツール名 | 説明 | 主要引数 |
|:---|:---|:---|
| `create_note` | **【新機能】** ナレッジベースに新しいノートを登録します。スラグの自動生成、タグの自動登録・紐付けも行われます。embedding 無効時はベクトルなしで保存します。 | `title`, `field`, `summary`, `bodyMarkdown`, `isPublic`, `tags` |
| `update_note` | **【新機能】** 既存のノートの情報を部分更新します。本文やタイトルが変更された場合、embedding 有効時は埋め込みベクトルも自動で再計算されます。embedding 無効時は古いベクトルを `NULL` にします。 | `slug`, `title`, `field`, `summary`, `bodyMarkdown`, `isPublic`, `tags` |

---

## 完全ローカル・セマンティック検索の仕組み

本プロジェクトのセマンティック検索は、外部の有料クラウドAPIを一切使用せず、**自宅サーバー（Proxmox）のCPUリソースのみで完結する完全ローカルな構成**で動作します。

本番の `mathkb-mcp` コンテナでは、常駐メモリを抑えるため `MATHKB_ENABLE_EMBEDDINGS=false` を設定しています。この場合、通常検索・取得・ノート作成/更新は継続しますが、`@xenova/transformers` と `Xenova/multilingual-e5-small` は読み込まれず、`semantic_search_notes` は無効になります。

### 1. 使用モデル
- **モデル**: `Xenova/multilingual-e5-small` (約130MB / 384次元)
- **特徴**: 日本語と英語の双方に対応した高性能な多言語モデルです。非常に軽量なため、安価なCPU（Intel N100等）でも瞬時にベクトル（Embedding）を算出できます。

### 2. プレフィックスルール
E5モデルの推奨仕様に従い、テキストの種類に応じて自動的に以下の接頭辞（プレフィックス）を付与してからベクトルを生成します。
- **検索クエリ (`query`):** `"query: <検索文字列>"`
- **ノート本文 (`passage`):** `"passage: <タイトル + 概要 + 本文の結合テキスト>"`

### 3. PostgreSQL (pgvector)
- **拡張機能**: PostgreSQLの `pgvector` を利用して `384` 次元の浮動小数点配列（`vector(384)`）としてデータベースに格納します。
- **高速化**: 類似度検索には **HNSW (Hierarchical Navigable Small World)** インデックスを使用しており、コサイン類似度（`notes.embedding <=> $1`）の昇順で高速に近似近傍検索を行います。
- **自動同期**: ノートの作成・更新時、リポジトリ層でタイトル・概要・本文がマージされ、自動的にベクトルが再生成されて保存されます。

---

## セキュリティと権限の分離（最小権限の法則）

MathKBスタックは、セキュリティを担保するためにデータベース（PostgreSQL）に接続するロールを意図的に3つに分離しています。

```
┌─────────────────┐     (Read-Only: SELECTのみ)
│   mcp_reader    ├─────────────────────────────┐
└─────────────────┘                             │
                                                ▼
┌─────────────────┐     (Write-Capable: SELECT/INSERT/UPDATE)
│   mcp_writer    ├───────────────────────────▶[ PostgreSQL (mathkb) ]
└─────────────────┘                             ▲ (※DELETE権限なし)
                                                │
┌─────────────────┐     (Full Control: SELECT/INSERT/UPDATE/DELETE)
│  mathkb_nocodb  ├─────────────────────────────┘
└─────────────────┘
```

*   **`mcp_reader`**: ノートの検索・閲覧のみを行わせたい場合のロール。
*   **`mcp_writer`**: AIエージェントにノートの作成・編集まで許可したい場合のロール。AIの誤操作によるデータ全消去を防ぐため、**`DELETE`（削除）権限は剥奪**されています。
*   **`mathkb_nocodb`**: 管理画面（NocoDB）用。データの管理・クリーンアップ等のため、削除権限を含めた全権限を持ちます。

---

## セットアップ手順（管理者用）

### ステップ 1: PostgreSQLコンテナでの pgvector インストール
Proxmox（PVE）ホスト側から、PostgreSQLが動いているLXCコンテナ（VMID: 123）に対して以下のコマンドを実行します。
```bash
# 1. コンテナ内でパッケージリストを更新し、pgvectorをインストール
pct exec 123 -- apt-get update
pct exec 123 -- apt-get install -y postgresql-18-pgvector
```

### ステップ 2: 拡張の有効化と mcp_writer ロールの作成
同じくPVEホスト側から、`postgres` 管理者ユーザーとしてSQLを適用します。
```bash
# 2. vector 拡張の有効化
pct exec 123 -- su - postgres -c "psql -d mathkb -c 'CREATE EXTENSION IF NOT EXISTS vector;'"

# 3. mcp_writer ロールの作成と権限設定 (db/mathkb.roles.sql を適用)
# ※手動で実行する場合は、psql から以下のコマンドを実行
#   CREATE ROLE mcp_writer LOGIN PASSWORD 'your-password';
#   GRANT USAGE ON SCHEMA public TO mcp_writer;
#   GRANT SELECT, INSERT, UPDATE ON notes, tags, note_tags TO mcp_writer;
#   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mcp_writer;
#   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO mcp_writer;
#   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO mcp_writer;
```

### ステップ 3: データベーススキーマの拡張
テーブルに `embedding` カラムと HNSW インデックスを適用します。
```bash
pct exec 123 -- su - postgres -c "psql -d mathkb -c '
  ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(384);
  CREATE INDEX IF NOT EXISTS notes_embedding_hnsw_idx ON notes USING hnsw (embedding vector_cosine_ops);
'"
```

### ステップ 4: アプリケーション環境変数の更新
Dockerホスト（LXC 130）内の `.env.mathkb` を更新します。
1. `MCP_DATABASE_URL` の接続文字列を `mcp_writer` のものに変更します。
   ```bash
   MCP_DATABASE_URL=postgresql://mcp_writer:your-password@10.0.100.123:5432/mathkb
   ```
2. MCPサーバーコンテナを再起動して設定を適用します。
   ```bash
   docker compose -p koshikai_mathkb -f docker-compose.internal.yaml up -d --force-recreate
   ```
