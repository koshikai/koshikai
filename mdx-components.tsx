import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
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
    code: (props) => (
      <code
        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
    ),
    ...components,
  };
}
