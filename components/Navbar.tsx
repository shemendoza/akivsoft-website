"use client";

import Image from "next/image";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = links
      .map(({ href }) => ({
        href,
        element: document.getElementById(href.slice(1)),
      }))
      .filter(
        (section): section is {
          href: string;
          element: HTMLElement;
        } => section.element !== null,
      );

    const updateNavbar = () => {
      const marker = window.innerHeight * 0.34;
      let currentHref = sections[0]?.href ?? "#home";

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= marker) {
          currentHref = section.href;
        } else {
          break;
        }
      }

      setActiveHref(currentHref);
      setScrolled(window.scrollY > 24);
    };

    /*
     * Run immediately.
     */

    updateNavbar();

    /*
     * Listen for scrolling.
     */

    window.addEventListener(
      "scroll",
      updateNavbar,
      {
        passive: true,
      },
    );

    /*
     * Recalculate on resize.
     */

    window.addEventListener(
      "resize",
      updateNavbar,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateNavbar,
      );

      window.removeEventListener(
        "resize",
        updateNavbar,
      );
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      {/* =================================================
          SCROLL BACKDROP
          ================================================= */}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-64 backdrop-blur-[2px] transition-opacity duration-500 ${
          scrolled
            ? "bg-[linear-gradient(to_bottom,rgba(21,22,45,0.94)_0%,rgba(21,22,45,0.72)_35%,rgba(21,22,45,0.32)_70%,transparent_100%)] opacity-100"
            : "opacity-0"
        }`}
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
        }}
      />

      {/* =================================================
          NAVIGATION
          ================================================= */}

      <nav
        className="
          relative
          z-10
          w-full
          px-5
          py-4
          sm:px-8
          sm:py-5
          lg:px-10
          lg:py-5
          xl:px-14
          2xl:px-20
        "
      >
        <div className="relative flex w-full items-center justify-between">
          {/* =================================================
              LOGO
              ================================================= */}

          <a
            href="#home"
            aria-label="AKIVSOFT Home"
            onClick={closeMenu}
            className="
              relative
              z-40
              flex
              shrink-0
              items-center
              gap-1
              transition-transform
              duration-300
              hover:scale-[1.02]
            "
          >
            {/* A LOGO */}

            <div
              className="
                relative
                h-11
                w-11
                sm:h-12
                sm:w-12
                lg:h-14
                lg:w-14
                xl:h-16
                xl:w-16
                2xl:h-[4.25rem]
                2xl:w-[4.25rem]
              "
            >
              <Image
                src="/images/a-logo.png"
                alt="AKIVSOFT"
                fill
                priority
                sizes="68px"
                className="object-contain"
              />
            </div>

            {/* AKIVSOFT TEXT */}

            <div
              className="
                relative
                h-8
                w-[135px]
                sm:h-9
                sm:w-[150px]
                lg:h-10
                lg:w-[165px]
                xl:h-11
                xl:w-[180px]
                2xl:h-12
                2xl:w-[195px]
              "
            >
              <Image
                src="/images/akivsoft-text-img.png"
                alt="AKIVSOFT"
                fill
                priority
                sizes="195px"
                className="object-contain object-left"
              />
            </div>
          </a>

          {/* =================================================
              DESKTOP CENTER NAVIGATION
              ================================================= */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-20
              hidden
              w-[min(52vw,820px)]
              -translate-x-1/2
              -translate-y-1/2
              min-[1280px]:flex
            "
          >
            <div
              className="
                flex
                w-full
                min-w-0
                items-center
                justify-center
                gap-0
                min-[1400px]:gap-0.5
                min-[1536px]:gap-1
                min-[1700px]:gap-1.5
                min-[1900px]:gap-2.5
              "
            >
              {links.map((link) => {
                const isActive =
                  activeHref === link.href;

                return (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    aria-current={
                      isActive
                        ? "location"
                        : undefined
                    }
                    className={`
                      group
                      relative
                      z-0
                      flex
                      min-h-8
                      min-w-0
                      flex-1
                      items-center
                      justify-center
                      overflow-visible
                      whitespace-nowrap
                      rounded-full
                      px-[clamp(0.2rem,0.4vw,0.75rem)]
                      py-2
                      font-[var(--font-rajdhani)]
                      text-[clamp(0.64rem,0.64vw,0.98rem)]
                      font-normal
                      tracking-[0.04em]
                      text-white/80
                      transition-all
                      duration-300
                      hover:text-white
                      ${
                        isActive
                          ? "text-[#F0CA77]"
                          : ""
                      }
                    `}
                  >
                    {/* LABEL */}

                    <span
                      className="
                        relative
                        z-20
                      "
                    >
                      {link.label}
                    </span>

                    {/* =================================================
                        ACTIVE / HOVER UNDERLINE
                        ================================================= */}

                    <span
                      aria-hidden="true"
                      className={`
                        pointer-events-none
                        absolute
                        bottom-0
                        left-1/2
                        z-30
                        h-[2px]
                        -translate-x-1/2
                        rounded-full
                        bg-gradient-to-r
                        from-[#DE8A61]
                        via-[#F0CA77]
                        to-white
                        shadow-[0_0_6px_rgba(240,202,119,0.5),0_0_12px_rgba(240,202,119,0.25)]
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "w-1/2 opacity-100"
                            : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100"
                        }
                      `}
                    />

                    {/* =================================================
                        ACTIVE GLOW
                        ================================================= */}

                    <span
                      aria-hidden="true"
                      className={`
                        pointer-events-none
                        absolute
                        bottom-0
                        left-1/2
                        -z-10
                        h-5
                        -translate-x-1/2
                        rounded-full
                        bg-[#F0CA77]/20
                        blur-xl
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "w-3/4 opacity-100"
                            : "w-0 opacity-0"
                        }
                      `}
                    />

                    {/* =================================================
                        HOVER GLOW
                        ================================================= */}

                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        -z-20
                        rounded-full
                        bg-gradient-to-r
                        from-[#DE8A61]/0
                        via-[#F0CA77]/0
                        to-[#DE8A61]/0
                        opacity-0
                        blur-xl
                        transition-opacity
                        duration-300
                        group-hover:from-[#DE8A61]/10
                        group-hover:via-[#F0CA77]/10
                        group-hover:to-[#DE8A61]/10
                        group-hover:opacity-100
                      "
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* =================================================
              DESKTOP CTA
              ================================================= */}

          <div
            className="
              hidden
              shrink-0
              items-center
              min-[1280px]:flex
            "
          >
            <a
              href="#contact"
             className="artsy-button group">
                Start a Project


             <ArrowUpRight
                    size={18}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
              {/* CTA SHINE */}

 
            </a>
          </div>

          {/* =================================================
              MOBILE / TABLET MENU BUTTON
              ================================================= */}

          <button
            type="button"
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
            onClick={() =>
              setOpen((value) => !value)
            }
            className="
              relative
              z-40
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-[#15162D]/70
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-[#F0CA77]/40
              hover:text-[#F0CA77]
              min-[1280px]:hidden
            "
          >
            {open ? (
              <X
                size={19}
                aria-hidden="true"
              />
            ) : (
              <Menu
                size={19}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </nav>

      {/* =================================================
          MOBILE / TABLET MENU
          ================================================= */}

      <div
        className={`
          fixed
          inset-x-0
          top-0
          z-30
          min-[1280px]:hidden
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        {/* BACKDROP */}

        <div
          className={`
            absolute
            inset-0
            h-screen
            bg-[#0D1023]/80
            backdrop-blur-xl
            transition-opacity
            duration-300
            ${
              open
                ? "opacity-100"
                : "opacity-0"
            }
          `}
          onClick={closeMenu}
        />

        {/* MENU PANEL */}

        <div
          className={`
            relative
            mx-4
            mt-20
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#15162D]/95
            shadow-[0_20px_80px_rgba(0,0,0,0.4)]
            transition-all
            duration-300
            sm:mx-6
            sm:mt-24
            ${
              open
                ? "translate-y-0 scale-100"
                : "-translate-y-4 scale-[0.98]"
            }
          `}
        >
          {/* DECORATIVE GLOW */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-[#F0CA77]/10
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-24
              -left-20
              h-48
              w-48
              rounded-full
              bg-[#934C60]/15
              blur-3xl
            "
          />

          <div className="relative p-5 sm:p-7">
            {/* MENU LABEL */}

            <div className="mb-5 flex items-center gap-2">
              <Sparkles
                size={14}
                className="text-[#F0CA77]"
                aria-hidden="true"
              />

              <span
                className="
                  font-[var(--font-rajdhani)]
                  text-[0.65rem]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#C5BFD0]
                "
              >
                Navigation
              </span>
            </div>

            {/* MOBILE LINKS */}

            <div className="space-y-1">
              {links.map((link) => {
                const isActive =
                  activeHref === link.href;

                return (
                  <a
                    key={`mobile-${link.label}-${link.href}`}
                    href={link.href}
                    aria-current={
                      isActive
                        ? "location"
                        : undefined
                    }
                    onClick={closeMenu}
                    className={`
                      group
                      flex
                      min-h-12
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      font-[var(--font-rajdhani)]
                      text-sm
                      font-medium
                      tracking-[0.08em]
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "bg-[#F0CA77]/[0.07] text-[#F0CA77]"
                          : "text-white/75 hover:bg-white/[0.04] hover:text-white"
                      }
                    `}
                  >
                    <span>
                      {link.label}
                    </span>

                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className={`
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }
                      `}
                    />
                  </a>
                );
              })}
            </div>

            {/* MOBILE CTA */}

            <div className="mt-5 border-t border-white/10 pt-5">
              <a
                href="#contact"
                onClick={closeMenu}
                className="
                  group
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  artsy-button group
                "
              >
                <span>
                  Start a Project
                </span>

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}