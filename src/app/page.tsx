import { Cigarette, Heart } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { ResearchSection } from "@/components/ResearchSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob motion-reduce:animate-none dark:bg-pink-900/20 dark:mix-blend-normal"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob motion-reduce:animate-none animation-delay-2000 dark:bg-blue-900/20 dark:mix-blend-normal"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-yellow-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob motion-reduce:animate-none animation-delay-4000 dark:bg-yellow-900/20 dark:mix-blend-normal"></div>
      </div>

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-6 pt-32 pb-20 sm:pt-40 sm:pb-32 relative">
          <div className="flex flex-col gap-8 items-center text-center sm:items-start sm:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700 shadow-sm animate-fade-in-up motion-reduce:animate-none">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                K
              </div>
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 tracking-wide">
                koshikai.dev
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-50 sm:text-7xl drop-shadow-sm leading-[1.1] text-balance">
              Building apps that <br />
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent inline-block cursor-default motion-safe:transition-transform motion-safe:hover:scale-105">
                  make life better
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-200/60 -rotate-2 rounded-full -z-10 dark:bg-yellow-900/40"></span>
              </span>
            </h1>

            <p className="max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
              個人開発者として、日常をより良くするアプリケーションを作っています。
              禁煙支援から大切な人との繋がりまで、テクノロジーで<span className="text-orange-500 dark:text-orange-400 font-bold">ワクワク</span>する解決策を。
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 text-balance">
              Projects
            </h2>
            <div className="h-1 flex-1 bg-zinc-200 rounded-full dark:bg-zinc-800"></div>
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
          </div>
        </section>

        <ResearchSection />

        {/* Tech Stack Section */}
        <section className="mx-auto max-w-4xl px-6 py-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 text-balance">
              Tech Stack
            </h2>
            <div className="h-1 flex-1 bg-zinc-200 rounded-full dark:bg-zinc-800"></div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { name: "Next.js", color: "bg-black text-white dark:bg-white dark:text-black border-transparent" },
              { name: "TypeScript", color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
              { name: "Tailwind CSS", color: "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800" },
              { name: "Prisma", color: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
              { name: "PostgreSQL", color: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800" },
              { name: "Auth.js", color: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800" },
              { name: "OpenAI API", color: "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" },
              { name: "Bun", color: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800" },
              { name: "Docker", color: "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800" },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`rounded-2xl border-2 px-5 py-2 text-sm font-bold shadow-sm cursor-default ${tech.color} hover:shadow-md motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-2`}
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
