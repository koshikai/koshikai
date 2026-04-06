# koshikai.dev

公開ポートフォリオと、内部限定の数学ナレッジベース / MCP サーバーを同じリポジトリで管理する構成です。

## App Modes

- `SITE_VARIANT=portfolio`
  公開ポートフォリオを表示します。既存の `koshikai.dev` 用です。
- `SITE_VARIANT=notes`
  内部限定の数学KB UI を表示します。ノート一覧、詳細、キーワード検索、分野フィルタ、タグ絞り込みに対応します。`robots.txt` は全拒否、`sitemap.xml` は空になります。

## Environment Variables

主に使う変数は以下です。

```bash
SITE_VARIANT=portfolio | notes
SITE_URL=variant ごとの canonical / metadata 用 URL
notes_DATABASE_URL=postgresql://user:password@host:5432/notes
notes_APP_DATABASE_URL=postgresql://user:password@host:5432/notes
MCP_DATABASE_URL=postgresql://user:password@host:5432/notes
notes_DATABASE_SSL=disable (default) | require
MCP_BIND_HOST=0.0.0.0
MCP_PORT=3004
MCP_PATH=/mcp
```

`SITE_URL` は `portfolio` では `https://koshikai.dev`、`notes` では `http://127.0.0.1:3003` など内部URLを設定します。DB 接続は `notes_DATABASE_URL` を共通値として使えますが、Docker デプロイでは `notes_APP_DATABASE_URL` と `MCP_DATABASE_URL` を分けると、内部UIを `notes_app`、MCP を `app_reader` で動かせます。`notes_DATABASE_URL` が未設定なら、内部UI / MCP は `DATABASE_URL` にもフォールバックします。

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

DB schema をまとめて適用する場合 (`sh` / `bash`):

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

`notes.sql` では `pg_trgm` 拡張、全文検索用の `search_document`、`body_markdown` から `body_plain` を生成する trigger を定義します。

`notes` テーブルは以下のカラムを持ちます。

- `id`
- `slug`
- `title`
- `field`
- `summary`
- `body_markdown`
- `body_plain` (`body_markdown` から自動生成)
- `is_public`
- `created_at`
- `updated_at`
- `search_document` (generated tsvector)

関連テーブル:

- `tags` (`id`, `slug`, `name`, `created_at`)
- `note_tags` (`note_id`, `tag_id`, `created_at`)

v1 は `notes`, `tags`, `note_tags` のみです。`concepts` 系は未実装です。

## Deployment

公開ポートフォリオ用 compose:

- [`docker-compose.prod.yaml`](./docker-compose.prod.yaml)

内部KB + MCP 用 compose:

- [`docker-compose.internal.yaml`](./docker-compose.internal.yaml)

内部KB は `Dockerfile`、MCP サーバーは [`Dockerfile.mcp`](./Dockerfile.mcp) を使います。`docker-compose.internal.yaml` には NocoDB も含まれており、管理UI としてそのまま起動できます。`.env.notes` に `notes_APP_DATABASE_URL` / `MCP_DATABASE_URL` を設定すると、compose 上でも DB ロールを分離できます。未指定時は `notes_DATABASE_URL` を両方で共有します。

想定ポート:

- `3002`: 公開ポートフォリオ
- `3003`: 内部KB UI
- `3004`: MCP HTTP
- `8080`: NocoDB

監視用:

- `GET /healthz` on `notes-app`
- `GET /healthz` on `notes-mcp`

## LAN-only Operations Policy

内部KB UI / MCP / NocoDB は、インターネット公開を前提にしていません。`notes` 系のスタックは LAN 内またはホストローカルでのみ到達できるように運用してください。

- `3003`, `3004`, `8080` はルータでポート開放しない
- Proxmox ホストまたはゲストOSの firewall で、許可元を `192.0.2.20/16`, `192.0.2.10/8`, `192.0.2.30/12` など必要な内部セグメントに限定する
- 外部から使いたい場合も、公開 ingress ではなく VPN を使う
- MCP は書き込みツールを追加せず、DB ロールも `app_reader` の read-only を維持する
- `SITE_URL` は `notes` 用に内部URLを設定する

`docker-compose.internal.yaml` の `ports` はそのままでも動きますが、安全側に倒すなら `127.0.0.1:3003:3000` のように loopback bind へ変更し、必要なものだけ reverse proxy や SSH port forward で中継してください。

## GitHub Actions Deploy

`main` への push で [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) が動きます。

- `ghcr.io/koshikai/koshikai:latest` を build / push
- `ghcr.io/koshikai/koshikai-mcp:latest` を build / push
- Proxmox 上の self-hosted runner で `$HOME/deploy/koshikai` に compose を同期して公開ポートフォリオを再起動
- `/opt/home/.env.notes` または `$HOME/deploy/koshikai/.env.notes` が存在する場合のみ、内部KB / MCP / NocoDB も再起動

公開側は `/opt/home/.env.prod`、内部側は `/opt/home/.env.notes` を置いておけば、そのまま symlink されて使われます。必要なら直接 `$HOME/deploy/koshikai` 側に置いても構いません。内部側で DB ロールを分ける場合は `.env.notes` に `notes_APP_DATABASE_URL` と `MCP_DATABASE_URL` を追加してください。

### Proxmox prerequisites

GitHub Actions 側の workflow 定義は揃っており、次の前提が満たされていればデプロイできます。

- Proxmox 上に self-hosted GitHub Actions runner がある
- runner ホストで Docker Engine と Docker Compose plugin が使える
- runner ユーザーが `docker` を実行できる
- runner ホストから `ghcr.io` と GitHub へ outbound 接続できる
- 公開側を動かすなら `/opt/home/.env.prod` または `$HOME/deploy/koshikai/.env.prod` がある
- 内部KB / MCP も動かすなら `/opt/home/.env.notes` または `$HOME/deploy/koshikai/.env.notes` がある

手で置く必要があるファイルは基本的に env だけです。compose ファイルは workflow が毎回 `$HOME/deploy/koshikai` に同期します。

- 必須: `/opt/home/.env.prod`
- 任意: `/opt/home/.env.notes`
- 自動同期: `docker-compose.prod.yaml`, `docker-compose.internal.yaml`, `.env.notes.example`

初期セットアップ用に [`scripts/setup_server.sh`](./scripts/setup_server.sh) もあります。このスクリプトは `/opt/home` と `/opt/actions-runner-home` を作り、runner 用のベースディレクトリを用意します。

workflow の挙動は次の通りです。

- `.env.prod` が無いと公開側 deploy job は失敗する
- `.env.notes` が無いと内部KB / MCP / NocoDB の再起動はスキップされる
- `notes-mcp` は `Dockerfile.mcp` から別イメージとして build / push される

## MCP Tools

実装済みの読み取り専用ツール:

- `search_notes(query, field, tag, limit)` (`limit` は default 10, max 50)
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
