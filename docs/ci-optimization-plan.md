# CI/CD パイプライン改善記録

最終確認: 2026-07-12

この文書は改善履歴と残課題をまとめたものです。現行workflowの操作仕様は [`deployment.md`](./deployment.md) を参照してください。

## 完了済み

### Phase 1（2026-06-01）

- amd64単一buildで不要だったQEMU setupを削除
- `bun audit` をdependency manifest / lockfile変更時だけ実行
- MCP関連変更のpath判定を導入

### Phase 2（2026-06-01）

- `lint-test`、`changes`、`build-app`、`build-mcp`、`deploy` にjobを分離
- MCP imageを関連変更時だけbuild
- Buildx GHA cacheをapp / MCP buildで利用
- self-hosted runnerが1台のためpublic / internal deployは同一job内で直列実行

## 現行フロー

```text
lint-test ─┬─> build-app ─┐
changes  ──┘              ├─> deploy
          └─> build-mcp ──┘
              (条件付き)
```

検証失敗時はimage buildとdeployを行いません。MCP buildがskipでもapp buildが成功すればdeployは進みます。

## 優先度の高い残課題

1. immutable deploy
   - composeをcommit SHA tagへ固定し、`latest`依存を減らす
   - rollback対象を明確にする
2. MCP security
   - portをloopbackまたは認証付きproxy配下へ置く
3. package境界の整理
   - WebとMCPのdependency境界をpackage単位で分離する案を検討する

## 低優先度の最適化候補

- Docker builder stageでBunをdownloadし直さないbase image構成の検証
- image digestが変わらない場合のpull / restart skip
- image pruneをdeploy critical pathから定期jobへ移動
- workflow durationを複数回計測し、中央値で改善効果を管理

## 検証方法

変更ごとに以下を確認します。

1. `bun run lint`
2. `bun run test -- --run`
3. `bun run build`
4. 対象Docker imageのbuild
5. Web / MCPのhealth check
6. GitHub Actions所要時間とdeploy後log

最適化のためのdummy commitは履歴を汚すため避け、必要なら`workflow_dispatch`を利用します。
