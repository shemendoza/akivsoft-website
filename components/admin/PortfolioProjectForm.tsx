
"use client";

import { useState } from "react";

import { createPortfolioProject } from "@/app/admin/portfolio/actions";
import type { PortfolioCategoryRecord } from "@/types/portfolio";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type ProjectContent = {
  kind: "Game" | "App" | "Web";
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
    tagline: string;
  };
};

type PortfolioProjectFormProps = {
  categories: PortfolioCategoryRecord[];
};

const FEATURE_ICON_OPTIONS = [
  { value: "✨", label: "✨ General Feature" },
  { value: "🚀", label: "🚀 Movement / Performance" },
  { value: "🛡️", label: "🛡️ Protection / Security" },
  { value: "⚡", label: "⚡ Speed / Power" },
  { value: "🎮", label: "🎮 Gameplay" },
  { value: "🌌", label: "🌌 Space / Exploration" },
  { value: "❤️", label: "❤️ Lives / Health" },
  { value: "🏆", label: "🏆 Achievement" },
  { value: "🧭", label: "🧭 Navigation" },
  { value: "💡", label: "💡 Ideas / Innovation" },
  { value: "🔒", label: "🔒 Privacy / Security" },
  { value: "📱", label: "📱 Mobile" },
  { value: "🎨", label: "🎨 Design / Creativity" },
  { value: "☁️", label: "☁️ Cloud / Online" },
  { value: "🔥", label: "🔥 Intensity" },
] as const;

const DEFAULT_CONTENT: ProjectContent = {
  kind: "App",
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
    tagline: "",
  },
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#77738B] focus:border-[#F0CA77]";

const labelClass = "mb-2 block text-sm text-[#FFFDF8]";

const sectionClass =
  "space-y-5 rounded-xl border border-white/10 bg-[#0D1023]/50 p-5";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PortfolioProjectForm({
  categories,
}: PortfolioProjectFormProps) {
  const [content, setContent] = useState<ProjectContent>(DEFAULT_CONTENT);

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
            The main information used to identify and organize this project.
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
              placeholder="e.g. Cosmic Shunner"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="project_number" className={labelClass}>
              Project Number
            </label>
            <input
              id="project_number"
              name="project_number"
              type="text"
              placeholder="e.g. 01"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              URL Slug <span className="text-[#DE8A61]">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Use lowercase letters, numbers, and hyphens only."
              placeholder="e.g. cosmic-shunner"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#8F8AA3]">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div>
            <label htmlFor="category_id" className={labelClass}>
              Portfolio Category <span className="text-[#DE8A61]">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="display_order" className={labelClass}>
              Display Order <span className="text-[#DE8A61]">*</span>
            </label>
            <input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              step="1"
              defaultValue="1"
              required
              className={inputClass}
            />
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

          <div className="sm:col-span-2">
            <label htmlFor="full_details" className={labelClass}>
              Full Details
            </label>
            <textarea
              id="full_details"
              name="full_details"
              rows={4}
              placeholder="Additional project information."
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
            <label htmlFor="kind" className={labelClass}>
              Project Type
            </label>
            <select
              id="kind"
              value={content.kind}
              onChange={(event) =>
                updateContent(
                  "kind",
                  event.target.value as "Game" | "App" | "Web"
                )
              }
              className={inputClass}
            >
              <option value="Game">Games</option>
              <option value="App">Application</option>
              <option value="Web">Website</option>
            </select>
          </div>

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
            <label htmlFor="detailsId" className={labelClass}>
              Details ID
            </label>
            <input
              id="detailsId"
              value={content.detailsId}
              onChange={(event) =>
                updateContent("detailsId", event.target.value)
              }
              placeholder="e.g. cosmic-shunner-details"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="genre" className={labelClass}>
              Primary Genre
            </label>
            <input
              id="genre"
              value={content.genre}
              onChange={(event) =>
                updateContent("genre", event.target.value)
              }
              placeholder="e.g. Arcade"
              className={inputClass}
            />
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="secondaryGenres" className={labelClass}>
              Secondary Genres
            </label>
            <textarea
              id="secondaryGenres"
              rows={3}
              value={content.secondaryGenres.join("\n")}
              onChange={(event) =>
                updateContent(
                  "secondaryGenres",
                  splitLines(event.target.value)
                )
              }
              placeholder={"Action\nCasual\nSurvival"}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="platforms" className={labelClass}>
              Platforms
            </label>
            <textarea
              id="platforms"
              rows={3}
              value={content.platforms.join("\n")}
              onChange={(event) =>
                updateContent("platforms", splitLines(event.target.value))
              }
              placeholder={"Android\nWindows\nWeb"}
              className={`${inputClass} resize-y`}
            />
          </div>

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
              <option value="Gamepad2">Gamepad2 — Games</option>
              <option value="Smartphone">Smartphone — Applications</option>
              <option value="Globe">Globe — Websites</option>
            </select>
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

          <div>
            <label htmlFor="closing-tagline" className={labelClass}>
              Closing Tagline
            </label>
            <input
              id="closing-tagline"
              value={content.closing.tagline}
              onChange={(event) =>
                updateClosing("tagline", event.target.value)
              }
              placeholder="A final project tagline."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <input
        type="hidden"
        name="content"
        value={JSON.stringify(content)}
      />

      <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#8F8AA3]">
          The project will initially be saved as an unpublished draft.
        </p>

        <button
          type="submit"
          disabled={categories.length === 0}
          className="rounded-xl bg-gradient-to-r from-[#3B4895] to-[#934C60] px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Project
        </button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-[#DE8A61]">
          Create a portfolio category before adding a project.
        </p>
      )}
    </form>
  );
}
