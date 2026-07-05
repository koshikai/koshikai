import { Trophy } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const researchItems = [
  {
    title: "ブーリアンネットワーク制御",
    description:
      "遺伝子ネットワークをモデル化したブーリアンネットワーク (BN) を対象に、Q学習を用いて特定の遺伝子間相互作用を遮断することで目標状態に安定化させる制御手法の研究。信号時相論理 (STL) により「休薬期間」や「単調性」といった動的制約を形式化し、フラグ状態拡張によってマルコフ決定過程として扱う手法を提案。2つの生物学的モデル (Cortical Development, Wnt5a) において100%の制御成功率を達成。",
    features: ["Q-learning", "STL Formalization", "Boolean Network", "卒業論文"],
  },
  {
    title: "モデル間制御知識転移 (C2D)",
    description:
      "同一の生物学的機構を異なる粒度（解像度）で記述した2つのBN（例：アポトーシスの n25 モデルと n39 モデル）を対象とし、粗いモデルの制御知識を詳細なモデルへ転移する手法の研究。GNNによる構造・意味特徴量の埋め込みと、Action-Prior Transfer（アクション優先度転移）による方策適応手法を提案し、検証中。",
    features: ["Transfer Learning", "GNN", "Action-Prior", "修士研究"],
  },
  {
    title: "対話的研究実験環境",
    description:
      "研究データの解析・可視化環境として Marimo (リアクティブノートブック) を活用。エージェントがコード変更を即座に可視化できる特性を活かし、強化学習の学習曲線やSTLロバストネス値の探索を高速化。論文の全実験はこの環境上で再現可能な形で管理。",
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
    award: "学生発表賞",
  },
] as const;

const courses = [
  {
    name: "グローバル消費インテリジェンス寄付講座 (GCI)",
    org: "東京大学 松尾研究室",
    completedAt: "2025.09",
    highlight: "NFL予測 AUC 0.808→0.927、離職分析 ROI 445% の事業計画を策定",
  },
  {
    name: "LLM 大規模言語モデル講座 基礎編",
    org: "東京大学 松尾・岩澤研究室",
    completedAt: "2025.12",
    highlight: "Transformer・RLHF・RAG の理論と実装",
  },
  {
    name: "Deep Learning 基礎講座",
    org: "東京大学 松尾・岩澤研究室",
    completedAt: "2026.01",
    highlight: "CNN・RNN・最適化手法の数理と実装",
  },
] as const;

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      <span>{children}</span>
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

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
      className={`mx-auto w-full max-w-5xl px-6 py-20 sm:py-28 ${className || ""}`}
      aria-labelledby="research-heading"
    >
      <Reveal>
        <SectionHeading
          id="research-heading"
          index="04"
          label="Research"
          title="研究 — ブーリアンネットワーク制御"
        />

        <p className="mb-14 max-w-2xl text-base leading-[1.9] text-muted">
          ブーリアンネットワークの制御理論を中心に、強化学習と形式手法を組み合わせた研究を行っています。
          実験環境から理論検証までを一貫して自ら設計し、再現性を重視したフローで進めています。
        </p>

        {/* Research topics */}
        <ul className="mb-16 list-none">
          {researchItems.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-border py-8 sm:grid-cols-[3rem_1fr]"
            >
              <span className="font-mono text-sm text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="font-serif text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h4>
                <p className="mt-3 max-w-2xl text-sm leading-[1.9] text-muted">
                  {item.description}
                </p>
                <ul role="list" className="mt-4 flex flex-wrap gap-2 list-none">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        {/* Publications & Presentations */}
        <div className="mb-16">
          <SubHeading>Publications &amp; Presentations</SubHeading>

          <div className="list-none">
            {presentations.map((pres, idx) => {
              const hasAward = "award" in pres;
              return (
                <article
                  key={idx}
                  className={`border-t border-border py-6 last:border-b ${
                    hasAward ? "border-l-2 border-l-accent pl-5" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                        {pres.isInternational ? "International" : "Domestic"}
                      </span>
                      <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                        {pres.style}
                      </span>
                      {pres.isFuture && (
                        <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                          Forthcoming
                        </span>
                      )}
                      {hasAward && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-background">
                          <Trophy className="h-2.5 w-2.5" aria-hidden="true" />
                          {pres.award}
                        </span>
                      )}
                    </div>
                    <time className="font-mono text-[11px] text-muted">{pres.date}</time>
                  </div>

                  <h5 className="mt-3 font-serif text-base font-semibold leading-snug text-foreground">
                    {pres.title}
                  </h5>

                  <div className="mt-2 flex flex-col justify-between gap-1 text-xs text-muted sm:flex-row sm:items-center">
                    <span>{pres.conference}</span>
                    <span className="flex items-center gap-2">
                      {pres.location}
                      {"details" in pres && (
                        <span className="font-mono text-[10px] text-muted">{pres.details}</span>
                      )}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Courses & Certifications */}
        <div>
          <SubHeading>Courses &amp; Certifications</SubHeading>

          <div className="list-none">
            {courses.map((course) => (
              <div
                key={course.name}
                className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-border py-5 last:border-b sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-serif text-base font-semibold leading-snug text-foreground">
                    {course.name}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{course.org}</p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                    {course.highlight}
                  </p>
                </div>
                <time className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted sm:text-right">
                  修了 {course.completedAt}
                </time>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
