import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import type { CSSProperties } from "react";

type LeafShape = "maple" | "oak" | "ginkgo" | "serrated";

type AutumnLeaf = {
  shape: LeafShape;
  left: string;
  size: number;
  duration: string;
  delay: string;
  color: string;
  opacity: number;
  mid: string;
  late: string;
  end: string;
  turn: string;
};

const autumnLeaves: AutumnLeaf[] = [
  {
    shape: "maple",
    left: "4%",
    size: 31,
    duration: "24s",
    delay: "-16s",
    color: "#DE8A61",
    opacity: 0.58,
    mid: "8vw",
    late: "-3vw",
    end: "5vw",
    turn: "520deg",
  },
  {
    shape: "ginkgo",
    left: "12%",
    size: 42,
    duration: "29s",
    delay: "-7s",
    color: "#F0CA77",
    opacity: 0.48,
    mid: "-6vw",
    late: "7vw",
    end: "-4vw",
    turn: "610deg",
  },
  {
    shape: "oak",
    left: "20%",
    size: 26,
    duration: "21s",
    delay: "-18s",
    color: "#934C60",
    opacity: 0.62,
    mid: "5vw",
    late: "-7vw",
    end: "3vw",
    turn: "460deg",
  },
  {
    shape: "serrated",
    left: "29%",
    size: 36,
    duration: "27s",
    delay: "-11s",
    color: "#DE8A61",
    opacity: 0.5,
    mid: "-8vw",
    late: "4vw",
    end: "-6vw",
    turn: "570deg",
  },
  {
    shape: "maple",
    left: "37%",
    size: 29,
    duration: "23s",
    delay: "-4s",
    color: "#F0CA77",
    opacity: 0.56,
    mid: "6vw",
    late: "-5vw",
    end: "7vw",
    turn: "500deg",
  },
  {
    shape: "oak",
    left: "46%",
    size: 45,
    duration: "30s",
    delay: "-22s",
    color: "#71527B",
    opacity: 0.55,
    mid: "-5vw",
    late: "8vw",
    end: "-7vw",
    turn: "630deg",
  },
  {
    shape: "ginkgo",
    left: "55%",
    size: 30,
    duration: "25s",
    delay: "-13s",
    color: "#DE8A61",
    opacity: 0.62,
    mid: "9vw",
    late: "-6vw",
    end: "4vw",
    turn: "540deg",
  },
  {
    shape: "serrated",
    left: "63%",
    size: 38,
    duration: "28s",
    delay: "-8s",
    color: "#F0CA77",
    opacity: 0.48,
    mid: "-7vw",
    late: "5vw",
    end: "-5vw",
    turn: "590deg",
  },
  {
    shape: "oak",
    left: "71%",
    size: 27,
    duration: "22s",
    delay: "-19s",
    color: "#934C60",
    opacity: 0.6,
    mid: "6vw",
    late: "-8vw",
    end: "6vw",
    turn: "470deg",
  },
  {
    shape: "maple",
    left: "79%",
    size: 43,
    duration: "30s",
    delay: "-5s",
    color: "#DE8A61",
    opacity: 0.52,
    mid: "-9vw",
    late: "6vw",
    end: "-3vw",
    turn: "620deg",
  },
  {
    shape: "ginkgo",
    left: "87%",
    size: 32,
    duration: "24s",
    delay: "-15s",
    color: "#F0CA77",
    opacity: 0.58,
    mid: "5vw",
    late: "-4vw",
    end: "8vw",
    turn: "530deg",
  },
  {
    shape: "serrated",
    left: "95%",
    size: 26,
    duration: "21s",
    delay: "-10s",
    color: "#71527B",
    opacity: 0.56,
    mid: "-6vw",
    late: "7vw",
    end: "-5vw",
    turn: "490deg",
  },
];

type FallingLeafStyle = CSSProperties & {
  "--leaf-drift-mid": string;
  "--leaf-drift-late": string;
  "--leaf-drift-end": string;
  "--leaf-turn": string;
  "--leaf-opacity": number;
};

