import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href: string;
}

export function ProjectCard({
  title,
  subtitle,
  description,
  features,
  href,
}: ProjectCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block border-b border-border py-8 pr-10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
        {title}
      </h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {subtitle}
      </p>

      <p className="mt-4 max-w-2xl text-sm leading-[1.9] text-muted">
        {description}
      </p>

      <ul role="list" className="mt-5 flex flex-wrap gap-2 list-none">
        {features.map((feature) => (
          <li
            key={feature}
            className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
          >
            {feature}
          </li>
        ))}
      </ul>

      <ExternalLink
        aria-hidden="true"
        className="absolute right-0 top-9 h-4 w-4 text-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
      />
    </a>
  );
}
