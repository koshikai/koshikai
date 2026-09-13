import type { Metadata } from "next";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { Reveal } from "@/components/Reveal";
import { ArrowLink, Container, PageHeader, SectionHeader } from "@/components/ui";
import { profile } from "@/lib/profile";
import { courses, publications } from "@/lib/research";

export const metadata: Metadata = {
  title: "About",
  description: "koshikai の経歴・大切にしていること・連絡先。",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "生活の不便を仕組みに置き換える",
    body: "日常で繰り返す手間を見つけ、続けて使える仕組みとして設計・実装します。",
  },
  {
    title: "作って終わりにしない",
    body: "デプロイ・バックアップ・復旧手順まで含めて、動かし続けられる状態を目指します。",
  },
  {
    title: "データの価値を保つ",
    body: "年月が経っても参照でき、移行や拡張に耐えるデータ構造を考えます。",
  },
];

export default function AboutPage() {
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
        <PageHeader label="about" title={profile.name} description={profile.role}>
          <AvailabilityNote className="mt-6" />
        </PageHeader>

        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          <section aria-labelledby="bio-heading" className="col-span-12 lg:col-span-7">
            <h2 id="bio-heading" className="sr-only">
              自己紹介
            </h2>
            <div className="max-w-2xl space-y-5 text-[0.9375rem] leading-[1.95] text-foreground">
              <p>
                開発を始めたきっかけは、「自分が不便だと思うことを自分で直したい」という一点です。小さなスクリプトから始まり、自宅にサーバーを置いてインフラを組み、論文を読みながらコードを書くようになりました。
              </p>
              <p>
                特定の肩書きにこだわらず、アプリ・インフラ・研究を行き来しながら、「これ、なんとかならないか」を形にし続けています。
              </p>
              <p>いま特に関心があるのは、LLM やエージェントを実際の運用の現場にどう組み込むかという領域です。</p>
            </div>
          </section>

          <section aria-labelledby="principles-heading" className="col-span-12 lg:col-span-5">
            <h2 id="principles-heading" className="font-mono text-xs text-muted">
              大切にしていること
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
          <SectionHeader id="background-heading" label="background" title="経歴" />
          <dl className="border-t border-border">
            {/* 経歴は上から順に現れる。まとめて出すと「いつ何をしたか」の
                順序が読み取りにくいので、行ごとに 70ms ずらす。 */}
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
            label="contact"
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
