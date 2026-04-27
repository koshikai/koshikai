export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-sky-600 dark:border-zinc-700 dark:border-t-sky-300" />
        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
