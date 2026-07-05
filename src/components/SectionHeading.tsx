export function SectionHeading({
  index,
  label,
  title,
  id,
}: {
  index: string;
  label: string;
  title: string;
  id?: string;
}) {
  return (
    <header className="mb-12 border-t border-border pt-6">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[13px] font-medium tracking-widest text-accent">
          {index}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {label}
        </span>
      </div>
      <h2
        id={id}
        className="mt-3 text-balance font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
    </header>
  );
}
