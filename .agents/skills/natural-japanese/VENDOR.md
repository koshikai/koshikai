# 出自（vendored 外部スキル）

日本語文書を読みやすく書く・直すための Agent Skill。MIT ライセンスの第三者製スキルをそのまま同梱している（リポジトリ側で改変していない）。

- 上流: https://github.com/coji/natural-japanese
- 取得元: タグ `v2.0.0`（コミット `c9610f5`、公開 2026-11-05）
- 取得日: 2026-11-10
- 取得範囲: 上流の `skills/natural-japanese/` を丸ごと。`corpus/`・`evals/`・`dev/`・`release-notes/` は同梱していない
- ライセンス: MIT（`LICENSE` は上流リポジトリを参照）

## 前の版

同梱していたのは v2.0.0 より前の版（`SKILL.md` が約 20k 字、references の構成が旧レイアウト）。2026-11-10 に v2.0.0 へ差し替えた。上流 v2.0.0 では `SKILL.md` が約 52k 字になり、`scripts/` に `calques.py` / `newfacts.py` / `paragraphs.py` が増え、旧レイアウトの references（`writing-constitution.md` / `forbidden-patterns.md` / `readability-principles.md` など）は上流の構成へ統合された。

## 実行時の前提

`scripts/lint.py` は形態素解析に `sudachipy` を使う。素の `python3` では `ModuleNotFoundError: No module named 'sudachipy'` で落ちるので、次のどちらかで回す。

```bash
uv run --quiet --with sudachipy --with sudachidict-core python .agents/skills/natural-japanese/scripts/lint.py <file>
```

## 更新の確認方法

```bash
gh api repos/coji/natural-japanese/releases/latest --jq '.tag_name'
```

新しいタグが出ていたら `git clone --branch <tag> --depth 1` して `skills/natural-japanese/` を差し替え、このファイルの取得元と日付を更新する。
