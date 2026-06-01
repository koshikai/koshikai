# CI/CD パイプライン改善計画

最終更新: 2026-06-01 (Phase 1 完了)

## 進捗

| Phase | 状態 | コミット | 実測削減 |
|-------|------|----------|----------|
| Phase 1: 即時実施 (リスク低) | ✅ 完了 | `9b2d3b6` | 約 25-40秒 (QEMU + bun audit) |
| Phase 2: 並列化 | ⏳ 未着手 | — | 期待 2-4分 |
| Phase 3: ビルド最適化 | ⏳ 未着手 | — | 期待 30-60秒 |
| Phase 4: デプロイ最適化 | ⏳ 未着手 | — | 期待 30-60秒 |

## Phase 1 実施結果 (2026-06-01)

### 変更内容

1. `Set up QEMU` ステップを削除
   - `linux/amd64` 1アーキのみビルドなので不要
   - 期待削減: 5-10秒
2. `bun audit` を lockfile 変更時のみ実行
   - `dorny/paths-filter@v3` で `bun.lock` / `package.json` の変更を検出
   - 期待削減: 20-30秒
3. `Dockerfile.mcp` / `src/mcp/**` を `paths-ignore` に追加
   - Phase 2 の MCP path trigger 化の前段
   - 単独削減効果なし (Phase 2 で活用)

### 実測

- commit `9b2d3b6` push → deploy job 完了まで: プッシュ後 9分
  - long-polling 遅延: 7分 (self-hosted runner の挙動)
  - workflow 実時間: 約 1分44秒 (deploy job のみ計測可、build job は GitHub Actions UI で確認必要)
- ビルド検証: koshikai-app, mathkb-app, mathkb-mcp すべて HTTP 200/404 (正常起動)

### 注意点

- long-polling 遅延 (7分) は self-hosted runner の特性で、Phase 1-4 では改善対象外
- 実際の削減効果を測るには GitHub Actions UI で `build` job の所要時間を確認する必要あり

## 現状 (Before)

`main` ブランチへの push で実行される `.github/workflows/deploy.yml` の典型的な所要時間は **6〜9 分**。

### 処理時間の内訳

| ステップ | ジョブ | 概算時間 (warm cache) |
|----------|--------|---------------------|
| Checkout + Setup Bun + Bun install | build | 30秒 |
| Lint + Test + bun audit | build | 30〜60秒 |
| QEMU + Buildx + GHCR login | build | 20秒 |
| `Dockerfile` ビルド (deps → builder → runner) | build | 1.5〜3分 |
| `Dockerfile.mcp` ビルド | build | 1〜2分 |
| GHCR へ 2 イメージ push | build | 30〜60秒 |
| Deploy: checkout + login + sync | deploy | 15秒 |
| `docker compose pull` (public) | deploy | 30〜60秒 |
| `docker compose pull` (internal) | deploy | 30〜60秒 |
| コンテナ再起動 + cleanup | deploy | 20秒 |

### 主な無駄

1. **毎回 MCP イメージもフルビルド** — アプリだけの変更でも 1〜2 分浪費
2. **QEMU ステップが不要** — `linux/amd64` 1アーキのみビルド
3. **Lint/Test/Audit と Build が直列** — CPU/IO リソースが遊んでいる
4. **Builder ステージで Bun を再インストール** — `node:22-slim` に curl で bun を入れる 1 分が毎回発生
5. **Public と Internal のデプロイが直列** — 互いに独立なのに順次実行
6. **`docker compose pull` が常に走る** — イメージ digest が変わっていなくても pull
7. **`bun audit` が常に走る** — 依存 lockfile 変更時のみ必要

## 目標 (After)

**2〜3 分** (約 60〜70% 削減) を目指す。

## Phase 1: 即時実施 (リスク低)

| 項目 | 期待削減 | 工数 | リスク |
|------|----------|------|--------|
| `Set up QEMU` ステップ削除 | 5〜10秒 | 5分 | 極小 (amd64 のみ) |
| `bun audit` を `bun.lock` 変更時のみ | 20〜30秒 | 30分 | 小 (失敗条件の制御必要) |
| `Extract app metadata` を 1 step に統合 | 5秒 | 15分 | 極小 |
| `paths-ignore` に `Dockerfile.mcp` を追加 (Phase 2 の前段) | — | 10分 | 極小 |

## Phase 2: 並列化 (リスク中・効果大)

| 項目 | 期待削減 | 工数 | リスク |
|------|----------|------|--------|
| `lint-test` ジョブを分離し `build` と並列実行 | 30〜60秒 | 1時間 | 中 (失敗時のブロック条件を再設計) |
| `build-mcp` ジョブを path トリガー化 (`Dockerfile.mcp` / `src/mcp/**` 変更時のみ) | 1〜2分 | 1時間 | 中 (キャッシュ共有を再設計) |
| `deploy-public` / `deploy-internal` を並列ジョブ化 | 30〜60秒 | 1時間 | 中 (両ジョブが self-hosted runner を 2 必要とする可能性) |

