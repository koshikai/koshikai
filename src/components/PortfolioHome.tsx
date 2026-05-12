import {
  ArrowRight,
  Cigarette,
  Database,
  Images,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { ResearchSection } from "@/components/ResearchSection";
import { caseItems } from "@/lib/cases";

const sections = [
  { id: "hero", label: "Top" },
  { id: "principles", label: "Principles" },
  { id: "cases", label: "Cases" },
  { id: "infrastructure", label: "Infra" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "toolbox", label: "Toolbox" },
];

function SideNav() {
  return (
    <nav className="fixed right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
                  className="group flex items-center justify-end gap-3 text-right transition-[gap,opacity] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 rounded"
          aria-label={`Jump to ${section.label}`}
        >
          <span className="pointer-events-none text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 opacity-0 transition-[opacity,transform] group-hover:translate-x-0 group-hover:opacity-100 dark:text-zinc-500">
            {section.label}
          </span>
          <div className="h-1 w-4 rounded-full bg-zinc-200 transition-[width,background-color] group-hover:w-8 group-hover:bg-sky-500 dark:bg-zinc-800" />
        </a>
      ))}
    </nav>
  );
}

const solveAreas = [
  {
    title: "生活の不便を仕組みに置き換える",
    description:
      "日常で繰り返す手間を見つけ、継続して使える仕組みとして設計・実装します。",
    icon: Wrench,
  },
  {
    title: "一貫性のある運用設計",
    description:
      "作って終わりではなく、バックアップや監視を含めた運用可能な状態を目指します。",
    icon: ShieldCheck,
  },
  {
    title: "データの価値を維持する",
    description:
      "年月が経っても参照可能で、移行や拡張に耐えうるデータ構造を検討します。",
    icon: Database,
  },
];

const featuredCaseSlugs = ["immich-distributed", "nosmoke", "karigallery"];

const featuredCases = caseItems.filter((item) =>
  featuredCaseSlugs.includes(item.slug),
);

const operationHighlights = [
  "Proxmox VE によるサーバー仮想化とリソース管理",
  "Tailscale によるセキュアな拠点間通信とリモートアクセス",
  "Immich / NocoDB 等のセルフホストサービスの安定運用",
  "ZFS / 外部ストレージへの自動バックアップ体制の構築",
  "Cloudflare Tunnel を活用した安全なサービス公開",
];

const toolboxByUse = [
  { use: "Front-end", tools: "Next.js, TypeScript, Tailwind CSS, Framer Motion" },
  { use: "Back-end & DB", tools: "Node.js, Prisma, PostgreSQL, Redis" },
  { use: "Infrastructure", tools: "Proxmox, Docker, Tailscale, Cloudflare" },
  { use: "Management", tools: "NocoDB, Linear, GitHub Actions" },
];

