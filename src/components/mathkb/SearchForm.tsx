"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import type { MathKbField, MathKbSearchFilters, MathKbTag } from "@/lib/mathkb/types";

interface SearchFormProps {
  filters: MathKbSearchFilters;
  fields: MathKbField[];
  tags: MathKbTag[];
}

export function SearchForm({ filters, fields, tags }: SearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const q = (formData.get("q") as string) ?? "";
    const field = (formData.get("field") as string) ?? "";
    const tag = (formData.get("tag") as string) ?? "";

    if (q.trim()) params.set("q", q.trim());
    if (field) params.set("field", field);
    if (tag) params.set("tag", tag);

    const url = params.toString() ? `/?${params.toString()}` : "/";
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  };

  return (
    <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mb-5 flex items-center gap-3">
        <Search className="h-5 w-5 text-sky-600 dark:text-sky-300" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Search Notes
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto_auto]"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="search-q" className="sr-only">
            検索キーワード
          </label>
          <input
            id="search-q"
            type="search"
            name="q"
            defaultValue={filters.query}
            placeholder="定理名、キーワード、メモ断片で検索"
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-0 transition-colors focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="search-field" className="sr-only">
            分野で絞り込み
          </label>
          <select
            id="search-field"
            name="field"
            defaultValue={filters.field}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          >
            <option value="">All fields</option>
            {fields.map((field) => (
              <option key={field.name} value={field.name}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="search-tag" className="sr-only">
            タグで絞り込み
          </label>
          <select
            id="search-tag"
            name="tag"
            defaultValue={filters.tag}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.slug} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "..." : "Search"}
        </button>

        <Link
          href="/"
          className="rounded-2xl border border-zinc-200 px-5 py-3 text-center text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Clear
        </Link>
      </form>
    </div>
  );
}
