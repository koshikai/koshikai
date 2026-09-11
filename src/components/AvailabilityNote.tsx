import { profile } from "@/lib/profile";

/**
 * 就職・インターンの募集状況。profile.availability が null の間は何も描かない。
 * 古い募集文が残り続けないよう、いつ時点の情報かを必ず併記する。
 */
export function AvailabilityNote({ className = "" }: { className?: string }) {
  const availability = profile.availability;
  if (!availability) return null;

  return (
    <p className={`inline-flex items-start gap-2 rounded border border-border bg-background px-3 py-2 text-sm text-foreground ${className}`}>
      <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span>
        {availability.message}
        <span className="ml-2 font-mono text-xs text-muted">as of {availability.asOf}</span>
      </span>
    </p>
  );
}
