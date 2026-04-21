import {
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

const solveAreas = [
  {
    title: "生活の不便を仕組みに置き換える",
    description:
      "日常で繰り返す手間を見つけ、継続して使える仕組みとして設計・実装します。",
    icon: Wrench,
  },
  {
    title: "運用まで含めて安定化する",
    description:
      "作って終わりにせず、監視・復旧・バックアップまで含めて改善サイクルを回します。",
    icon: ShieldCheck,
  },
  {
    title: "複数ツールをつなぎ価値に変える",
    description:
      "用途に応じて技術を組み合わせ、コスト・利便性・自律性のバランスを取ります。",
    icon: Database,
  },
] as const;

const caseStudies = [
  {
    slug: "infrastructure",
    title: "高度な分散インフラ・AI自動化",
    challenge: "多様なサービス運用と、単一ノードでは不足する計算リソースの両立。",
    action:
      "Proxmox と Windows GPU を連携させた分散構成、および運用自動化スクリプトの構築。",
    result:
      "GPU オフロードにより低消費電力と高出力を両立し、AI 運用の自律性を向上。",
    learning: "リソースを場所で縛らず、機能単位で最適配置する分散設計の有用性。",
  },
  {
    slug: "nosmoke",
    title: "NoSmoke: 洗練された PWA 支援",
    challenge: "Web アプリの枠を超えた、ネイティブ級のモバイル体験と信頼性の提供。",
    action:
      "Next.js 16.2 と Optimistic UI を採用し、オフライン動作と即時反応を追求。",
    result:
      "通信環境に左右されない安定した操作感を実現し、継続的な利用を支援。",
    learning: "楽観的 UI は、単なる速さではなくユーザーの心理的負荷を劇的に下げる。",
  },
  {
    slug: "karigallery",
    title: "KariGallery: 決済・認証統合 SaaS",
    challenge: "認証、決済、大容量画像処理を統合した商用レベルの基盤構築。",
    action:
      "Auth.js, Stripe, Prisma v7.7 を統合し、ブラウザ側での画像圧縮処理を実装。",
    result: "フルスタックな機能をセキュアに提供し、イラスト管理の全フローをカバー。",
    learning: "外部 API を前提とした堅牢なデータモデル設計と型安全の重要性。",
  },
  {
    slug: "shuukatsu",
    title: "就活・自己史分析プロジェクト",
    challenge: "最新技術を早期にキャッチアップし、実戦環境での有効性を検証したい。",
    action: "React 19, Tailwind v4, Bun を採用し、自己史のデータ化と分析ツールを構築。",
    result: "極めて高速な開発・動作環境を実現し、多角的な自己分析を可能にした。",
    learning: "リリース直後の技術を即座にワークフローへ組み込む技術的適応力。",
  },
  {
    slug: "home-backup",
    title: "自宅バックアップ基盤の構築",
    challenge: "スマホ故障をきっかけに、写真・動画のデータ保全を強化したい。",
    action:
      "Proxmox 上で自宅サーバーを運用し、自動バックアップと復旧手順を整備。",
    result:
      "サブスク依存を下げつつ、データ管理を自分でコントロールできる運用へ移行。",
    learning: "利便性だけでなく、継続運用しやすさとコストを同時に設計する重要性。",
  },
] as const;

const operationHighlights = [
  "Proxmox VE (Ryzen 7) と LXC による10以上のマイクロサービス運用",
  "Windows GPU への分散オフロードによる Immich 機械学習処理の高速化",
  "PowerShell と MCP を活用した AI エージェント用運用エコシステム構築",
  "運用方針: 日次/週次バックアップと定期レビューで改善を継続",
] as const;

const toolboxByUse = [
  { use: "アプリ実装", tools: "Next.js / React / TypeScript / Tailwind CSS" },
  { use: "データ管理", tools: "PostgreSQL / Prisma / NocoDB" },
  { use: "運用・自動化", tools: "Docker / GitHub Actions / Proxmox / Bun" },
  { use: "品質確保", tools: "Playwright / Jest / Static Analysis" },
] as const;

export function PortfolioHome() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] animate-blob rounded-full bg-pink-200/40 opacity-70 blur-3xl filter mix-blend-multiply motion-reduce:animate-none dark:bg-pink-900/20 dark:mix-blend-normal"></div>
        <div className="animation-delay-2000 absolute top-[20%] left-[-10%] h-[400px] w-[400px] animate-blob rounded-full bg-blue-200/40 opacity-70 blur-3xl filter mix-blend-multiply motion-reduce:animate-none dark:bg-blue-900/20 dark:mix-blend-normal"></div>
        <div className="animation-delay-4000 absolute right-[20%] bottom-[-10%] h-[600px] w-[600px] animate-blob rounded-full bg-yellow-200/40 opacity-70 blur-3xl filter mix-blend-multiply motion-reduce:animate-none dark:bg-yellow-900/20 dark:mix-blend-normal"></div>
      </div>

      <main id="main-content" className="flex-1">
        <section className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 sm:pt-40 sm:pb-32">
          <div className="grid md:grid-cols-[1.2fr_0.8fr] items-center gap-12">
            <div className="flex w-full flex-col items-center gap-8 text-center md:items-start md:text-left">
              <div className="animate-fade-in-up inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm motion-reduce:animate-none dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-sky-400 to-blue-500 text-lg font-bold text-white shadow-inner">
                  K
                </div>
                <span className="text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-300">
                  koshikai.dev
                </span>
              </div>

              <h1 className="text-balance text-5xl leading-[1.1] font-extrabold tracking-tight text-zinc-800 drop-shadow-sm sm:text-7xl dark:text-zinc-50">
                Building apps that <br />
                <span className="relative whitespace-normal sm:whitespace-nowrap">
                  <span className="relative z-10 inline-block cursor-default bg-linear-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent motion-safe:transition-transform motion-safe:hover:scale-105">
                    make life better
                  </span>
                  <span className="absolute bottom-2 left-0 -z-10 h-3 w-full rounded-full bg-yellow-200/60 -rotate-2 dark:bg-yellow-900/40"></span>
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
              {/* Ambient Background Glow */}
              <div className="absolute h-[300px] w-[300px] rounded-full bg-linear-to-r from-sky-400/20 to-emerald-400/20 blur-[80px] dark:from-sky-900/30 dark:to-emerald-900/30 animate-pulse"></div>

              {/* 3D Rotating Orbits Group */}
              <div className="absolute inset-0 flex items-center justify-center animate-[spin_40s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                {/* Inner Orbit */}
                <div className="absolute h-64 w-64 rounded-full border-2 border-dashed border-sky-400/30 dark:border-sky-500/20" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}>
                  {/* Orbiting Satellite */}
                  <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]"></div>
                </div>
                
                {/* Middle Orbit */}
                <div className="absolute h-80 w-80 rounded-full border border-emerald-400/30 dark:border-emerald-500/20" style={{ transform: 'rotateX(70deg) rotateY(-30deg)' }}>
                  <div className="absolute bottom-0 left-1/4 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
                </div>

                {/* Outer Orbit */}
                <div className="absolute h-96 w-96 rounded-full border border-purple-400/20 dark:border-purple-500/10 animate-[spin_60s_linear_infinite_reverse]" style={{ transform: 'rotateX(50deg) rotateY(40deg)' }}></div>
              </div>

              {/* Central Abstract Structure */}
              <div className="relative z-10 flex h-64 w-64 items-center justify-center animate-float overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
                {/* Central Power Core */}
                <div className="absolute z-0 h-20 w-20 rounded-full bg-white/60 backdrop-blur-3xl shadow-[0_0_40px_rgba(255,255,255,1)] dark:bg-zinc-800/80 dark:shadow-[0_0_40px_rgba(56,189,248,0.3)] animate-pulse"></div>

                {/* Isometric Layer 1 (Back Depth) */}
                <div className="absolute inset-4 rounded-[2rem] border border-white/20 bg-linear-to-br from-white/10 to-transparent backdrop-blur-md shadow-2xl dark:border-zinc-700/30 dark:from-zinc-700/20" style={{ transform: 'rotateX(20deg) rotateY(-20deg) translateZ(-50px)' }}></div>

                {/* Isometric Layer 2 (Middle) */}
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 bg-linear-to-tr from-white/20 to-transparent backdrop-blur-xl shadow-2xl dark:border-zinc-600/40 dark:from-zinc-600/30" style={{ transform: 'rotateX(20deg) rotateY(-20deg) translateZ(0px)' }}></div>

                {/* Isometric Layer 3 (Floating Front Nodes) */}
                <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(-20deg) translateZ(60px)' }}>
                   {/* Top Left Node */}
                   <div className="absolute top-2 left-2 flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-300/50 bg-white/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-110 hover:-translate-y-2 dark:border-sky-600/50 dark:bg-zinc-800/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                     <Server className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                   </div>
                   {/* Bottom Right Node */}
                   <div className="absolute bottom-2 right-2 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-300/50 bg-white/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-110 hover:-translate-y-2 dark:border-emerald-600/50 dark:bg-zinc-800/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                     <Database className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   {/* Top Right Node (Small) */}
                   <div className="absolute top-6 right-6 flex h-14 w-14 items-center justify-center rounded-xl border border-purple-300/50 bg-white/40 backdrop-blur-2xl shadow-lg transition-transform duration-500 hover:scale-110 hover:-translate-y-1 dark:border-purple-600/50 dark:bg-zinc-800/60">
                     <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                   </div>
                   {/* Bottom Left Node (Small) */}
                   <div className="absolute bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-xl border border-orange-300/50 bg-white/40 backdrop-blur-2xl shadow-lg transition-transform duration-500 hover:scale-110 hover:-translate-y-1 dark:border-orange-600/50 dark:bg-zinc-800/60">
                     <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                   </div>
                </div>

                {/* Dynamic Data Particles (representing flow) */}
                <div className="absolute top-1/4 -right-12 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)] animate-bounce" style={{ animationDuration: '2.5s' }}></div>
                <div className="absolute bottom-1/4 -left-12 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] animate-bounce" style={{ animationDuration: '3.2s' }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
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
                  className="rounded-3xl border-2 border-zinc-200 bg-white/80 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:border-zinc-700 dark:bg-zinc-900/50"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                    <Icon className="h-5 w-5" />
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

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Case Studies
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <article
                key={study.title}
                className="rounded-3xl border-2 border-zinc-200 bg-white/80 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:border-zinc-700 dark:bg-zinc-900/50"
              >
                <h3 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-100">
                  {study.title}
                </h3>
                <div className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      課題:
                    </span>{" "}
                    {study.challenge}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      対応:
                    </span>{" "}
                    {study.action}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      結果:
                    </span>{" "}
                    {study.result}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      学び:
                    </span>{" "}
                    {study.learning}
                  </p>
                </div>
                <Link
                  href={`/cases/${study.slug}`}
                  className="mt-4 inline-flex text-sm font-bold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
                >
                  詳しく見る
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
              Infrastructure
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-zinc-200 via-zinc-400/30 to-transparent dark:from-zinc-800 dark:via-zinc-600/30 dark:to-transparent rounded-full"></div>
          </div>

          <div className="grid gap-8 rounded-3xl border-2 border-zinc-200 bg-white/80 p-8 dark:border-zinc-700 dark:bg-zinc-900/50 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Server className="h-6 w-6" />
              </div>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                Proxmox を基盤に、自宅サーバーを大学時代から継続運用しています。
                生活課題を起点に、バックアップ、自動化、障害対応までを一体で設計し、
                技術を実用へつなげる運用を続けています。
              </p>
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

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
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

        <ResearchSection />

        <section className="mx-auto max-w-4xl px-6 py-12 pb-32">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-black italic tracking-tight text-zinc-800 dark:text-zinc-100 uppercase">
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

      <Footer />
    </div>
  );
}
