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
    slug: "home-backup",
    title: "自宅バックアップ基盤の構築",
    challenge: "スマホ故障をきっかけに、写真・動画のデータ保全を強化したい。",
    action:
      "Proxmox 上で自宅サーバーを運用し、自動バックアップと復旧手順を整備。",
    result:
      "サブスク依存を下げつつ、データ管理を自分でコントロールできる運用へ移行。",
    learning: "利便性だけでなく、継続運用しやすさとコストを同時に設計する重要性。",
  },
  {
    slug: "deploy-automation",
    title: "デプロイ作業の自動化",
    challenge: "手動デプロイの手間と設定差分によるミスを減らしたい。",
    action:
      "GitHub Actions と self-hosted runner を連携し、CI/CD パイプラインを構築。",
    result:
      "反復作業を削減し、更新の再現性を高めた。運用ドキュメントも合わせて整備。",
    learning: "自動化はスピードだけでなく、チームや将来の自分の認知負荷を下げる。",
  },
  {
    slug: "research-workflow",
    title: "研究ワークフローの実装",
    challenge: "数理研究の検証結果を安定して再現し、比較しやすくしたい。",
    action:
      "制約付き制御の実験フローを整理し、条件を固定して結果を記録・検証。",
    result: "Cortical Development で 32/32、Wnt5a で 96/96 の成功率を確認。",
    learning: "探索速度より、検証条件の明確化と再現性の担保が信頼性に直結する。",
  },
] as const;

const operationHighlights = [
  "大学時代から継続して自宅サーバーを運用",
  "広告ブロック、写真・動画バックアップ、検証環境を自己管理",
  "障害対応・バックアップ・復旧手順をドキュメント化",
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
        <section className="relative mx-auto max-w-4xl px-6 pt-32 pb-20 sm:pt-40 sm:pb-32">
          <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
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
              <span className="relative whitespace-nowrap">
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
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              What I Solve
            </h2>
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
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
            <h2 className="text-balance text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              Case Studies
            </h2>
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
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
            <h2 className="text-balance text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              Home Server & Operations
            </h2>
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
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
            <h2 className="text-balance text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              Existing Projects
            </h2>
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <ProjectCard
              title="no"
              subtitle="nosmoke.koshikai.dev"
              description="喫煙習慣の記録と管理を支援する PWA。自分のペースで喫煙量を追跡し、禁煙に挑戦できます。AI コーチによるサポート付き。"
              features={["PWA", "AI Coach", "Push通知", "バッジシステム"]}
              href="https://nosmoke.koshikai.dev"
              accentColor="green"
              icon={<Cigarette className="h-7 w-7" />}
            />

            <ProjectCard
              title="KariGallery"
              subtitle="gallery.koshikai.dev"
              description="創作活動のためのイラスト・アートワーク管理プラットフォーム。作品のアーカイブやタグ付け、スムーズな閲覧体験を提供します。"
              features={["作品管理", "タグシステム", "レスポンシブビューワ", "Prisma"]}
              href="https://gallery.koshikai.dev"
              accentColor="purple"
              icon={<Images className="h-7 w-7" />}
            />
          </div>
        </section>

        <ResearchSection />

        <section className="mx-auto max-w-4xl px-6 py-12 pb-32">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              Toolbox by Use
            </h2>
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
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
