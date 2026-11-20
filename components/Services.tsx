
import {
  Activity,
  ArrowUpRight,
  Blocks,
  Box,
  Braces,
  Bug,
  Camera,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Fingerprint,
  Gamepad2,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  Image,
  Joystick,
  Laptop,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Monitor,
  MousePointer2,
  Music,
  Network,
  Palette,
  PenTool,
  Puzzle,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
  Video,
  Wifi,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ServiceCard from "./ServiceCard";
import {
  getPublicServices,
  getPublicServiceContentBlocks,
} from "@/lib/services";
import type { PublicServiceContentBlock } from "@/lib/services";
import type { ServiceIconName } from "@/types/services";

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  Gamepad2,
  Lightbulb,
  Gauge,
  Rocket,
  Smartphone,
  Globe,
  Sparkles,
  Code2,
  Braces,
  Terminal,
  Monitor,
  Laptop,
  Layers,
  Palette,
  PenTool,
  Activity,
  Blocks,
  Box,
  Bug,
  Cloud,
  Cpu,
  Database,
  FileCode2,
  Fingerprint,
  GitBranch,
  HardDrive,
  Joystick,
  LayoutDashboard,
  MousePointer2,
  Network,
  Puzzle,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Target,
  Workflow,
  Wrench,
  Zap,
  Camera,
  Image,
  Music,
  Video,
  Wifi,
  Server,
  Lock,
};

const listAccents = [
  "text-[#F0B191]",
  "text-[#F0CA77]",
  "text-[#C59DD3]",
  "text-[#9AA8FF]",
];

function ContentBlockHeading({
  heading,
  gradientText,
}: {
  heading: string;
  gradientText: string | null;
}) {
  const phrase = gradientText?.trim();

  if (!phrase) {
    return <>{heading}</>;
  }

  const startIndex = heading.indexOf(phrase);

  if (startIndex === -1) {
    return <>{heading}</>;
  }

  const endIndex = startIndex + phrase.length;

  return (
    <>
      {heading.slice(0, startIndex)}
      <span className="gradient-text">{phrase}</span>
      {heading.slice(endIndex)}
    </>
  );
}

