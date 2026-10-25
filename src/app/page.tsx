import Link from "next/link";
import { getImageProps } from "next/image";
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
import { featuredWorks, works, STATUS_LABELS, type Work } from "@/lib/works";

/**
 * 30 秒で「Web/AI/ゲームのプロダクトを作れる」「インフラまで運用できる」
 * 「研究・データ分析もできる」の3点が伝わることを最優先にした構成。
 * 所属・学会名・受賞はトップに出さない（About と Research に置く）。
 */
const axes = [
  {
    keyword: "build",
    section: "Works",
    href: "#works",
    summary: "Web・AI・ゲームを、設計から公開まで自分で作る",
    proof: `${works.length} つの個人プロダクトを単独で開発`,
  },
  {
    keyword: "operate",
    section: "Engineering",
    href: "#engineering",
    summary: "作ったものを自宅のインフラで動かし続ける",
    proof: "Proxmox 上で 10 以上のサービスを運用",
  },
  {
    keyword: "research",
    section: "Research",
    href: "#research",
    summary: "実験とデータで仮説を確かめる",
    proof: "強化学習・統計分析による検証",
  },
];

export default function Home() {
  // ファーストビューに出す実物。文字だけでは「何を作れる人か」が伝わらないので、
  // 公開中のプロダクトの画面をデータから引いて置く。
  const heroWork = works.find((work) => work.slug === "smoke-it");

  return (
    <main id="main-content">
      {/* --- Hero --- */}
      <Container>
        <section
          aria-labelledby="hero-heading"
          className="grid grid-cols-12 items-center gap-x-6 gap-y-10 pb-14 pt-16 sm:pb-20 sm:pt-24"
        >
          <div className="col-span-12 lg:col-span-7">
            {/* ハンドルは 1 語の欧文なので、傾きを伴う立ち上がりで主役にする */}
            <SplitHeading
              as="h1"
              id="hero-heading"
              text={profile.name}
              skew
              delayStart={160}
              delayStep={70}
              className="font-mono text-5xl font-medium tracking-tight text-foreground sm:text-6xl"
            />
            {/* 見出しの立ち上がりに続けて、本文は少し遅れて現れる */}
            <Reveal delay={620}>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-[1.8] text-foreground sm:text-xl sm:leading-[1.8]">
                {profile.lead}
              </p>
              <p className="mt-5 font-mono text-sm text-muted" aria-label="build, operate, research">
                {profile.keywords.map((keyword, i) => (
                  <span key={keyword}>
                    {i > 0 && <span className="px-2 text-accent">·</span>}
                    {keyword}
                  </span>
                ))}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <LiquidButton href="/works" label="Works を見る" labelNext="View Works" />
                <LiquidButton
                  href="https://github.com/koshikai"
                  label="GitHub"
                  labelNext="Open GitHub"
                  variant="outline"
                />
                <LiquidButton
                  href="/about#contact"
                  label="Contact"
                  labelNext="Get in touch"
                  variant="outline"
                />
              </div>
            </Reveal>
          </div>

          {heroWork?.image && (
            <div className="col-span-12 lg:col-span-5">
              <Reveal delay={240}>
                <figure>
                  {/* 枠は「実際に開いている画面」に見える程度に留める。
                      装飾を足すより、UI の文字が読める大きさで置く方が伝わる。 */}
                  <div className="w-[68%] max-w-[260px] sm:w-auto sm:max-w-none">
                    <div className="overflow-hidden rounded border border-border bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-24px_rgba(0,0,0,0.35)] sm:rounded-md">
                      {/* ブラウザ枠は横長のときだけ。縦長の実機比で出す画面に
                          URL バーを付けると、何の画面か分からなくなる */}
                      <div className="hidden items-center gap-2 border-b border-border px-3 py-2 sm:flex">
                        <span aria-hidden="true" className="flex justify-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                        </span>
                        <span className="truncate font-mono text-[11px] text-muted">
                          smoke-it.koshikai.dev
                        </span>
                      </div>
                      <HeroShot image={heroWork.image} />
                    </div>
                  </div>
                  <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 sm:mt-3">
                    <span className="text-sm text-foreground">
                      {heroWork.name}
                      <span className="text-muted">
                        {" "}
                        — {heroWork.since} から{STATUS_LABELS[heroWork.status]}
                      </span>
                    </span>
                    <ArrowLink href={`/works#${heroWork.slug}`}>事例を読む</ArrowLink>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          )}
        </section>
      </Container>

      {/* --- 使っている技術と、手の動きを流す。境界を挟んで本文と分ける --- */}
      <div className="border-y border-border py-5 sm:py-6">
        <Marquee items={marqueeStack} duration={58} className="font-mono text-sm text-foreground" />
        <Marquee
          items={marqueeWork}
          reverse
          duration={46}
          className="mt-3 text-xs tracking-[0.18em] text-muted"
        />
      </div>

      <Container className="mt-16 sm:mt-20">
        {/* --- 3 軸の概要。数字を並べるより先に「何ができる人か」を伝える --- */}
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
                  <span className="flex items-baseline justify-end">
                    <ArrowRight
                      className="h-4 w-4 text-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:mt-2 sm:text-xl">
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

        {/* --- Works --- */}
        <Reveal className="mt-24 sm:mt-28">
          <section id="works" aria-labelledby="works-heading">
            <SectionHeader
              id="works-heading"
              title="作ったもの"
              description="どれも企画から実装・公開まで 1 人で担当しています。"
              action={{ label: "すべての作品", href: "/works" }}
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
        <Reveal className="mt-24 sm:mt-28">
          <section id="engineering" aria-labelledby="engineering-heading">
            <SectionHeader
              id="engineering-heading"
              title="動かし続ける基盤"
              description="デプロイ・構成・復旧までを自分の基盤で回しています。"
              action={{ label: "構成と技術の詳細", href: "/engineering" }}
            />
            <div className="grid grid-cols-12 gap-x-6 gap-y-8">
              <ul role="list" className="col-span-12 list-none space-y-6 lg:col-span-6">
                {operationFacts.slice(0, 3).map((fact) => (
                  <li key={fact.title} className="border-l-2 border-border pl-4">
                    <p className="text-[0.9375rem] font-semibold text-foreground">{fact.title}</p>
                    <p className="mt-1.5 text-sm leading-[1.8] text-muted">{fact.body}</p>
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
        <Reveal className="mt-24 sm:mt-28">
          <section id="research" aria-labelledby="research-heading">
            <SectionHeader
              id="research-heading"
              title="研究とデータ分析"
              description="問題設定・手法・検証結果を分けて書いています。"
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

        {/* --- About への導線 --- */}
        <Reveal className="mt-24 sm:mt-28">
          <section
            aria-labelledby="about-heading"
            className="grid grid-cols-12 gap-x-6 gap-y-4 rounded border border-border bg-surface/60 p-6 sm:p-8"
          >
            <div className="col-span-12 md:col-span-8">
              <h2
                id="about-heading"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                About
              </h2>
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-[1.8] text-muted">
                「自分が不便だと思うことを自分で直したい」から始まり、アプリ・インフラ・研究を行き来しながら課題を形にしています。経歴と連絡先は About にまとめています。
              </p>
            </div>
            <div className="col-span-12 flex flex-wrap items-center gap-x-5 md:col-span-4 md:justify-end">
              <ArrowLink href="/about">経歴を見る</ArrowLink>
              <Link
                href="/about#contact"
                className="focus-ring inline-flex min-h-11 items-center text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                連絡先
              </Link>
            </div>
          </section>
        </Reveal>
      </Container>
    </main>
  );
}

/**
 * ヒーローに置く実物の画面。スマホは縦長の実機比、PC は横長を出す。
 * 1 枚を横長の枠に contain すると縦長スクショの左右が空くため、
 * getImageProps で最適化 URL を保ったまま srcSet を組み <picture> で切り替える。
 */
function HeroShot({ image }: { image: NonNullable<Work["image"]> }) {
  const { alt, desktop, mobile } = image;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt,
    sizes: "(min-width: 1024px) 440px, (min-width: 640px) 60vw, 260px",
    src: desktop.src,
    width: desktop.width,
    height: desktop.height,
    quality: 90,
    priority: true,
  });
  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({
    alt,
    sizes: "(min-width: 1024px) 440px, (min-width: 640px) 60vw, 260px",
    src: mobile.src,
    width: mobile.width,
    height: mobile.height,
    quality: 90,
    priority: true,
  });

  return (
    <picture>
      <source media="(min-width: 40rem)" srcSet={desktopSrcSet} />
      {/* getImageProps が最適化 URL を生成しているため next/image は使わない。
          スマホは縦長の実機比、PC は横長のスクショをそのまま出す */}
      <img
        {...mobileProps}
        srcSet={mobileSrcSet}
        alt={alt}
        className="block h-auto w-full"
      />
    </picture>
  );
}
