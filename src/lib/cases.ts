export type Axis = "build" | "operate" | "research";

export interface CaseItem {
  slug: string;
  /** どの軸の事例か。Works / Engineering / Research の各ページがこれで絞り込む */
  axis: Axis;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  challenge?: string;
  action?: string;
  result?: string;
  learning?: string;
}

export const caseItems: CaseItem[] = [
  {
    slug: "immich-distributed",
    axis: "operate",
    title: "Immich の機械学習処理を GPU マシンへ分離",
    summary:
      "写真管理ツール Immich の顔検出・画像検索・文字認識だけを、LAN 上の Windows PC の GPU へ送る構成。本体は省電力サーバーの LXC に置いたまま、更新は本体と推論側を同じバージョンに揃えて進めている。",
    tags: ["Immich", "Proxmox", "LXC", "CUDA", "GPU Offloading"],
    publishedAt: "2026-04-21",
    challenge:
      "省電力ノード 1 台では、約 1.8 万枚の写真の顔認識と画像検索の索引づくりが数日経っても終わらなかった。",
    action:
      "Immich 本体は LXC に置いたまま、機械学習の推論だけを Windows PC の WSL コンテナ（CUDA）へ LAN 越しに送る構成にした。",
    result:
      "数日かかっていた初期スキャンが数時間で終わった。1 枚あたりの顔検出と CLIP の埋め込みは約 60 ミリ秒。",
    learning:
      "推論側が止まっても本体は動き続けるが、ジョブは失敗として残る。本体と推論コンテナのバージョンを揃える手順が運用の要になった。",
  },
  {
    slug: "smoke-it",
    axis: "build",
    title: "Smoke it.: 喫煙習慣を記録し、改善を支援する AI コーチ付き PWA",
    summary:
      "ワンタップ記録・傾向の可視化・記録データを踏まえた AI コーチで、喫煙習慣を客観的に振り返り、改善を考えられるようにした PWA。",
    tags: ["TanStack Start", "PWA", "AI Coach", "PostgreSQL", "Web Push"],
    publishedAt: "2026-04-21",
    challenge:
      "既存アプリは初期登録が面倒で続かず、見た目が医療的すぎ、自分のデータも手元に残らなかった。",
    action:
      "オフラインでも動く PWA とワンタップ記録（Optimistic UI）を実装し、直近の記録傾向を渡して対話できる AI コーチを組み込んだ。",
    result:
      "記録の手間をワンタップまで削り、タイムラインとグラフで自分の行動傾向を把握できるようになった。",
    learning:
      "AI 連携では全履歴をそのまま渡すのではなく、直近4週間の統計傾向に要約して渡すことで応答の安定性と実用性が向上した。",
  },
  {
    slug: "karigallery",
    axis: "build",
    title: "KariGallery: 決済フローまで実装したイラストギャラリー",
    summary:
      "友人のイラストを管理・公開するギャラリー。Stripe による決済フローまで実装・検証したうえで、法的手続きの負荷を踏まえて本番決済は行わない判断をした。",
    tags: ["Auth.js", "Stripe", "Prisma v7.7", "Image Processing"],
    publishedAt: "2026-04-21",
    challenge:
      "友人のイラストを一箇所でまとめて展示したい。あわせて将来の通販を見据えた決済技術の検証も行いたい。",
    action:
      "TanStack Start と Prisma、Auth.js で基盤を構築。Stripe Checkout を組み込み、サンドボックス環境で決済フローを検証。",
    result:
      "技術的には販売可能な状態を整えた上で、法的手続きの運用負荷を考慮して決済機能を停止。ダミーデータによるギャラリーとして公開。",
    learning:
      "決済機能の実装コスト以上に、特定商取引法対応や個人情報管理など継続運用に伴う法務・運用コストの見積もりが重要になる。",
  },
  {
    slug: "home-backup",
    axis: "operate",
    title: "自宅バックアップ基盤の構築",
    summary:
      "スマートフォンの故障をきっかけに、写真や動画を手元で保護するバックアップ運用を設計・構築した事例。",
    tags: ["Home Server", "Backup", "Proxmox"],
    publishedAt: "2026-04-21",
    challenge:
      "スマートフォンの故障によるデータ喪失リスク、クラウドストレージの容量課金増加、および復旧手順の未整理。",
    action:
      "Proxmox 上に自動バックアップを再設計し、定期的な世代保持と復元手順のドキュメント化を実施。",
    result:
      "日次・週次のバックアップが自動化され、障害時の復元手順と所要時間が明確になった。",
    learning:
      "データの複製だけでなく、障害発生時に迷わず実行できる復元手順書を整備して初めてバックアップとして機能する。",
  },
  {
    slug: "deploy-automation",
    axis: "operate",
    title: "デプロイ作業の自動化",
    summary:
      "手動更新で生じていた手順差分や作業ミスを、CI/CD パイプラインと運用手順の標準化で解消した事例。",
    tags: ["CI/CD", "GitHub Actions", "Self-hosted Runner"],
    publishedAt: "2026-04-21",
    challenge:
      "手作業による更新ミスのリスク、手順の属人化、およびデプロイ履歴の追跡困難。",
    action:
      "GitHub Actions と自宅の self-hosted runner を連携させ、テストからコンテナ更新までを自動化。",
    result:
      "更新作業の手間を削減し、デプロイの再現性を確保。ビルドログとコンテナログが一元化され、障害時の原因切り分けが高速化した。",
    learning:
      "CI/CD の導入効果は作業時間の短縮だけでなく、テスト・ビルド・反映の手順が常に同一条件で実行される点にある。",
  },
  {
    slug: "jr-hokkaido-pbl",
    axis: "research",
    title: "データ分析 × 鉄道の冬期リスク",
    summary:
      "大学院 PBL で、JR北海道の冬期ポイント不転換リスクをデータで定量化した。アメダスの紐付け誤りの修復から、多重共線性を抑えたロジスティック回帰までを担当し、JR北海道の社員から業務計画への活用を検討するフィードバックを得た。",
    tags: ["Python", "Logistic Regression", "Data Analysis", "PBL"],
    publishedAt: "2026-06-23",
    challenge:
      "初期データでは追分駅の気温が全件 0.0℃ だった。モデルを作ると多重共線性（VIF 2500 超の組があった）と深夜帯の Exposure Bias が重なり、推定値が実態と合わなかった。",
    action:
      "アメダスの観測地点の誤りを特定してデータを再取得した。気象変数を「1 時間前の値」と「直近 1 時間の変化量」に分け、VIF を 1.3 以下に下げた。運行時間帯（5〜23 時）に絞って再推定し、社員への発表では統計用語を平易な表現に置き換えた。",
    result:
      "6 時間累積降水 5mm 以上かつ気温 -8℃ 以下の条件で、Precision 32.0%、Lift 19.9 倍（全体の発生率 1.59% に対する比）だった。該当は 261 時間で、再現率は 2.6% にとどまる。JR北海道の社員から「除雪班の事前配置基準として活用を検討したい」とのフィードバックを得た。",
    learning:
      "データの異常を原因まで追うことと、統計指標を現場の判断基準（発生率や Lift）に置き換えることが、現場で使う分析には必要になる。",
  },
  {
    slug: "research-workflow",
    axis: "research",
    title: "再現性 × 実験環境",
    summary:
      "実験の設定・実行・図の生成をコードで固定し、同じ手順を繰り返せるようにした事例。",
    tags: ["Research", "Reproducibility", "Experiment Design"],
    publishedAt: "2026-04-21",
    challenge:
      "実験条件が文書とコードに分かれ、数か月前の結果を同じ条件で再実行するのに時間がかかっていた。ログや図が作業ディレクトリに散らばり、比較の前提を毎回確認する必要があった。",
    action:
      "設定を YAML に、実行を CLI のタスクにまとめ、学習・評価・図の生成を同じコマンドから回せるようにした。乱数種と出力先を設定に固定し、結果は run ごとのディレクトリに保存した。",
    result:
      "同じ設定と同じ乱数種を指定すると、学習から図の生成までを再実行できる。論文用の図もスクリプトから作り直せるため、設定を変えたときの差し替えが 1 コマンドで済む。",
    learning:
      "設定・実行・図の生成を同じ場所に置くと、結果の比較と差し替えの手順が短くなる。",
  },
  {
    slug: "agent-operations",
    axis: "operate",
    title: "AI エージェント運用基盤の構築",
    summary:
      "自宅サーバーに Hermes Agent を常駐させ、差分と履歴の確認・検証コマンドの実行・デプロイ監視を SSH 越しに委譲。モデル選定、コンテキスト圧縮、日次バックアップまで含めて運用している事例。",
    tags: ["AI Agent", "Hermes Agent", "MCP", "LLM", "Operations"],
    publishedAt: "2026-11-10",
    challenge:
      "定型の確認作業に毎回席を取られ、会話が長くなると文脈が切れ、モデルを乗り換えるたびに同じ前提を書き直していた。",
    action:
      "自宅の LXC にエージェントを常駐させ、用途別プロファイルと SSH 越しの操作を整備。モデルはツール呼び出しの安定性とプロンプトキャッシュ効率で選び、長い会話は要約の階層と全文検索で原文を残したまま圧縮した。",
    result:
      "主に使うプロファイルで、91 日間に 155 セッション・7,968 メッセージ・4,022 回のツール実行を処理。状態と会話ログは日次で暗号化バックアップされ、モデルを差し替えても手順と履歴が残る構成になった。",
    learning:
      "常駐エージェントを続けて使うには、長い会話を原文に戻せる形で圧縮しておくことと、任せる範囲と落とし穴を手順として残すことが要った。",
  },
  {
    slug: "transfer-line",
    axis: "research",
    title: "転移 × 打ち切り",
    summary:
      "粗いモデルで学んだ制御方策を詳しいモデルへ移す試みと、それを保留にして閉じるまでの記録。移せなかった理由と、閉じたあとに何が残ったかを書いている。",
    tags: ["Transfer Learning", "GNN", "PyTorch"],
    publishedAt: "2026-11-12",
    challenge:
      "粗いモデルと詳しいモデルで状態の意味がずれ、方策をそのまま移すと双方で振る舞いが変わる。到達の成功率が上がっても、到達後の維持と別モデルへの一般性は示せていなかった。",
    action:
      "節点の対応付けを明示する方法と、方策をグラフニューラルネットワークに蒸留する方法を試した。判断を先送りにしないため、各段階の結果と弱点を記録し、再開の条件を書ける状態にして保留にした。",
    result:
      "到達の成功率は上がったが、到達後の維持は弱く、一般性は示せなかった。関連するラインでは条件とハッシュを先に固定した確認的評価を行い、交互作用を検出できなかったため完了として閉じた。",
    learning:
      "記録として後で効くのは、成功した実験より止めた理由のほうだった。閉じた日付と、閉じた時点で何が分かっていなかったかを残すと、同じ検討を繰り返さずに済む。",
  },
  {
    slug: "ai-research-agent",
    axis: "research",
    title: "AI エージェント × 研究検証",
    summary:
      "定型の検証作業を研究用の AI エージェントに任せ、記録と実装のずれを拾う仕組みを作った事例。",
    tags: ["AI Agent", "Research", "Automation", "Reproducibility"],
    publishedAt: "2026-10-05",
    challenge:
      "記録どおりに結果が出ているかを確かめる作業が特定の作業者に依存し、記録と実装のずれに気づかないまま再検証が重くなっていた。",
    action:
      "結果を見る前に条件とハッシュを固定し、再現実行・記録値との突き合わせ・選定規則の再計算・実装の read-only 監査をエージェントに任せた。手法の採否と結論は自分で決めた。",
    result:
      "学習と評価で状態が重なっていた評価集合、介入なしの条件を 1 ステップだけで判定していた箇所、教師データの成功判定を終端状態から記録していなかった箇所が見つかり、記録と採点を直した。",
    learning:
      "任せる範囲を再現・照合・監査に限り、手法の採否と結論を自分に残すと、記録の誤りを直す責任が曖昧にならない。",
  },
  {
    slug: "mathkb",
    axis: "operate",
    title: "MathKB × MCP サーバー",
    summary:
      "手書きのノートと研究リポジトリの文書を、1 つの MCP サーバーから引けるようにした検索基盤。25 問の評価セットで検索品質を測りながら、埋め込みモデルとリランカーを入れ替えた。",
    tags: ["TypeScript", "PostgreSQL", "pgvector", "MCP", "RAG"],
    publishedAt: "2026-11-12",
    challenge:
      "研究の判断がリポジトリの ADR と実験記録に散らばり、同じ検討をやり直すことが増えていた。短い決定記録は長い設計文書に埋もれ、キーワード検索では日本語が効かない。",
    action:
      "手書きノートと研究文書を 1 つの MCP サーバーにまとめ、見出し優先で 900 文字に切ったチャンクと、チャンク・文書要約・キーワードを RRF で統合する検索を実装した。25 問の評価セットで Recall@8 と MRR@8 を測り、埋め込みモデルとリランカーを比較している。",
    result:
      "埋め込みを e5-small から bge-m3 に替えて Recall@8 は 0.56 → 0.96。文書要約の経路で 0.64 → 0.72、英語訳の併用で 0.96 まで上がった。リランカーは 1 クエリ 22.7 秒かかったうえ精度も落ちたため、既定で無効にした。索引は 1,632 文書・12,246 チャンク。",
    learning:
      "同じ人が評価セットを見ながら改善を作ると、数字は簡単に良くなる。評価クエリの語彙から育てた用語表は 25/25 を出したが in-sample なので凍結した。採否の線を先に引く。",
  },
];

export function getCaseBySlug(slug: string) {
  return caseItems.find((item) => item.slug === slug);
}

export function getCasesByAxis(axis: Axis) {
  return caseItems.filter((item) => item.axis === axis);
}

/** 軸ごとの表示名と、その軸を扱うトップレベルページ、事例一覧での見出し */
export const AXES: Record<Axis, { label: string; section: string; href: string; casesTitle: string }> = {
  build: { label: "Build", section: "Works", href: "/works", casesTitle: "開発の事例" },
  operate: { label: "Operate", section: "Engineering", href: "/engineering", casesTitle: "運用の事例" },
  research: { label: "Research", section: "Research", href: "/research", casesTitle: "研究・分析の事例" },
};
