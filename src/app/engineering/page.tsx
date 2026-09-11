import type { Metadata } from "next";
import { CapabilityTable } from "@/components/CapabilityTable";
import { CaseList } from "@/components/CaseList";
import { DeployPipeline } from "@/components/DeployPipeline";
import { HomelabStack } from "@/components/HomelabStack";
import { Container, PageHeader, SectionHeader } from "@/components/ui";
import { getCasesByAxis } from "@/lib/cases";
import { operationFacts } from "@/lib/engineering";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "作るだけでなく、自分で動かして運用する。自宅の Proxmox を基盤にしたデプロイ・構成・復旧の仕組みと、実際に使っている技術。",
  alternates: { canonical: "/engineering" },
};

export default function EngineeringPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          label="operate — Engineering"
          title="作るだけでなく、自分で動かし続ける"
          description="自宅の Proxmox を基盤に、自分のプロダクトのデプロイ・構成・復旧までを自分で回しています。ここに載せているのは、実際に使って運用している技術だけです。"
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
            label="architecture"
            title="デプロイ経路と自宅基盤"
            description="このサイトが push からブラウザに届くまでの経路と、各サービスが載っている自宅基盤の構成です。"
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
            label="capabilities"
            title="使っている技術と、使った場所"
            description="技術名だけを並べず、どの作品・事例で使ったかを添えています。"
          />
          <CapabilityTable />
        </section>

        <section aria-labelledby="operate-cases" className="mt-20">
          <SectionHeader id="operate-cases" label="case studies" title="運用の事例" />
          <CaseList items={getCasesByAxis("operate")} />
        </section>
      </Container>
    </main>
  );
}
