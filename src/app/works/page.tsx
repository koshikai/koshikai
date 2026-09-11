import type { Metadata } from "next";
import { CaseList } from "@/components/CaseList";
import { ArrowLink, Container, PageHeader, SectionHeader, Tags } from "@/components/ui";
import { StatusBadge, WorkThumb } from "@/components/WorkCard";
import { getCasesByAxis } from "@/lib/cases";
import { works } from "@/lib/works";

export const metadata: Metadata = {
  title: "Works",
  description: "koshikai が企画から実装・デプロイまで単独で手がけた Web・AI プロダクト。",
  alternates: { canonical: "/works" },
};

export default function WorksPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          label="build — Works"
          title="作ったもの"
          description="課題を見つけて、作り、公開できる状態にするまでを 1 人で担当した作品です。公開中のものは自宅のサーバーで動かしています。"
        />

        <ul role="list" className="list-none">
          {works.map((work) => (
            <li
              key={work.slug}
              id={work.slug}
              className="grid scroll-mt-24 grid-cols-12 gap-x-6 gap-y-6 border-t border-border py-10 sm:py-12"
            >
              <div className="col-span-12 md:col-span-5">
                <WorkThumb work={work} sizes="(min-width: 768px) 440px, 100vw" />
              </div>
              <article className="col-span-12 md:col-span-7">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">{work.name}</h2>
                  <StatusBadge work={work} />
                </div>
                <p className="mt-2 text-pretty text-[0.9375rem] leading-[1.8] text-foreground">{work.tagline}</p>
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-[1.9] text-muted">{work.summary}</p>

                <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-xs text-muted">担当範囲</dt>
                    <dd className="mt-1 text-foreground">{work.scope}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs text-muted">開発開始</dt>
                    <dd className="mt-1 font-mono text-foreground">{work.since}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-mono text-xs text-muted">状態</dt>
                    <dd className="mt-1 text-foreground">
                      {work.statusNote ?? work.operation ?? "非公開のため、公開できる範囲の技術概要のみ掲載"}
                    </dd>
                  </div>
                </dl>

                <Tags items={work.stack} className="mt-5" />

                <div className="mt-4 flex flex-wrap gap-x-5">
                  {work.links.caseSlug && <ArrowLink href={`/cases/${work.links.caseSlug}`}>事例を読む</ArrowLink>}
                  {work.links.live && (
                    <ArrowLink href={work.links.live}>{work.status === "demo" ? "デモを見る" : "サイトを開く"}</ArrowLink>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        <section aria-labelledby="build-cases" className="mt-16">
          <SectionHeader id="build-cases" label="case studies" title="作品の事例" />
          <CaseList items={getCasesByAxis("build")} />
        </section>
      </Container>
    </main>
  );
}
