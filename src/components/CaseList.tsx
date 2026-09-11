import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseItem } from "@/lib/cases";
import { Tags } from "@/components/ui";

export function CaseList({ items }: { items: CaseItem[] }) {
  return (
    <ul role="list" className="list-none border-t border-border">
      {items.map((item) => (
        <li key={item.slug} className="border-b border-border">
          <Link
            href={`/cases/${item.slug}`}
            className="focus-ring group grid grid-cols-12 gap-x-6 gap-y-2 py-5 sm:py-6"
          >
            <div className="col-span-12 md:col-span-8">
              <h3 className="flex items-start justify-between gap-4 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                <span>{item.title}</span>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 text-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none md:hidden"
                  aria-hidden="true"
                />
              </h3>
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-[1.8] text-muted">{item.summary}</p>
            </div>
            <div className="col-span-12 flex items-start justify-between gap-4 md:col-span-4">
              <Tags items={item.tags.slice(0, 3)} />
              <ArrowRight
                className="mt-1 hidden h-4 w-4 shrink-0 text-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none md:block"
                aria-hidden="true"
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
