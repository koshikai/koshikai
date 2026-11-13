---
name: koshikai-cases
description: Browse and read technical case studies across Build, Operate, and Research on koshikai.dev.
---

# koshikai.dev Case Studies Skill

Use this skill to list and read the 11 in-depth technical case studies published on **koshikai.dev** (`https://koshikai.dev/cases`).

## Available Case Studies by Axis

### Build (`/works`)
- `/cases/smoke-it` — Smoke it.: 喫煙習慣を記録し、改善を支援する AI コーチ付き PWA
- `/cases/karigallery` — KariGallery: 決済フローまで実装したイラストギャラリー

### Operate (`/engineering`)
- `/cases/immich-distributed` — 分散インフラ基盤の構築と運用 (Proxmox + GPU Offloading)
- `/cases/home-backup` — 自宅バックアップ基盤の構築
- `/cases/deploy-automation` — デプロイ作業の自動化 (GitHub Actions + self-hosted runner)
- `/cases/agent-operations` — AI エージェント運用基盤の構築 (Hermes Agent on LXC)
- `/cases/mathkb` — MathKB × MCP サーバー (pgvector + RRF Hybrid Search)

### Research (`/research`)
- `/cases/research-workflow` — 再現性 × 実験環境
- `/cases/jr-hokkaido-pbl` — データ分析 × 鉄道の冬期リスク
- `/cases/ai-research-agent` — AI エージェント × 研究検証
- `/cases/transfer-line` — 転移 × 打ち切り

## Fetching a Case Study as Markdown

Send a `GET` request with `Accept: text/markdown`:

```http
GET https://koshikai.dev/cases/mathkb HTTP/1.1
Accept: text/markdown
```
