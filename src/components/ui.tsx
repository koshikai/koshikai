import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SplitHeading } from "@/components/SplitHeading";
import { splitIntoChunks } from "@/lib/chunks";
import { tagClassName } from "@/lib/typography";

/** 12 カラムグリッドの外枠。全ページで幅と左右の余白をそろえる */
export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  /** narrow は記事本文用（読みやすい行長に絞る） */
  size?: "default" | "narrow";
}) {
  const width = size === "narrow" ? "max-w-3xl" : "max-w-6xl";
  return <div className={`mx-auto w-full ${width} px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.04em] text-muted">{children}</p>
  );
}

/**
 * セクション見出し。label は build / operate / research のような
 * 軸のキーワード、title は日本語の見出し。
 */
export function SectionHeader({
  id,
  label,
  title,
  description,
  action,
}: {
  id?: string;
  label: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 grid grid-cols-12 items-end gap-x-6 gap-y-3 border-t border-border pt-6 sm:mb-10">
      <div className="col-span-12 md:col-span-8">
        <Eyebrow>{label}</Eyebrow>
        {/* 見出しは文字単位で立ち上げる。改行位置は splitIntoChunks が決めた
            語の境界に固定されるので、和文でも語の途中で折れない。 */}
        <SplitHeading
          as="h2"
          id={id}
          text={title}
          chunks={splitIntoChunks(title)}
          delayStep={22}
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]"
        />
        {description && (
          <p className="mt-3 max-w-2xl text-pretty text-[0.9375rem] leading-[1.9] text-muted">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="col-span-12 md:col-span-4 md:text-right">
          <ArrowLink href={action.href}>{action.label}</ArrowLink>
        </div>
      )}
    </div>
  );
}

export function PageHeader({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="pb-12 pt-14 sm:pb-16 sm:pt-20">
      <Eyebrow>{label}</Eyebrow>
      <SplitHeading
        as="h1"
        text={title}
        chunks={splitIntoChunks(title)}
        delayStart={60}
        delayStep={24}
        className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
      />
      {description && (
        <p className="mt-5 max-w-2xl text-pretty text-base leading-[1.9] text-muted">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export function Tags({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul role="list" className={`flex list-none flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className={tagClassName(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

const arrowLinkClass =
  "focus-ring group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent";

/** 内部リンクは →、外部リンクは ↗ で見分ける */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${arrowLinkClass} ${className}`}>
        <span>{children}</span>
        <ArrowUpRight
          className="h-3.5 w-3.5 text-muted transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
          aria-hidden="true"
        />
      </a>
    );
  }
  return (
    <Link href={href} className={`${arrowLinkClass} ${className}`}>
      <span>{children}</span>
      <ArrowRight
        className="h-3.5 w-3.5 text-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
        aria-hidden="true"
      />
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "secondary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const external = /^https?:\/\//.test(href);
  const className = `focus-ring inline-flex min-h-11 items-center gap-2 rounded border px-4 text-sm font-medium transition-colors ${
    variant === "primary"
      ? "border-foreground bg-foreground text-background hover:border-accent hover:bg-accent"
      : "border-border bg-background text-foreground hover:border-foreground"
  }`;
  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {children}
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
