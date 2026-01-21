import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href: string;
  accentColor: "green" | "pink";
  icon: React.ReactNode;
}

const colorClasses = {
  green: {
    border: "border-teal-200 dark:border-teal-800",
    bg: "bg-white dark:bg-zinc-800",
    hover: "hover:bg-teal-50 dark:hover:bg-teal-900/30",
    text: "text-teal-600 dark:text-teal-300",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    iconBg: "bg-teal-200 dark:bg-teal-700",
    shadow:
      "shadow-[6px_6px_0px_0px_rgba(45,212,191,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(45,212,191,0.6)]",
  },
  pink: {
    border: "border-pink-200 dark:border-pink-800",
    bg: "bg-white dark:bg-zinc-800",
    hover: "hover:bg-pink-50 dark:hover:bg-pink-900/30",
    text: "text-pink-600 dark:text-pink-300",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    iconBg: "bg-pink-200 dark:bg-pink-700",
    shadow:
      "shadow-[6px_6px_0px_0px_rgba(244,114,182,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(244,114,182,0.6)]",
  },
} as const;

export function ProjectCard({
  title,
  subtitle,
  description,
  features,
  href,
  accentColor,
  icon,
}: ProjectCardProps) {
  const colors = colorClasses[accentColor];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col gap-4 rounded-3xl border-2 p-6 ${colors.border} ${colors.bg} ${colors.hover} ${colors.shadow} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-600 motion-safe:transition-[transform,background-color,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between">
        <div
          aria-hidden="true"
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.iconBg} text-white shadow-sm rotate-3 motion-safe:transition-transform motion-safe:group-hover:rotate-12`}
        >
          {icon}
        </div>
        <div className="rounded-full bg-zinc-100 dark:bg-zinc-700 p-2 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
          <ExternalLink
            aria-hidden="true"
            className="h-4 w-4 text-zinc-500 dark:text-zinc-300"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white text-balance">
          {title}
        </h3>
        <p className={`text-sm font-bold ${colors.text}`}>{subtitle}</p>
      </div>

      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
        {description}
      </p>

      <ul role="list" className="flex flex-wrap gap-2 mt-auto pt-2 list-none">
        {features.map((feature) => (
          <li
            key={feature}
            className={`rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}
          >
            {feature}
          </li>
        ))}
      </ul>
    </a>
  );
}
