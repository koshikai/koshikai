import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { getSiteVariant } from "@/lib/site-config";

export default function NotFound() {
  const isMathKb = getSiteVariant() === "mathkb";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.18),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)] px-6 py-12 dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_60%,_#09090b_100%)]">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
          <Compass className="h-7 w-7" />
        </div>

        <p className="mt-6 text-sm font-bold tracking-[0.3em] text-sky-700 uppercase dark:text-sky-300">
          404
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          {isMathKb ? "ノートが見つかりません" : "ページが見つかりません"}
        </h1>

        <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          {isMathKb
            ? "指定した slug のノートは存在しないか、まだ内部KBに登録されていません。"
            : "URL を確認するか、トップページから目的のページへ戻ってください。"}
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {isMathKb ? "内部KBへ戻る" : "トップへ戻る"}
          </Link>
        </div>
      </section>
    </main>
  );
}
