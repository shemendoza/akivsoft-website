"use client";

import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type PortfolioItem = {
  number: string;
  title: string;
  technologies: string[];
  icon: React.ElementType;
  gradient: string;
};

const portfolioItems: PortfolioItem[] = [
  {
    number: "01",
    title: "Game 01",
    technologies: [
      "Unity",
      "C#",
    ],
    icon: Gamepad2,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
  {
    number: "02",
    title: "Game 02",
    technologies: [
      "Unity",
      "C#",
    ],
    icon: Gamepad2,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
  {
    number: "03",
    title: "Game 03",
    technologies: [
      "Unity",
      "C#",
    ],
    icon: Gamepad2,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
];

export default function Portfolio() {
  const totalItems = portfolioItems.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] =
    useState(false);
  const [revealProgress, setRevealProgress] =
    useState(0);

  const paused =
    isHovered || isManuallyPaused;

  const portfolioRef =
    useRef<HTMLElement | null>(null);

  /*
   * Keep a timeout ref so clicking cards does not
   * create multiple competing timers.
   */
  const resumeTimeoutRef = useRef<number | null>(null);
  /* ========================================================
     SCROLL REVEAL
     ======================================================== */

  useEffect(() => {
    let ticking = false;

    const updateReveal = () => {
      const section = portfolioRef.current;

      if (!section) {
        ticking = false;
        return;
      }

      const rect =
        section.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const start =
        viewportHeight * 0.95;

      const end =
        viewportHeight * 0.25;

      const progress = Math.min(
        Math.max(
          (start - rect.top) /
            (start - end),
          0,
        ),
        1,
      );

      setRevealProgress(progress);

      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(
        updateReveal,
      );
    };

    updateReveal();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    window.addEventListener(
      "resize",
      handleScroll,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "resize",
        handleScroll,
      );
    };
  }, []);

  /* ========================================================
     CIRCULAR CARD POSITION
     ======================================================== */

  const getRelativePosition =
    useCallback(
      (index: number) => {
        let difference =
          index - activeIndex;

        if (
          difference >
          totalItems / 2
        ) {
          difference -= totalItems;
        }

        if (
          difference <
          -totalItems / 2
        ) {
          difference += totalItems;
        }

        return difference;
      },
      [activeIndex, totalItems],
    );

  /* ========================================================
     RESUME AUTO ROTATION
     ======================================================== */

  const scheduleResume = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(
        resumeTimeoutRef.current,
      );
    }

    resumeTimeoutRef.current =
      window.setTimeout(() => {
        resumeTimeoutRef.current = null;
        setIsManuallyPaused(false);
      }, 5000);
  }, []);

  /* ========================================================
     CARD SELECTION
     ======================================================== */

  const selectCard = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setIsManuallyPaused(true);

      scheduleResume();
    },
    [scheduleResume],
  );

  /* ========================================================
     NEXT / PREVIOUS
     ======================================================== */

  const advance = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current + 1) % totalItems,
    );
  }, [totalItems]);

  const next = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current + 1) % totalItems,
    );
    setIsManuallyPaused(true);
    scheduleResume();
  }, [scheduleResume, totalItems]);

  const previous = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current - 1 + totalItems) %
        totalItems,
    );
    setIsManuallyPaused(true);
    scheduleResume();
  }, [scheduleResume, totalItems]);

  /* ========================================================
     AUTO ROTATION
     ======================================================== */

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval =
      window.setInterval(() => {
        advance();
      }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [advance, paused]);

  /* ========================================================
     CLEANUP
     ======================================================== */

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(
          resumeTimeoutRef.current,
        );
        resumeTimeoutRef.current = null;
      }
    };
  }, []);

  /* ========================================================
     VISUAL VALUES
     ======================================================== */

  const contentOpacity =
    0.35 + revealProgress * 0.65;

  const contentTranslate =
    (1 - revealProgress) * 70;

  const atmosphereOpacity =
    0.35 + revealProgress * 0.65;

  return (
    <section
      ref={portfolioRef}
      id="portfolio"
      className="
        artsy-background
        relative
        overflow-hidden
        pt-0
        pb-24
        sm:pb-28
        lg:pb-32
      "
    >
      {/* =====================================================
          HERO → PORTFOLIO TRANSITION

          The Portfolio starts with the exact same dark
          background as the bottom of Hero.
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-[220px]
          left-0
          z-0
          h-[420px]
          w-full
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            left-1/2
            top-[35%]
            h-[260px]
            w-[75vw]
            -translate-x-1/2
            rounded-full
            bg-[#3B4895]/20
            blur-[110px]
          "
          style={{
            opacity:
              atmosphereOpacity,
          }}
        />

        <div
          className="
            absolute
            left-[12%]
            top-[30%]
            h-[180px]
            w-[30vw]
            rounded-full
            bg-[#71527B]/15
            blur-[100px]
          "
          style={{
            opacity:
              atmosphereOpacity,
          }}
        />

        <div
          className="
            absolute
            right-[8%]
            top-[35%]
            h-[160px]
            w-[25vw]
            rounded-full
            bg-[#3B4895]/10
            blur-[100px]
          "
          style={{
            opacity:
              atmosphereOpacity,
          }}
        />
      </div>

      {/* =====================================================
          PORTFOLIO ATMOSPHERE

          NO AUTUMN PARTICLES HERE.
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
        "
        aria-hidden="true"
      >
        <div className="art-grid absolute inset-0 opacity-25" />

        <div className="noise absolute inset-0" />

        <div
          className="
            blob
            blob-blue
            -right-40
            top-40
            h-[30rem]
            w-[30rem]
            opacity-15
            lg:h-[42rem]
            lg:w-[42rem]
          "
        />

        <div
          className="
            blob
            blob-purple
            -bottom-40
            -left-40
            h-[30rem]
            w-[30rem]
            opacity-15
            lg:h-[40rem]
            lg:w-[40rem]
          "
        />

        <div
          className="
            blob
            blob-orange
            left-[42%]
            top-[32%]
            h-72
            w-72
            opacity-10
          "
        />

        <div
          className="
            absolute
            right-[20%]
            top-[18%]
            h-48
            w-48
            rounded-full
            bg-[#F0CA77]/5
            blur-[100px]
          "
        />
      </div>

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-[1]
          h-[360px]
          bg-gradient-to-b
          from-[#15162D]
          via-[#15162D]/70
          to-transparent
        "
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <div
        className="
          section-container
          relative
          z-10
          w-full
        "
        style={{
          opacity: contentOpacity,
          transform: `translate3d(
            0,
            ${contentTranslate}px,
            0
          )`,
          transition:
            "opacity 120ms linear, transform 120ms linear",
        }}
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <div
          className="
            mb-12
            grid
            gap-8
            pt-20
            sm:mb-16
            sm:pt-24
            md:mb-16
            md:grid-cols-[1fr_2fr]
            md:items-center
            md:pt-36
            min-h-[65vh]
            content-center
            portfolio-intro
          "
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="pixel-dot" />

              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                Unity games
              </p>
            </div>

            <h2 className="section-title">
              Three games
              <br />
              <span className="gradient-text">
                coming soon.
              </span>
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-base leading-relaxed text-[#C5BFD0] sm:text-lg md:text-xl">
              Each project is exploring a different world and style of play.
            </p>
          </div>
        </div>

        {/* =================================================
            CAROUSEL
            ================================================= */}

        <div
          className="
            relative
            h-[510px]
            w-full
            sm:h-[540px]
            lg:h-[560px]
          "
          style={{
            "--carousel-step":
              "clamp(245px, 32vw, 540px)",
          } as React.CSSProperties}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
            style={{
              perspective: "1800px",
            }}
          >
            {portfolioItems.map(
              (item, index) => {
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
                    <div
                      key={item.number}
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        w-[min(88vw,520px)]
                        -translate-x-1/2
                        -translate-y-1/2
                      "
                      style={{
                        zIndex: 50,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          selectCard(index)
                        }
                        aria-label={`${item.title}, currently selected`}
                        aria-pressed="true"
                        className="
                          group
                          relative
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
                            relative
                            rounded-[2rem]
                            bg-gradient-to-br
                            ${item.gradient}
                            p-[1px]
                            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                            transition-transform
                            duration-500
                            group-hover:-translate-y-2
                            group-focus-visible:-translate-y-2
                          `}
                        >
                          <div
                            className="
                              relative
                              min-h-[410px]
                              overflow-hidden
                              rounded-[2rem]
                              bg-[#111225]
                              p-7
                              sm:p-9
                            "
                          >
                            <div
                              className={`
                                pointer-events-none
                                absolute
                                -right-20
                                -top-20
                                h-48
                                w-48
                                rounded-full
                                bg-gradient-to-br
                                ${item.gradient}
                                opacity-20
                                blur-3xl
                              `}
                            />

                            <div
                              className="
                                relative
                                mb-8
                                flex
                                items-start
                                justify-between
                              "
                            >
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                              >
                                <item.icon size={22} className="text-[#15162D]" />
                              </div>
                            </div>

                            <div className="relative">
                              <h3
                                className="
                                  font-ethnocentric
                                  text-3xl
                                  font-normal
                                  uppercase
                                  leading-none
                                  tracking-[-0.04em]
                                  text-white
                                  sm:text-4xl
                                "
                              >
                                {item.title}
                              </h3>

                              <div
                                className="
                                  mt-5
                                  h-[2px]
                                  w-14
                                  bg-gradient-to-r
                                  from-[#DE8A61]
                                  to-[#F0CA77]
                                "
                              />

                              <div className="mt-7 flex flex-wrap gap-2">
                                {item.technologies.map(
                                  (technology) => (
                                    <span
                                      key={technology}
                                      className="
                                        rounded-full
                                        bg-white/[0.04]
                                        px-3
                                        py-1.5
                                        font-[var(--font-rajdhani)]
                                        text-[10px]
                                        font-normal
                                        uppercase
                                        tracking-[0.12em]
                                        text-white/45
                                      "
                                    >
                                      {technology}
                                    </span>
                                  ),
                                )}
                              </div>

                              <div
                                className="
                                  mt-8
                                  flex
                                  items-center
                                  gap-3
                                  font-[var(--font-rajdhani)]
                                  text-xs
                                  font-normal
                                  uppercase
                                  tracking-[0.2em]
                                  text-white/60
                                  transition-colors
                                  duration-300
                                  group-hover:text-[#F0CA77]
                                "
                              >
                                Coming soon
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
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
                      aria-label={`Select ${item.title}`}
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
                            <h3
                              className="
                                font-ethnocentric
                                text-2xl
                                font-normal
                                uppercase
                                tracking-[-0.04em]
                                text-white/90
                              "
                            >
                              {item.title}
                            </h3>

                            <div
                              className="
                                mt-5
                                flex
                                items-center
                                gap-2
                                font-[var(--font-rajdhani)]
                                text-[10px]
                                font-normal
                                uppercase
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
              aria-label="Previous portfolio item"
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
              {portfolioItems.map(
                (item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() =>
                      selectCard(index)
                    }
                    aria-label={`Go to ${item.title}`}
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
              aria-label="Next portfolio item"
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
              uppercase
              tracking-[0.25em]
              text-white/25
            "
          >
            Click any card to focus
          </p>
        </div>
      </div>

    </section>
  );
}
