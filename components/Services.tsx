"use client";

import {
  ArrowUpRight,
  AudioLines,
  Box,
  Gamepad2,
  Gauge,
  Lightbulb,
  Monitor,
  Palette,
  Rocket,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import ServiceCard from "./ServiceCard";

type ServiceAccent = "blue" | "purple" | "cyan" | "pink";

const services = [
  {
    number: "01",
    title: "Game Development",
    description:
      "We build core gameplay systems, responsive controls, interfaces, and content around the needs of your project.",
    tags: ["Gameplay", "Unity", "C#"],
    icon: Gamepad2,
    accent: "blue",
  },
  {
    number: "02",
    title: "Game Concept & Design",
    description:
      "Every great game starts with a great idea. We help transform concepts into compelling game experiences through gameplay mechanics, game systems, level design, progression, and player experiences.",
    tags: ["Mechanics", "Systems", "Level Design"],
    icon: Lightbulb,
    accent: "purple",
  },
  {
    number: "03",
    title: "2D & 3D Game Development",
    description:
      "Whether you're looking for a stylized 2D experience or an immersive 3D world, we create games with engaging visuals, responsive controls, and polished gameplay.",
    tags: ["2D", "3D", "Unity"],
    icon: Box,
    accent: "pink",
  },
  {
    number: "04",
    title: "Multiplayer & Online Games",
    description:
      "We develop multiplayer experiences designed for engaging player interactions, including competitive and cooperative gameplay, online systems, matchmaking, and player progression.",
    tags: ["Online", "Co-op", "Competitive"],
    icon: Users,
    accent: "cyan",
  },
  {
    number: "05",
    title: "Mobile Game Development",
    description:
      "We create engaging mobile games optimized for smooth performance and intuitive controls across modern mobile devices.",
    tags: ["iOS", "Android", "Mobile UX"],
    icon: Smartphone,
    accent: "purple",
  },
  {
    number: "06",
    title: "PC & Console Game Development",
    description:
      "Our development services extend to PC and console experiences, with a focus on responsive gameplay, performance optimization, and platform-specific requirements.",
    tags: ["PC", "Console", "Optimization"],
    icon: Monitor,
    accent: "blue",
  },
  {
    number: "07",
    title: "Game Art & Animation",
    description:
      "Bring your game world to life with distinctive characters, environments, animations, interfaces, and visual effects that complement the gameplay and create a memorable experience.",
    tags: ["Characters", "Animation", "VFX"],
    icon: Palette,
    accent: "pink",
  },
  {
    number: "08",
    title: "Sound & Game Audio",
    description:
      "Sound plays an important role in immersion. We integrate music, sound effects, environmental audio, and interactive audio elements to enhance the overall player experience.",
    tags: ["Music", "SFX", "Interactive Audio"],
    icon: AudioLines,
    accent: "cyan",
  },
  {
    number: "09",
    title: "Game Optimization & Testing",
    description:
      "We test and optimize games to identify bugs, improve performance, refine gameplay, and provide a smoother experience across supported platforms and devices.",
    tags: ["QA", "Profiling", "Performance"],
    icon: Gauge,
    accent: "purple",
  },
  {
    number: "10",
    title: "Game Launch & Support",
    description:
      "Our work doesn't stop when development is complete. We can support the launch process, updates, improvements, technical maintenance, and ongoing development of your game.",
    tags: ["Launch", "Updates", "Support"],
    icon: Rocket,
    accent: "blue",
  },
] satisfies {
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: typeof Gamepad2;
  accent: ServiceAccent;
}[];

const genres = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Casual",
  "Puzzle",
  "Racing",
  "Sports",
  "Multiplayer",
  "Survival",
  "Horror",
  "And more",
];

const genreAccents = [
  "text-[#F0B191]",
  "text-[#F0CA77]",
  "text-[#C59DD3]",
  "text-[#9AA8FF]",
];

