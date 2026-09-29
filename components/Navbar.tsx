
"use client";

import Image from "next/image";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <nav className="relative w-full px-5 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-5 xl:px-14 2xl:px-20">
        <div className="relative flex w-full items-center justify-between">

          {/* =========================================================
              LOGO
          ========================================================= */}
          <a
            href="#home"
            onClick={closeMenu}
            aria-label="Akivsoft home"
            className="group relative z-30 flex shrink-0 items-center gap-2 transition-transform duration-300 hover:scale-[1.03] sm:gap-3 xl:gap-4"
          >
            <Image
              src="/images/a-logo.png"
              alt=""
              width={1800}
              height={1800}
              priority
              className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[72px] lg:w-[72px] xl:h-20 xl:w-20 2xl:h-24 2xl:w-24"
            />
            <Image
              src="/images/akivsoft-text-img.png"
              alt="Akivsoft"
              width={8400}
              height={1103}
              priority
              className="h-auto w-[170px] object-contain sm:w-[210px] lg:w-[235px] xl:w-[290px] 2xl:w-[330px]"
            />
          </a>

          {/* =========================================================
              DESKTOP CENTER NAVIGATION
              
              The navigation has its own protected space.
              This prevents the links from visually colliding with
              the logo or the CTA button.
          ========================================================= */}
          <div
            className="
              absolute left-1/2 z-20 hidden
              -translate-x-1/2
              lg:block
            "
          >
            <div
              className="
                flex items-center
                gap-2
                rounded-full
                bg-[#15162D]/55
                px-2
                py-2
                shadow-[0_12px_45px_rgba(0,0,0,0.25)]
                backdrop-blur-xl
                xl:gap-3
                2xl:gap-4
              "
            >
              {links.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="
                    group relative
                    flex min-h-11 items-center justify-center
                    whitespace-nowrap
                    rounded-full
                    px-4 py-2.5
                    font-[var(--font-rajdhani)]
                    text-[1rem]
                    font-normal
                    tracking-wide
                    text-white/80
                    transition-all duration-300
                    hover:bg-white/[0.08]
                    hover:text-white
                    xl:min-h-12
                    xl:px-5
                    xl:text-[1.05rem]
                    2xl:px-6
                    2xl:text-[1.1rem]
                  "
                >
                  {link.label}

                  {/* Hover underline */}
                  <span
                    className="
                      absolute bottom-1.5 left-1/2
                      h-[2px] w-0
                      -translate-x-1/2
                      rounded-full
                      bg-gradient-to-r
                      from-[#DE8A61]
                      via-[#F0CA77]
                      to-white
                      transition-all duration-300
                      group-hover:w-1/2
                    "
                  />

                  {/* Small glow behind active hover */}
                  <span
                    className="
                      pointer-events-none
                      absolute inset-0 -z-10
                      rounded-full
                      bg-gradient-to-r
                      from-[#DE8A61]/0
                      via-[#F0CA77]/0
                      to-[#DE8A61]/0
                      opacity-0
                      blur-xl
                      transition-opacity duration-300
                      group-hover:from-[#DE8A61]/10
                      group-hover:via-[#F0CA77]/10
                      group-hover:to-[#DE8A61]/10
                      group-hover:opacity-100
                    "
                  />
                </a>
              ))}
            </div>
          </div>

          {/* =========================================================
              DESKTOP CTA
          ========================================================= */}
          <a
            href="#contact"
            className="
              group relative z-30
              hidden min-h-12
              items-center gap-2.5
              rounded-full
              bg-gradient-to-r
              from-[#DE8A61]
              to-[#F0CA77]
              px-6 py-3
              font-[var(--font-rajdhani)]
              text-base
              font-normal
              tracking-wide
              text-[#15162D]
              shadow-[0_10px_35px_rgba(222,138,97,0.2)]
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_16px_50px_rgba(222,138,97,0.35)]
              lg:flex
              xl:min-h-14
              xl:px-7
              xl:text-[1.05rem]
              2xl:px-8
              2xl:text-[1.1rem]
            "
          >
            Start a Project

            <ArrowUpRight
              size={19}
              strokeWidth={2.2}
              className="
                transition-transform duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </a>

          {/* =========================================================
              MOBILE MENU BUTTON
          ========================================================= */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="
              relative z-30
              flex h-12 w-12
              items-center justify-center
              rounded-full
              border border-white/10
              bg-white/[0.06]
              text-white
              transition-all duration-300
              hover:border-[#DE8A61]/50
              hover:bg-[#DE8A61]/20
              lg:hidden
            "
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      {open && (
        <div
          className="
            relative mx-4
            overflow-hidden
            rounded-3xl
            border border-[#F0CA77]/10
            bg-[#15162D]/95
            px-5 pb-6 pt-2
            shadow-[0_25px_80px_rgba(13,16,35,0.45)]
            backdrop-blur-2xl
            sm:mx-6
            lg:hidden
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-24 -top-24
              h-64 w-64
              rounded-full
              bg-[#DE8A61]/10
              blur-3xl
            "
          />

          <div className="relative flex flex-col">
            {links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={closeMenu}
                className="
                  group flex items-center justify-between
                  border-b border-white/[0.07]
                  px-2 py-5
                  font-[var(--font-rajdhani)]
                  text-lg
                  font-normal
                  tracking-wide
                  text-white/80
                  transition-colors duration-300
                  hover:text-white
                "
              >
                {link.label}

                <ArrowUpRight
                  size={18}
                  className="
                    text-white/25
                    transition-all duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-[#F0CA77]
                  "
                />
              </a>
            ))}

            <a
              href="#contact"
              onClick={closeMenu}
              className="
                mt-5
                flex min-h-14
                items-center justify-center
                gap-2.5
                rounded-full
                bg-gradient-to-r
                from-[#DE8A61]
                to-[#F0CA77]
                px-6 py-3
                font-[var(--font-rajdhani)]
                text-base
                font-normal
                tracking-wide
                text-[#15162D]
                shadow-[0_12px_40px_rgba(222,138,97,0.25)]
              "
            >
              <Sparkles size={18} />

              Start a Project

              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
