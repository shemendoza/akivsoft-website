
"use client";

import { useState } from "react";

import { createPortfolioProject } from "@/app/akiv-base/admin/portfolio/actions";
import PendingSubmitButton from "@/components/admin/PendingSubmitButton";
import { Check } from "lucide-react";
type Feature = {
  icon: string;
  title: string;
  description: string;
};

type ProjectContent = {
  category: string;
  tagline: string;
  detailsId: string;
  description: string[];
  features: Feature[];
  genre: string;
  secondaryGenres: string[];
  platforms: string[];
  builtWith: string[];
  availability: string;
  icon: string;
  gradient: string;
  closing: {
    prompt: string;
    subline: string;
    brand: string;
  };
};

type PortfolioProjectFormProps = {
  categoryId: string;
  categoryName: string;
  onCancel?: () => void;
};

const GENRE_OPTIONS = [
  "Action",
  "Adventure",
  "Arcade",
  "Casual",
  "Educational",
  "Fighting",
  "Horror",
  "Music & Rhythm",
  "Platformer",
  "Puzzle",
  "Racing",
  "Role-Playing (RPG)",
  "Simulation",
  "Sports",
  "Strategy",
  "Survival",
  "Productivity",
  "Finance",
  "Health & Fitness",
  "Lifestyle",
  "Entertainment",
  "Social",
  "Communication",
  "E-commerce",
  "Business",
  "Portfolio",
  "Blog",
  "News",
  "Travel",
  "Utilities",
  "Other",
] as const;

const PLATFORM_OPTIONS = [
  "Mobile",
  "PC/Desktop",
  "Web",
] as const;

const DISPLAY_ICON_OPTIONS = [
  { value: "Gamepad2", label: "Gamepad — Games" },
  { value: "Smartphone", label: "Smartphone — Mobile Applications" },
  { value: "Globe", label: "Globe — Websites / Web Projects" },
  { value: "Monitor", label: "Monitor — Desktop Software" },
  { value: "Laptop", label: "Laptop — Computer Applications" },
  { value: "Tablet", label: "Tablet — Tablet Applications" },
  { value: "Code2", label: "Code — Development" },
  { value: "Layers", label: "Layers — Platforms / Systems" },
  { value: "Brain", label: "Brain — Artificial Intelligence" },
  { value: "BookOpen", label: "Book — Education / Learning" },
  { value: "BriefcaseBusiness", label: "Briefcase — Business" },
  { value: "Calculator", label: "Calculator — Finance / Tools" },
  { value: "CalendarDays", label: "Calendar — Scheduling" },
  { value: "Camera", label: "Camera — Photography" },
  { value: "Cloud", label: "Cloud — Cloud Services" },
  { value: "Compass", label: "Compass — Navigation" },
  { value: "Cpu", label: "CPU — Technology" },
  { value: "Database", label: "Database — Data Management" },
  { value: "GraduationCap", label: "Graduation Cap — Education" },
  { value: "HeartPulse", label: "Heart — Health / Fitness" },
  { value: "Image", label: "Image — Media / Graphics" },
  { value: "LayoutDashboard", label: "Dashboard — Admin / Analytics" },
  { value: "Map", label: "Map — Maps / Location" },
  { value: "MessageCircle", label: "Message — Communication" },
  { value: "Music2", label: "Music — Audio / Music" },
  { value: "Palette", label: "Palette — Design / Art" },
  { value: "Puzzle", label: "Puzzle — Problem Solving" },
  { value: "Rocket", label: "Rocket — Innovation / Launch" },
  { value: "ShoppingCart", label: "Shopping Cart — E-commerce" },
  { value: "Sparkles", label: "Sparkles — Creative Projects" },
  { value: "Terminal", label: "Terminal — Developer Tools" },
  { value: "Wallet", label: "Wallet — Money / Payments" },
  { value: "Wrench", label: "Wrench — Tools / Utilities" },
  { value: "Zap", label: "Zap — Performance / Energy" },
] as const;

