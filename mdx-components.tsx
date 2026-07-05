import type { MDXComponents } from "mdx/types";
import type React from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="mt-12 mb-4 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="mt-10 mb-3 font-serif text-xl font-semibold tracking-tight text-foreground sm:mt-12 sm:mb-4 sm:text-2xl"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mt-7 mb-2.5 font-serif text-lg font-semibold tracking-tight text-foreground sm:mt-8 sm:mb-3 sm:text-xl"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="mb-4 text-sm leading-[1.9] text-muted sm:text-base"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="mb-5 list-disc space-y-2 pl-5 text-sm leading-[1.9] text-muted marker:text-accent sm:pl-6 sm:text-base"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mb-5 list-decimal space-y-2 pl-5 text-sm leading-[1.9] text-muted marker:text-accent sm:pl-6 sm:text-base"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="text-accent underline underline-offset-4 decoration-accent/40 transition-[text-decoration-color] hover:decoration-accent"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="my-6 border-l-2 border-accent pl-4 text-sm leading-[1.9] text-muted italic sm:text-base"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="my-6 overflow-x-auto rounded-sm border border-border bg-surface px-5 py-4 font-mono text-sm leading-relaxed text-foreground [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    hr: (props) => (
      <hr className="my-8 border-border" {...props} />
    ),
    img: ({ alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="my-6 h-auto max-w-full border border-border" alt={alt} {...props} />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border border-border text-left text-sm text-muted" {...props} />
      </div>
    ),
    thead: (props) => (
      <thead className="border-b border-border bg-surface font-mono text-[11px] uppercase tracking-[0.1em] text-foreground" {...props} />
    ),
    tbody: (props) => (
      <tbody className="divide-y divide-border" {...props} />
    ),
    tr: (props) => (
      <tr {...props} />
    ),
    th: (props) => (
      <th className="px-4 py-3 font-medium" {...props} />
    ),
    td: (props) => (
      <td className="px-4 py-3" {...props} />
    ),
    ...components,
  };
}
