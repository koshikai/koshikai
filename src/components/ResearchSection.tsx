import { Cpu, Terminal, Zap, Layers } from "lucide-react";

const researchItems = [
  {
    title: "Private Math KB + MCP",
    description:
      "研究ノートを内部向けに構造化して蓄積し、AI からは読み取り専用 MCP で参照できる基盤を構築中。公開サイトには詳細を出さず、内部運用を前提に設計しています。",
    icon: Cpu,
    color: "bg-emerald-400",
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    features: ["PostgreSQL Search", "Read-only MCP", "Internal First"],
  },
  {
    title: "Modular Agent Skills",
    description:
      "Anthropic の設計思想に基づき、SKILL.md とディレクトリ構造でパッケージ化された能力。独自のメタデータ定義と Progressive Disclosure により、効率的な機能拡張を実現しています。",
    icon: Layers,
    color: "bg-indigo-400",
    accent: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    features: ["SKILL.md", "YAML Metadata", "Progressive Disclosure"],
  },
  {
    title: "Reactive Research Flow",
    description:
      "Marimo ノートブックのリアクティブな性質をエージェントが活用。コードの変更が即座に可視化されるため、自律的な仮説検証とデータ探索のループが高速化されます。",
    icon: Terminal,
    color: "bg-amber-400",
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    features: ["Real-time Analysis", "DAG-based Exec", "Python Ecosystem"],
  },
  {
    title: "Unified Python Tooling",
    description:
      "Astral 社のビジョンに基づき、Rust 製の超高速ツール (uv, Ruff, ty) を用いたエコシステムの統合を研究。断片化したツールチェーンを単一の高性能スタックへ再構築します。",
    icon: Zap,
    color: "bg-sky-400",
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-200 dark:border-sky-800",
    features: ["Rust-powered", "uv / Ruff / ty", "Toolchain Merger"],
  },
] as const;

export function ResearchSection() {
  return (
    <section
      className="mx-auto max-w-4xl px-6 py-12"
      aria-labelledby="research-heading"
    >
      <div className="flex items-center gap-4 mb-10">
        <h2
          id="research-heading"
          className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 italic text-balance"
        >
          Research Notes
        </h2>
        <div className="h-1 flex-1 bg-zinc-200 rounded-full dark:bg-zinc-800"></div>
      </div>

      <div className="mb-8">
        <p className="text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
          研究では、検証条件を明確にしたうえで再現可能なフローを重視しています。
          AIエージェントや知識基盤を活用しながら、
          実験結果を比較しやすい形に整理するための基盤を継続的に整備しています。
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {researchItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`flex flex-col gap-4 rounded-3xl border-2 p-6 ${item.bg} ${item.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1`}
            >
              <div
                aria-hidden="true"
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} text-white shadow-sm -rotate-2`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-2 text-balance">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <ul
                role="list"
                className="flex flex-wrap gap-1.5 mt-auto list-none"
              >
                {item.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/50 dark:bg-black/20 text-zinc-500 dark:text-zinc-400"
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
