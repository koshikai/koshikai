"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { ResearchSection } from "@/components/ResearchSection";
import { SectionHeading } from "@/components/SectionHeading";

const sections = [
  { id: "hero", index: "00", label: "Top" },
  { id: "about", index: "01", label: "About" },
  { id: "principles", index: "02", label: "Principles" },
  { id: "projects", index: "03", label: "Projects" },
  { id: "research", index: "04", label: "Research" },
  { id: "infrastructure", index: "05", label: "Infra" },
  { id: "toolbox", index: "06", label: "Toolbox" },
];

function SideNav({ activeSection }: { activeSection: string }) {
  return (
    <nav
      className="fixed right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 xl:flex"
      aria-label="セクションナビゲーション"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="focus-ring group flex items-center justify-end gap-3 text-right"
            aria-label={`Jump to ${section.label}`}
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-muted/60 group-hover:text-foreground"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`h-px transition-[width,background-color] ${
                isActive
                  ? "w-6 bg-accent"
                  : "w-3 bg-border group-hover:w-6 group-hover:bg-foreground"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

function Header({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** 閉じたらトリガーにフォーカスを戻す（開閉で行き先を見失わないため） */
  const closeAndRestoreFocus = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Escape と外側クリックで閉じる。開いたあとの出口がボタンの再タップしか
  // 無い状態だと、開いてやめたいときに逃げ場がない。
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndRestoreFocus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (drawerRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, closeAndRestoreFocus]);

  const navSections = sections.filter((s) => s.id !== "hero");

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 transition-[background-color,border-color,padding] duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/90 py-3 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="focus-ring font-mono text-sm tracking-tight text-foreground transition-colors hover:text-accent"
        >
          koshikai.dev
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="グローバルナビゲーション">
          {navSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`focus-ring font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {section.label}
              </a>
            );
          })}
          <Link
            href="/cases"
            className="focus-ring border-l border-border pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground"
          >
            Cases
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="focus-ring flex h-11 w-11 items-center justify-center border border-border text-foreground lg:hidden"
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          ref={drawerRef}
          id="mobile-nav"
          className="absolute left-0 right-0 top-full border-b border-border bg-background px-6 py-6 lg:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label="モバイルナビゲーション">
            {navSections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`focus-ring flex min-h-11 items-center gap-3 font-mono text-sm uppercase tracking-[0.16em] transition-colors ${
                    isActive ? "text-accent" : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-[11px] text-accent/70">{section.index}</span>
                  {section.label}
                </a>
              );
            })}
            <div className="h-px bg-border" />
            <Link
              href="/cases"
              onClick={() => setIsOpen(false)}
              className="focus-ring flex min-h-11 items-center font-mono text-sm uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground"
            >
              Case Studies
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

const solveAreas = [
  {
    title: "生活の不便を仕組みに置き換える",
    description:
      "日常で繰り返す手間を見つけ、継続して使える仕組みとして設計・実装します。",
  },
  {
    title: "一貫性のある運用設計",
    description:
      "作って終わりではなく、バックアップや監視を含めた運用可能な状態を目指します。",
  },
  {
    title: "データの価値を維持する",
    description:
      "年月が経っても参照可能で、移行や拡張に耐えうるデータ構造を検討します。",
  },
];

const operationHighlights = [
  "Proxmox VE によるサーバー仮想化とリソース管理",
  "Tailscale によるセキュアな拠点間通信とリモートアクセス",
  "Immich / NocoDB 等のセルフホストサービスの安定運用",
  "ZFS / 外部ストレージへの自動バックアップ体制の構築",
  "Cloudflare Tunnel を活用した安全なサービス公開",
];

const infraCases = [
  { slug: "immich-distributed", title: "分散インフラ基盤の構築と運用" },
  { slug: "home-backup", title: "自宅バックアップ基盤の構築" },
  { slug: "deploy-automation", title: "デプロイ作業の自動化" },
];

const credentials = [
  "北海道大学大学院 情報科学院 M1",
  "SCI'26 学生発表賞",
  "松尾研 修了 ×3",
];

const toolboxByUse = [
  { use: "Front-end", tools: "Next.js, React 19, TypeScript, Tailwind CSS, Framer Motion" },
  { use: "Back-end & DB", tools: "Node.js, Prisma, PostgreSQL, Redis, Auth.js" },
  { use: "Infrastructure", tools: "Proxmox, Docker, Tailscale, Cloudflare, AWS" },
  { use: "Languages & Runtimes", tools: "TypeScript, Python, Bun, C#, .NET" },
  { use: "Quality & Testing", tools: "Playwright, Jest, React Testing Library" },
  { use: "AI & Research", tools: "PyTorch, MCP, RAG, Prompt Engineering, Marimo" },
];

export function PortfolioHome() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    // 交差中のセクションを保持し、そのうち文書順で最初のもの（＝画面上で
    // 一番上）を active にする。entries を順に代入すると配列の最後が勝つため、
    // 帯に複数セクションが入る上スクロール時にハイライトがずれていた。
    const intersecting = new Set<string>();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) intersecting.add(entry.target.id);
        else intersecting.delete(entry.target.id);
      });

      const topmost = sections.find((section) => intersecting.has(section.id));
      if (topmost) setActiveSection(topmost.id);
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="relative bg-background font-sans text-foreground">
      <Header activeSection={activeSection} />
      <SideNav activeSection={activeSection} />

      <main id="main-content" className="relative flex flex-col items-center">
        {/* --- Hero Section --- */}
        <section
          id="hero"
          className="flex min-h-dvh w-full flex-col justify-center px-6 pb-16 pt-28 scroll-mt-24"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              Hokkaido University · Graduate School of Information Science · M1
            </p>

            <h1 className="mt-8 max-w-2xl text-pretty font-serif text-2xl font-semibold leading-[1.7] tracking-tight text-foreground sm:text-3xl">
              生活や運用の課題を見つけて、実装し、改善を続けることを大切にしています。
              特定の職種に寄せるより、必要なツールを組み合わせて
              <span className="text-accent">問題を前に進める</span>
              ことに取り組んでいます。
            </h1>

            <div className="mt-12 border-t border-border pt-6">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none">
                {credentials.map((item) => (
                  <li
                    key={item}
                    className="text-xs leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <nav
                className="mt-6 flex flex-wrap gap-x-5 gap-y-2 list-none"
                aria-label="セクション目次"
              >
                {sections
                  .filter((s) => s.id !== "hero")
                  .map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="focus-ring group inline-flex items-baseline gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
                    >
                      <span className="text-accent">{section.index}</span>
                      <span className="tracking-[0.1em] group-hover:underline">
                        {section.label}
                      </span>
                    </a>
                  ))}
              </nav>
            </div>
          </div>
        </section>

        {/* --- About --- */}
        <section id="about" className="mx-auto w-full max-w-5xl px-6 py-20 scroll-mt-24 sm:py-28">
          <Reveal>
            <SectionHeading index="01" label="About" title="はじまりは「自分で直したい」" />
            <div className="max-w-2xl space-y-6 text-base leading-[1.9] text-muted">
              <p>
                開発を始めたきっかけは、「自分が不便だと思うことを自分で直したい」という一点です。
                最初は小さなスクリプトから始まり、いつの間にか自宅にサーバーを置いてインフラを組み、論文を読みながらコードを書くようになっていました。
              </p>
              <p>
                特定の肩書きにこだわらず、フロントエンド・インフラ・研究の間を渡り歩きながら、
                「これ、なんとかならないか」を形にし続けています。
              </p>
              <p>
                いま特に関心があるのは、LLM やエージェントを実用的な運用の現場にどう組み込むかという領域です。
              </p>
            </div>
          </Reveal>
        </section>

        {/* --- Core Principles --- */}
        <section id="principles" className="mx-auto w-full max-w-5xl px-6 py-20 scroll-mt-24 sm:py-28">
          <Reveal>
            <SectionHeading index="02" label="Principles" title="大切にしていること" />
            <ul className="list-none">
              {solveAreas.map((area, i) => (
                <li
                  key={area.title}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-border py-7 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {area.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-[1.9] text-muted">
                      {area.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* --- Projects --- */}
        <section id="projects" className="mx-auto w-full max-w-5xl px-6 py-20 scroll-mt-24 sm:py-28">
          <Reveal>
            <SectionHeading index="03" label="Projects" title="つくったもの" />
            <div className="border-t border-border">
              <ProjectCard
                title="Smoke it."
                subtitle="smoke-it.koshikai.dev"
                description="Next.js 16.2 + PWA に Optimistic UI を組み合わせたネイティブ級の喫煙記録管理アプリ。AI コーチ（OpenRouter）と 3D バッジ（Three.js）で自分の習慣と向き合う継続を支援。"
                features={["Next.js 16.2", "PWA", "AI Coach", "3D Badges"]}
                href="https://smoke-it.koshikai.dev"
                image={{
                  src: "/images/projects/smoke-it.webp",
                  alt: "Smoke it. のアプリ画面",
                  width: 780,
                  height: 1688,
                }}
              />

              <ProjectCard
                title="KariGallery"
                subtitle="gallery.koshikai.dev"
                description="友人のイラスト販売用に制作したが、現在は偽名によるダミーデータを表示するギャラリーとして運用中。Stripe 決済は技術検証済み。"
                features={["Prisma v7.7", "Auth.js", "Stripe API", "Image Compression"]}
                href="https://gallery.koshikai.dev"
                image={{
                  src: "/images/projects/karigallery.webp",
                  alt: "KariGallery のギャラリー画面",
                  width: 1920,
                  height: 1200,
                }}
              />
            </div>

            <div className="mt-8">
              <Link
                href="/cases"
                className="focus-ring group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
              >
                <span className="border-b border-border pb-0.5 transition-colors group-hover:border-accent">
                  他の事例を見る
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* --- Research --- */}
        <ResearchSection id="research" className="scroll-mt-24" />

        {/* --- Infrastructure --- */}
        <section id="infrastructure" className="mx-auto w-full max-w-5xl px-6 py-20 scroll-mt-24 sm:py-28">
          <Reveal>
            <SectionHeading index="05" label="Infrastructure" title="自宅から続けるインフラ運用" />
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="max-w-xl text-base leading-[1.9] text-muted">
                  Proxmox を基盤に、自宅サーバーを大学時代から継続運用しています。生活課題を起点に、バックアップ、自動化、障害対応までを一体で設計し、技術を実用に結びつける運用を続けています。
                </p>
                <div className="mt-8">
                  {infraCases.map((caseStudy) => (
                    <Link
                      key={caseStudy.slug}
                      href={`/cases/${caseStudy.slug}`}
                      className="focus-ring group flex items-center justify-between border-t border-border py-4 text-sm text-foreground transition-colors last:border-b hover:text-accent"
                    >
                      <span>{caseStudy.title}</span>
                      <ArrowRight
                        className="h-4 w-4 text-muted transition-[transform,color] group-hover:translate-x-1 group-hover:text-accent motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </div>
              <ul role="list" className="list-none">
                {operationHighlights.map((item) => (
                  <li
                    key={item}
                    className="border-t border-border py-4 text-sm leading-relaxed text-muted last:border-b"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* --- Toolbox --- */}
        <section id="toolbox" className="mx-auto w-full max-w-5xl px-6 py-20 pb-28 scroll-mt-24 sm:py-28">
          <Reveal>
            <SectionHeading index="06" label="Toolbox" title="道具箱" />
            <dl className="list-none">
              {toolboxByUse.map((group) => (
                <div
                  key={group.use}
                  className="grid grid-cols-1 gap-1 border-t border-border py-5 last:border-b sm:grid-cols-[12rem_1fr] sm:gap-6"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {group.use}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground">
                    {group.tools}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
