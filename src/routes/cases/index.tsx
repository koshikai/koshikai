import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CaseRows, SectionHead } from "@/components/rdx";
import { AXES, caseItems, getCasesByAxis, type Axis } from "@/lib/cases";
import { pageHead } from "@/lib/metadata";
import { useReveal } from "@/lib/use-reveal";
import { pad2 } from "@/lib/format";

export const Route = createFileRoute("/cases/")({
  head: () =>
    pageHead({
      title: "Case Studies",
      description: "開発・インフラ運用・研究の各プロジェクトにおける課題と実装・検証の記録。",
      path: "/cases",
    }),
  component: CasesPage,
});

const ORDER: Axis[] = ["build", "operate", "research"];

/** 事例の一覧。3 つの軸ごとに、トップと同じ部品（`.rdx`）で並べる */
function CasesPage() {
  const ref = useReveal<HTMLElement>();

  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-wrap rdx-page-hero">
        <SectionHead
          as="h1"
          label="Cases"
          title="事例一覧"
          description="開発・インフラ運用・研究の各プロジェクトにおける課題と実装・検証の記録です。"
        />
        <nav aria-label="軸ごとの目次">
          <ol className="rdx-index" data-rv="stagger">
            {ORDER.map((axis, i) => (
              <li key={axis}>
                <a href={`#cases-${axis}`} className="rdx-index-row">
                  <span className="rdx-index-no rdx-mono">{pad2(i + 1)}</span>
                  <span className="rdx-index-name">{AXES[axis].casesTitle}</span>
                  <span className="rdx-index-desc">
                    {getCasesByAxis(axis)
                      .map((item) => item.title)
                      .join(" / ")}
                  </span>
                  <span className="rdx-index-meta rdx-mono">
                    <span>{getCasesByAxis(axis).length} 件</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {ORDER.map((axis) => {
        const items = getCasesByAxis(axis);
        return (
          <section key={axis} className="rdx-wrap rdx-section" aria-labelledby={`cases-${axis}`}>
            <SectionHead id={`cases-${axis}`} label={AXES[axis].label} title={AXES[axis].casesTitle} />
            <CaseRows items={items} />
            <div className="rdx-foot" data-rv>
              <span>
                全 {caseItems.length} 件のうち {items.length} 件
              </span>
              <Link to={AXES[axis].href} className="rdx-more">
                {AXES[axis].section}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}
