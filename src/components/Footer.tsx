import { VariantSwitcher } from "./VariantSwitcher";

export function Footer({ currentVariant }: { currentVariant?: string }) {
    return (
        <footer className="w-full mt-12 py-12 bg-[#fffbf0] dark:bg-[#1a1625] border-t-4 border-dashed border-zinc-200 dark:border-zinc-800 motion-safe:transition-[background-color,border-color] motion-safe:duration-300">
            <div className="mx-auto max-w-4xl px-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">

                <div className="flex flex-col items-center sm:items-start">
                    <span className="font-bold text-lg text-zinc-800 dark:text-zinc-100 font-sans tracking-wide">
                        koshikai.dev
                    </span>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                    {currentVariant && (
                        <VariantSwitcher currentVariant={currentVariant} />
                    )}
                </div>

                <div className="flex gap-4">
                    <a
                        href="https://github.com/koshikai"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="flex items-center justify-center p-3 rounded-full bg-zinc-100 hover:bg-sky-100 text-zinc-600 hover:text-sky-500 dark:bg-zinc-800 dark:hover:bg-sky-900/50 dark:text-zinc-300 dark:hover:text-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-600 motion-safe:transition-[transform,background-color,color] motion-safe:duration-300 motion-safe:hover:scale-110 motion-safe:hover:rotate-6"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
