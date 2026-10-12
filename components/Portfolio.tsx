"use client";

import { Gamepad2, Globe, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import type { PortfolioItem } from "@/types/portfolio";

const portfolioItems: PortfolioItem[] = [
  {
    number: "01",
    detailsId: "cosmic-dodge-details",
    closing: {
      prompt: "How long can you survive the cosmic chaos?",
      subline: "Enter the void. Take flight. Dodge everything.",
      brand: "Cosmic Dodge",
      tagline: "How long can you stay alive?",
    },
    title: "Cosmic Dodge",
    image: "/unity-images/1.jpeg",
    tagline: "Dodge. Fly. Survive.",
    description: [
      "Take control of your astronaut and navigate through a dangerous cosmic field filled with massive asteroids and unpredictable space debris!",
      "In Cosmic Dodge, your astronaut constantly flies upward on an endless journey. Tap and hold the screen to dive downward; release to rise again, then carefully maneuver around incoming obstacles.",
      "Watch out for massive asteroid formations blocking your path, while smaller asteroids appear unexpectedly from different directions. Every collision costs you a life, and you have only three lives, so survive as long as possible.",
      "The longer you survive, the more intense the challenge becomes.",
    ],
    features: [
      {
        icon: "\u{1F30C}",
        title: "Endless Space Adventure",
        description: "Fly through an ever-changing cosmic environment.",
      },
      {
        icon: "\u2604\uFE0F",
        title: "Dodge Massive Asteroids",
        description: "Navigate through dangerous asteroid formations.",
      },
      {
        icon: "\u{1F4AB}",
        title: "Quick Tap Controls",
        description: "Hold to dive and release to rise.",
      },
      {
        icon: "\u2764\uFE0F",
        title: "Three Lives",
        description: "Make every move count.",
      },
      {
        icon: "\u{1F3AE}",
        title: "Arcade-Style Gameplay",
        description: "Easy to learn, challenging to master.",
      },
      {
        icon: "\u{1F3C6}",
        title: "Survive as Long as You Can",
        description: "Push your limits and beat your best run.",
      },
    ],
    genre: "Arcade",
    secondaryGenres: [
      "Action",
      "Casual",
      "Endless Runner",
      "Survival",
      "Space",
    ],
   platforms: ["Android"],

    availability: "Coming soon",
    
    icon: Gamepad2,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
  {
    number: "02",
    title: "",
    tagline: "",
    description: [],
    features: [],
    genre: "",
    secondaryGenres: [],
    availability: "Coming soon",
    icon: Gamepad2,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
  {
    number: "03",
    title: "",
    tagline: "",
    description: [],
    features: [],
    genre: "",
    secondaryGenres: [],
    availability: "Coming soon",
    icon: Gamepad2,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
];

const otherServiceItems: PortfolioItem[] = [
  {
    number: "01",
    kind: "App",
    detailsId: "lifely-space-details",
    category: "Application Development",
    title: "Lifely Space",
    image: "/images/a-logo.png",
    tagline: "Your space for everything life.",
    description: [
      "Lifely Space is a customizable digital journaling app designed to give you one flexible space for writing, planning, organizing, creating, and keeping track of everyday life.",
    ],
    features: [
      { icon: "📝", title: "Your Personal Life Space", description: "Keep your notes, plans, journals, and ideas all in one place." },
      { icon: "✍️", title: "Rich Text Editing", description: "Customize selected text with fonts, colors, sizes, bold, italic, underline, and highlights." },
      { icon: "🖼️", title: "Write Anywhere", description: "Add text freely around images, tables, shapes, checklists, and other content." },
      { icon: "🎨", title: "Creative Tools", description: "Draw, sketch, add shapes, dividers, and personalize your pages." },
      { icon: "🗂️", title: "Organize Your Life", description: "Create folders and notebooks for everything from Life Admin and Brain Dumps to goals and projects." },
      { icon: "📅", title: "Built-In Calendar", description: "Plan, organize, and keep track of important dates." },
      { icon: "↔️", title: "Flexible Pages", description: "Move, resize, rotate, and arrange content anywhere on your page." },
      { icon: "✨", title: "Templates & Customization", description: "Start with templates or create pages that fit your style." },
      { icon: "↩️", title: "Stay in Control", description: "Undo, redo, autosave, backup, and restore your journal content." },
      { icon: "📄", title: "Export Your Pages", description: "Turn your journals into PDF files whenever you need them." },
      { icon: "📴", title: "Offline by Design", description: "Write, plan, and organize your life without needing an internet connection." },
    ],
    genre: "",
    secondaryGenres: [],
    platforms: ["Android"],
    builtWith: ["Kotlin", "Android SDK", "Jetpack Compose", "Material 3", "AndroidX", "Gradle"],
    availability: "Coming Soon",
    icon: Smartphone,
    gradient: "from-[#3B4895] to-[#DE8A61]",
    closing: {
      prompt: "Where will you make space for your life?",
      subline: "Write it down. Plan it out. Make it yours.",
      brand: "Lifely Space",
      tagline: "Your life. Your space. Your way.",
    },
  },
  {
    number: "02",
    kind: "Web",
    detailsId: "website-development-details",
    category: "Web Development",
    title: "Website Development",
    tagline: "",
    description: [
      "Explore our upcoming web development work, featuring modern, responsive, and creative digital experiences built for the web.",
    ],
    features: [],
    genre: "",
    secondaryGenres: [],
    availability: "Coming Soon",
    icon: Globe,
    gradient: "from-[#3B4895] to-[#DE8A61]",
  },
];

export default function Portfolio() {
  const [revealProgress, setRevealProgress] = useState(0);
  const portfolioRef = useRef<HTMLElement | null>(null);

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
          HERO TO PORTFOLIO TRANSITION
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
      UNITY GAMES
      ================================================= */}

  <div className="mt-20 sm:mt-24">
    <div className="mb-8 flex items-center gap-3">
      <span className="pixel-dot" />

      <h3 className="font-ethnocentric text-xl font-normal tracking-[0.02em] text-[#F0CA77] sm:text-4xl">
        Unity Games
      </h3>
    </div>
  </div>

  <div>
    <p className="text-sm leading-relaxed text-[#C5BFD0] sm:text-lg md:text-xl">
      Each game explores a different idea, world, and style of play.
    </p>
  </div>
<div className="mt-10 sm:mt-14">
  <PortfolioCarousel
    items={portfolioItems}
    carouselId="unity-games"
    itemTypeLabel="game"
  />
</div>
  {/* =================================================
      DIVIDER BETWEEN PORTFOLIO CATEGORIES
      ================================================= */}

  <div className="my-20 sm:my-28">
    <div className="h-px w-full bg-white/10" />
  </div>

  {/* =================================================
      OTHER SERVICES
      ================================================= */}

  <div>
    <div className="mb-8 flex items-center gap-3">
      <span className="pixel-dot" />

      <h3 className="font-ethnocentric text-xl font-normal tracking-[0.02em] text-[#F0CA77] sm:text-3xl">
        Other Services We Offer
      </h3>
    </div>
  </div>

  <div>
    <p className="text-sm leading-relaxed text-[#C5BFD0] sm:text-lg md:text-xl">
      Each project brings a different idea to life through applications and websites.
    </p>
  </div>
<div className="mt-10 sm:mt-14">
  <PortfolioCarousel
    items={otherServiceItems}
    carouselId="other-services"
    itemTypeLabel="service"
  />
  </div>
</div>

    </section>
  );
}
