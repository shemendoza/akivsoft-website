import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="
        artsy-background
        relative
        isolate
        min-h-screen
        overflow-hidden
      "
    >
      {/* =====================================================
          ATMOSPHERIC GLOWS
          ===================================================== */}

      <div
        className="
          blob
          blob-blue
          absolute
          -left-72
          top-[-10rem]
          z-0
          h-[40rem]
          w-[40rem]
          opacity-25
        "
        style={{ animation: "none" }}
        aria-hidden="true"
      />

      <div
        className="
          blob
          blob-purple
          absolute
          right-[-16rem]
          top-[8%]
          z-0
          h-[38rem]
          w-[38rem]
          opacity-25
        "
        style={{ animation: "none" }}
        aria-hidden="true"
      />

      <div
        className="
          blob
          blob-orange
          absolute
          right-[18%]
          bottom-[-12rem]
          z-0
          h-[34rem]
          w-[34rem]
          opacity-20
        "
        style={{ animation: "none" }}
        aria-hidden="true"
      />

      {/* =====================================================
          ART GRID
          ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-25">
        <div
          className="art-grid h-full w-full"
          style={{ animation: "none" }}
        />
      </div>

      <div className="noise" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div
          className="pixel-dot absolute left-[8%] top-[22%] opacity-35"
          style={{ animation: "none" }}
        />
        <div
          className="pixel-dot absolute left-[46%] top-[14%] opacity-30"
          style={{ animation: "none" }}
        />
        <div
          className="pixel-dot absolute right-[12%] top-[28%] opacity-35"
          style={{ animation: "none" }}
        />
        <div
          className="pixel-dot absolute right-[24%] bottom-[22%] opacity-30"
          style={{ animation: "none" }}
        />
      </div>

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}

      <div
        className="
          section-container
          hero-content
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          pb-32
          pt-32
          sm:pt-36
          lg:pt-40
          xl:pt-44
        "
      >
        <div className="w-full">
          <div
            className="
              grid
              grid-cols-1
              items-center
              gap-12
              lg:grid-cols-[1.15fr_0.85fr]
              lg:gap-20
            "
          >
            {/* =================================================
                LEFT
                ================================================= */}

            <div className="max-w-5xl min-w-0">
              <div className="mb-8 flex items-center gap-3">
                <span
                  className="
                    font-rajdhani
                    text-xs
                    font-normal
                    uppercase
                    tracking-[0.35em]
                    text-[#F0CA77]
                  "
                >
                  Independent Game Studio
                </span>

                <Sparkles
                  size={14}
                  className="text-[#DE8A61]"
                />
              </div>

              <h1 className="m-0 max-w-[760px] font-ethnocentric text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.98] tracking-[-0.025em]">
                <span className="block text-white">IDEAS MADE</span>
                <span
                  className="gradient-text block w-fit pr-[0.12em]"
                  style={{ animation: "none" }}
                >
                  PLAYABLE
                </span>
              </h1>

              <p
                className="
                  mt-8
                  max-w-2xl
                  font-space
                  text-base
                  leading-relaxed
                  text-white/55
                  sm:text-lg
                "
              >
                We create original Unity games, pairing playful ideas with
                expressive art and hands-on development.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#portfolio"
                  className="artsy-button group"
                >
                  <span>Explore Our Work</span>

                  <ArrowUpRight
                    size={18}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                </a>

                <a
                  href="#contact"
                  className="artsy-button-outline group"
                >
                  <span>Start a Project</span>

                  <ArrowUpRight
                    size={18}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                </a>
              </div>
            </div>

            {/* =================================================
                RIGHT
                ================================================= */}

            <div className="relative hidden lg:block">
              <div className="relative ml-auto max-w-[500px]">
                <div className="absolute -inset-12 rounded-full border border-[#F0CA77]/10" />
                <div className="absolute -inset-6 rounded-full border border-[#DE8A61]/10" />
                <div
                  className="
                    relative
                    aspect-square
                    overflow-hidden
                    rounded-[3rem]
                    border
                    border-white/10
                    bg-white/[0.025]
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0
                      bg-[radial-gradient(circle_at_30%_30%,rgba(59,72,149,0.35),transparent_45%),radial-gradient(circle_at_75%_70%,rgba(222,138,97,0.25),transparent_45%)]
                    "
                  />

                  <div
                    className="
                      absolute
                      left-[18%]
                      top-[20%]
                      h-32
                      w-32
                      rounded-full
                      bg-[#3B4895]/30
                      blur-3xl
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-[15%]
                      right-[15%]
                      h-36
                      w-36
                      rounded-full
                      bg-[#DE8A61]/25
                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-full
                      flex-col
                      items-center
                      justify-center
                      p-10
                      text-center
                    "
                  >
                    <span
                      className="
                        font-ethnocentric
                        text-[clamp(4rem,9vw,8rem)]
                        font-normal
                        leading-none
                        text-white/90
                      "
                    >
                      A
                    </span>

                    <p
                      className="
                        mt-5
                        font-rajdhani
                        text-sm
                        uppercase
                        tracking-[0.35em]
                        text-white/50
                      "
                    >
                      Create
                      <span className="mx-2 text-[#F0CA77]">
                        ×
                      </span>
                      Build
                      <span className="mx-2 text-[#DE8A61]">
                        ×
                      </span>
                      Imagine
                    </p>
                  </div>
                </div>

                <div
                  className="
                    absolute
                    -left-8
                    top-[18%]
                    rounded-full
                    border
                    border-white/10
                    bg-[#15162D]/60
                    px-4
                    py-2
                    backdrop-blur-md
                  "
                >
                  <span
                    className="
                      font-rajdhani
                      text-xs
                      uppercase
                      tracking-[0.2em]
                      text-white/60
                    "
                  >
                    Code
                  </span>
                </div>

                <div
                  className="
                    absolute
                    -right-8
                    bottom-[22%]
                    rounded-full
                    border
                    border-white/10
                    bg-[#15162D]/60
                    px-4
                    py-2
                    backdrop-blur-md
                  "
                >
                  <span
                    className="
                      font-rajdhani
                      text-xs
                      uppercase
                      tracking-[0.2em]
                      text-white/60
                    "
                  >
                    Art
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
          ===================================================== */}

      <div
        className="
          absolute
          bottom-24
          left-1/2
          z-20
          -translate-x-1/2
        "
      >
        <a
          href="#portfolio"
          className="group flex flex-col items-center gap-3"
          aria-label="Scroll to portfolio"
        >
          <span
            className="
              font-rajdhani
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-white/40
              transition-colors
              duration-300
              group-hover:text-[#F0CA77]
            "
          >
            Explore
          </span>

          <span
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.02]
              text-white/50
              backdrop-blur-sm
              transition-all
              duration-300
              group-hover:border-[#F0CA77]/40
              group-hover:bg-[#F0CA77]/5
              group-hover:text-[#F0CA77]
            "
          >
            <ArrowDown
              size={15}
              className="
                text-white/50
                transition-colors
                duration-300
                group-hover:text-[#F0CA77]
              "
            />
          </span>
        </a>
      </div>

      {/* =====================================================
          HERO → PORTFOLIO TRANSITION

          IMPORTANT:
          This remains inside Hero, but the Hero itself
          does NOT fade away.
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          z-[1]
          h-[38vh]
          min-h-[240px]
          w-full
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            inset-0
            z-10
            bg-gradient-to-b
            from-transparent
            via-[#0D1023]/45
            to-[#15162D]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-[35vw]
            w-[80vw]
            -translate-x-1/2
            translate-y-[65%]
            rounded-full
            bg-[#3B4895]/25
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-[20%]
            h-[18vw]
            w-[30vw]
            translate-y-[55%]
            rounded-full
            bg-[#71527B]/15
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-[10%]
            h-[15vw]
            w-[25vw]
            translate-y-[55%]
            rounded-full
            bg-[#3B4895]/10
            blur-[100px]
          "
        />
      </div>
    </section>
  );
}
