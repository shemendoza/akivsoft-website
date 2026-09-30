"use client";

import { ArrowUpRight, Check, Mail, MessageCircle, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

const services = [
  "Game Development",
  "Game Concept & Design",
  "2D & 3D Game Development",
  "Multiplayer & Online Games",
  "Mobile Game Development",
  "PC & Console Game Development",
  "Game Art & Animation",
  "Sound & Game Audio",
  "Optimization & Testing",
  "Launch & Support",
  "Other",
];

export default function Contact() {
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [submissionError, setSubmissionError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmissionStatus("sending");
    setSubmissionError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "We couldn't send your message. Please try again.",
        );
      }

      form.reset();
      setSubmissionStatus("success");
    } catch (error) {
      setSubmissionStatus("error");
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again.",
      );
    }
  };

  return (
    <section
      id="contact"
      className="artsy-background relative overflow-hidden py-20 sm:py-24 md:py-36"
    >
      <div className="art-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="noise" />

      <div className="blob blob-blue -left-80 top-[-12rem] h-[44rem] w-[44rem] opacity-25" />
      <div className="blob blob-purple right-[-18rem] top-[8%] h-[42rem] w-[42rem] opacity-30" />
      <div className="blob blob-pink left-[15%] bottom-[-14rem] h-[40rem] w-[40rem] opacity-20" />
      <div className="blob blob-orange right-[15%] bottom-[-8rem] h-[38rem] w-[38rem] opacity-30" />
      <div className="blob blob-gold left-[48%] top-[28%] h-48 w-48 opacity-20" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="pixel-dot absolute left-[8%] top-[20%]" />
        <div className="pixel-dot absolute left-[38%] top-[14%]" />
        <div className="pixel-dot absolute right-[14%] top-[25%]" />
        <div className="pixel-dot absolute right-[8%] bottom-[22%]" />
        <div className="pixel-dot absolute left-[25%] bottom-[15%]" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="pixel-dot" />
              <p className="text-xs font-normal uppercase tracking-[0.3em] text-[#F0CA77] sm:text-sm">
                Start a project
              </p>
            </div>

            <h2 className="section-title">
              Got a game
              <br />
              <span className="gradient-text">idea?</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#C5BFD0] sm:text-xl">
              Tell us the genre, target platform, or mechanic you want players
              to experience in your Unity game.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Concepts", "Prototypes", "Full game development"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#F0CA77]/10 px-3.5 py-2 font-[var(--font-rajdhani)] text-xs font-normal uppercase tracking-[0.12em] text-[#F0CA77] sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2">
              <a
                href="mailto:akivsoft@gmail.com"
                className="artsy-card group flex items-center gap-4 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#DE8A61]/10 text-[#DE8A61] transition-all duration-300 group-hover:bg-[#DE8A61] group-hover:text-[#15162D]">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Email
                  </p>
                  <p className="mt-1 truncate text-sm text-white/70">
                    akivsoft@gmail.com
                  </p>
                </div>
              </a>

              <div className="artsy-card flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#3B4895]/20 text-[#F0CA77]">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Availability
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Open for projects
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 lg:flex">
              <span className="text-[#DE8A61]">&gt;</span>
              <span>project.inquiry</span>
              <span className="text-[#F0CA77]">READY</span>
            </div>
          </div>

          <div className="relative">
            <div className="artsy-card relative overflow-hidden p-5 sm:p-7 md:p-9">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#DE8A61]/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#3B4895]/15 blur-3xl" />
              <div className="relative">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles size={15} className="text-[#F0CA77]" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                        Project inquiry
                      </span>
                    </div>
                    <h3 className="text-2xl font-normal text-white sm:text-3xl">
                      Project details
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] text-white/20">
                    FORM_001
                  </span>
                </div>

                {submissionStatus === "success" ? (
                  <div
                    className="flex min-h-[430px] flex-col items-center justify-center text-center"
                    aria-live="polite"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DE8A61] text-[#15162D] shadow-[0_0_70px_rgba(222,138,97,0.3)]">
                      <Check size={36} />
                    </div>
                    <h3 className="text-3xl font-normal text-white">
                      Message sent.
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#C5BFD0]">
                      Thanks for reaching out. Your project inquiry was sent to
                      the Akivsoft team.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmissionStatus("idle")}
                      className="artsy-button mt-8"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <label
                      aria-hidden="true"
                      className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                    >
                      Leave this field empty
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/40">
                          Name
                        </span>
                        <input
                          required
                          type="text"
                          name="name"
                          maxLength={100}
                          placeholder="Your name"
                          className="w-full rounded-2xl border border-white/10 bg-[#0D1023]/40 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-[#DE8A61]/60 focus:bg-[#0D1023]/60 focus:ring-2 focus:ring-[#DE8A61]/10"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/40">
                          Email
                        </span>
                        <input
                          required
                          type="email"
                          name="email"
                          maxLength={254}
                          placeholder="you@example.com"
                          className="w-full rounded-2xl border border-white/10 bg-[#0D1023]/40 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-[#DE8A61]/60 focus:bg-[#0D1023]/60 focus:ring-2 focus:ring-[#DE8A61]/10"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/40">
                        Service
                      </span>
                      <select
                        required
                        name="service"
                        defaultValue=""
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-[#0D1023]/40 px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-[#DE8A61]/60 focus:bg-[#0D1023]/60 focus:ring-2 focus:ring-[#DE8A61]/10"
                      >
                        <option value="" disabled className="bg-[#15162D]">
                          Choose a service
                        </option>
                        {services.map((service) => (
                          <option
                            key={service}
                            value={service}
                            className="bg-[#15162D]"
                          >
                            {service}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/40">
                        Message
                      </span>
                      <textarea
                        required
                        name="message"
                        rows={7}
                        maxLength={4000}
                        placeholder="Describe the scope, platform, or goals..."
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#0D1023]/40 px-4 py-3.5 text-sm leading-relaxed text-white outline-none transition-all placeholder:text-white/20 focus:border-[#DE8A61]/60 focus:bg-[#0D1023]/60 focus:ring-2 focus:ring-[#DE8A61]/10"
                      />
                    </label>

                    {submissionStatus === "error" && (
                      <p
                        role="alert"
                        className="rounded-xl border border-[#DE8A61]/30 bg-[#DE8A61]/[0.08] px-4 py-3 text-sm leading-relaxed text-[#F4C5A8]"
                      >
                        {submissionError} If this keeps happening, email{" "}
                        <a
                          className="underline underline-offset-4"
                          href="mailto:akivsoft@gmail.com"
                        >
                          akivsoft@gmail.com
                        </a>
                        .
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submissionStatus === "sending"}
                      className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#DE8A61] to-[#F0CA77] px-6 text-sm font-normal text-[#15162D] shadow-[0_15px_45px_rgba(222,138,97,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(222,138,97,0.32)] disabled:cursor-wait disabled:opacity-70"
                    >
                      {submissionStatus === "sending"
                        ? "Sending..."
                        : "Send Message"}
                      {submissionStatus !== "sending" && (
                        <ArrowUpRight
                          size={18}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      )}
                    </button>

                    <p
                      className="text-center text-[10px] leading-relaxed text-white/25"
                      aria-live="polite"
                    >
                      Your message will be sent securely to akivsoft@gmail.com.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
