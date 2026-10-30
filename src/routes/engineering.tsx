import { createFileRoute } from "@tanstack/react-router";
import { CapabilityTable } from "@/components/CapabilityTable";
import { CaseList } from "@/components/CaseList";
import { DeployPipeline } from "@/components/DeployPipeline";
import { HomelabStack } from "@/components/HomelabStack";
import { Container, PageHeader, SectionHeader } from "@/components/ui";
import { getCasesByAxis } from "@/lib/cases";
import { operationFacts } from "@/lib/engineering";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/engineering")({
  head: () =>
    pageHead({
      title: "Engineering",
      description:
        "自宅の Proxmox を基盤に、開発プロダクトの自動デプロイ・構成管理・バックアップを運用しています。",
      path: "/engineering",
    }),
  component: EngineeringPage,
});

function EngineeringPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          title="インフラと運用"
          description="自宅の Proxmox VE を基盤に、個人プロダクトの自動デプロイ・構成管理・バックアップを運用しています。実際に運用で使用している技術のみを掲載しています。"
        />

        <ul role="list" className="grid list-none grid-cols-1 gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">
          {operationFacts.map((fact) => (
            <li key={fact.title} className="bg-background p-5 sm:p-6">
              <p className="text-[0.9375rem] font-semibold text-foreground">{fact.title}</p>
              <p className="mt-2 text-sm leading-[1.8] text-muted">{fact.body}</p>
            </li>
          ))}
        </ul>

        <section aria-labelledby="architecture-heading" className="mt-20">
          <SectionHeader
            id="architecture-heading"
            title="デプロイ構成と自宅サーバー"
            description="main ブランチへの push から本番反映までのパイプラインと、自宅基盤のレイヤー構成です。"
          />
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 lg:col-span-5">
              <DeployPipeline />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <HomelabStack />
            </div>
          </div>
        </section>

        <section aria-labelledby="capabilities-heading" className="mt-20">
          <SectionHeader
            id="capabilities-heading"
            title="使用技術と適用先"
            description="各技術と、それを使用しているプロダクト・事例の対応一覧です。"
          />
          <CapabilityTable />
        </section>

        <section aria-labelledby="operate-cases" className="mt-20">
          <SectionHeader id="operate-cases" title="運用の事例" />
          <CaseList items={getCasesByAxis("operate")} />
        </section>
      </Container>
    </main>
  );
}
