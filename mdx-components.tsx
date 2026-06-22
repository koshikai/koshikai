import type { MDXComponents } from "mdx/types";
import type React from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="mt-12 mb-4 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="mt-10 mb-3 text-xl font-bold tracking-tight text-zinc-900 sm:mt-12 sm:mb-4 sm:text-2xl dark:text-zinc-50"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mt-7 mb-2.5 text-lg font-semibold tracking-tight text-zinc-900 sm:mt-8 sm:mb-3 sm:text-xl dark:text-zinc-100"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="mb-4 text-sm leading-7 text-zinc-700 sm:text-base sm:leading-8 dark:text-zinc-300"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="mb-5 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700 sm:pl-6 sm:text-base sm:leading-8 dark:text-zinc-300"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mb-5 list-decimal space-y-2 pl-5 text-sm leading-7 text-zinc-700 sm:pl-6 sm:text-base sm:leading-8 dark:text-zinc-300"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="font-semibold text-sky-700 underline underline-offset-4 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="my-6 border-l-4 border-zinc-300 pl-4 text-sm leading-7 text-zinc-600 italic sm:text-base sm:leading-8 dark:border-zinc-700 dark:text-zinc-300"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="my-6 overflow-x-auto rounded-2xl bg-zinc-900 px-5 py-4 text-sm leading-relaxed text-zinc-100 dark:bg-zinc-800/80"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
    ),
    hr: (props) => (
      <hr className="my-8 border-zinc-200 dark:border-zinc-700" {...props} />
    ),
    img: ({ alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="my-6 rounded-2xl shadow-lg max-w-full h-auto" alt={alt} {...props} />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300" {...props} />
      </div>
    ),
    thead: (props) => (
      <thead className="text-xs uppercase bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" {...props} />
    ),
    tbody: (props) => (
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700" {...props} />
    ),
    tr: (props) => (
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50" {...props} />
    ),
    th: (props) => (
      <th className="px-4 py-3 font-semibold" {...props} />
    ),
    td: (props) => (
      <td className="px-4 py-3" {...props} />
    ),
    ...components,
  };
}
