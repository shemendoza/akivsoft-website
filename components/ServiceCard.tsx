import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  accent: "blue" | "purple" | "cyan" | "pink";
};

const accentClasses = {
  blue: "text-[#9AA8FF]",
  purple: "text-[#C59DD3]",
  cyan: "text-[#DE8A61]",
  pink: "text-[#E39AAE]",
};

export default function ServiceCard({
  number,
  title,
  description,
  tags,
  icon: Icon,
  accent,
}: ServiceCardProps) {
  return (
    <article className="group relative grid gap-5 py-7 transition-colors duration-500 sm:py-8 md:grid-cols-[84px_minmax(220px,0.9fr)_1.5fr_56px] md:items-center md:gap-6 lg:grid-cols-[100px_minmax(260px,0.9fr)_1.5fr_64px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#DE8A61]/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center gap-3 md:flex-col md:items-start md:gap-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-[#F0CA77] sm:text-xs">
          {number}
        </span>

        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#111225]/75 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/[0.06] ${accentClasses[accent]}`}>
          <Icon size={18} strokeWidth={1.7} />
        </div>
      </div>

      <h3 className="relative font-ethnocentric text-lg font-normal uppercase leading-snug tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-[#F0CA77] sm:text-xl lg:text-2xl">
        {title}
      </h3>

      <div className="relative">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="tech-label rounded-full px-3 py-1 text-[10px] sm:text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={`relative hidden h-11 w-11 items-center justify-center rounded-full bg-white/[0.02] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-white/[0.05] md:flex ${accentClasses[accent]}`}>
        <ArrowUpRight size={18} />
      </div>
    </article>
  );
}
