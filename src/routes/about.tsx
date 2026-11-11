import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import "../styles/home.css";

import { AvailabilityNote } from "@/components/AvailabilityNote";
import { Chars, SectionHead } from "@/components/rdx";
import { pageHead } from "@/lib/metadata";
import { profile } from "@/lib/profile";
import { courses, publications } from "@/lib/research";
import { useReveal } from "@/lib/use-reveal";

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

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 経歴・方針・連絡先。トップと同じ部品（`.rdx`）で組む。
 * 所属・受賞・講座名はトップには出さず、このページの経歴欄に置く。
 * 連絡先は `#contact` で、ほかのページから飛んでくる。
 */
function AboutPage() {
  const ref = useReveal<HTMLElement>();
  // 受賞と講座の修了を1本の年表にまとめ、新しい順に並べる（日付は "YYYY.MM"）
  const timeline = [
    ...publications
      .filter((pub) => pub.award)
      .map((pub) => ({ date: pub.date, title: pub.award!, detail: pub.venue })),
    ...courses.map((course) => ({ date: course.completedAt, title: `${course.name} 修了`, detail: course.org })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const rows = [
    ...profile.education.map((item) => ({ date: item.period, title: item.title, detail: item.detail })),
    ...timeline,
  ];
  const { email, links } = profile.contact;

  return (
    <main id="main-content" className="rdx" ref={ref}>
      <div className="rdx-progress" aria-hidden="true" />

      <div className="rdx-wrap rdx-page-hero">
        <SectionHead as="h1" label="About" title={profile.name} description={profile.role} />
        {profile.availability && (
          <div className="rdx-about-note" data-rv>
            <AvailabilityNote />
          </div>
        )}

        <div className="rdx-about">
          <section aria-labelledby="bio-heading" data-rv>
            <h2 id="bio-heading" className="rdx-sr">
              自己紹介
            </h2>
            <div className="rdx-bio">
              <p>
                日常の不便や手作業をソフトウェアで解決することから開発を始めました。小さな自動化スクリプトからスタートし、現在は
                Web アプリケーションの開発、自宅サーバーでのインフラ構築・運用、大学院での数理モデル研究に取り組んでいます。
              </p>
              <p>
                Web
                開発、インフラ運用、数理モデル・統計分析と複数の領域を扱っていますが、いずれも「課題を定義し、再現可能なコードと構成で解決する」ことを軸にしています。
              </p>
              <p>
                最近は、LLM
                やエージェント技術を単発の検証にとどめず、実際のサービス運用や研究ワークフローに組み込む設計に関心を持っています。
              </p>
            </div>
          </section>

          <section aria-labelledby="principles-heading">
            <h2 id="principles-heading" className="rdx-layers-title rdx-mono" data-rv>
              開発・運用の方針
            </h2>
            <ol className="rdx-ops-facts" data-rv="stagger">
              {principles.map((item, i) => (
                <li key={item.title}>
                  <span className="rdx-mono" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <section className="rdx-wrap rdx-section" aria-labelledby="background-heading">
        <SectionHead id="background-heading" label="Background" title="経歴" />
        <ul className="rdx-pubs" data-rv="stagger">
          {rows.map((row) => (
            <li key={row.title}>
              <span className="rdx-pub-date rdx-mono">{row.date}</span>
              <div>
                <h3>{row.title}</h3>
                {row.detail && <p>{row.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
        <div className="rdx-foot" data-rv>
          <span>学会での発表は Research にまとめています</span>
          <Link to="/research" hash="publications-heading" className="rdx-more">
            発表の一覧
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="contact" className="rdx-wrap rdx-section" aria-labelledby="contact-heading">
        <SectionHead
          id="contact-heading"
          label="Contact"
          title="連絡先"
          description="お仕事・インターンのご相談や、作品・研究についての質問は、以下からご連絡ください。"
        />
        <div data-rv>
          {email && (
            <a href={`mailto:${email}`} className="rdx-mail" aria-label={email}>
              <Chars text={email} />
            </a>
          )}
          <div className="rdx-contact-links">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rdx-more"
              >
                {link.label} {link.handle}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
