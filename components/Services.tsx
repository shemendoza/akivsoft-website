"use client";

import {
  ArrowUpRight,
  AudioLines,
  Box,
  Gamepad2,
  Gauge,
  Globe,
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
    title: "2D & 3D Game Development",
    description:
      "We create engaging 2D and 3D games for mobile and PC, combining responsive controls, polished gameplay, and immersive experiences tailored to each project.",
    tags: ["2D", "3D", "Mobile", "PC"],
    icon: Gamepad2,
    accent: "blue",
  },
  {
    number: "02",
    title: "Game Concept, Art & Design",
    description:
      "We turn ideas into playable experiences through game concepts, mechanics, visual direction, interfaces, environments, and creative design.",
    tags: ["Concept", "Art", "Game Design"],
    icon: Lightbulb,
    accent: "purple",
  },
  {
    number: "03",
    title: "Game Optimization & Testing",
    description:
      "We test, refine, and optimize games to improve performance, identify bugs, balance gameplay, and create a smoother player experience.",
    tags: ["QA", "Testing", "Optimization"],
    icon: Gauge,
    accent: "pink",
  },
  {
    number: "04",
    title: "Game Launch & Support",
    description:
     "We prepare games for release and provide continued support through updates, improvements, maintenance, and technical assistance after launch.",
    tags: ["Launch", "Updates", "Support"],
    icon: Rocket,
    accent: "cyan",
  },
] satisfies {
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: typeof Gamepad2;
  accent: ServiceAccent;
}[];
const otherDevelopmentServices = [
  {
    number: "01",
    title: "Application Development",
    description:
      "We develop desktop and mobile applications tailored to your ideas, workflows, and users, from interface design and development to deployment.",
    tags: ["Desktop", "Mobile", "Applications"],
    icon: Smartphone,
    accent: "blue",
  },
  {
    number: "02",
    title: "Website Development",
    description:
      "We create modern, responsive websites with thoughtful design, smooth interactions, and reliable functionality across desktop and mobile devices.",
    tags: ["Web", "Responsive", "Modern"],
    icon: Globe,
    accent: "purple",
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

        <div className="relative">
          <div className="flex items-center justify-between gap-4 py-4">
            <p className="font-[var(--font-rajdhani)] text-xs font-normal tracking-[0.25em] text-white/55 sm:text-sm">
  Game development services
</p>
            <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.16em] text-[#F0CA77]/45 sm:text-[10px]">
  4 ways to build
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

      <p className="text-xs font-normal tracking-[0.3em] text-[#F0CA77] sm:text-sm">
        Game genres
      </p>
    </div>

    <h3 className="section-title">
      Built for
      <br />
      <span className="gradient-text">every kind of player.</span>
    </h3>

    <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
      From fast-paced action to immersive adventures, we adapt our
      development approach to the genre, gameplay, and experience your
      project is meant to deliver.
    </p>
  </div>

  <div className="artsy-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
    <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3B4895]/20 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-24 left-[25%] h-48 w-48 rounded-full bg-[#DE8A61]/10 blur-3xl" />

    <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />

    <div className="relative">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] font-normal tracking-[0.2em] text-white/45">
          Explore the possibilities
        </p>

        <Gamepad2
          size={19}
          className="text-[#DE8A61]/80"
        />
      </div>

      <div className="flex flex-wrap gap-2.5">
        {genres.map((genre, index) => (
          <span
            key={genre}
            className={`rounded-full px-4 py-2 font-[var(--font-rajdhani)] text-xs font-normal tracking-[0.14em] sm:text-sm ${genreAccents[index % genreAccents.length]}`}
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>


          <div className="my-20 sm:my-28">
    <div className="h-px w-full bg-white/10" />
  </div>

        <div className="relative mt-20 sm:mt-28">
  <div className="flex items-center justify-between gap-4 py-4">
    <p className="font-[var(--font-rajdhani)] text-xs font-normal tracking-[0.25em] text-white/55 sm:text-sm">
      Other development services
    </p>

    <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.16em] text-[#F0CA77]/45 sm:text-[10px]">
      Apps · Websites
    </span>
  </div>

  {otherDevelopmentServices.map((service) => (
    <ServiceCard
      key={service.number}
      {...service}
    />
  ))}
</div>

        
<div className="mt-20 grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
  <div className="artsy-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
    <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#71527B]/20 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-24 right-[20%] h-48 w-48 rounded-full bg-[#F0CA77]/10 blur-3xl" />

    <div className="art-grid pointer-events-none absolute inset-0 opacity-20" />

    <div className="relative">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] font-normal tracking-[0.2em] text-white/45">
          Beyond game development
        </p>

        <div className="flex items-center gap-2">
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <Smartphone
            size={22}
            className="mb-4 text-[#F0CA77]"
          />

          <h4 className="font-[var(--font-rajdhani)] text-lg text-white">
            Applications
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-[#C5BFD0]">
            Desktop and mobile applications built around your
            ideas, workflows, and users.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <Globe
            size={22}
            className="mb-4 text-[#F0CA77]"
          />

          <h4 className="font-[var(--font-rajdhani)] text-lg text-white">
            Websites
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-[#C5BFD0]">
            Modern, responsive websites designed to bring your
            brand, ideas, and services to the web.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div className="mb-5 flex items-center gap-3">
      <span className="pixel-dot" />

      <p className="text-xs font-normal tracking-[0.3em] text-[#F0CA77] sm:text-sm">
        Other development
      </p>
    </div>

    <h3 className="section-title">
      More than
      <br />
      <span className="gradient-text">
        just games.
      </span>
    </h3>

    <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
      Game development is at the heart of what we do, but our
      creativity extends beyond games. We also build applications
      and websites that turn ideas into useful, engaging, and
      meaningful digital experiences.
    </p>
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
