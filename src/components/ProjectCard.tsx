import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href: string;
  accentColor: "green" | "pink" | "purple" | "blue" | "orange";
  icon: React.ReactNode;
}

const colorClasses = {
  green: {
    border: "border-teal-200/50 dark:border-teal-800/50",
    bg: "bg-white/40 dark:bg-zinc-900/40",
    gradient: "from-teal-500/5 to-transparent",
    hover: "hover:bg-teal-50/50 dark:hover:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-300",
    badge: "bg-teal-100/80 text-teal-700 dark:bg-teal-900/80 dark:text-teal-300 border border-teal-200/30 dark:border-teal-700/30",
    iconBg: "bg-linear-to-br from-teal-400 to-emerald-500",
    shadow: "shadow-2xl hover:shadow-teal-500/20",
  },
  pink: {
    border: "border-pink-200/50 dark:border-pink-800/50",
    bg: "bg-white/40 dark:bg-zinc-900/40",
    gradient: "from-pink-500/5 to-transparent",
    hover: "hover:bg-pink-50/50 dark:hover:bg-pink-900/20",
    text: "text-pink-600 dark:text-pink-300",
    badge: "bg-pink-100/80 text-pink-700 dark:bg-pink-900/80 dark:text-pink-300 border border-pink-200/30 dark:border-pink-700/30",
    iconBg: "bg-linear-to-br from-pink-400 to-rose-500",
    shadow: "shadow-2xl hover:shadow-pink-500/20",
  },
  purple: {
    border: "border-purple-200/50 dark:border-purple-800/50",
    bg: "bg-white/40 dark:bg-zinc-900/40",
    gradient: "from-purple-500/5 to-transparent",
    hover: "hover:bg-purple-50/50 dark:hover:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-300",
    badge: "bg-purple-100/80 text-purple-700 dark:bg-purple-900/80 dark:text-purple-300 border border-purple-200/30 dark:border-purple-700/30",
    iconBg: "bg-linear-to-br from-purple-400 to-indigo-500",
    shadow: "shadow-2xl hover:shadow-purple-500/20",
  },
  blue: {
    border: "border-blue-200/50 dark:border-blue-800/50",
    bg: "bg-white/40 dark:bg-zinc-900/40",
    gradient: "from-blue-500/5 to-transparent",
    hover: "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-300",
    badge: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/80 dark:text-blue-300 border border-blue-200/30 dark:border-blue-700/30",
    iconBg: "bg-linear-to-br from-blue-400 to-sky-500",
    shadow: "shadow-2xl hover:shadow-blue-500/20",
  },
  orange: {
    border: "border-orange-200/50 dark:border-orange-800/50",
    bg: "bg-white/40 dark:bg-zinc-900/40",
    gradient: "from-orange-500/5 to-transparent",
    hover: "hover:bg-orange-50/50 dark:hover:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-300",
    badge: "bg-orange-100/80 text-orange-700 dark:bg-orange-900/80 dark:text-orange-300 border border-orange-200/30 dark:border-orange-700/30",
    iconBg: "bg-linear-to-br from-orange-400 to-amber-500",
    shadow: "shadow-2xl hover:shadow-orange-500/20",
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
      className={`group relative flex flex-col gap-4 rounded-[2.5rem] border ${colors.border} ${colors.bg} ${colors.hover} ${colors.shadow} backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-600 p-7 transition-all duration-500 hover:-translate-y-2`}
    >
      {/* Background radial glow */}
      <div className={`absolute top-0 right-0 h-32 w-32 bg-radial ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

      <div className="flex items-start justify-between">
        <div
          aria-hidden="true"
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.iconBg} text-white shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="rounded-full bg-zinc-100/50 dark:bg-zinc-700/50 p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
          <ExternalLink
            aria-hidden="true"
            className="h-4 w-4 text-zinc-500 dark:text-zinc-300"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black tracking-tight text-zinc-800 dark:text-white text-balance group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className={`text-sm font-black tracking-wide uppercase ${colors.text}`}>{subtitle}</p>
      </div>

      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
        {description}
      </p>

      <ul role="list" className="flex flex-wrap gap-2 mt-auto pt-2 list-none">
        {features.map((feature) => (
          <li
            key={feature}
            className={`rounded-lg px-3 py-1 text-[10px] uppercase tracking-widest font-black ${colors.badge}`}
          >
            {feature}
          </li>
        ))}
      </ul>
    </a>
  );
}
