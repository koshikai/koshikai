import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { tagClassName } from "@/lib/typography";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export function ProjectCard({
  title,
  subtitle,
  description,
  features,
  href,
  image,
}: ProjectCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group relative block border-b border-border py-8 pr-10 transition-colors"
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
        <div className="min-w-0 flex-1">
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
              <li key={feature} className={tagClassName(feature)}>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Screenshots range from phone portrait to desktop landscape, so the
            frame follows each image instead of cropping it to a shared shape.
            On phones the shot stacks under the copy at a larger cap — hiding it
            there dropped the most persuasive part of the card for the readers
            most likely to see it. */}
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 640px) 240px, 100vw"
            className="h-auto max-h-80 w-auto max-w-full self-center border border-border bg-surface sm:max-h-52 sm:max-w-60 sm:shrink-0 sm:self-start"
          />
        )}
      </div>

      <ExternalLink
        aria-hidden="true"
        className="absolute right-0 top-9 h-4 w-4 text-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
      />
    </a>
  );
}