const leafArtwork: Record<LeafShape, { outline: string; veins: string[] }> = {
  maple: {
    outline:
      "m24 2 4 8 6-4 1 9 9-1-6 7 7 5-9 2 4 8-9-2-1 9-6-7-6 7-1-9-9 2 4-8-9-2 7-5-6-7 9 1 1-9 6 4 4-8Z",
    veins: ["M24 22 25 44", "m24 31-8-7", "m25 27 8-8"],
  },
  oak: {
    outline:
      "M24 3c-4 5-9 3-10 9-7-1-10 4-5 9-6 5-3 11 5 11-1 7 4 9 9 5 0 5 1 8 1 8s1-3 1-8c5 4 10 2 9-5 8 0 11-6 5-11 5-5 2-10-5-9-1-6-6-4-10-9Z",
    veins: ["M24 26v19", "m24 33-9-9", "m24 29 9-9", "m24 37 8-3"],
  },
  ginkgo: {
    outline:
      "M24 44C20 36 7 35 7 23C7 13 13 5 23 3C21 11 22 18 24 23C26 18 27 11 25 3C35 5 41 13 41 23C41 35 28 36 24 44Z",
    veins: [
      "M24 43 9 24",
      "M24 43 12 16",
      "M24 43 20 9",
      "M24 43 28 9",
      "M24 43 36 16",
      "M24 43 39 24",
    ],
  },
  serrated: {
    outline:
      "M24 2 27 8 32 6 31 12 37 12 35 18 41 21 36 25 40 30 34 32 36 38 30 37 27 43 24 46 21 43 18 37 12 38 14 32 8 30 12 25 7 21 13 18 11 12 17 12 16 6 21 8Z",
    veins: ["M24 24v21", "M24 32 15 18", "M24 29 33 15", "m24 37 8-3"],
  },
};

function LeafSilhouette({ shape }: { shape: LeafShape }) {
  const artwork = leafArtwork[shape];

  return (
    <>
      <path d={artwork.outline} fill="currentColor" />
      <g
        stroke="#15162D"
        strokeOpacity=".45"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {artwork.veins.map((vein) => (
          <path key={vein} d={vein} />
        ))}
      </g>
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        isolate
        min-h-screen
        overflow-hidden
        bg-[#15162D]
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
          FALLING AUTUMN SILHOUETTES
          ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {autumnLeaves.map((leaf, index) => (
          <svg
            key={`${leaf.left}-${index}`}
            viewBox="0 0 48 48"
            fill="none"
            className="falling-leaf"
            style={{
              left: leaf.left,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              animationDuration: leaf.duration,
              animationDelay: leaf.delay,
              color: leaf.color,
              "--leaf-drift-mid": leaf.mid,
              "--leaf-drift-late": leaf.late,
              "--leaf-drift-end": leaf.end,
              "--leaf-turn": leaf.turn,
              "--leaf-opacity": leaf.opacity,
            } as FallingLeafStyle}
          >
            <LeafSilhouette shape={leaf.shape} />
          </svg>
        ))}
      </div>

      {/* =====================================================
          AUTUMN LAND LAYERS
          ===================================================== */}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[42vh] min-h-[240px] max-h-[440px] bg-transparent opacity-[0.42]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1600 520"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient
              id="distant-landscape"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="130"
              x2="0"
              y2="500"
            >
              <stop offset="0%" stopColor="#626CC2" stopOpacity="0" />
              <stop offset="30%" stopColor="#626CC2" stopOpacity="0.04" />
              <stop offset="58%" stopColor="#626CC2" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#626CC2" stopOpacity="0.58" />
            </linearGradient>
            <linearGradient
              id="foreground-landscape"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="310"
              x2="0"
              y2="520"
            >
              <stop offset="0%" stopColor="#34395F" stopOpacity="0" />
              <stop offset="18%" stopColor="#34395F" stopOpacity="0.12" />
              <stop offset="48%" stopColor="#34395F" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#34395F" stopOpacity="0.96" />
            </linearGradient>
          </defs>
          <path
            d="M0 352c154-67 288-32 431-79 182-59 299 4 454-33 217-51 393 7 715-88v368H0V352Z"
            fill="url(#distant-landscape)"
          />
          <path
            d="M0 407c177-75 329-49 475-18 175 38 312-49 479-54 207-7 357 59 646-35v220H0V407Z"
            fill="url(#foreground-landscape)"
          />
        </svg>
      </div>

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

      <div
        className="artsy-background pointer-events-none absolute inset-0 z-[1] opacity-[0.28]"
        aria-hidden="true"
      />

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
                <div className="hero-orbit-ring hero-orbit-ring--code rounded-full border border-[#F0CA77]/10" />
                <div className="hero-orbit-ring hero-orbit-ring--art rounded-full border border-[#DE8A61]/10" />
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

                <div className="hero-orbit hero-orbit--code" aria-hidden="true">
                  <div className="hero-orbit-planet">
                    <span className="hero-orbit-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#15162D]/60 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5362B7] shadow-[0_0_12px_2px_rgba(83,98,183,0.75)]" />
                      <span className="font-rajdhani text-xs uppercase tracking-[0.2em] text-white/70">
                        Code
                      </span>
                    </span>
                  </div>
                </div>

                <div className="hero-orbit hero-orbit--art" aria-hidden="true">
                  <div className="hero-orbit-planet">
                    <span className="hero-orbit-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#15162D]/60 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#DE8A61] shadow-[0_0_12px_2px_rgba(222,138,97,0.75)]" />
                      <span className="font-rajdhani text-xs uppercase tracking-[0.2em] text-white/70">
                        Art
                      </span>
                    </span>
                  </div>
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
