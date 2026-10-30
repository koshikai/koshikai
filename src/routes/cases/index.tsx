import { createFileRoute } from "@tanstack/react-router";
import { CaseList } from "@/components/CaseList";
import { Container, PageHeader, SectionHeader } from "@/components/ui";
import { AXES, getCasesByAxis, type Axis } from "@/lib/cases";
import { pageHead } from "@/lib/metadata";

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

function CasesPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          title="事例一覧"
          description="開発・インフラ運用・研究の各プロジェクトにおける課題と実装・検証の記録です。"
        />
        <div className="space-y-16">
          {ORDER.map((axis) => (
            <section key={axis} aria-labelledby={`cases-${axis}`}>
              <SectionHeader
                id={`cases-${axis}`}
                title={AXES[axis].section}
                action={{ label: `${AXES[axis].section} へ`, href: AXES[axis].href }}
              />
              <CaseList items={getCasesByAxis(axis)} />
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