const FEATURE_ICON_OPTIONS = [
  { value: "✨", label: "✨ General Feature" },
  { value: "🚀", label: "🚀 Movement / Performance" },
  { value: "🛡️", label: "🛡️ Protection / Security" },
  { value: "⚡", label: "⚡ Speed / Power" },
  { value: "🎮", label: "🎮 Gameplay" },
  { value: "🕹️", label: "🕹️ Controls / Gaming" },
  { value: "🌌", label: "🌌 Space / Exploration" },
  { value: "❤️", label: "❤️ Lives / Health" },
  { value: "🏆", label: "🏆 Achievement" },
  { value: "🧭", label: "🧭 Navigation" },
  { value: "💡", label: "💡 Ideas / Innovation" },
  { value: "🔒", label: "🔒 Privacy / Security" },
  { value: "📱", label: "📱 Mobile" },
  { value: "💻", label: "💻 Desktop / Computing" },
  { value: "🌐", label: "🌐 Online / Web" },
  { value: "🎨", label: "🎨 Design / Creativity" },
  { value: "☁️", label: "☁️ Cloud / Online" },
  { value: "🔥", label: "🔥 Intensity" },
  { value: "💎", label: "💎 Premium / Special" },
  { value: "🪙", label: "🪙 Coins / Currency" },
  { value: "🧲", label: "🧲 Magnet / Collection" },
  { value: "🎯", label: "🎯 Goals / Accuracy" },
  { value: "🧠", label: "🧠 Intelligence / Logic" },
  { value: "🧩", label: "🧩 Puzzles / Challenges" },
  { value: "🎵", label: "🎵 Music / Audio" },
  { value: "📚", label: "📚 Learning / Content" },
  { value: "🔔", label: "🔔 Notifications" },
  { value: "🤖", label: "🤖 Automation / AI" },
  { value: "🗺️", label: "🗺️ Maps / Locations" },
  { value: "🏁", label: "🏁 Racing / Completion" },
  { value: "🎲", label: "🎲 Random / Chance" },
  { value: "⚙️", label: "⚙️ Settings / Configuration" },
  { value: "🛠️", label: "🛠️ Tools / Customization" },
  { value: "📈", label: "📈 Growth / Progress" },
  { value: "📊", label: "📊 Statistics / Analytics" },
  { value: "💬", label: "💬 Communication" },
  { value: "🔍", label: "🔍 Search / Discovery" },
  { value: "📦", label: "📦 Inventory / Storage" },
  { value: "♻️", label: "♻️ Sustainability / Recycling" },
  { value: "🌟", label: "🌟 Highlights / Rewards" },
  { value: "🔑", label: "🔑 Access / Authentication" },
  { value: "📷", label: "📷 Camera / Capture" },
  { value: "⏱️", label: "⏱️ Time / Timer" },
  { value: "🌈", label: "🌈 Themes / Customization" },
] as const;

