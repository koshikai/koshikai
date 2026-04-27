import Link from "next/link";

interface SetupNoticeProps {
  message: string;
}

export function SetupNotice({ message }: SetupNoticeProps) {
  return (
    <section className="rounded-[2rem] border border-amber-200 bg-amber-50/90 p-8 text-zinc-800 shadow-[0_20px_80px_-40px_rgba(180,83,9,0.45)] dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-zinc-100">
      <p className="text-sm font-bold tracking-[0.3em] text-amber-700 uppercase dark:text-amber-300">
        Setup Required
      </p>
      <h2 className="mt-3 text-2xl font-bold">内部KBはまだ接続されていません</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
        {message}
      </p>
      <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
        `db/mathkb.sql` を適用し、`MATHKB_DATABASE_URL` を設定したうえで
        `SITE_VARIANT=mathkb` のサービスとして起動してください。
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/?v=portfolio"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sky-500"
        >
          ポートフォリオに戻る
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          再読み込み
        </Link>
      </div>
    </section>
  );
}
