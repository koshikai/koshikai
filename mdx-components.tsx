import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-12 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mt-8 mb-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="mb-4 leading-8 text-zinc-700 dark:text-zinc-300"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
    ),
    ...components,
  };
}
