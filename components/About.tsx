import { Gamepad2, Sparkles } from "lucide-react";

const values = [
  {
    letter: "A",
    name: "Artistry",
    number: "01",
    description: "Creativity is at the heart of everything we make.",
    accent: "from-[#DE8A61] to-[#F0CA77]",
  },
  {
    letter: "K",
    name: "Knowledge",
    number: "02",
    description: "We continuously learn, improve, and push our skills further.",
    accent: "from-[#71527B] to-[#DE8A61]",
  },
  {
    letter: "I",
    name: "Innovation",
    number: "03",
    description: "We explore new ideas, mechanics, technologies, and experiences.",
    accent: "from-[#3B4895] to-[#71527B]",
  },
  {
    letter: "V",
    name: "Vision",
    number: "04",
    description: "We look beyond what's possible today and imagine what's next.",
    accent: "from-[#934C60] to-[#F0CA77]",
  },
];

const framedPanelClassName =
  "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.035] via-[#3B4895]/[0.06] to-[#71527B]/[0.08] transition-colors duration-300 hover:border-[#F0CA77]/35";

const panelAccentClassName =
  "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CA77]/55 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100";

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 sm:py-24 md:py-36"
    >
      <div className="section-container relative z-10">
        <header className="mb-16 grid min-h-[65vh] content-center gap-10 xl:mb-24 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="pixel-dot" />
              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                About Akivsoft
              </p>
            </div>

            <h2 className="section-title text-[clamp(2.25rem,4.8vw,4.5rem)]">
              Four minds.
              <br />
              One vision.
              <br />
              <span className="gradient-text">Infinite creations.</span>
            </h2>
          </div>

          <div className="relative hidden xl:block xl:pl-8">
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-white/40">
                  Studio profile / 004
                </span>
                <Gamepad2 size={19} className="text-[#DE8A61]" />
              </div>

              <p className="font-ethnocentric text-6xl font-normal tracking-[-0.08em] text-white sm:text-7xl">
                <span className="gradient-text">AKIV</span>
                <span className="text-white/45">soft</span>
              </p>

              <div className="mt-8 flex flex-wrap gap-2 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-white/45">
                <span className="text-[#DE8A61]">Art</span>
                <span className="text-[#F0CA77]">Ideas</span>
                <span className="text-[#A995D7]">Games</span>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-14">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="pixel-dot" />
              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                Who We Are
              </p>
            </div>

            <h3 className="font-ethnocentric text-3xl font-normal uppercase leading-tight tracking-[-0.05em] text-white sm:text-4xl">
              A studio built
              <br />
              around play.
            </h3>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#3B4895]/20 via-[#71527B]/10 to-[#15162D]/55 p-6 shadow-[0_20px_70px_rgba(13,16,35,0.28)] sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-[#3B4895]/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CA77]/65 to-transparent"
            />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="pixel-dot" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#F0CA77]/80">
                    Studio notes
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.18em] text-white/30">
                  AKV / 001
                </span>
              </div>

              <div className="space-y-5">
                <p className="text-lg font-normal leading-relaxed text-white sm:text-xl md:text-2xl">
                  <span className="text-[#F0CA77]">Akivsoft</span> is an
                  independent studio focused on original games with expressive
                  visuals and satisfying mechanics.
                </p>

                <p className="max-w-3xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
                  Our small team brings art, systems, and code together through
                  close collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24 md:mt-32" aria-labelledby="akiv-values-title">
          <div className="mb-8 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Sparkles size={15} className="text-[#DE8A61]" />
                <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                  Principles we work by
                </p>
              </div>

              <h3 id="akiv-values-title" className="section-title">
                What AKIV
                <br />
                <span className="gradient-text">means.</span>
              </h3>
            </div>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.letter}
                className={`${framedPanelClassName} p-6 sm:p-7`}
              >
                <span aria-hidden="true" className={panelAccentClassName} />
                <div className="relative">
                  <div className="mb-7 flex items-start justify-between">
                    <span className={`bg-gradient-to-br ${value.accent} bg-clip-text font-ethnocentric text-6xl font-normal leading-none tracking-[-0.08em] text-transparent`}>
                      {value.letter}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/25">
                      {value.number}
                    </span>
                  </div>

                  <h4 className="mb-3 font-ethnocentric text-lg font-normal uppercase tracking-[-0.03em] text-white sm:text-xl">
                    {value.name}
                  </h4>

                  <p className="text-sm leading-relaxed text-[#C5BFD0]">
                    {value.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

        </section>

        <section className="mt-20 grid gap-10 sm:mt-24 md:mt-32 xl:grid-cols-[0.85fr_1.15fr] xl:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Gamepad2 size={17} className="text-[#DE8A61]" />
              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                What We Create
              </p>
            </div>

            <h3 className="section-title">
              Every game finds
              <br />
              <span className="gradient-text">its rhythm.</span>
            </h3>

            <div className="mt-6 max-w-2xl text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
              <p>
                Each project starts with a feeling, a playful challenge, or a
                world we want players to explore. That spark guides its
                mechanics, atmosphere, and art direction.
              </p>
            </div>
          </div>

          <div className="relative py-2 sm:py-4">
            <div className="relative">
              <div className="mb-7 flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-white/45">
                  Building blocks of a game
                </p>
                <Sparkles size={17} className="text-[#F0CA77]/80" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Mechanics", detail: "How it plays" },
                  { title: "Atmosphere", detail: "How it feels" },
                  { title: "World", detail: "Where it happens" },
                ].map((element, index) => (
                  <div
                    key={element.title}
                    className={`${framedPanelClassName} p-4 sm:p-5`}
                  >
                    <span aria-hidden="true" className={panelAccentClassName} />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-[#F0CA77]/60">
                          0{index + 1}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rotate-45 border border-[#DE8A61]/70"
                        />
                      </div>
                      <p className="mt-4 font-ethnocentric text-xs font-normal uppercase tracking-[0.04em] text-white sm:text-sm">
                        {element.title}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {element.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-5 sm:mt-24 md:mt-32 xl:grid-cols-2" aria-label="Our vision and journey">
          <article className={`${framedPanelClassName} p-6 sm:p-8`}>
            <span aria-hidden="true" className={panelAccentClassName} />
            <div className="relative">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles size={17} className="text-[#DE8A61]" />
                  <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77]">
                    Our Vision
                  </p>
                </div>
                <span className="font-mono text-[9px] tracking-[0.2em] text-white/25">01 / 02</span>
              </div>

              <h3 className="mb-5 font-ethnocentric text-2xl font-normal uppercase leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                Imagination has
                <br />
                <span className="gradient-text">no boundaries.</span>
              </h3>

              <div className="space-y-4 text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
                <p>
                  We want to grow a studio whose games travel beyond our own
                  circles and bring players together across the world.
                </p>
                <p className="text-[#F0CA77]">And this is only the beginning.</p>
              </div>
            </div>
          </article>

          <article className={`${framedPanelClassName} p-6 sm:p-8`}>
            <span aria-hidden="true" className={panelAccentClassName} />
            <div className="relative">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gamepad2 size={18} className="text-[#DE8A61]" />
                  <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77]">
                    Our Journey
                  </p>
                </div>
                <span className="font-mono text-[9px] tracking-[0.2em] text-white/25">02 / 02</span>
              </div>

              <h3 className="mb-5 font-ethnocentric text-2xl font-normal uppercase leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                One game
                <br />
                <span className="gradient-text">at a time.</span>
              </h3>

              <div className="space-y-4 text-sm leading-relaxed text-[#C5BFD0] sm:text-base">
                <p>
                  Every prototype gives us a new challenge and a chance to
                  refine our craft while we discover what makes each game fun.
                </p>
              </div>
            </div>
          </article>
        </section>

        <div className="relative mt-24 sm:mt-32 md:mt-40">
          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <span className="pixel-dot" />
              <p className="font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-[#F0CA77]/70 sm:text-xs">
                The reason we create
              </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h3 className="font-ethnocentric text-[clamp(2rem,7.2vw,6rem)] uppercase leading-[1.08] text-white">
                <span className="block">Where ideas</span>
                <span className="gradient-text block">become games.</span>
              </h3>

              <div className="flex items-center gap-4 pb-2 text-[#DE8A61] lg:shrink-0">
                <Gamepad2 size={34} strokeWidth={1.4} />
                <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-white/35 sm:text-[10px]">
                  Akivsoft
                  <br />
                  Game studio
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