const DEFAULT_CONTENT: ProjectContent = {
  category: "",
  tagline: "",
  detailsId: "",
  description: [],
  features: [],
  genre: "",
  secondaryGenres: [],
  platforms: [],
  builtWith: [],
  availability: "Coming Soon",
  icon: "Smartphone",
  gradient: "from-[#3B4895] to-[#DE8A61]",
  closing: {
    prompt: "",
    subline: "",
    brand: "",
  },
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#77738B] focus:border-[#F0CA77]";

const labelClass = "mb-2 block text-sm text-[#FFFDF8]";

const sectionClass =
  "space-y-5 rounded-xl border border-white/10 bg-[#0D1023]/50 p-5";

const checkboxClass =
  "h-4 w-4 shrink-0 accent-[#DE8A61]";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PortfolioProjectForm({
  categoryId,
  categoryName,
  onCancel,
}: PortfolioProjectFormProps) {
  const [content, setContent] = useState<ProjectContent>(DEFAULT_CONTENT);
  const [title, setTitle] = useState("");

  const generatedSlug = normalizeSlug(title);
  const generatedDetailsId = generatedSlug
    ? `${generatedSlug}-details`
    : "";

  function updateContent<K extends keyof ProjectContent>(
    key: K,
    value: ProjectContent[K]
  ) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function updateClosing(
    key: keyof ProjectContent["closing"],
    value: string
  ) {
    setContent((current) => ({
      ...current,
      closing: {
        ...current.closing,
        [key]: value,
      },
    }));
  }

  function toggleArrayValue(
    key: "secondaryGenres" | "platforms",
    value: string,
    checked: boolean
  ) {
    setContent((current) => {
      const currentValues = current[key];

      return {
        ...current,
        [key]: checked
          ? [...currentValues.filter((item) => item !== value), value]
          : currentValues.filter((item) => item !== value),
      };
    });
  }

  function updateFeature(
    index: number,
    key: keyof Feature,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index
          ? { ...feature, [key]: value }
          : feature
      ),
    }));
  }

  function addFeature() {
    setContent((current) => ({
      ...current,
      features: [
        ...current.features,
        { icon: "✨", title: "", description: "" },
      ],
    }));
  }

  function removeFeature(index: number) {
    setContent((current) => ({
      ...current,
      features: current.features.filter(
        (_, featureIndex) => featureIndex !== index
      ),
    }));
  }

  return (
    <form
      action={createPortfolioProject}
      className="space-y-8 rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl sm:p-8"
    >
      <input type="hidden" name="category_id" value={categoryId} />

      <div>
        <h3 className="font-ethnocentric text-base text-[#F0CA77]">
          Add New Project
        </h3>

        <p className="mt-2 text-sm text-[#C5BFD0]">
          Create a portfolio project using the fields below. New projects are
          saved as unpublished drafts.
        </p>
      </div>

      <section className={sectionClass}>
        <div>
          <h4 className="font-semibold text-[#F0CA77]">
            Basic Information
          </h4>

          <p className="mt-1 text-xs text-[#8F8AA3]">
            Project numbers and URL identifiers are generated automatically.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Project Title <span className="text-[#DE8A61]">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Cosmic Shunner"
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>Portfolio Category</span>

            <div className={`${inputClass} flex items-center`}>
              {categoryName}
            </div>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-white/10 bg-[#15162D]/70 p-4">
            <p className="text-xs font-semibold text-[#F0CA77]">
              Automatically Generated Identifiers
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs text-[#8F8AA3]">
                  URL Slug
                </span>

                <p className="mt-1 break-all text-sm text-[#FFFDF8]">
                  {generatedSlug || "Enter a project title"}
                </p>
              </div>

              <div>
                <span className="block text-xs text-[#8F8AA3]">
                  Details ID
                </span>

                <p className="mt-1 break-all text-sm text-[#FFFDF8]">
                  {generatedDetailsId || "Generated from the project title"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#8F8AA3]">
              The project number is assigned according to its position in the
              selected category. These identifiers update automatically when
              the project title changes.
            </p>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>
              Project Image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="w-full rounded-xl border border-white/10 bg-[#0D1023] px-3 py-2.5 text-sm text-[#C5BFD0] file:mr-3 file:rounded-lg file:border-0 file:bg-[#3B4895] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
            />

            <p className="mt-2 text-xs text-[#8F8AA3]">
              JPEG, PNG, or WebP. Maximum 10 MB.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="short_description" className={labelClass}>
              Short Description <span className="text-[#DE8A61]">*</span>
            </label>

            <textarea
              id="short_description"
              name="short_description"
              required
              rows={3}
              placeholder="A short introduction for this project."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div>
          <h4 className="font-semibold text-[#F0CA77]">
            Portfolio Display Content
          </h4>

          <p className="mt-1 text-xs text-[#8F8AA3]">
            Content displayed in the project carousel and project details.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="content_category" className={labelClass}>
              Project Label
            </label>

            <input
              id="content_category"
              value={content.category}
              onChange={(event) =>
                updateContent("category", event.target.value)
              }
              placeholder="e.g. Game Development"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tagline" className={labelClass}>
              Tagline
            </label>

            <input
              id="tagline"
              value={content.tagline}
              onChange={(event) =>
                updateContent("tagline", event.target.value)
              }
              placeholder="A short, memorable phrase."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="genre" className={labelClass}>
              Primary Genre
            </label>

            <select
              id="genre"
              value={content.genre}
              onChange={(event) =>
                updateContent("genre", event.target.value)
              }
              className={inputClass}
            >
              <option value="">Select a primary genre</option>

              {GENRE_OPTIONS.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="availability" className={labelClass}>
              Availability
            </label>

            <select
              id="availability"
              value={content.availability}
              onChange={(event) =>
                updateContent("availability", event.target.value)
              }
              className={inputClass}
            >
              <option value="Coming Soon">Coming Soon</option>
              <option value="Available Now">Available Now</option>
              <option value="In Development">In Development</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Project Description
          </label>

          <textarea
            id="description"
            rows={6}
            value={content.description.join("\n")}
            onChange={(event) =>
              updateContent("description", splitLines(event.target.value))
            }
            placeholder={
              "Write one paragraph per line.\n\nEach line becomes a separate paragraph."
            }
            className={`${inputClass} resize-y leading-relaxed`}
          />

          <p className="mt-2 text-xs text-[#8F8AA3]">
            Enter each paragraph on a separate line.
          </p>
        </div>

        <div>
          <span className={labelClass}>Secondary Genres</span>

          <p className="mb-3 text-xs text-[#8F8AA3]">
            Select all genres that also describe this project.
          </p>

          <div className="grid gap-3 rounded-xl border border-white/10 bg-[#15162D]/70 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {GENRE_OPTIONS.map((genre) => (
              <label
                key={genre}
                className="flex cursor-pointer items-center gap-2 text-xs text-[#C5BFD0] transition hover:text-[#FFFDF8]"
              >
                <input
                  type="checkbox"
                  checked={content.secondaryGenres.includes(genre)}
                  onChange={(event) =>
                    toggleArrayValue(
                      "secondaryGenres",
                      genre,
                      event.target.checked
                    )
                  }
                  className={checkboxClass}
                />

                {genre}
              </label>
            ))}
          </div>

          {content.secondaryGenres.length > 0 && (
            <p className="mt-3 text-xs text-[#DE8A61]">
              Selected: {content.secondaryGenres.join(", ")}
            </p>
          )}
        </div>

        <div>
          <span className={labelClass}>Platforms</span>

          <p className="mb-3 text-xs text-[#8F8AA3]">
            Select every platform where this project is available or intended
            to run.
          </p>

          <div className="grid gap-3 rounded-xl border border-white/10 bg-[#15162D]/70 p-4 sm:grid-cols-3">
            {PLATFORM_OPTIONS.map((platform) => (
              <label
                key={platform}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#C5BFD0] transition hover:text-[#FFFDF8]"
              >
                <input
                  type="checkbox"
                  checked={content.platforms.includes(platform)}
                  onChange={(event) =>
                    toggleArrayValue(
                      "platforms",
                      platform,
                      event.target.checked
                    )
                  }
                  className={checkboxClass}
                />

                {platform}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="builtWith" className={labelClass}>
              Built With / Technologies
            </label>

            <textarea
              id="builtWith"
              rows={3}
              value={content.builtWith.join("\n")}
              onChange={(event) =>
                updateContent("builtWith", splitLines(event.target.value))
              }
              placeholder={"Flutter\nDart\nSupabase"}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="icon" className={labelClass}>
              Display Icon
            </label>

            <select
              id="icon"
              value={content.icon}
              onChange={(event) =>
                updateContent("icon", event.target.value)
              }
              className={inputClass}
            >
              {DISPLAY_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-[#8F8AA3]">
              Choose an icon that best represents the project.
            </p>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-semibold text-[#F0CA77]">
              Project Features
            </h4>

            <p className="mt-1 text-xs text-[#8F8AA3]">
              Add the features that explain what makes this project useful or
              distinctive.
            </p>
          </div>

          <button
            type="button"
            onClick={addFeature}
            className="rounded-lg border border-[#F0CA77]/30 px-4 py-2 text-xs font-semibold text-[#F0CA77] transition hover:bg-[#F0CA77]/10"
          >
            + Add Feature
          </button>
        </div>

        {content.features.length === 0 && (
          <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-sm text-[#8F8AA3]">
            No features added yet.
          </p>
        )}

        {content.features.map((feature, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-white/10 bg-[#15162D]/70 p-4"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-semibold text-[#FFFDF8]">
                Feature {index + 1}
              </h5>

              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-xs text-[#DE8A61] transition hover:text-[#F0CA77]"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`feature-icon-${index}`}
                  className={labelClass}
                >
                  Feature Icon
                </label>

                <select
                  id={`feature-icon-${index}`}
                  value={feature.icon || "✨"}
                  onChange={(event) =>
                    updateFeature(index, "icon", event.target.value)
                  }
                  className={inputClass}
                >
                  {FEATURE_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`feature-title-${index}`}
                  className={labelClass}
                >
                  Feature Title
                </label>

                <input
                  id={`feature-title-${index}`}
                  value={feature.title}
                  onChange={(event) =>
                    updateFeature(index, "title", event.target.value)
                  }
                  placeholder="e.g. Endless Cosmic Journey"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor={`feature-description-${index}`}
                  className={labelClass}
                >
                  Feature Description
                </label>

                <textarea
                  id={`feature-description-${index}`}
                  rows={2}
                  value={feature.description}
                  onChange={(event) =>
                    updateFeature(index, "description", event.target.value)
                  }
                  placeholder="Explain this feature."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className={sectionClass}>
        <div>
          <h4 className="font-semibold text-[#F0CA77]">
            Appearance
          </h4>

          <p className="mt-1 text-xs text-[#8F8AA3]">
            Configure the gradient styling used by the portfolio display.
          </p>
        </div>

        <div>
          <label htmlFor="gradient" className={labelClass}>
            Tailwind Gradient Classes
          </label>

          <input
            id="gradient"
            value={content.gradient}
            onChange={(event) =>
              updateContent("gradient", event.target.value)
            }
            placeholder="from-[#3B4895] to-[#DE8A61]"
            className={inputClass}
          />

          <p className="mt-2 text-xs text-[#8F8AA3]">
            Example: from-[#3B4895] to-[#DE8A61]
          </p>
        </div>
      </section>

      <section className={sectionClass}>
        <div>
          <h4 className="font-semibold text-[#F0CA77]">
            Closing Section
          </h4>

          <p className="mt-1 text-xs text-[#8F8AA3]">
            Optional final message displayed at the end of the project details.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="closing-prompt" className={labelClass}>
              Closing Prompt
            </label>

            <input
              id="closing-prompt"
              value={content.closing.prompt}
              onChange={(event) =>
                updateClosing("prompt", event.target.value)
              }
              placeholder="e.g. Can you survive the infinite void?"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="closing-subline" className={labelClass}>
              Closing Subline
            </label>

            <input
              id="closing-subline"
              value={content.closing.subline}
              onChange={(event) =>
                updateClosing("subline", event.target.value)
              }
              placeholder="A supporting closing message."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="closing-brand" className={labelClass}>
              Closing Brand
            </label>

            <input
              id="closing-brand"
              value={content.closing.brand}
              onChange={(event) =>
                updateClosing("brand", event.target.value)
              }
              placeholder="e.g. Cosmic Shunner"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <input
        type="hidden"
        name="content"
        value={JSON.stringify({
          ...content,
          detailsId: generatedDetailsId,
          closing: {
            prompt: content.closing.prompt,
            subline: content.closing.subline,
            brand: content.closing.brand,
          },
        })}
      />

      <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#8F8AA3]">
          The project will initially be saved as an unpublished draft.
        </p>

        <div className="flex flex-wrap gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
            >
              Cancel
            </button>
          )}

          <PendingSubmitButton
            pendingText="Creating..."
            disabled={!categoryId}
            className="inline-flex items-center gap-2 rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={15} />
            Create Project
          </PendingSubmitButton>
        </div>
      </div>
    </form>
  );
}
