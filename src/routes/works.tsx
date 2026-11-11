import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import "../styles/home.css";

import { CaseRows, SectionHead } from "@/components/rdx";
import { WorkItem } from "@/components/WorkItem";
import { caseItems, getCasesByAxis } from "@/lib/cases";
import { pageHead } from "@/lib/metadata";
import { useReveal } from "@/lib/use-reveal";
import { STATUS_LABELS, works } from "@/lib/works";

export const Route = createFileRoute("/works")({
  head: () =>
    pageHead({
      title: "Works",
      description:
        "koshikai が企画から実装・公開まで単独で手がけた Web アプリ・AI プロダクト・ゲーム。",
      path: "/works",
    }),
  component: WorksPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 作品の一覧。トップと同じ部品（`.rdx`）で組む。
 * 冒頭の目次で全作品を見渡し、下で 1 件ずつ詳しく見せる。
 * 各作品の id は slug のままにして、他ページからの `/works#slug` を受ける。
 */
function WorksPage() {
  const ref = useReveal<HTMLElement>();
  const buildCases = getCasesByAxis("build");

  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-progress" aria-hidden="true" />

      <div className="rdx-wrap rdx-page-hero">
        <SectionHead
          as="h1"
          label="Works"
          title="開発プロダクト"
          description="企画・設計・実装・公開まで単独で開発したプロダクトです。公開中の Web アプリは自宅サーバーで運用し、配布物は GitHub Releases で公開しています。"
        />

        <nav aria-label="作品の目次">
          <ol className="rdx-index" data-rv="stagger">
            {works.map((work, i) => (
              <li key={work.slug}>
                <a href={`#${work.slug}`} className="rdx-index-row">
                  <span className="rdx-index-no rdx-mono">{pad(i + 1)}</span>
                  <span className="rdx-index-name">{work.name}</span>
                  <span className="rdx-index-desc">{work.tagline}</span>
                  <span className="rdx-index-meta rdx-mono">
                    <span className="rdx-pill" data-status={work.status}>
                      {STATUS_LABELS[work.status]}
                    </span>
                    <span>{work.since}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="rdx-wrap rdx-section">
        <div className="rdx-works">
          {works.map((work, i) => (
            <WorkItem
              key={work.slug}
              work={work}
              heading="h2"
              index={i + 1}
              flip={i % 2 === 1}
              anchor
            />
          ))}
        </div>
      </div>

      <section className="rdx-wrap rdx-section" aria-labelledby="build-cases">
        <SectionHead
          id="build-cases"
          label="Cases"
          title="開発の事例"
          description="作品ごとに、設計と判断をまとめた記事です。"
        />
        <CaseRows items={buildCases} />
        <div className="rdx-foot" data-rv>
          <span>
            全 {caseItems.length} 件の事例のうち、開発の {buildCases.length} 件を掲載
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