export function PortfolioHome() {
  return (
    <div className="relative min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900 dark:bg-zinc-950 dark:selection:bg-sky-900/30 dark:selection:text-sky-200">
      <SideNav />

      <main className="relative flex flex-col items-center">
        {/* --- Hero Section --- */}
        <section id="hero" className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-32 scroll-mt-24">
          <div className="pointer-events-none absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] animate-blob rounded-full bg-pink-200/40 opacity-70 blur-3xl filter mix-blend-multiply motion-reduce:animate-none dark:bg-pink-900/20 dark:mix-blend-normal"></div>
            <div className="animation-delay-2000 absolute top-[20%] left-[-10%] h-[400px] w-[400px] animate-blob rounded-full bg-blue-200/40 opacity-70 blur-3xl filter mix-blend-multiply motion-reduce:animate-none dark:bg-blue-900/20 dark:mix-blend-normal"></div>
            <div className="animation-delay-4000 absolute right-[20%] bottom-[-10%] h-[600px] w-[600px] animate-blob rounded-full bg-yellow-200/40 opacity-70 blur-3xl filter mix-blend-multiply motion-reduce:animate-none dark:bg-yellow-900/20 dark:mix-blend-normal"></div>
          </div>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] items-center gap-12 max-w-7xl w-full mx-auto">
            <div className="flex w-full flex-col items-center gap-8 text-center md:items-start md:text-left">
              <div className="animate-fade-in-up inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm motion-reduce:animate-none dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-sky-400 to-blue-500 text-lg font-bold text-white shadow-inner">
                  K
                </div>
                <span className="text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-300">
                  koshikai.dev
                </span>
              </div>

              <h1 className="text-pretty text-5xl leading-[1.1] font-extrabold tracking-tight text-zinc-800 drop-shadow-sm sm:text-7xl dark:text-zinc-50">
                Building apps that{" "}
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                    make life better
                  </span>
                  <span
                    className="absolute bottom-2 left-0 -z-10 h-3 w-full rounded-full bg-yellow-200/60 -rotate-2 dark:bg-yellow-900/40"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              <p className="max-w-2xl text-xl leading-relaxed font-medium text-zinc-600 dark:text-zinc-300">
                生活や運用の課題を見つけて、実装し、改善を続けることを大切にしています。
                特定の職種に寄せるより、必要なツールを組み合わせて
                <span className="font-bold text-orange-500 dark:text-orange-400">
                  問題を前に進める
                </span>
                ことに取り組んでいます。
              </p>
            </div>

            <div className="hidden md:flex justify-center items-center relative h-[450px] w-full" style={{ perspective: '1000px' }}>
              <div className="absolute h-[300px] w-[300px] rounded-full bg-linear-to-r from-sky-400/20 to-emerald-400/20 blur-[80px] dark:from-sky-900/30 dark:to-emerald-900/30 animate-pulse motion-reduce:animate-none"></div>

              <div className="absolute inset-0 flex items-center justify-center animate-[spin_40s_linear_infinite] motion-reduce:animate-none" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute h-64 w-64 rounded-full border-2 border-dashed border-sky-400/30 dark:border-sky-500/20" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}>
                  <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]"></div>
                </div>
                
                <div className="absolute h-80 w-80 rounded-full border border-emerald-400/30 dark:border-emerald-500/20" style={{ transform: 'rotateX(70deg) rotateY(-30deg)' }}>
                  <div className="absolute bottom-0 left-1/4 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
                </div>

                <div className="absolute h-96 w-96 rounded-full border border-purple-400/20 dark:border-purple-500/10 animate-[spin_60s_linear_infinite_reverse] motion-reduce:animate-none" style={{ transform: 'rotateX(50deg) rotateY(40deg)' }}></div>
              </div>

              <div className="relative z-10 flex h-64 w-64 items-center justify-center animate-float motion-reduce:animate-none overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute z-0 h-20 w-20 rounded-full bg-white/60 backdrop-blur-3xl shadow-[0_0_40px_rgba(255,255,255,1)] dark:bg-zinc-800/80 dark:shadow-[0_0_40px_rgba(56,189,248,0.3)] animate-pulse motion-reduce:animate-none"></div>
                <div className="absolute inset-4 rounded-[2rem] border border-white/20 bg-linear-to-br from-white/10 to-transparent backdrop-blur-md shadow-2xl dark:border-zinc-700/30 dark:from-zinc-700/20" style={{ transform: 'rotateX(20deg) rotateY(-20deg) translateZ(-50px)' }}></div>
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 bg-linear-to-tr from-white/20 to-transparent backdrop-blur-xl shadow-2xl dark:border-zinc-600/40 dark:from-zinc-600/30" style={{ transform: 'rotateX(20deg) rotateY(-20deg) translateZ(0px)' }}></div>

                <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(-20deg) translateZ(60px)' }}>
                   <div className="absolute top-2 left-2 flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-300/50 bg-white/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-110 hover:-translate-y-2 dark:border-sky-600/50 dark:bg-zinc-800/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                     <Server className="h-8 w-8 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                   </div>
                   <div className="absolute bottom-2 right-2 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-300/50 bg-white/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-110 hover:-translate-y-2 dark:border-emerald-600/50 dark:bg-zinc-800/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                     <Database className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                   </div>
                   <div className="absolute top-6 right-6 flex h-14 w-14 items-center justify-center rounded-xl border border-purple-300/50 bg-white/40 backdrop-blur-2xl shadow-lg transition-transform duration-500 hover:scale-110 hover:-translate-y-1 dark:border-purple-600/50 dark:bg-zinc-800/60">
                     <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                   </div>
                   <div className="absolute bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-xl border border-orange-300/50 bg-white/40 backdrop-blur-2xl shadow-lg transition-transform duration-500 hover:scale-110 hover:-translate-y-1 dark:border-orange-600/50 dark:bg-zinc-800/60">
                     <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                   </div>
                </div>

                <div className="absolute top-1/4 -right-12 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)] animate-bounce motion-reduce:animate-none" style={{ animationDuration: '2.5s' }}></div>
                <div className="absolute bottom-1/4 -left-12 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] animate-bounce motion-reduce:animate-none" style={{ animationDuration: '3.2s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Core Principles --- */}
        <section id="principles" className="mx-auto max-w-4xl px-6 py-12 scroll-mt-24 w-full">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-pretty text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Core Principles
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {solveAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.title}
                  className="group rounded-3xl border-2 border-zinc-200 bg-white/80 p-6 shadow-sm transition-[transform,border-color] hover:-translate-y-1 hover:border-sky-300 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-sky-800"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white dark:bg-sky-950/40 dark:text-sky-300 transition-colors">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    {area.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {area.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* --- Case Studies --- */}
        <section id="cases" className="mx-auto max-w-4xl px-6 py-12 scroll-mt-24 w-full">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-pretty text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Case Studies
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredCases.map((study) => (
              <article
                key={study.title}
                className="rounded-3xl border-2 border-zinc-200 bg-white/80 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50 hover:shadow-lg transition-shadow"
              >
                <h3 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-100">
                  {study.title}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100 italic">課題:</span> {study.challenge}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100 italic">対応:</span> {study.action}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100 italic">結果:</span> {study.result}
                  </p>
                </div>
                <Link
                  href={`/cases/${study.slug}`}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
                >
                  詳細を見る
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* --- Infrastructure Highlights --- */}
        <section id="infrastructure" className="mx-auto max-w-4xl px-6 py-12 scroll-mt-24 w-full">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-pretty text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Infrastructure
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-8 rounded-3xl border-2 border-zinc-200 bg-white/80 p-8 dark:border-zinc-700 dark:bg-zinc-900/50 md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col h-full">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Server className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300 flex-1">
                Proxmox を基盤に、自宅サーバーを大学時代から継続運用しています。生活課題を起点に、バックアップ、自動化、障害対応までを一体で設計し、技術を実用へつなげる運用を続けています。
              </p>
              <Link
                href="/cases/immich-distributed"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                詳細: Immich 分散アーキテクチャの構築
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul role="list" className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              {operationHighlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Projects --- */}
        <section id="projects" className="mx-auto max-w-4xl px-6 py-12 scroll-mt-24 w-full">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-pretty text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Existing Projects
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <ProjectCard
              title="no"
              subtitle="nosmoke.koshikai.dev"
              description="Next.js 16.2 採用の高度な PWA。Optimistic UI や Glassmorphism によるネイティブ級の体験。Jest による網羅的なテストと Recharts での可視化を統合。"
              features={["Next.js 16.2", "PWA", "Optimistic UI", "Jest/RTL"]}
              href="https://nosmoke.koshikai.dev"
              accentColor="green"
              icon={<Cigarette className="h-7 w-7" />}
            />

            <ProjectCard
              title="KariGallery"
              subtitle="gallery.koshikai.dev"
              description="Prisma v7.7 と Auth.js を軸にしたイラスト管理 SaaS。Stripe 決済やブラウザ画像圧縮、Framer Motion による滑らかな UI を備えたフルスタック構成。"
              features={["Prisma v7.7", "Auth.js", "Stripe API", "Image Compression"]}
              href="https://gallery.koshikai.dev"
              accentColor="purple"
              icon={<Images className="h-7 w-7" />}
            />
          </div>
        </section>

        {/* --- Research --- */}
        <ResearchSection id="research" className="scroll-mt-24" />

        {/* --- Toolbox --- */}
        <section id="toolbox" className="mx-auto max-w-4xl px-6 py-12 pb-32 scroll-mt-24 w-full">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-pretty text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Toolbox & Stacks
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {toolboxByUse.map((group) => (
              <article
                key={group.use}
                className="rounded-2xl border-2 border-zinc-200 bg-white/80 px-5 py-4 dark:border-zinc-700 dark:bg-zinc-900/50"
              >
                <p className="mb-1 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  {group.use}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {group.tools}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer currentVariant="portfolio" />
    </div>
  );
}
