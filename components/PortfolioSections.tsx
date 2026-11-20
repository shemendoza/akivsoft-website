
"use client";

import { Gamepad2, Globe, Smartphone } from "lucide-react";
import type { ElementType } from "react";

import PortfolioCarousel from "@/components/PortfolioCarousel";

import type {
  PortfolioCategoryRecord,
  PortfolioItem,
  PortfolioProjectContent,
  PortfolioProjectDetailRecord,
  PortfolioProjectRecord,
} from "@/types/portfolio";

type PortfolioSectionsProps = {
  categories: PortfolioCategoryRecord[];
  projects: PortfolioProjectRecord[];
  details: PortfolioProjectDetailRecord[];
};

const iconMap: Record<string, ElementType> = {
  Gamepad2,
  Globe,
  Smartphone,
};

const DEFAULT_GRADIENT = "from-[#3B4895] to-[#DE8A61]";

export default function PortfolioSections({
  categories,
  projects,
  details,
}: PortfolioSectionsProps) {
  const detailsMap = new Map(
    details.map((detail) => [detail.project_id, detail.content])
  );

  return (
    <>
      {categories.map((category, categoryIndex) => {
        const categoryProjects = projects.filter(
          (project) => project.category_id === category.id
        );

        const items: PortfolioItem[] = categoryProjects.map(
          (project, projectIndex) => {
            const content: PortfolioProjectContent =
              detailsMap.get(project.id) ?? {};

            const Icon = iconMap[content.icon ?? "Gamepad2"] ?? Gamepad2;

            return {
              id: project.id,
              slug: project.slug,
              number:
                project.project_number ??
                String(projectIndex + 1).padStart(2, "0"),
              kind: content.kind,
              category: content.category ?? category.name,
              title: project.title,
              image: project.image_url ?? undefined,
              tagline: content.tagline ?? "",
              description:
                content.description?.length
                  ? content.description
                  : [project.short_description].filter(Boolean),
              features: content.features ?? [],
              genre: content.genre ?? "",
              secondaryGenres: content.secondaryGenres ?? [],
              platforms: content.platforms,
              builtWith: content.builtWith,
              availability: content.availability ?? "Coming soon",
              icon: Icon,
              gradient: content.gradient ?? DEFAULT_GRADIENT,
              detailsId: `${project.slug}-details`,
              closing: content.closing,
            };
          }
        );

        return (
          <div key={category.id}>
            {categoryIndex > 0 && (
              <div className="my-14 sm:my-24 lg:my-28">
                <div className="h-px w-full bg-white/10" />
              </div>
            )}

            <div className={categoryIndex === 0 ? "mt-14 sm:mt-24" : ""}>
              <div className="mb-8 flex items-center gap-3">
                <span className="pixel-dot" />

                <h3
  className={`font-ethnocentric text-xl font-normal tracking-[0.02em] text-[#F0CA77] ${
    categoryIndex === 0 ? "sm:text-4xl" : "sm:text-3xl"
  }`}
>
                  {category.section_title}
                </h3>
              </div>
            </div>

            <div>
              <p className="text-sm leading-relaxed text-[#C5BFD0] sm:text-lg md:text-xl">
                {category.section_description}
              </p>
            </div>

            {items.length > 0 && (
              <div className="mt-10 sm:mt-14">
                <PortfolioCarousel
                  items={items}
                  carouselId={category.slug}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