export default function Services() {
  return (
    <section
      id="services"
      className="artsy-background relative overflow-hidden py-20 sm:py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="art-grid absolute inset-0" />
        <div className="noise absolute inset-0" />
      </div>

      <div className="blob blob-blue pointer-events-none absolute -right-72 top-[-8rem] h-[40rem] w-[40rem] opacity-30" aria-hidden="true" />
      <div className="blob blob-purple pointer-events-none absolute -left-72 top-[30%] h-[38rem] w-[38rem] opacity-30" aria-hidden="true" />
      <div className="blob blob-orange pointer-events-none absolute right-[15%] bottom-[-12rem] h-[34rem] w-[34rem] opacity-25" aria-hidden="true" />
      <div className="blob blob-gold pointer-events-none absolute left-[45%] top-[12%] h-40 w-40 opacity-20" aria-hidden="true" />
      <div className="blob blob-pink pointer-events-none absolute right-[35%] top-[45%] h-48 w-48 opacity-15" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="pixel-dot absolute left-[10%] top-[18%]" />
        <div className="pixel-dot absolute right-[12%] top-[28%]" />
        <div className="pixel-dot absolute left-[38%] bottom-[18%]" />
        <div className="pixel-dot absolute right-[30%] bottom-[30%]" />
      </div>

      <div className="section-container relative z-10">
        <header className="mb-14 grid min-h-[65vh] content-center gap-8 xl:mb-20 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Gamepad2 size={17} className="text-[#DE8A61]" />
              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                Our Services
              </p>
            </div>

            <h2 className="section-title">
              We build games
              <br />
              <span className="gradient-text">players remember.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-base leading-relaxed text-[#C5BFD0] sm:text-lg md:text-xl">
              At <span className="font-normal text-white">Akivsoft</span>,
              we take game projects from design and development through
              optimization and launch, tailoring each stage to the project&apos;s
              genre and platform.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[9px] font-normal uppercase tracking-[0.18em] text-white/35 sm:text-[10px]">
              <span>Concept</span>
              <span className="pixel-dot" />
              <span>Build</span>
              <span className="pixel-dot" />
              <span>Play</span>
              <Sparkles size={13} className="ml-1 text-[#F0CA77]/70" />
            </div>
          </div>
        </header>

        <div className="relative">
          <div className="flex items-center justify-between gap-4 py-4">
            <p className="font-[var(--font-rajdhani)] text-xs font-normal uppercase tracking-[0.25em] text-white/55 sm:text-sm">
              Game development services
            </p>
            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] text-[#F0CA77]/45 sm:text-[10px]">
              10 ways to play
            </span>
          </div>

          {services.map((service) => (
            <ServiceCard key={service.number} {...service} />
          ))}
        </div>

        <div className="mt-20 grid gap-10 xl:grid-cols-[0.85fr_1.15fr] xl:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="pixel-dot" />
              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                Find your next favorite
              </p>
            </div>

            <h3 className="section-title">
              Built across
              <br />
              <span className="gradient-text">genres.</span>
            </h3>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
              The same mechanic can create very different moods. We shape each
              experience around the feeling it should leave with players.
            </p>
          </div>

          <div className="artsy-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3B4895]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-[25%] h-48 w-48 rounded-full bg-[#DE8A61]/10 blur-3xl" />
            <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <div className="mb-7 flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-white/45">
                  Choose your adventure
                </p>
                <Gamepad2 size={19} className="text-[#DE8A61]/80" />
              </div>

              <div className="flex flex-wrap gap-2.5">
                {genres.map((genre, index) => (
                  <span
                    key={genre}
                    className={`rounded-full px-4 py-2 font-[var(--font-rajdhani)] text-xs font-normal uppercase tracking-[0.14em] sm:text-sm ${genreAccents[index % genreAccents.length]}`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="artsy-card relative mt-20 overflow-hidden p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#71527B]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-[35%] h-64 w-64 rounded-full bg-[#DE8A61]/15 blur-3xl" />
          <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />
          <Gamepad2
            className="pointer-events-none absolute -right-4 -top-5 h-32 w-32 rotate-[-12deg] text-white/[0.035] sm:right-10 sm:top-4 sm:h-48 sm:w-48"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-[#F0CA77]">
                <Sparkles size={14} />
                Planning the next build
              </div>

              <h3 className="section-title">
                Need a development partner?
                <br />
                <span className="gradient-text">Let&apos;s talk scope.</span>
              </h3>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
                Bring us a design, art, or technical challenge and we&apos;ll
                discuss the right way to move your project forward.
              </p>
            </div>

            <a href="#contact" className="artsy-button group w-fit shrink-0">
              <span>Let&apos;s talk games</span>
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
