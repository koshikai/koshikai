import Link from "next/link";
import { BookOpenText, Layers3, Search, Tags } from "lucide-react";
import { SetupNotice } from "@/components/mathkb/SetupNotice";
import type { MathKbHomeState, MathKbSearchFilters, MathKbTag } from "@/lib/mathkb/types";

interface MathKbHomeProps {
  state: MathKbHomeState;
}

function buildFilterHref(
  filters: MathKbSearchFilters,
  patch: Partial<MathKbSearchFilters>,
) {
  const params = new URLSearchParams();
  const nextFilters = { ...filters, ...patch };

  if (nextFilters.query) {
    params.set("q", nextFilters.query);
  }

  if (nextFilters.field) {
    params.set("field", nextFilters.field);
  }

  if (nextFilters.tag) {
    params.set("tag", nextFilters.tag);
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

function TagPill({
  filters,
  tag,
}: {
  filters: MathKbSearchFilters;
  tag: MathKbTag;
}) {
  const isActive = filters.tag === tag.slug;

  return (
    <Link
      href={buildFilterHref(filters, { tag: isActive ? "" : tag.slug })}
      className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-colors ${
        isActive
          ? "bg-sky-600 text-white"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      }`}
    >
      #{tag.name}
      {typeof tag.noteCount === "number" ? ` · ${tag.noteCount}` : ""}
    </Link>
  );
}

export function MathKbHome({ state }: MathKbHomeProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_60%,_#09090b_100%)]">
      <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 sm:px-8 sm:py-14">
        <section className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <p className="text-sm font-bold tracking-[0.3em] text-sky-700 uppercase dark:text-sky-300">
            Internal Research Infrastructure
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-balance text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
                Private Math Knowledge Base
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
                研究ノートを PostgreSQL に集約し、内部UIでは一覧・詳細・検索を、
                MCP では読み取り専用の参照を提供するための最小構成です。
              </p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <p className="text-zinc-500 dark:text-zinc-400">Notes</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {state.status === "ready" ? state.data.totalNotes : "--"}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <p className="text-zinc-500 dark:text-zinc-400">Fields</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {state.status === "ready" ? state.data.fields.length : "--"}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <p className="text-zinc-500 dark:text-zinc-400">Tags</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {state.status === "ready" ? state.data.tags.length : "--"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {state.status === "setup" ? (
          <SetupNotice message={state.message} />
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
              <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="mb-5 flex items-center gap-3">
                  <Search className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Search Notes
                  </h2>
                </div>

                <form action="/" className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto_auto]">
                  <input
                    type="search"
                    name="q"
                    defaultValue={state.data.filters.query}
                    placeholder="定理名、キーワード、メモ断片で検索"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-0 transition-colors focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />

                  <select
                    name="field"
                    defaultValue={state.data.filters.field}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  >
                    <option value="">All fields</option>
                    {state.data.fields.map((field) => (
                      <option key={field.name} value={field.name}>
                        {field.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="tag"
                    defaultValue={state.data.filters.tag}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  >
                    <option value="">All tags</option>
                    {state.data.tags.map((tag) => (
                      <option key={tag.slug} value={tag.slug}>
                        {tag.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-500"
                  >
                    Search
                  </button>

                  <Link
                    href="/"
                    className="rounded-2xl border border-zinc-200 px-5 py-3 text-center text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Clear
                  </Link>
                </form>
              </div>

              <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center gap-3">
                  <Layers3 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Fields
                  </h2>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {state.data.fields.map((field) => {
                    const isActive = state.data.filters.field === field.name;

                    return (
                      <Link
                        key={field.name}
                        href={buildFilterHref(state.data.filters, {
                          field: isActive ? "" : field.name,
                        })}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                        }`}
                      >
                        {field.name} · {field.noteCount}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_20rem]">
              <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="mb-6 flex items-center gap-3">
                  <BookOpenText className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Notes
                  </h2>
                </div>

                {state.data.notes.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-zinc-300 px-6 py-10 text-center dark:border-zinc-700">
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      条件に一致するノートはまだありません
                    </p>
                    <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                      NocoDB からノートを追加するか、検索条件を緩めてください。
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {state.data.notes.map((note) => (
                      <article
                        key={note.slug}
                        className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-5 transition-colors hover:border-sky-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-sky-800 dark:hover:bg-zinc-950"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="max-w-3xl">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold tracking-wide text-sky-700 uppercase dark:bg-sky-950/50 dark:text-sky-300">
                                {note.field}
                              </span>
                              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                Updated {new Date(note.updatedAt).toLocaleDateString("ja-JP")}
                              </span>
                            </div>

                            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                              <Link href={`/notes/${note.slug}`} className="hover:text-sky-600 dark:hover:text-sky-300">
                                {note.title}
                              </Link>
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                              {note.summary}
                            </p>
                          </div>

                          <Link
                            href={`/notes/${note.slug}`}
                            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-sky-700 dark:hover:text-sky-200"
                          >
                            Open note
                          </Link>
                        </div>

                        {note.tags.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                              <TagPill
                                key={`${note.slug}-${tag.slug}`}
                                filters={state.data.filters}
                                tag={tag}
                              />
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <aside className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center gap-3">
                  <Tags className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Tags
                  </h2>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {state.data.tags.map((tag) => (
                    <TagPill key={tag.slug} filters={state.data.filters} tag={tag} />
                  ))}
                </div>
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
