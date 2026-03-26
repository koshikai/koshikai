import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";

const markdownComponents = {
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mt-12 mb-4 text-3xl font-bold tracking-tight text-zinc-900 first:mt-0 dark:text-zinc-50">
      {children}
    </h1>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
      {children}
    </h2>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
      {children}
    </h3>
  ),
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <p className="my-4 leading-8 text-zinc-700 dark:text-zinc-200">{children}</p>
  ),
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-200">
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-200">
      {children}
    </ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-8">{children}</li>
  ),
  blockquote: ({ children }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 rounded-r-2xl border-l-4 border-sky-400 bg-sky-50/70 px-5 py-4 text-zinc-700 italic dark:bg-sky-950/20 dark:text-zinc-200">
      {children}
    </blockquote>
  ),
  code: ({ children }: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded-md bg-zinc-900/90 px-1.5 py-1 font-mono text-[0.9em] text-zinc-50 dark:bg-zinc-950">
      {children}
    </code>
  ),
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => (
    <pre className="my-6 overflow-x-auto rounded-2xl bg-zinc-950 p-5 text-sm text-zinc-50">
      {children}
    </pre>
  ),
};

interface MarkdownArticleProps {
  markdown: string;
}

export function MarkdownArticle({ markdown }: MarkdownArticleProps) {
  return (
    <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
    </div>
  );
}
