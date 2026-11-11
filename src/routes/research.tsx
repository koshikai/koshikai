import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CaseRows, ResearchPapers, SectionHead } from "@/components/rdx";
import { caseItems, getCasesByAxis } from "@/lib/cases";
import { pageHead } from "@/lib/metadata";
import { publications, researchCode, researchNotes, researchTopics } from "@/lib/research";
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
  "Wnt5a モデルの制御結果。上段は目標集合へのハミング距離が時刻 2 で 0 に到達し以後維持される様子、下段は各時刻に除去したエッジを示すヒートマップ。";

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
          description="ブーリアンネットワークの制御を中心に、強化学習と形式手法を組み合わせた研究をしています。データ分析の実務的なプロジェクトも含め、問題設定・手法・検証結果を分けてまとめています。"
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
              学習した方策による制御の実行例。上段は目標集合へのハミング距離で、時刻 2 で 0
              に到達し、到達期限を越えて以降も維持されています。下段は各時刻に除去したエッジで、
              <span className="rdx-figure-mark">朱色のマス</span>
              が介入です。96 個の初期状態すべてで安定化に成功しました。
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
      </section>

      <section className="rdx-wrap rdx-section" aria-labelledby="notes-heading">
        <SectionHead id="notes-heading" label="Related" title="関連コンテンツ" />
        <ul className="rdx-notes">
          {researchNotes.map((note) => (
            <li key={note.href} className="rdx-note" data-rv>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <a href={note.href} className="rdx-more">
                {note.title} を開く
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
          <li className="rdx-note" data-rv style={{ "--rv-delay": "100ms" } as React.CSSProperties}>
            <h3 className="rdx-mono">{researchCode.label}</h3>
            <p>{researchCode.description}</p>
            <a href={researchCode.href} target="_blank" rel="noopener noreferrer" className="rdx-more">
              GitHub で見る
              <ArrowUpRight aria-hidden="true" />
            </a>
          </li>
        </ul>
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
