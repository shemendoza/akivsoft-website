
import { getPublishedPortfolio } from "@/lib/portfolio";
import PortfolioSections from "@/components/PortfolioSections";

export default async function Portfolio() {
  const { categories, projects, details } =
    await getPublishedPortfolio();

  return (
    <section
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
            blur-[48px]
            sm:blur-[110px]
          "
          style={{ opacity: 0.7 }}
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
            blur-[44px]
            sm:blur-[100px]
          "
          style={{ opacity: 0.7 }}
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
            blur-[44px]
            sm:blur-[100px]
          "
          style={{ opacity: 0.7 }}
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
            blur-[44px]
            sm:blur-[100px]
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
          portfolio-scroll-reveal
        "
      >
        <PortfolioSections
          categories={categories}
          projects={projects}
          details={details}
        />
      </div>
    </section>
  );
}
