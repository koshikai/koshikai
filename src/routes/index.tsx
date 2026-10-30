import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CapabilityTable } from "@/components/CapabilityTable";
import { DeployPipeline } from "@/components/DeployPipeline";
import { LiquidButton } from "@/components/LiquidButton";
import { Marquee } from "@/components/Marquee";
import { ResearchCard } from "@/components/ResearchCard";
import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { ArrowLink, Container, SectionHeader } from "@/components/ui";
import { WorkCard } from "@/components/WorkCard";
import { operationFacts } from "@/lib/engineering";
import { marqueeStack, marqueeWork } from "@/lib/motion";
import { profile } from "@/lib/profile";
import { featuredResearch } from "@/lib/research";
import { getSiteConfig } from "@/lib/site-config";
import { featuredWorks, works } from "@/lib/works";

export const Route = createFileRoute("/")({
  head: () => {
    const site = getSiteConfig();
    return {
      links: [{ rel: "canonical", href: site.baseUrl }],
    };
  },
  component: Home,
});

/**
 * ファーストビューで「Web/AI/ゲームのプロダクト開発」「インフラ運用」
 * 「研究・データ分析」の3軸が伝わる構成。
 * 所属・学会名・受賞はトップに出さない（About と Research に置く）。
 */
const axes = [
  {
    keyword: "build",
    section: "Works",
    href: "#works",
    summary: "Web・AI・ゲームの個人開発",
    proof: `${works.length} つの個人プロダクトを単独で開発`,
  },
  {
    keyword: "operate",
    section: "Engineering",
    href: "#engineering",
    summary: "自宅サーバーと CI/CD によるインフラ運用",
    proof: "Proxmox 上で 10 以上のサービスを運用",
  },
  {
    keyword: "research",
    section: "Research",
    href: "#research",
    summary: "強化学習と統計モデルによる検証",
    proof: "強化学習・統計分析による検証",
  },
];

function Home() {
  return (
    <main id="main-content">
      {/* --- Hero + 3軸サマリ --- */}
      <Container>
        <section aria-labelledby="hero-heading" className="pb-12 pt-16 sm:pb-16 sm:pt-24">
          <SplitHeading
            as="h1"
            id="hero-heading"
            text={profile.name}
            skew
            delayStart={160}
            delayStep={70}
            className="font-mono text-5xl font-medium tracking-tight text-foreground sm:text-6xl"
          />
          <Reveal delay={620}>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-[1.8] text-foreground sm:text-xl sm:leading-[1.8]">
              {profile.lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <LiquidButton href="/works" label="Works を見る" labelNext="View Works" />
              <ArrowLink href="https://github.com/koshikai">GitHub</ArrowLink>
              <ArrowLink href="/about#contact">Contact</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={760} className="mt-12 sm:mt-14">
            <nav aria-label="3つの軸">
              <ul
                role="list"
                className="grid list-none grid-cols-1 overflow-hidden rounded border border-border md:grid-cols-3"
              >
                {axes.map((axis, i) => (
                  <li
                    key={axis.keyword}
                    className={`border-border ${i > 0 ? "border-t md:border-l md:border-t-0" : ""}`}
                  >
                    <a
                      href={axis.href}
                      className="focus-ring group flex h-full flex-col bg-background px-5 py-4 transition-colors hover:bg-surface sm:p-6"
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted">{axis.keyword}</span>
                        <ArrowRight
                          className="h-4 w-4 text-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        {axis.section}
                      </span>
                      <span className="mt-1 text-sm leading-[1.8] text-foreground sm:mt-2">
                        {axis.summary}
                      </span>
                      <span className="mt-2 text-xs text-muted sm:mt-3">{axis.proof}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </section>
      </Container>

      {/* --- 使用技術と担当領域 --- */}
      <div className="border-y border-border py-4 sm:py-6">
        <Marquee items={marqueeStack} duration={58} className="font-mono text-sm text-foreground" />
        <Marquee
          items={marqueeWork}
          reverse
          duration={46}
          className="mt-3 text-xs tracking-[0.18em] text-muted"
        />
      </div>

      <Container className="mt-20 sm:mt-24">
        {/* --- Works --- */}
        <Reveal>
          <section id="works" aria-labelledby="works-heading">
            <SectionHeader
              id="works-heading"
              title="開発プロダクト"
              description="企画から設計・実装・公開まで単独で開発したプロダクトです。"
              action={{ label: "作品一覧", href: "/works" }}
            />
            <ul
              role="list"
              className="grid list-none grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featuredWorks.map((work) => (
                <li key={work.slug}>
                  <WorkCard work={work} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* --- Engineering --- */}
        <Reveal className="mt-24">
          <section id="engineering" aria-labelledby="engineering-heading">
            <SectionHeader
              id="engineering-heading"
              title="インフラと運用"
              description="自宅の Proxmox 基盤で、デプロイ自動化・構成管理・バックアップを運用しています。"
              action={{ label: "構成と技術の詳細", href: "/engineering" }}
            />
            <div className="grid grid-cols-12 gap-x-6 gap-y-8">
              <ul role="list" className="col-span-12 list-none space-y-6 lg:col-span-6">
                {operationFacts.slice(0, 3).map((fact) => (
                  <li key={fact.title}>
                    <p className="text-sm font-semibold text-foreground">{fact.title}</p>
                    <p className="mt-2 text-sm leading-[1.8] text-muted">{fact.body}</p>
                  </li>
                ))}
              </ul>
              <div className="col-span-12 lg:col-span-6">
                <DeployPipeline />
              </div>
              <div className="col-span-12">
                <CapabilityTable />
              </div>
            </div>
          </section>
        </Reveal>

        {/* --- Research --- */}
        <Reveal className="mt-24">
          <section id="research" aria-labelledby="research-heading">
            <SectionHeader
              id="research-heading"
              title="研究とデータ分析"
              description="強化学習によるネットワーク制御と、実データを用いた統計分析の取り組みです。"
              action={{ label: "研究の詳細", href: "/research" }}
            />
            <ul role="list" className="grid list-none grid-cols-1 gap-6 md:grid-cols-2">
              {featuredResearch.map((topic) => (
                <li key={topic.slug}>
                  <ResearchCard topic={topic} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* --- Contact CTA --- */}
        <Reveal className="mt-24">
          <section
            aria-labelledby="contact-heading"
            className="grid grid-cols-12 gap-x-6 gap-y-6 rounded border border-border bg-surface/60 p-6 sm:p-8"
          >
            <div className="col-span-12 md:col-span-8">
              <h2
                id="contact-heading"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Contact
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-[1.8] text-muted">
                作品や運用について、気軽に連絡してください。
              </p>
            </div>
            <div className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-2 md:col-span-4 md:justify-end">
              <LiquidButton href="/about#contact" label="Contact" labelNext="Get in touch" />
              <ArrowLink href="/about">経歴を見る</ArrowLink>
            </div>
          </section>
        </Reveal>
      </Container>
    </main>
  );
}
