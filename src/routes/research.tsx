import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CaseRows, ResearchPapers, SectionHead } from "@/components/rdx";
import { caseItems, getCasesByAxis } from "@/lib/cases";
import { pageHead } from "@/lib/metadata";
import { publications, researchCode, researchTopics } from "@/lib/research";
import { useReveal } from "@/lib/use-reveal";

export const Route = createFileRoute("/research")({
  head: () =>
    pageHead({
      title: "Research",
      description:
        "強化学習によるネットワーク制御と、データ分析の取り組み。問題設定・手法・検証結果を分けてまとめています。",
      path: "/research",
    }),
  component: ResearchPage,
});

const figureAlt =
  "Wnt5a モデルの制御結果。上段は目標集合へのハミング距離が時刻 2 で 0 になり、10 ステップ目まで維持される様子、下段は各時刻に遮断したエッジを示すヒートマップ。";

const PUBLICATION_STATUS = { presented: "発表済み", accepted: "採択" } as const;

/**
 * 研究とデータ分析。トップと同じ部品（`.rdx`）で組む。
 * 発表の見出しは `#publications-heading` で、About の経歴欄から飛んでくる。
 */
function ResearchPage() {
  const ref = useReveal<HTMLElement>();
  const researchCases = getCasesByAxis("research");

  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-wrap rdx-page-hero">
        <SectionHead
          as="h1"
          label="Research"
          title="研究とデータ分析"
          description="ブーリアンネットワークの制御を中心に、強化学習と信号時相論理（STL）を組み合わせた研究をしています。データ分析のプロジェクトも含め、問題設定・手法・検証結果を分けてまとめています。進行中と保留のラインも、状態を添えて載せています。"
        />
        <ResearchPapers topics={researchTopics} heading="h2" detailed />

        <figure className="rdx-figure" data-rv>
          <div className="rdx-figure-media">
            <img
              src="/images/research/trajectory-recovery-light.webp"
              alt={figureAlt}
              width={2081}
              height={1535}
              loading="lazy"
              decoding="async"
              className="dark:hidden"
            />
            <img
              src="/images/research/trajectory-recovery-dark.webp"
              alt=""
              aria-hidden="true"
              width={2081}
              height={1535}
              loading="lazy"
              decoding="async"
              className="hidden dark:block"
            />
          </div>
          <figcaption>
            <span className="rdx-mono">Fig. Wnt5a / recovery constraint</span>
            <p>
              学習した方策による制御の実行例。上段は目標集合（2 つのアトラクタ状態）へのハミング距離で、
              時刻 2 に 0 へ到達し、到達期限の 7 ステップを超えて 10 ステップ目まで維持されている。
              下段は各時刻に遮断したエッジで、<span className="rdx-figure-mark">朱色のマス</span>が介入を表す。
              休薬 2 ステップの制約下で、全 128 初期状態（128/128、seed 11）を目標集合へ導いた。
            </p>
          </figcaption>
        </figure>
      </div>

      <section className="rdx-wrap rdx-section" aria-labelledby="publications-heading">
        <SectionHead id="publications-heading" label="Publications" title="発表" />
        <ul className="rdx-pubs" data-rv="stagger">
          {publications.map((pub) => (
            <li key={pub.title}>
              <span className="rdx-pub-date rdx-mono">{pub.date}</span>
              <div>
                <h3>{pub.title}</h3>
                <p>
                  {pub.venue} · {pub.format} · {PUBLICATION_STATUS[pub.status]}
                  {pub.award && <b> · {pub.award}</b>}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="rdx-foot" data-rv>
          <span>{researchCode.description}</span>
          <a href={researchCode.href} target="_blank" rel="noopener noreferrer" className="rdx-more rdx-mono">
            {researchCode.label}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="rdx-wrap rdx-section" aria-labelledby="research-cases">
        <SectionHead
          id="research-cases"
          label="Cases"
          title="研究・分析の事例"
          description="研究と分析の進め方をまとめた記事です。"
        />
        <CaseRows items={researchCases} />
        <div className="rdx-foot" data-rv>
          <span>
            全 {caseItems.length} 件の事例のうち、研究・分析の {researchCases.length} 件を掲載
          </span>
          <Link to="/cases" className="rdx-more">
            すべての事例
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
