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
    title: "分散インフラ基盤の構築と運用",
    summary:
      "自宅の Proxmox 上で 10 以上のサービスを運用。重い機械学習処理だけを GPU のある別マシンへオフロードし、省電力と処理速度を両立した事例。",
    tags: ["Proxmox", "Immich", "GPU Offloading", "MCP", "IaC"],
    publishedAt: "2026-04-21",
    challenge:
      "単一の省電力ノードでは処理しきれない写真の顔認識タスクと、増え続けるサービスの運用コスト。",
    action:
      "Proxmox と LXC で基本機能を統合し、重い画像分類処理だけを Windows 側の GPU へオフロードする構成を採用。",
    result:
      "数日かかっていた初期スキャンを数時間に短縮。常時稼働の省電力サーバーと手元の GPU 資源を両立させた。",
    learning:
      "常時稼働ノードと演算ノードをネットワーク越しに分離することで、消費電力を抑えたまま高負荷な推論処理を実行できる。",
  },
  {
    slug: "smoke-it",
    axis: "build",
    title: "Smoke it.: 喫煙習慣を記録し、改善を支援する AI コーチ付き PWA",
    summary:
      "ワンタップ記録・傾向の可視化・記録データを踏まえた AI コーチで、喫煙習慣を客観的に振り返り、改善を考えられるようにした PWA。",
    tags: ["Next.js", "PWA", "AI Coach", "PostgreSQL", "Web Push"],
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
      "Next.js と Prisma、Auth.js で基盤を構築。Stripe Checkout を組み込み、サンドボックス環境で決済フローを検証。",
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
    title: "JR北海道 冬期運行リスクのデータ分析",
    summary:
      "大学院 PBL として、JR北海道の冬期ポイント不転換リスクをデータで定量化。データ品質の修復から多重共線性の解消まで、現場活用を前提とした統計分析を実施し、JR社員から実際の業務計画への活用を検討するフィードバックを得た。",
    tags: ["Python", "Logistic Regression", "Data Analysis", "PBL"],
    publishedAt: "2026-06-23",
    challenge:
      "初期データで追分駅の気温が全件 0.0℃ という異常を発見。さらにモデル構築後に多重共線性（VIF > 2500）と深夜帯の Exposure Bias が重なり、推定値が実態とかけ離れた。",
    action:
      "アメダス観測地点の誤りを特定してデータを修復。変数変換で VIF を 1.3 以下に改善し、運行時間帯に絞って再推定。JR社員への発表では統計用語を平易な表現に変換した。",
    result:
      "複合条件で Precision 30.3%・Lift 43.2 倍を達成。JR北海道社員から「除雪班の事前配置基準として活用を検討する」という具体的なフィードバックを得た。",
    learning:
      "モデリング前のデータ品質検証と、統計指標を現場の意思決定基準（Lift・条件別の発生率）へ変換する工程が実務適用において重要になる。",
  },
  {
    slug: "research-workflow",
    axis: "research",
    title: "研究ワークフローの実装",
    summary:
      "実験条件の固定と記録の自動化により、研究プロセスの再現性を高めた事例。",
    tags: ["Research", "Reproducibility", "Experiment Design"],
    publishedAt: "2026-04-21",
    challenge:
      "曖昧な実験条件による結果比較の難しさ、ログ散逸による再検証の遅れ、検証品質のばらつき。",
    action:
      "探索速度よりも再現性を優先し、条件固定と記録ルールを整備。CLI とノートブックを連携させた再現実験環境を構築。",
    result:
      "実験の実行から図・論文のビルドまでを CLI で再実行できるようにし、再検証にかかる時間を約 80% 削減。",
    learning:
      "実験条件と実行コマンドをコードで固定することで、パラメータ変更時の再実験と論文図表の更新コストを大幅に削減できる。",
  },
  {
    slug: "ai-research-agent",
    axis: "research",
    title: "研究検証用 AI エージェントの構築",
    summary:
      "定型化できる検証作業を研究用の AI エージェントに委譲し、実験結果の突き合わせと監査を効率化した事例。",
    tags: ["AI Agent", "Research", "Automation", "Reproducibility"],
    publishedAt: "2026-10-05",
    challenge:
      "記録どおりに結果が出ているかを確かめる作業が属人化し、記録と実装のずれに気づけないまま再検証が重くなっていた。",
    action:
      "結果を見る前に条件を固定してハッシュを記録し、実験の再現実行・記録値の突き合わせ・選定規則の再計算・実装の read-only 監査をエージェントに任せた。",
    result:
      "エージェントの再計算が記録と合わなかった箇所（ハイパーパラメータ選定の最良値など）を洗い出し、記録側の誤りを検出・修正できた。",
    learning:
      "自動化する範囲（再現実行・数値照合・監査）と人間が判断する範囲（手法の採否・結論）を分離することで、再現性を保ったまま検証速度を上げられる。",
  },
];

export function getCaseBySlug(slug: string) {
  return caseItems.find((item) => item.slug === slug);
}

export function getCasesByAxis(axis: Axis) {
  return caseItems.filter((item) => item.axis === axis);
}

/** 軸ごとの表示名と、その軸を扱うトップレベルページ */
export const AXES: Record<Axis, { label: string; section: string; href: string }> = {
  build: { label: "Build", section: "Works", href: "/works" },
  operate: { label: "Operate", section: "Engineering", href: "/engineering" },
  research: { label: "Research", section: "Research", href: "/research" },
};
