import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import "../styles/home.css";

import { CaseRows, Layers, Pipeline, SectionHead, StackRows } from "@/components/rdx";
import { caseItems, getCasesByAxis } from "@/lib/cases";
import { operationFacts } from "@/lib/engineering";
import { pageHead } from "@/lib/metadata";
import { useReveal } from "@/lib/use-reveal";

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

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * インフラと運用。トップと同じ部品（`.rdx`）で組む。
 * 配信経路の図は `#pipeline` で、技術一覧の「このサイト」から飛んでくる。
 */
function EngineeringPage() {
  const ref = useReveal<HTMLElement>();
  const operateCases = getCasesByAxis("operate");

  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-progress" aria-hidden="true" />

      <div className="rdx-wrap rdx-page-hero">
        <SectionHead
          as="h1"
          label="Engineering"
          title="インフラと運用"
          description="自宅の Proxmox VE を基盤に、個人プロダクトの自動デプロイ・構成管理・バックアップを運用しています。実際に運用で使用している技術のみを掲載しています。"
        />
        <ol className="rdx-ops-facts rdx-ops-facts--wide" data-rv="stagger">
          {operationFacts.map((fact, i) => (
            <li key={fact.title}>
              <span className="rdx-mono" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h2>{fact.title}</h2>
              <p>{fact.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rdx-band-outer">
        <section className="rdx-band" aria-labelledby="architecture-heading">
          <div className="rdx-wrap">
            <SectionHead
              id="architecture-heading"
              label="Architecture"
              title="デプロイ構成と自宅サーバー"
              description="main ブランチへの push から本番反映までのパイプラインと、自宅基盤のレイヤー構成です。"
            />
            <Pipeline anchor />
            <div className="rdx-layers-block">
              <p className="rdx-layers-title rdx-mono" data-rv>
                層ごとの構成
              </p>
              <Layers wide />
            </div>
            <div className="rdx-foot" data-rv>
              <span>構成の詳細と、自動デプロイの組み方</span>
              <span className="rdx-foot-links">
                <Link to="/cases/$slug" params={{ slug: "immich-distributed" }} className="rdx-more">
                  分散インフラ基盤
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                <Link to="/cases/$slug" params={{ slug: "deploy-automation" }} className="rdx-more">
                  デプロイ自動化
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="rdx-wrap rdx-section" aria-labelledby="capabilities-heading">
        <SectionHead
          id="capabilities-heading"
          label="Stack"
          title="使用技術と適用先"
          description="各技術と、それを使用しているプロダクト・事例の対応一覧です。"
        />
        <StackRows />
      </section>

      <section className="rdx-wrap rdx-section" aria-labelledby="operate-cases">
        <SectionHead
          id="operate-cases"
          label="Cases"
          title="運用の事例"
          description="構成を決めた理由と、運用して分かったことをまとめた記事です。"
        />
        <CaseRows items={operateCases} />
        <div className="rdx-foot" data-rv>
          <span>
            全 {caseItems.length} 件の事例のうち、運用の {operateCases.length} 件を掲載
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
