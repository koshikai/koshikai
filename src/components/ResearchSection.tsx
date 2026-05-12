import { Brain, FlaskConical } from "lucide-react";

const researchItems = [
  {
    title: "ブーリアンネットワーク制御",
    description:
      "遺伝子ネットワークをモデル化したブーリアンネットワーク (BN) を対象に、Q学習を用いて特定の遺伝子間相互作用を遮断することで目標状態へ安定化させる制御手法の研究。信号時相論理 (STL) により「休薬期間」や「単調性」といった動的制約を形式化し、フラグ状態拡張によってマルコフ決定過程として扱う手法を提案。2つの生物学的モデル (Cortical Development, Wnt5a) において100%の制御成功率を達成。",
    icon: Brain,
    color: "bg-sky-500",
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-200 dark:border-sky-800",
    features: ["Q-learning", "STL Formalization", "Boolean Network", "卒業論文"],
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
          className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 italic text-balance tracking-tight"
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

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
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
    </section>
  );
}
