# docs 索引

このリポジトリの詳細ドキュメントです。概要とクイックスタートは [`../README.md`](../README.md)、AI エージェント向けの作業ガイドは [`../AGENTS.md`](../AGENTS.md) を参照してください。

| ドキュメント | 内容 | こんなときに |
|---|---|---|
| [`architecture.md`](./architecture.md) | ポートフォリオと MathKB MCP の全体構成、route 一覧、データモデル、セキュリティ、Docker image | 全体像を把握したいとき |
| [`deployment.md`](./deployment.md) | GitHub Actions の job 構成、Compose 定義、必要なサーバー環境、Troubleshooting | デプロイやサーバー設定を触るとき |
| [`mcp.md`](./mcp.md) | MCP の transport、tool 一覧、DB role、embedding、環境変数 | MCP サーバーや DB を扱うとき |
| [`image-assets.md`](./image-assets.md) | デザインシステム（配色・タイポグラフィ）と画像アセットの要件 | 画像やビジュアルを追加するとき |
| [`ci-optimization-plan.md`](./ci-optimization-plan.md) | CI/CD 改善の履歴と残課題 | CI を最適化するとき |

## 設定ファイルのテンプレート

| ファイル | 用途 |
|---|---|
| [`../.env.example`](../.env.example) | ローカル開発用（`.env.local` にコピー） |
| [`../.env.mathkb.example`](../.env.mathkb.example) | MathKB MCP 内部スタック用（サーバーの `.env.mathkb` にコピー） |

`docs/**` と Markdown のみの変更では deploy workflow は起動しません。
