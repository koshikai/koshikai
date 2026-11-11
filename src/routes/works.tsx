import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import "../styles/home.css";

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
        <div className="rdx-head" data-rv>
          <p className="rdx-label rdx-mono">Works</p>
          <h1 className="rdx-h2">
            <span>開発プロダクト</span>
          </h1>
          <p className="rdx-head-desc">
            企画・設計・実装・公開まで単独で開発したプロダクトです。公開中の Web
            アプリは自宅サーバーで運用し、配布物は GitHub Releases で公開しています。
          </p>
        </div>

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
        <div className="rdx-head" data-rv>
          <p className="rdx-label rdx-mono">Cases</p>
          <h2 id="build-cases" className="rdx-h2">
            <span>開発の事例</span>
          </h2>
          <p className="rdx-head-desc">作品ごとに、設計と判断をまとめた記事です。</p>
        </div>
        <ul className="rdx-cases" data-rv="stagger">
          {buildCases.map((item) => (
            <li key={item.slug}>
              <Link to="/cases/$slug" params={{ slug: item.slug }} className="rdx-case">
                <div className="rdx-case-main">
                  <h3>{item.title}</h3>
                  <p className="rdx-case-sum">{item.summary}</p>
                </div>
                <div className="rdx-case-tags rdx-mono">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <ArrowUpRight className="rdx-case-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
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