function ListContentBlock({
  block,
}: {
  block: PublicServiceContentBlock;
}) {
  const items = block.items.filter(
    (item): item is string => typeof item === "string"
  );

  const cardOnLeft = block.layout_position === "left";

  return (
    <div
      className={`grid gap-10 sm:gap-12 xl:items-center ${
        cardOnLeft
          ? "xl:grid-cols-[1.15fr_0.85fr]"
          : "xl:grid-cols-[0.85fr_1.15fr]"
      }`}
    >
      <div
        className={
          cardOnLeft
            ? "relative order-2"
            : "relative order-1"
        }
      >
        {block.eyebrow && (
          <div className="mb-5 flex items-center gap-3">
            <span className="pixel-dot" />

            <p className="text-xs font-normal tracking-[0.3em] text-[#F0CA77] sm:text-sm">
              {block.eyebrow}
            </p>
          </div>
        )}

        <h3 className="section-title">
          <ContentBlockHeading
            heading={block.heading}
            gradientText={block.gradient_text}
          />
        </h3>

        {block.description && (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
            {block.description}
          </p>
        )}
      </div>

      <div
        className={
          cardOnLeft
            ? "relative order-1"
            : "relative order-2"
        }
      >
        <div className="artsy-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3B4895]/20 blur-2xl sm:blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-[25%] h-48 w-48 rounded-full bg-[#DE8A61]/10 blur-2xl sm:blur-3xl" />

          <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />

          <div className="relative">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h4 className="font-mono text-[10px] font-normal tracking-[0.2em] text-white/55 sm:text-xs">
                {block.items_heading || block.heading}
              </h4>

              <Gamepad2
                size={19}
                className="shrink-0 text-[#DE8A61]/80"
              />
            </div>

            {items.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {items.map((item, index) => (
                  <span
                    key={`${block.id}-${index}`}
                    className={`rounded-full px-4 py-2 font-[var(--font-rajdhani)] text-xs font-normal tracking-[0.14em] sm:text-sm ${listAccents[index % listAccents.length]}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureContentBlock({
  block,
}: {
  block: PublicServiceContentBlock;
}) {
  const items = block.items.filter(
    (
      item
    ): item is { title: string; description: string } =>
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      "description" in item
  );

  const cardOnLeft = block.layout_position === "left";

  return (
    <div
      className={`grid gap-10 sm:gap-12 xl:items-center ${
        cardOnLeft
          ? "xl:grid-cols-[1.15fr_0.85fr]"
          : "xl:grid-cols-[0.85fr_1.15fr]"
      }`}
    >
      <div
        className={
          cardOnLeft
            ? "relative order-2 xl:order-1"
            : "relative order-1 xl:order-2"
        }
      >
        <div className="artsy-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#71527B]/20 blur-2xl sm:blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 right-[20%] h-48 w-48 rounded-full bg-[#F0CA77]/10 blur-2xl sm:blur-3xl" />

          <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />

          <div className="relative">
            <div className="mb-7 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] font-normal tracking-[0.2em] text-white/45">
                {block.eyebrow || block.heading}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <Smartphone
                  size={17}
                  className="text-[#3B4895]/90"
                />

                <Globe
                  size={17}
                  className="text-[#DE8A61]/90"
                />
              </div>
            </div>

            {items.length > 0 && (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {items.map((item, index) => {
                  const FeatureIcon =
                    index % 2 === 0 ? Smartphone : Globe;

                  return (
                    <div
                      key={`${block.id}-${index}`}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                    >
                      <FeatureIcon
                        size={22}
                        className="mb-4 text-[#F0CA77]"
                      />

                      <h4 className="font-[var(--font-rajdhani)] text-lg text-white">
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-[#C5BFD0]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={
          cardOnLeft
            ? "order-1 xl:order-2"
            : "order-2 xl:order-1"
        }
      >
        {block.eyebrow && (
          <div className="mb-5 flex items-center gap-3">
            <span className="pixel-dot" />

            <p className="text-xs font-normal tracking-[0.3em] text-[#F0CA77] sm:text-sm">
              {block.eyebrow}
            </p>
          </div>
        )}

        <h3 className="section-title">
          <ContentBlockHeading
            heading={block.heading}
            gradientText={block.gradient_text}
          />
        </h3>

        {block.description && (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
            {block.description}
          </p>
        )}
      </div>
    </div>
  );
}

function ServiceSectionContentBlocks({
  blocks,
}: {
  blocks: PublicServiceContentBlock[];
}) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="mt-14 space-y-14 sm:mt-20 sm:space-y-20">
      {blocks.map((block) => (
        <div key={block.id} className="relative">
          {block.block_type === "list" ? (
            <ListContentBlock block={block} />
          ) : (
            <FeatureContentBlock block={block} />
          )}
        </div>
      ))}
    </div>
  );
}

export default async function Services() {
  const [serviceSections, contentBlocks] = await Promise.all([
    getPublicServices(),
    getPublicServiceContentBlocks(),
  ]);

  const primarySection = serviceSections[0];
  const additionalSections = serviceSections.slice(1);

  function getSectionContentBlocks(sectionId: string) {
    return contentBlocks.filter(
      (block) => block.service_section_id === sectionId
    );
  }

  return (
    <section
      id="services"
      className="artsy-background relative overflow-hidden py-20 sm:py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="art-grid absolute inset-0" />
        <div className="noise absolute inset-0" />
      </div>

      <div
        className="blob blob-blue pointer-events-none absolute -right-72 top-[-8rem] h-[40rem] w-[40rem] opacity-30"
        aria-hidden="true"
      />
      <div
        className="blob blob-purple pointer-events-none absolute -left-72 top-[30%] h-[38rem] w-[38rem] opacity-30"
        aria-hidden="true"
      />
      <div
        className="blob blob-orange pointer-events-none absolute right-[15%] bottom-[-12rem] h-[34rem] w-[34rem] opacity-25"
        aria-hidden="true"
      />
      <div
        className="blob blob-gold pointer-events-none absolute left-[45%] top-[12%] h-40 w-40 opacity-20"
        aria-hidden="true"
      />
      <div
        className="blob blob-pink pointer-events-none absolute right-[35%] top-[45%] h-48 w-48 opacity-15"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="pixel-dot absolute left-[10%] top-[18%]" />
        <div className="pixel-dot absolute right-[12%] top-[28%]" />
        <div className="pixel-dot absolute left-[38%] bottom-[18%]" />
        <div className="pixel-dot absolute right-[30%] bottom-[30%]" />
      </div>

      <div className="section-container relative z-10">
        <header className="mb-10 grid min-h-[45vh] content-center gap-8 sm:mb-14 sm:min-h-[65vh] xl:mb-20 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Gamepad2 size={17} className="text-[#DE8A61]" />

              <p className="text-xs font-normal tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                Game Development & Digital Solutions
              </p>
            </div>

            <h2 className="section-title">
              We build games
              <br />
              <span className="gradient-text">
                and bring ideas to life.
              </span>
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-base leading-relaxed text-[#C5BFD0] sm:text-lg md:text-xl">
              At <span className="font-normal text-white">Akivsoft</span>,
              we bring game ideas to life through creative design,
              gameplay development, optimization, and launch. Beyond
              games, we also create websites, applications, and other
              digital experiences tailored to each project&apos;s needs.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[9px] font-normal tracking-[0.18em] text-white/35 sm:text-[10px]">
              <span>Concept</span>
              <span className="pixel-dot" />
              <span>Design</span>
              <span className="pixel-dot" />
              <span>Develop</span>
              <span className="pixel-dot" />
              <span>Launch</span>

              <Sparkles
                size={13}
                className="ml-1 text-[#F0CA77]/70"
              />
            </div>
          </div>
        </header>

        {/* Primary service section */}
        {primarySection && (
          <div className="relative">
            <div className="flex items-center justify-between gap-4 py-4">
              <p className="font-[var(--font-rajdhani)] text-xs font-normal tracking-[0.25em] text-white/55 sm:text-sm">
                {primarySection.title}
              </p>

              <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.16em] text-[#F0CA77]/45 sm:text-[10px]">
                {primarySection.services.length} services
              </span>
            </div>

            {primarySection.services.map((service) => (
              <div key={service.id}>
                <ServiceCard
                  {...service}
                  icon={serviceIcons[service.icon]}
                />
              </div>
            ))}

            <ServiceSectionContentBlocks
              blocks={getSectionContentBlocks(primarySection.id)}
            />
          </div>
        )}

        {/* Divider */}
        <div className="my-14 sm:my-28">
          <div className="h-px w-full bg-white/10" />
        </div>

        {/* Additional service sections */}
        {additionalSections.map((section) => (
          <div
            key={section.id}
            className="relative mt-14 sm:mt-28"
          >
            <div className="flex items-center justify-between gap-4 py-4">
              <p className="font-[var(--font-rajdhani)] text-xs font-normal tracking-[0.25em] text-white/55 sm:text-sm">
                {section.title}
              </p>

              <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.16em] text-[#F0CA77]/45 sm:text-[10px]">
                {section.services.length} services
              </span>
            </div>

            {section.services.map((service) => (
              <div key={service.id}>
                <ServiceCard
                  {...service}
                  icon={serviceIcons[service.icon]}
                />
              </div>
            ))}

            <ServiceSectionContentBlocks
              blocks={getSectionContentBlocks(section.id)}
            />
          </div>
        ))}

        {/* Contact CTA */}
        <div className="artsy-card relative mt-14 overflow-hidden p-7 sm:mt-20 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#71527B]/20 blur-2xl sm:blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-[35%] h-64 w-64 rounded-full bg-[#DE8A61]/15 blur-2xl sm:blur-3xl" />

          <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />

          <Gamepad2
            className="pointer-events-none absolute -right-4 -top-5 h-32 w-32 rotate-[-12deg] text-white/[0.035] sm:right-10 sm:top-4 sm:h-48 sm:w-48"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 font-mono text-[10px] font-normal tracking-[0.2em] text-[#F0CA77]">
                <Sparkles size={14} />
                Planning the next build
              </div>

              <h3 className="section-title">
                Have an idea in mind?
                <br />
                <span className="gradient-text">
                  Let&apos;s build it together.
                </span>
              </h3>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
                Whether you&apos;re planning a game, application, website, or
                another digital experience, bring us your idea and let&apos;s
                find the right way to turn it into something real.
              </p>
            </div>

            <a
              href="#contact"
              className="artsy-button group w-fit shrink-0"
            >
              <span>Let’s Create</span>

              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
