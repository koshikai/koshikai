import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Hash, LibraryBig } from "lucide-react";
import { MarkdownArticle } from "@/components/mathkb/MarkdownArticle";
import { SetupNotice } from "@/components/mathkb/SetupNotice";
import { getMathKbNoteState } from "@/lib/mathkb/service";
import { getSiteConfig, getSiteVariant } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  if (getSiteVariant() !== "mathkb") {
    return {};
  }

  const { slug } = await params;
  const state = await getMathKbNoteState(slug);

  if (state.status !== "ready") {
    return {
      title: "Note",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const site = getSiteConfig();

  return {
    title: state.note.title,
    description: state.note.summary,
    alternates: {
      canonical: `/notes/${state.note.slug}`,
    },
    openGraph: {
      title: state.note.title,
      description: state.note.summary,
      url: `${site.baseUrl}/notes/${state.note.slug}`,
      siteName: site.name,
      locale: site.locale,
      type: "article",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  if (getSiteVariant() !== "mathkb") {
    notFound();
  }

  const { slug } = await params;
  const state = await getMathKbNoteState(slug);

  if (state.status === "missing") {
    notFound();
  }

  if (state.status === "setup") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)] px-6 py-10 dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_60%,_#09090b_100%)]">
        <main className="mx-auto max-w-5xl">
          <SetupNotice message={state.message} />
        </main>
      </div>
    );
  }

  const { note } = state;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_60%,_#09090b_100%)]">
      <main id="main-content" className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to notes
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
            <LibraryBig className="h-4 w-4" />
            Internal note
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700 uppercase dark:bg-indigo-950/50 dark:text-indigo-300">
              {note.field}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Updated {new Date(note.updatedAt).toLocaleDateString("ja-JP")}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Created {new Date(note.createdAt).toLocaleDateString("ja-JP")}
            </span>
          </div>

          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            {note.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
            {note.summary}
          </p>

          {note.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/?tag=${tag.slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  <Hash className="h-3.5 w-3.5" />
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        <MarkdownArticle markdown={note.bodyMarkdown} />
      </main>
    </div>
  );
}
