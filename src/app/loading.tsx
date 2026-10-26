export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5" role="status">
        {/* 3 つのドットが順に跳ねる。動きを減らす設定では静止 */}
        <div className="flex h-8 items-end gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="loading-dot h-2.5 w-2.5 rounded-full bg-accent"
              style={{ animationDelay: `${i * 140}ms` }}
            />
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Loading…
        </p>
      </div>
    </div>
  );
}
