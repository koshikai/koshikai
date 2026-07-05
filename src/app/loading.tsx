export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent motion-reduce:animate-none" />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Loading…
        </p>
      </div>
    </div>
  );
}
