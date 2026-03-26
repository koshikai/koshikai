import { Cigarette, Heart, Images } from "lucide-react";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { ResearchSection } from "@/components/ResearchSection";

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
              個人開発者として、日常をより良くするアプリケーションを作っています。
              禁煙支援から大切な人との繋がりまで、テクノロジーで
              <span className="font-bold text-orange-500 dark:text-orange-400">
                ワクワク
              </span>
              する解決策を。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-balance text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              Projects
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
              title="Knot"
              subtitle="knot.koshikai.dev"
              description="遠距離恋愛中のカップル向けプライベート・プラットフォーム。再会カウントダウンや思い出のタイムラインで繋がりを深めます。"
              features={["カウントダウン", "タイムライン", "ウィッシュリスト", "招待制"]}
              href="https://knot.koshikai.dev"
              accentColor="pink"
              icon={<Heart className="h-7 w-7 fill-current" />}
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
              Tech Stack
            </h2>
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              {
                name: "Next.js",
                color:
                  "bg-black text-white dark:bg-white dark:text-black border-transparent",
              },
              {
                name: "TypeScript",
                color:
                  "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
              },
              {
                name: "Tailwind CSS",
                color:
                  "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
              },
              {
                name: "Prisma",
                color:
                  "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
              },
              {
                name: "PostgreSQL",
                color:
                  "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
              },
              {
                name: "Auth.js",
                color:
                  "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
              },
              {
                name: "OpenAI API",
                color:
                  "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
              },
              {
                name: "Bun",
                color:
                  "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
              },
              {
                name: "Docker",
                color:
                  "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
              },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`cursor-default rounded-2xl border-2 px-5 py-2 text-sm font-bold shadow-sm motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-2 hover:shadow-md ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
