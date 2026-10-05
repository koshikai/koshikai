import type { ComponentType } from "react";

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
      "単一のマシンにすべてを詰め込まず、ネットワーク越しに役割を分担させることで、ハードウェアの制約を構成で回避できると分かった。",
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
      "AI 連携では全履歴を漫然と渡すのではなく、直近4週間の傾向に絞り込んで渡す設計が、回答の安定性と実用性を高めた。",
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
      "技術的に作れることと、実際に金銭を受け取って運用し続けることの責任の差を実感した。",
  },
  {
    slug: "home-backup",
    axis: "operate",
    title: "自宅バックアップ基盤の構築",
    summary:
      "スマートフォンの故障をきっかけに、写真や動画を手元で守るためのバックアップ運用を設計・継続した事例。",
    tags: ["Home Server", "Backup", "Proxmox"],
    publishedAt: "2026-04-21",
    challenge:
      "スマートフォンの突然の故障によるデータ喪失と、クラウド頼みによる容量課金の増加、復旧手順の未整理。",
    action:
      "Proxmox 上に自動バックアップを再設計し、定期的な世代保持と復元手順のドキュメント化を実施。",
    result:
      "バックアップが生活の中で自然に回り、障害時の対処手順が明確になった。「保存されているはず」という曖昧な不安を解消できた。",
    learning:
      "データのコピーだけでなく、いざ壊れたときの復元手順を平易な言葉で残して初めて実用的な備えになる。",
  },
  {
    slug: "deploy-automation",
    axis: "operate",
    title: "デプロイ作業の自動化",
    summary:
      "手動更新で生じていた手順差分やミスへの不安を、CI/CD パイプラインと運用手順の固定化で解消した事例。",
    tags: ["CI/CD", "GitHub Actions", "Self-hosted Runner"],
    publishedAt: "2026-04-21",
    challenge:
      "手作業の多さによるミスの不安、手順の属人化、および反映状態の履歴追跡が困難だったこと。",
    action:
      "GitHub Actions と自宅の self-hosted runner を連携させ、テストからコンテナ更新までを自動化。",
    result:
      "更新作業の手間を削減し、反映の再現性を確保。ビルドログやコンテナログが揃い、障害時の原因究明が格段に早くなった。",
    learning:
      "自動化の恩恵は時間の短縮以上に、いつ誰が実行しても同じ手順と検証が通る安心感にある。",
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
      "異常値の理由を徹底して調べる姿勢と、統計用語を現場の言葉へ翻訳する力が、分析を役立てるために欠かせないと実感した。",
  },
  {
    slug: "research-workflow",
    axis: "research",
    title: "研究ワークフローの実装",
    summary:
      "実験条件の固定と記録の自動化に加え、定型的な検証を AI エージェントに任せる分業を組み、研究プロセスの再現性を高めた事例。",
    tags: ["Research", "Reproducibility", "AI Agent", "Experiment Design"],
    publishedAt: "2026-04-21",
    challenge:
      "曖昧な実験条件による結果比較の難しさ、ログ散逸による再検証の遅れ、検証品質のばらつき。",
    action:
      "探索速度よりも再現性を優先し、条件固定と記録ルールを整備。CLI とノートブックを連携させた再現実験環境を構築し、実験の再現実行と記録値の突き合わせ、実装の読み解きは研究用の AI エージェントに任せた。",
    result:
      "実験の実行から図・論文のビルドまでを CLI で再実行できるようにし、再検証にかかる時間を約 80% 削減。再計算が記録と合わなかった箇所は、記録側の誤りとして自分で確認して直した。",
    learning:
      "実験環境をコードで固定する初期投資が、結果としてその後の仮説検証のサイクルを最も軽くしてくれた。定型作業はエージェントに任せ、採否の判断は自分で持つと、再現性を落とさず検証回数を増やせる。",
  },
];

const caseMdxModules: Record<string, () => Promise<{ default: ComponentType }>> =
  Object.fromEntries(
    caseItems.map((item) => [
      item.slug,
      () => import(`@/content/cases/${item.slug}.mdx`),
    ]),
  );

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

export async function getCaseContentComponent(slug: string) {
  const loader = caseMdxModules[slug];
  if (!loader) return null;
  const mdxModule = await loader();
  return mdxModule.default;
}
