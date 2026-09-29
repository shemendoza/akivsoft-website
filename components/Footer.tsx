import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const services = [
  "Unity Game Development",
  "Game Concept & Design",
  "2D & 3D Game Creation",
  "Multiplayer & Online Games",
  "Mobile, PC & Console",
  "Game Art & Animation",
  "Optimization & Launch",
];

const socialLinks = [
{ label: "GitHub", href: "https://github.com/" },
{ label: "Facebook", href: "https://facebook.com/" },
{ label: "Instagram", href: "https://instagram.com/" },
];

export default function Footer() {
return ( <footer className="artsy-background relative overflow-hidden"> <div className="art-grid pointer-events-none absolute inset-0 opacity-25" /> <div className="noise" />

  {/* Final sunset atmosphere */}
  <div className="blob blob-blue -left-52 -top-52 h-[36rem] w-[36rem] opacity-25" />
  <div className="blob blob-purple right-[-14rem] top-[-8rem] h-[38rem] w-[38rem] opacity-25" />
  <div className="blob blob-pink left-[28%] bottom-[-16rem] h-[38rem] w-[38rem] opacity-18" />
  <div className="blob blob-orange right-[10%] bottom-[-12rem] h-[36rem] w-[36rem] opacity-22" />
  <div className="blob blob-gold right-[35%] top-[25%] h-40 w-40 opacity-15" />

  <div className="pointer-events-none absolute inset-0">
    <div className="pixel-dot absolute left-[8%] top-[22%]" />
    <div className="pixel-dot absolute left-[45%] top-[15%]" />
    <div className="pixel-dot absolute right-[15%] top-[20%]" />
    <div className="pixel-dot absolute right-[8%] bottom-[25%]" />
  </div>

  <div className="relative z-10 w-full px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20 2xl:px-24">
    <div className="grid gap-14 lg:grid-cols-[1.8fr_0.7fr_0.9fr_0.7fr] lg:items-center lg:gap-10 xl:grid-cols-[2fr_0.75fr_1fr_0.75fr] xl:gap-16">
      {/* Brand */}
      <div>
        <div className="mb-5 flex items-center gap-3">
          <span className="pixel-dot" />

          <p className="text-[10px] font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-xs">
            Akivsoft
          </p>
        </div>

        <h2 className="max-w-4xl text-[15vw] font-normal uppercase leading-[0.78] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl xl:text-9xl">
          Make
          <br />
          worlds
          <br />
          <span className="gradient-text">playable.</span>
        </h2>

        <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/40 sm:text-base">
          Playful by nature. Thoughtful by design.
        </p>

        <div className="mt-8 flex w-fit items-center gap-3 rounded-full bg-white/[0.04] px-4 py-2.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#DE8A61] shadow-[0_0_14px_rgba(222,138,97,0.8)]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
            Build mode: active
          </span>

          <Sparkles size={12} className="text-[#F0CA77]" />
        </div>
      </div>

      {/* Navigation */}
      <div>
        <h3 className="mb-6 text-[10px] font-normal uppercase tracking-[0.25em] text-[#F0CA77]/40 sm:text-xs">
          Navigation
        </h3>

        <div className="flex flex-col gap-3.5">
          {navigation.map((item) => (
            <Link 
            key={`${item.label}-${item.href}`}
              href={item.href}
              className="group flex w-fit items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
            >
              {item.label}

              <ArrowUpRight
                size={13}
                className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="mb-6 text-[10px] font-normal uppercase tracking-[0.25em] text-[#F0CA77]/40 sm:text-xs">
          Services
        </h3>

        <div className="flex flex-col gap-3.5">
          {services.map((service) => (
            <span
              key={service}
              className="w-fit text-sm text-white/45 transition-colors duration-200 hover:text-[#DE8A61]"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Social */}
      <div>
        <h3 className="mb-6 text-[10px] font-normal uppercase tracking-[0.25em] text-[#F0CA77]/40 sm:text-xs">
          Connect
        </h3>

        <div className="flex flex-col gap-3.5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group flex w-fit items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
            >
              {social.label}

              <ArrowUpRight
                size={13}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-16 pt-6 sm:mt-20">
      <div className="flex flex-col gap-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Akivsoft.</p>

        <div className="flex flex-wrap items-center gap-2">
          <span>Built with</span>
          <span className="text-[#DE8A61]">code</span>
          <span>&</span>
          <span className="text-[#F0CA77]">creativity</span>
          <span>&</span>
          <span className="text-[#934C60]">curiosity.</span>
        </div>
      </div>
    </div>
  </div>

  {/* Decorative pixel matrix */}
  <div className="pointer-events-none absolute bottom-10 left-[8%] hidden lg:block">
    <div className="grid grid-cols-4 gap-2 opacity-40">
      <span className="h-1.5 w-1.5 rounded-full bg-[#3B4895]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#71527B]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#934C60]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#DE8A61]" />

      <span className="h-1.5 w-1.5 rounded-full bg-[#F0CA77]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#934C60]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#71527B]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#3B4895]" />
    </div>
  </div>
</footer>

);
}
