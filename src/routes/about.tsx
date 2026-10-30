import { createFileRoute } from "@tanstack/react-router";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { Reveal } from "@/components/Reveal";
import { ArrowLink, Container, PageHeader, SectionHeader } from "@/components/ui";
import { pageHead } from "@/lib/metadata";
import { profile } from "@/lib/profile";
import { courses, publications } from "@/lib/research";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About",
      description: "koshikai の経歴・開発方針・連絡先。",
      path: "/about",
    }),
  component: AboutPage,
});

const principles = [
  {
    title: "日常の課題をツール化する",
    body: "手作業や不便なフローを見つけ、継続して使えるソフトウェアとして設計・実装します。",
  },
  {
    title: "運用・保守まで含めて設計する",
    body: "自動デプロイ・バックアップ・復旧手順まで整備し、長期稼働できる構成にします。",
  },
  {
    title: "移行しやすいデータ構造を保つ",
    body: "長期運用でも参照・移行・拡張しやすいスキーマと保存形式を選びます。",
  },
];

function AboutPage() {
  // 受賞と講座の修了を1本の年表にまとめ、新しい順に並べる（日付は "YYYY.MM"）
  const timeline = [
    ...publications
      .filter((pub) => pub.award)
      .map((pub) => ({ date: pub.date, title: pub.award!, detail: pub.venue })),
    ...courses.map((course) => ({ date: course.completedAt, title: `${course.name} 修了`, detail: course.org })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const { email, links } = profile.contact;

  return (
    <main id="main-content">
      <Container>
        <PageHeader title={profile.name} description={profile.role}>
          <AvailabilityNote className="mt-6" />
        </PageHeader>

        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          <section aria-labelledby="bio-heading" className="col-span-12 lg:col-span-7">
            <h2 id="bio-heading" className="sr-only">
              自己紹介
            </h2>
            <div className="max-w-2xl space-y-5 text-[0.9375rem] leading-[1.95] text-foreground">
              <p>
                日常の不便や手作業をソフトウェアで解決することから開発を始めました。小さな自動化スクリプトからスタートし、現在は Web アプリケーションの開発、自宅サーバーでのインフラ構築・運用、大学院での数理モデル研究に取り組んでいます。
              </p>
              <p>
                Web 開発、インフラ運用、数理モデル・統計分析と複数の領域を扱っていますが、いずれも「課題を定義し、再現可能なコードと構成で解決する」ことを軸にしています。
              </p>
              <p>最近は、LLM やエージェント技術を単発の検証にとどめず、実際のサービス運用や研究ワークフローに組み込む設計に関心を持っています。</p>
            </div>
          </section>

          <section aria-labelledby="principles-heading" className="col-span-12 lg:col-span-5">
            <h2 id="principles-heading" className="font-mono text-xs text-muted">
              開発・運用の方針
            </h2>
            <ol role="list" className="mt-4 list-none border-t border-border">
              {principles.map((item, i) => (
                <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-2 border-b border-border py-4">
                  <span className="font-mono text-xs leading-6 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[0.9375rem] font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-[1.8] text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section aria-labelledby="background-heading" className="mt-20">
          <SectionHeader id="background-heading" title="経歴" />
          <dl className="border-t border-border">
            {profile.education.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <Row term={item.period}>
                  <p className="text-[0.9375rem] font-medium text-foreground">{item.title}</p>
                  {item.detail && <p className="mt-1 text-sm text-muted">{item.detail}</p>}
                </Row>
              </Reveal>
            ))}
            {timeline.map((entry, i) => (
              <Reveal key={entry.title} delay={(profile.education.length + i) * 70}>
                <Row term={entry.date}>
                  <p className="text-[0.9375rem] font-medium text-foreground">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted">{entry.detail}</p>
                </Row>
              </Reveal>
            ))}
          </dl>
          <ArrowLink href="/research#publications-heading" className="mt-3">
            発表の一覧
          </ArrowLink>
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="mt-20 scroll-mt-24">
          <SectionHeader
            id="contact-heading"
            title="連絡先"
            description="お仕事・インターンのご相談や、作品・研究についての質問は、以下からご連絡ください。"
          />
          <ul role="list" className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {email && (
              <li>
                <ContactCard label="Email" handle={email} href={`mailto:${email}`} />
              </li>
            )}
            {links.map((link) => (
              <li key={link.href}>
                <ContactCard label={link.label} handle={link.handle} href={link.href} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-1 border-b border-border py-4">
      <dt className="col-span-12 font-mono text-xs leading-6 text-muted sm:col-span-2">{term}</dt>
      <dd className="col-span-12 sm:col-span-10">{children}</dd>
    </div>
  );
}

function ContactCard({ label, handle, href }: { label: string; handle: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="focus-ring group flex items-baseline justify-between rounded border border-border bg-background px-5 py-4 transition-colors hover:border-foreground"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">{handle}</span>
    </a>
  );
}
