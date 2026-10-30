import { createFileRoute } from "@tanstack/react-router";
import { CaseList } from "@/components/CaseList";
import { Container, PageHeader, SectionHeader } from "@/components/ui";
import { AXES, getCasesByAxis, type Axis } from "@/lib/cases";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Case Studies | koshikai" },
      {
        name: "description",
        content: "課題の切り分けから実装・運用・検証までをまとめた事例の一覧。",
      },
      { property: "og:title", content: "Case Studies | koshikai" },
      {
        property: "og:description",
        content: "課題の切り分けから実装・運用・検証までをまとめた事例の一覧。",
      },
    ],
  }),
  component: CasesPage,
});

const ORDER: Axis[] = ["build", "operate", "research"];

function CasesPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          title="すべての事例"
          description="課題をどう切り分け、何を選び、どう運用・検証したかを事例ごとにまとめています。"
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
