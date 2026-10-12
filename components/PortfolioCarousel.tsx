"use client";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import type { PortfolioItem } from "@/types/portfolio";

type PortfolioCarouselProps = {
  items: PortfolioItem[];
  carouselId: string;
  itemTypeLabel: string;
};

export default function PortfolioCarousel({
  items,
  carouselId,
  itemTypeLabel,
}: PortfolioCarouselProps) {
  const totalItems = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const paused = isHovered || isManuallyPaused;
  const isDetailsOpen = expandedIndex === activeIndex;
  const resumeTimeoutRef = useRef<number | null>(null);

  const getRelativePosition = useCallback((index: number) => {
    let difference = index - activeIndex;
    if (difference > totalItems / 2) difference -= totalItems;
    if (difference < -totalItems / 2) difference += totalItems;
    return difference;
  }, [activeIndex, totalItems]);

  const scheduleResume = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null;
      setIsManuallyPaused(false);
    }, 5000);
  }, []);

  const selectCard = useCallback((index: number) => {
    setExpandedIndex(null);
    setActiveIndex(index);
    setIsManuallyPaused(true);
    scheduleResume();
  }, [scheduleResume]);

  const advance = useCallback(() => {
    setExpandedIndex(null);
    setActiveIndex((current) => (current + 1) % totalItems);
  }, [totalItems]);

  const next = useCallback(() => {
    setExpandedIndex(null);
    setActiveIndex((current) => (current + 1) % totalItems);
    setIsManuallyPaused(true);
    scheduleResume();
  }, [scheduleResume, totalItems]);

  const previous = useCallback(() => {
    setExpandedIndex(null);
    setActiveIndex((current) => (current - 1 + totalItems) % totalItems);
    setIsManuallyPaused(true);
    scheduleResume();
  }, [scheduleResume, totalItems]);

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(advance, 6000);
    return () => window.clearInterval(interval);
  }, [advance, paused]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
        <div
          className="
            relative
            min-h-[500px]
            w-full
          "
          style={{
            "--carousel-step":
              "clamp(245px, 32vw, 540px)",
          } as CSSProperties}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setIsManuallyPaused(true);
            scheduleResume();
          }}
        >
          <div
            className="
              relative
              min-h-[500px]
              flex
              items-center
              justify-center
            "
            style={{
              perspective: "1800px",
            }}
          >
            {items.map(
              (item, index) => {
                const detailsId = item.detailsId ?? carouselId + "-item-" + item.number + "-details";

                const relative =
                  getRelativePosition(
                    index,
                  );

                const isActive =
                  relative === 0;

                const distance =
                  Math.abs(relative);

                /*
                 * Keep only the five nearest
                 * cards in the visual carousel.
                 */
                if (distance > 2) {
                  return null;
                }

                /* =================================================
                   CENTER CARD
                   ================================================= */

                if (isActive) {
                  return (
                    <article
                      key={item.number}
                      className="
                        relative
                        z-50
                        w-[min(92vw,780px)]
                      "
                      aria-label={
                        item.title
                          ? item.title + " " + (item.kind === "App" ? "application" : item.kind === "Web" ? "website" : "game") + " details"
                          : (item.kind ?? "Game") + " " + item.number + ", coming soon"
                      }
                    >
                      <div
                        className={`
                          portfolio-game-opening
                          rounded-[2rem]
                          bg-gradient-to-br
                          ${item.gradient}
                          p-[1px]
                          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                        `}
                      >
                        {item.title ? (
                          <div className="portfolio-game-content-reveal relative overflow-hidden rounded-[2rem] bg-[#111225] p-5 sm:p-8">
                            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#3B4895]/20 blur-[100px]" />
                            <div className="pointer-events-none absolute -bottom-32 -left-28 h-72 w-72 rounded-full bg-[#DE8A61]/10 blur-[100px]" />

                            <div className="relative grid items-center gap-4 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#3B4895]/25 via-[#17182f] to-[#DE8A61]/15 p-5 sm:grid-cols-[1fr_auto] sm:p-7">
                              <div className="relative z-10">
                                <div className="mb-6 flex flex-wrap items-center gap-3">
                                  <span className="font-[var(--font-rajdhani)] text-[10px]  tracking-[0.24em] text-white/55">
                                    {item.kind ?? "Game"} {item.number}
                                  </span>
                                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F0CA77]/10 px-3 py-1.5 font-[var(--font-rajdhani)] text-[10px]  tracking-[0.16em] text-[#F0CA77]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#F0CA77] shadow-[0_0_10px_#F0CA77]" />
                                    {item.availability}
                                  </span>
                                </div>

                                {item.category && (
                                  <p className="mb-3 font-[var(--font-rajdhani)] text-xs font-semibold tracking-[0.2em] text-white/55">
                                    {item.category}
                                  </p>
                                )}

                                <h3 className="font-ethnocentric text-3xl font-normal  leading-tight tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
                                  {item.title}
                                </h3>
                                {item.tagline && (
                                  <p className="mt-3 font-[var(--font-rajdhani)] text-lg font-semibold  tracking-[0.2em] text-[#F0CA77] sm:text-xl">
                                  {item.tagline}
                                  </p>
                                )}
                              </div>

                              {item.image && (
                                <div className="relative mx-auto h-44 w-44 sm:h-56 sm:w-56">
                                  <Image
                                    src={item.image}
                                    alt="Cosmic Dodge character artwork"
                                    width={300}
                                    height={300}
                                    sizes="(min-width: 768px) 224px, 176px"
                                    className="h-full w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]"
                                  />
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              aria-expanded={isDetailsOpen}
                              aria-controls={detailsId}
                              onClick={(event) => {
                                event.stopPropagation();
                                const shouldOpen = !isDetailsOpen;
                                setExpandedIndex(
                                  shouldOpen ? index : null,
                                );
                                setIsManuallyPaused(shouldOpen);
                                if (resumeTimeoutRef.current !== null) {
                                  window.clearTimeout(
                                    resumeTimeoutRef.current,
                                  );
                                  resumeTimeoutRef.current = null;
                                }
                              }}
                              className="mt-6 flex min-h-12 w-full items-center justify-between rounded-xl border border-[#F0CA77]/25 bg-[#F0CA77]/[0.045] px-4 text-left transition-colors duration-300 hover:border-[#F0CA77]/55 hover:bg-[#F0CA77]/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0CA77]/70"
                            >
                              <span className="font-[var(--font-rajdhani)] text-xs font-semibold  tracking-[0.22em] text-[#F0CA77]">
                                {isDetailsOpen ? "Show less" : "Show more"}
                              </span>
                              <ChevronDown
                                size={17}
                                aria-hidden="true"
                                className={`text-[#F0CA77] transition-transform duration-300 motion-reduce:transition-none ${
                                  isDetailsOpen
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                              />
                            </button>

                            <div
                              id={detailsId}
                              aria-hidden={!isDetailsOpen}
                              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                                isDetailsOpen
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              style={{
                                gridTemplateRows: isDetailsOpen
                                  ? "1fr"
                                  : "0fr",
                              }}
                            >
                              <div className="min-h-0 overflow-hidden">
                                <div
                                  className={`transform pt-7 transition duration-500 motion-reduce:transition-none ${
                                    isDetailsOpen
                                      ? "translate-y-0"
                                      : "-translate-y-2"
                                  }`}
                                >
                            <section className="relative">
                              <h4 className="mb-3 font-[var(--font-rajdhani)] text-xs font-semibold  tracking-[0.26em] text-[#DE8A61]">
                                Description
                              </h4>
                              <div className="space-y-4 text-sm leading-relaxed text-[#D8D3E1] sm:text-base">
                                {item.description.map((paragraph) => (
                                  <p key={paragraph}>{paragraph}</p>
                                ))}
                              </div>
                            </section>

                            {item.features.length > 0 && (
<section className="relative mt-8">
                              <div className="mb-4 flex items-end justify-between gap-4">
                                <div>
                                  <p className="font-[var(--font-rajdhani)] text-[10px]  tracking-[0.28em] text-[#DE8A61]">
                                    What awaits
                                  </p>
                                  <h4 className="mt-1 font-ethnocentric text-lg font-normal  tracking-[0.02em] text-white sm:text-xl">
                                    Features
                                  </h4>
                                </div>
                                <item.icon className="mb-1 text-white/25" size={22} aria-hidden="true" />
                              </div>

                              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                                {item.features.map((feature) => (
                                  <li key={feature.title} className="flex items-start gap-3">
                                    <span className="mt-0.5 text-lg" aria-hidden="true">
                                      {feature.icon}
                                    </span>
                                    <p className="text-sm leading-relaxed text-white/55">
                                      <strong className="font-semibold text-white/90">
                                        {feature.title}
                                      </strong>{" "}
                                      <span>&mdash; {feature.description}</span>
                                    </p>
                                  </li>
                                ))}
                              </ul>
                              </section>
                            )}

                            {item.genre ? (
<div className="relative mt-8">
  <section className="relative overflow-hidden rounded-2xl border border-[#F0CA77]/15 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:p-5">
    
    {/* Genre */}
    <div className="mb-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#DE8A61]/35 bg-[#DE8A61]/10 font-[var(--font-rajdhani)] text-[10px] text-[#DE8A61]">
          01
        </span>

        <div>
          <p className="font-[var(--font-rajdhani)] text-[9px] tracking-[0.2em] text-white/35">
            Game data
          </p>

          <h4 className="font-[var(--font-rajdhani)] text-xs font-semibold tracking-[0.2em] text-white/80">
            Genre
          </h4>
        </div>

        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F0CA77] shadow-[0_0_10px_#F0CA77]" />
      </div>

      <p className="font-ethnocentric text-lg font-normal text-[#F0CA77]">
        {item.genre}
      </p>
    </div>

    {/* Divider */}
    <div className="mb-6 h-px bg-white/[0.06]" />

    {/* Secondary Genre */}
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3B4895]/50 bg-[#3B4895]/20 font-[var(--font-rajdhani)] text-[10px] text-[#A9B2FF]">
          02
        </span>

        <div>
          <p className="font-[var(--font-rajdhani)] text-[9px] tracking-[0.2em] text-white/35">
            Gameplay tags
          </p>

          <h4 className="font-[var(--font-rajdhani)] text-xs font-semibold tracking-[0.2em] text-white/80">
            Secondary
          </h4>
        </div>

        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3B4895] shadow-[0_0_10px_#3B4895]" />
      </div>

      <div className="flex flex-wrap gap-2">
        {item.secondaryGenres.map((genre) => (
          <span
            key={genre}
            className="rounded-full bg-[#3B4895]/15 px-3 py-1.5 font-[var(--font-rajdhani)] text-[10px] tracking-[0.12em] text-white/75"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>

  </section>
</div>
                            
) : item.builtWith?.length ? (
<div className="relative mt-8">
  <section className="relative overflow-hidden rounded-2xl border border-[#F0CA77]/15 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:p-5">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#DE8A61]/35 bg-[#DE8A61]/10 font-[var(--font-rajdhani)] text-[10px] text-[#DE8A61]">01</span>
      <div>
        <p className="font-[var(--font-rajdhani)] text-[9px] tracking-[0.2em] text-white/35">App details</p>
        <h4 className="font-[var(--font-rajdhani)] text-xs font-semibold tracking-[0.2em] text-white/80">Built with</h4>
      </div>
      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F0CA77] shadow-[0_0_10px_#F0CA77]" />
    </div>
    <div className="flex flex-wrap gap-2">
      {item.builtWith?.map((technology) => (
        <span key={technology} className="rounded-full bg-[#3B4895]/15 px-3 py-1.5 font-[var(--font-rajdhani)] text-[10px] tracking-[0.12em] text-white/75">
          {technology}
        </span>
      ))}
    </div>
  </section>
</div>
) : null}{item.closing && (
  <div className="relative mt-8 space-y-2 text-center">
    <p className="font-[var(--font-rajdhani)] text-lg font-semibold text-[#F0CA77] sm:text-xl">{item.closing.prompt}</p>
    <p className="font-[var(--font-rajdhani)] text-sm tracking-[0.12em] text-white/60 sm:text-base">{item.closing.subline}</p>
    <p className="pt-3 font-ethnocentric text-xs font-normal tracking-[0.18em] text-white/75 sm:text-sm">{item.closing.brand}</p>
    <p className="font-[var(--font-rajdhani)] text-sm font-semibold tracking-[0.18em] text-[#DE8A61]">{item.closing.tagline}</p>
  </div>
)}
                                </div>
                              </div>
                            </div>
                            {item.platforms?.length ? (
                              <div className="mt-5 flex justify-start border-t border-white/[0.06] pt-4">
                                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-[var(--font-rajdhani)] text-[10px] tracking-[0.16em] text-white/70">
                                  Platforms: {item.platforms.join(", ")}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="portfolio-game-content-reveal relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#111225] p-8 text-center sm:min-h-[400px]">
                            <div className="pointer-events-none absolute h-64 w-64 rounded-full border border-[#F0CA77]/10" />
                            <div className="pointer-events-none absolute h-48 w-48 rounded-full border border-[#DE8A61]/15" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B4895] to-[#DE8A61] shadow-[0_0_50px_rgba(59,72,149,0.3)]">
                              <item.icon size={28} className="text-[#15162D]" aria-hidden="true" />
                            </div>
                            <p className="relative mt-3 font-ethnocentric text-xl font-normal  tracking-[0.04em] text-[#F0CA77] sm:text-2xl">
                              {item.availability}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                }

                /* =================================================
                   SIDE CARDS
                   ================================================= */

                const sideDirection =
                  relative < 0
                    ? -1
                    : 1;

                const horizontalOffset =
                  distance === 1
                    ? "var(--carousel-step)"
                    : "clamp(410px, 55vw, 880px)";

                const translateX =
                  sideDirection < 0
                    ? `calc(-50% - ${horizontalOffset})`
                    : `calc(-50% + ${horizontalOffset})`;

                const scale =
                  distance === 1
                    ? 0.78
                    : 0.62;

                const rotate =
                  sideDirection *
                  (distance === 1
                    ? 7
                    : 12);

                const opacity =
                  distance === 1
                    ? 0.72
                    : 0.35;

                return (
                  <div
                    key={item.number}
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      w-[min(76vw,440px)]
                    "
                    style={{
                      zIndex:
                        30 - distance,

                      transform: `
                        translateX(${translateX})
                        translateY(-50%)
                        scale(${scale})
                        rotateY(${rotate}deg)
                      `,

                      opacity,

                      pointerEvents:
                        "auto",

                      transition:
                        "transform 650ms cubic-bezier(0.2,0.8,0.2,1), opacity 450ms ease",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        selectCard(index)
                      }
                      aria-label={`Select ${item.title || `game ${item.number}`}`}
                      className="
                        group
                        block
                        w-full
                        cursor-pointer
                        text-left
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#F0CA77]/70
                        focus-visible:ring-offset-4
                        focus-visible:ring-offset-[#15162D]
                      "
                    >
                      <div
                        className={`
                          rounded-[2rem]
                          bg-gradient-to-br
                          ${item.gradient}
                          p-[1px]
                          shadow-2xl
                          transition-all
                          duration-500
                          group-hover:scale-[1.03]
                          group-hover:opacity-100
                          group-focus-visible:scale-[1.03]
                        `}
                      >
                        <div
                          className="
                            relative
                            min-h-[330px]
                            overflow-hidden
                            rounded-[2rem]
                            bg-[#111225]
                            p-7
                          "
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />

                          <div
                            className="
                              relative
                              flex
                              items-start
                              justify-between
                            "
                          >
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}>
                              <item.icon size={20} className="text-[#15162D]" />
                            </div>
                          </div>

                          <div className="relative mt-12">
                            {item.title && (
                              <h3
                                className="
                                  font-ethnocentric
                                  text-2xl
                                  font-normal

                                  tracking-[-0.04em]
                                  text-white/90
                                "
                              >
                                {item.title}
                              </h3>
                            )}

                            <p className="mt-5 font-[var(--font-rajdhani)] text-[10px]  tracking-[0.2em] text-[#F0CA77]/70">
                              {item.availability}
                            </p>

                            <div
                              className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                font-[var(--font-rajdhani)]
                                text-[10px]
                                font-normal

                                tracking-[0.2em]
                                text-white/30
                                transition-colors
                                duration-300
                                group-hover:text-[#F0CA77]
                              "
                            >
                              Click to focus

                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* =================================================
            CONTROLS
            ================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            items-center
            justify-center
            gap-5
            sm:mt-8
            sm:flex-row
          "
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label={itemTypeLabel === "game" ? "Previous portfolio item" : "Previous service item"}
              className="
                flex
                h-11
                w-11
                cursor-pointer
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white/55
                transition-all
                duration-300
                hover:border-[#F0CA77]/40
                hover:bg-[#F0CA77]/10
                hover:text-[#F0CA77]
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2 px-2">
              {items.map(
                (item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() =>
                      selectCard(index)
                    }
                    aria-label={"Go to " + itemTypeLabel + " " + item.number + (item.title ? ": " + item.title : " (coming soon)")}
                    aria-current={
                      index === activeIndex
                        ? "true"
                        : undefined
                    }
                    className={`
                      h-1.5
                      cursor-pointer
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        index === activeIndex
                          ? "w-8 bg-[#F0CA77]"
                          : "w-1.5 bg-white/20 hover:bg-white/50"
                      }
                    `}
                  />
                ),
              )}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label={itemTypeLabel === "game" ? "Next portfolio item" : "Next service item"}
              className="
                flex
                h-11
                w-11
                cursor-pointer
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white/55
                transition-all
                duration-300
                hover:border-[#F0CA77]/40
                hover:bg-[#F0CA77]/10
                hover:text-[#F0CA77]
              "
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <p
            className="
              font-[var(--font-rajdhani)]
              text-[10px]
              font-normal

              tracking-[0.25em]
              text-white/25
            "
          >
            Click any card to focus
          </p>
        </div>
    </>
  );
}