### ジョブ構成 (Phase 2 完了後)

```
        ┌─ lint-test (ubuntu-latest)
        │
push ───┼─ build-app (ubuntu-latest) ─┐
        │                              │
        ├─ build-mcp (ubuntu-latest) ─┤
        │   [paths: Dockerfile.mcp,   │
        │    src/mcp/**, package.json]│
        │                              │
        └──────────────────────────────┼─ deploy (self-hosted)
                                       │   ├─ pull public
                                       │   ├─ pull internal
                                       │   └─ restart
```

## Phase 3: ビルド最適化 (リスク中・効果中)

| 項目 | 期待削減 | 工数 | リスク |
|------|----------|------|--------|
| Builder ステージを `oven/bun:1.3.13` ベースに変更 (bun 再インストール廃止) | 30〜60秒 + イメージサイズ削減 | 2時間 | 中 (Alpine vs glibc で `node-gyp` などの挙動差を確認) |
| Bun install を Docker 外 (CI ホスト) で実行し結果をキャッシュ | 30秒 | 1.5時間 | 中 (Dockerfile 構造変更) |
| ベースイメージ (`oven/bun`, `node:22-slim`) を CI 冒頭で pre-pull | 10秒 | 15分 | 極小 |
| `next build` の `--debug` フラグ除去 / `productionBrowserSourceMaps: false` 確認 | 10〜20秒 | 30分 | 極小 |

### Builder ステージ変更案

```dockerfile
# Before
FROM node:22-slim AS builder
RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    apt-get remove -y curl unzip && apt-get autoremove -y
ENV PATH="/root/.bun/bin:${PATH}"

# After
FROM oven/bun:1.3.13 AS builder
# bun は既に PATH に存在
```

リスク検証手順:
1. ローカルで `docker build -f Dockerfile .` を実行し、現状と同等の `.next/standalone` が出力されることを確認
2. イメージサイズを比較 (Alpine vs Debian slim)
3. 起動後 `GET /healthz` が 200 を返すことを確認

## Phase 4: デプロイ最適化 (リスク中・効果中)

| 項目 | 期待削減 | 工数 | リスク |
|------|----------|------|--------|
| `docker compose pull` を digest 一致時スキップ | 30〜60秒 | 1時間 | 中 (digest 比較ロジックの正確性) |
| Public/Internal の再起動を並列ジョブ化 | 30〜60秒 | 1時間 | 中 (self-hosted runner の同時実行数) |
| `docker image prune` を日次 Cron で別 workflow 化 | 5秒 | 30分 | 小 |

### Pull スキップの疑似コード

```bash
# Remote の digest を取得
REMOTE_DIGEST=$(docker buildx imagetools inspect \
  "ghcr.io/koshikai/koshikai:latest" --format '{{json .Digest}}')
# Local の digest を取得
LOCAL_DIGEST=$(docker images --no-trunc --quiet \
  ghcr.io/koshikai/koshikai:latest | head -1)
if [ "$REMOTE_DIGEST" = "$LOCAL_DIGEST" ]; then
  echo "Image digest unchanged. Skipping pull."
else
  docker compose pull
fi
```

## 期待される総合効果

| フェーズ | 累積削減 | 目標時間 |
|----------|----------|----------|
| 現状 | — | 6〜9分 |
| Phase 1 | 30〜45秒 | 5.5〜8.5分 |
| Phase 2 | 2.5〜4分 | 3〜5.5分 |
| Phase 3 | 3.5〜5分 | 2.5〜4分 |
| Phase 4 | 4〜6分 | **2〜3分** |

## 検証手順

各 Phase 完了後:

1. **計測**: ダミー commit で workflow を 3 回連続実行し、所要時間の中央値を取得
2. **イメージ検証**: ビルド後の `ghcr.io/koshikai/koshikai:latest` の digest を `docker buildx imagetools inspect` で確認
3. **アプリ検証**: 公開側 `koshikai.dev` と内部 `mathkb` がそれぞれ HTTP 200 を返すことを確認
4. **後退確認**: `docker compose logs --tail 50` で起動エラーが出ていないこと

## ロールバック

各 Phase の変更は単一のファイル (`deploy.yml` または `Dockerfile`) への修正のため、
revert commit で即座に元に戻せる。

## 未着手の検討事項 (将来)

- Buildx のリモートキャッシュを GHA cache ではなく self-hosted runner のローカル registry に置く
- Turborepo / Nx による affected-only ビルド (現状は規模的に overkill)
- watchtower などを使った push 自動反映 (現状の workflow による明示的デプロイとトレードオフ)
