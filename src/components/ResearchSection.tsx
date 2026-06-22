import { Brain, FlaskConical, GitMerge } from "lucide-react";

const researchItems = [
  {
    title: "ブーリアンネットワーク制御",
    description:
      "遺伝子ネットワークをモデル化したブーリアンネットワーク (BN) を対象に、Q学習を用いて特定の遺伝子間相互作用を遮断することで目標状態に安定化させる制御手法の研究。信号時相論理 (STL) により「休薬期間」や「単調性」といった動的制約を形式化し、フラグ状態拡張によってマルコフ決定過程として扱う手法を提案。2つの生物学的モデル (Cortical Development, Wnt5a) において100%の制御成功率を達成。",
    icon: Brain,
    color: "bg-sky-500",
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-200 dark:border-sky-800",
    features: ["Q-learning", "STL Formalization", "Boolean Network", "卒業論文"],
  },
  {
    title: "モデル間制御知識転移 (C2D)",
    description:
      "同一の生物学的機構を異なる粒度（解像度）で記述した2つのBN（例：アポトーシスの n25 モデルと n39 モデル）を対象とし、粗いモデルの制御知識を詳細なモデルへ転移する手法の研究。GNNによる構造・意味特徴量の埋め込みと、Action-Prior Transfer（アクション優先度転移）による方策適応手法を提案し、検証中。",
    icon: GitMerge,
    color: "bg-purple-500",
    accent: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    features: ["Transfer Learning", "GNN", "Action-Prior", "修士研究"],
  },
  {
    title: "対話的研究実験環境",
    description:
      "研究データの解析・可視化環境として Marimo (リアクティブノートブック) を活用。エージェントがコード変更を即座に可視化できる特性を活かし、強化学習の学習曲線やSTLロバストネス値の探索を高速化。論文の全実験はこの環境上で再現可能な形で管理。",
    icon: FlaskConical,
    color: "bg-amber-500",
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    features: ["Marimo", "Interactive Analysis", "Reproducibility", "Python"],
  },
] as const;

const presentations = [
  {
    title: "A Reinforcement Learning Approach to Set Stabilization of Boolean Networks by Edge Removal Control",
    conference: "SICE FES 2026 (The SICE Festival with Annual Conference)",
    date: "2026.09 (予定)",
    style: "ポスター発表",
    location: "パシフィコ横浜 (神奈川)",
    isInternational: true,
    isFuture: true,
  },
  {
    title: "Edge Removal Control of Boolean Networks with STL Specifications Using Reinforcement Learning",
    conference: "The 41st International Technical Conference on Circuits/Systems, Computers and Communications (ITC-CSCC 2026)",
    date: "2026.07 (予定)",
    style: "口頭発表 (Oral)",
    location: "Bangkok, Thailand",
    details: "Paper ID: 1571266141",
    isInternational: true,
    isFuture: true,
  },
  {
    title: "ブーリアンネットワークのモデルフリーエッジ除去制御",
    conference: "第70回システム制御情報学会研究発表講演会 (SCI'26)",
    date: "2026.05",
    style: "口頭発表",
    location: "ウインクあいち (愛知)",
    isInternational: false,
    isFuture: false,
  },
] as const;

export function ResearchSection({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-4xl px-6 py-12 animate-fade-in-up ${className || ""}`}
      aria-labelledby="research-heading"
    >
      <div className="flex items-center gap-4 mb-10">
        <h2
          id="research-heading"
          className="text-pretty text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase"
        >
          Academic Research
        </h2>
        <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
      </div>

      <div className="mb-8">
        <p className="text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
          ブーリアンネットワークの制御理論を中心に、強化学習と形式手法を組み合わせた研究を行っています。
          実験環境から理論検証までを一貫して自ら設計し、再現性を重視したフローで進めています。
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {researchItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`group flex flex-col gap-4 rounded-[2.5rem] border border-white/50 bg-white/40 p-7 shadow-2xl backdrop-blur-xl dark:border-zinc-700/30 dark:bg-zinc-900/40 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}
            >
              <div className="relative">
                <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${item.color} rounded-full`}></div>
                <div
                  aria-hidden="true"
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-white shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-zinc-800 dark:text-white mb-2 text-balance tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <ul
                role="list"
                className="flex flex-wrap gap-2 mt-auto list-none"
              >
                {item.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-600/30"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Publications & Presentations */}
      <div className="mt-16">
        <h3 className="text-2xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 mb-6 uppercase flex items-center gap-4">
          <span>Publications & Presentations</span>
          <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        </h3>
        
        <div className="space-y-4">
          {presentations.map((pres, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-zinc-850 dark:bg-zinc-900/30 transition-[transform,border-color,box-shadow] duration-350 hover:-translate-y-0.5 hover:border-sky-300 dark:hover:border-sky-900 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                    pres.isInternational
                      ? "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/20"
                      : "bg-teal-100/80 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-200/20"
                  }`}>
                    {pres.isInternational ? "International / 国際会議" : "Domestic / 国内学会"}
                  </span>
                  <span className="rounded-lg bg-zinc-100/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400 border border-zinc-200/20 dark:border-zinc-700/20">
                    {pres.style}
                  </span>
                  {pres.isFuture && (
                    <span className="rounded-lg bg-sky-100/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200/20">
                      Forthcoming / 発表予定
                    </span>
                  )}
                </div>
                <time className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{pres.date}</time>
              </div>

              <h4 className="text-base font-extrabold text-zinc-800 dark:text-zinc-100 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {pres.title}
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="font-bold">{pres.conference}</span>
                <span className="text-zinc-400 dark:text-zinc-500">
                  {pres.location}
                  {"details" in pres && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px]">
                      {pres.details}
                    </span>
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
