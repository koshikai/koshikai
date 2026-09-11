import type { Metadata } from "next";
import { CaseList } from "@/components/CaseList";
import { Container, PageHeader, SectionHeader } from "@/components/ui";
import { AXES, getCasesByAxis, type Axis } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "課題の切り分けから実装・運用・検証までをまとめた事例の一覧。",
  alternates: { canonical: "/cases" },
};

const ORDER: Axis[] = ["build", "operate", "research"];

/** ナビには置かず、フッターと各軸のページから入る全事例の索引 */
export default function CasesPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          label="case studies"
          title="すべての事例"
          description="課題をどう切り分け、何を選び、どう運用・検証したかを事例ごとにまとめています。"
        />
        <div className="space-y-16">
          {ORDER.map((axis) => (
            <section key={axis} aria-labelledby={`cases-${axis}`}>
              <SectionHeader
                id={`cases-${axis}`}
                label={AXES[axis].label.toLowerCase()}
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
