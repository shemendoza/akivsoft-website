
"use client";

import { useState } from "react";

import {
  updatePortfolioProject,
  togglePortfolioProjectPublished,
  deletePortfolioProject,
} from "@/app/admin/portfolio/actions";

import type {
  PortfolioCategoryRecord,
  PortfolioProjectRecord,
  PortfolioProjectDetailRecord,
} from "@/types/portfolio";

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
  [key: string]: unknown;
};

type EditingProject = {
  id: string;
  title: string;
  slug: string;
  project_number: string;
  category_id: string;
  short_description: string;
  full_details: string;
  display_order: string;
};

type PortfolioProjectManagerProps = {
  categories: PortfolioCategoryRecord[];
  projects: PortfolioProjectRecord[];
  details: PortfolioProjectDetailRecord[];
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

const LEGACY_FEATURE_ICON_MAP: Record<string, string> = {
  Move: "🚀",
  Shield: "🛡️",
  Zap: "⚡",
};

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
  "w-full rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#77738B] focus:border-[#F0CA77]";

const labelClass = "mb-2 block text-sm text-[#C5BFD0]";

const sectionClass =
  "space-y-5 rounded-xl border border-white/10 bg-[#0D1023]/50 p-5";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeContent(value: unknown): ProjectContent {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const rawClosing =
    source.closing &&
    typeof source.closing === "object" &&
    !Array.isArray(source.closing)
      ? (source.closing as Record<string, unknown>)
      : {};

  const rawFeatures = Array.isArray(source.features)
    ? source.features
    : [];

  const features: Feature[] = rawFeatures
    .filter(
      (feature): feature is Record<string, unknown> =>
        Boolean(feature) &&
        typeof feature === "object" &&
        !Array.isArray(feature)
    )
    .map((feature) => {
      const rawIcon = stringValue(feature.icon);

      return {
        icon: LEGACY_FEATURE_ICON_MAP[rawIcon] ?? (rawIcon || "✨"),
        title: stringValue(feature.title),
        description: stringValue(feature.description),
      };
    });

  const kind =
    source.kind === "Game" ||
    source.kind === "App" ||
    source.kind === "Web"
      ? source.kind
      : DEFAULT_CONTENT.kind;

  return {
    ...DEFAULT_CONTENT,
    ...source,
    kind,
    category: stringValue(source.category),
    tagline: stringValue(source.tagline),
    detailsId: stringValue(source.detailsId),
    description: stringArray(source.description),
    features,
    genre: stringValue(source.genre),
    secondaryGenres: stringArray(source.secondaryGenres),
    platforms: stringArray(source.platforms),
    builtWith: stringArray(source.builtWith),
    availability: stringValue(
      source.availability,
      DEFAULT_CONTENT.availability
    ),
    icon: stringValue(source.icon, DEFAULT_CONTENT.icon),
    gradient: stringValue(source.gradient, DEFAULT_CONTENT.gradient),
    closing: {
      ...DEFAULT_CONTENT.closing,
      ...rawClosing,
      prompt: stringValue(rawClosing.prompt),
      subline: stringValue(rawClosing.subline),
      brand: stringValue(rawClosing.brand),
      tagline: stringValue(rawClosing.tagline),
    },
  };
}

export default function PortfolioProjectManager({
  categories,
  projects,
  details,
}: PortfolioProjectManagerProps) {
  const [editingProject, setEditingProject] =
    useState<EditingProject | null>(null);

  const [content, setContent] = useState<ProjectContent>(DEFAULT_CONTENT);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedJson, setAdvancedJson] = useState("");
  const [jsonError, setJsonError] = useState("");

  const detailsByProject = new Map(
    details.map((detail) => [detail.project_id, detail.content])
  );

  function startEditing(project: PortfolioProjectRecord) {
    const projectContent = normalizeContent(
      detailsByProject.get(project.id) ?? {}
    );

    setEditingProject({
      id: project.id,
      title: project.title,
      slug: project.slug,
      project_number: project.project_number ?? "",
      category_id: project.category_id,
      short_description: project.short_description,
      full_details: project.full_details,
      display_order: String(project.display_order),
    });

    setContent(projectContent);
    setAdvancedJson(JSON.stringify(projectContent, null, 2));
    setAdvancedMode(false);
    setJsonError("");
  }

  function closeEditor() {
    setEditingProject(null);
    setAdvancedMode(false);
    setJsonError("");
  }

  function updateProjectField(
    field: keyof EditingProject,
    value: string
  ) {
    setEditingProject((current) =>
      current ? { ...current, [field]: value } : current
    );
  }

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

  function enableAdvancedEditor() {
    setAdvancedJson(JSON.stringify(content, null, 2));
    setJsonError("");
    setAdvancedMode(true);
  }

  function returnToVisualEditor() {
    try {
      const parsed = JSON.parse(advancedJson);
      setContent(normalizeContent(parsed));
      setAdvancedMode(false);
      setJsonError("");
    } catch {
      setJsonError(
        "The JSON is invalid. Correct the syntax before returning to the visual editor."
      );
    }
  }

  function validateForm(event: React.FormEvent<HTMLFormElement>) {
    if (!advancedMode) return;

    try {
      JSON.parse(advancedJson);
      setJsonError("");
    } catch {
      event.preventDefault();
      setJsonError("Please correct the JSON syntax before saving.");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-ethnocentric text-lg text-[#F0CA77]">
            Project Management
          </h2>

          <p className="mt-2 text-sm text-[#C5BFD0]">
            Edit, publish, reorder, and remove your portfolio projects.
          </p>
        </div>

        <p className="text-sm text-[#C5BFD0]">
          {projects.length} projects
        </p>
      </div>

      {editingProject && (
        <form
          action={updatePortfolioProject}
          onSubmit={validateForm}
          className="space-y-6 rounded-2xl border border-[#F0CA77]/20 bg-[#15162D]/90 p-5 backdrop-blur-xl sm:p-7"
        >
          <input
            type="hidden"
            name="id"
            value={editingProject.id}
          />

          <input
            type="hidden"
            name="content"
            value={
              advancedMode
                ? advancedJson
                : JSON.stringify(content)
            }
          />

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-ethnocentric text-sm text-[#F0CA77]">
                Edit Project
              </h3>

              <p className="mt-2 text-sm text-[#C5BFD0]">
                Update the project's information and portfolio display content.
              </p>
            </div>

            <button
              type="button"
              onClick={closeEditor}
              className="self-start rounded-lg border border-white/15 px-4 py-2 text-xs text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
            >
              Close Editor
            </button>
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
              <label>
                <span className={labelClass}>Project Title *</span>
                <input
                  required
                  name="title"
                  value={editingProject.title}
                  onChange={(event) =>
                    updateProjectField("title", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Project Number</span>
                <input
                  name="project_number"
                  value={editingProject.project_number}
                  onChange={(event) =>
                    updateProjectField("project_number", event.target.value)
                  }
                  placeholder="e.g. 01"
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>URL Slug *</span>
                <input
                  required
                  name="slug"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Use lowercase letters, numbers, and hyphens only."
                  value={editingProject.slug}
                  onChange={(event) =>
                    updateProjectField("slug", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Portfolio Category *</span>
                <select
                  required
                  name="category_id"
                  value={editingProject.category_id}
                  onChange={(event) =>
                    updateProjectField("category_id", event.target.value)
                  }
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className={labelClass}>Display Order *</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  name="display_order"
                  value={editingProject.display_order}
                  onChange={(event) =>
                    updateProjectField("display_order", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Replace Project Image</span>
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-2.5 text-xs text-[#C5BFD0] file:mr-3 file:rounded-lg file:border-0 file:bg-[#3B4895] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
                <p className="mt-2 text-xs text-[#8F8AA3]">
                  JPEG, PNG, or WebP. Maximum 10 MB.
                </p>
              </label>

              <label className="sm:col-span-2">
                <span className={labelClass}>Short Description *</span>
                <textarea
                  required
                  name="short_description"
                  rows={3}
                  value={editingProject.short_description}
                  onChange={(event) =>
                    updateProjectField(
                      "short_description",
                      event.target.value
                    )
                  }
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </label>

              <label className="sm:col-span-2">
                <span className={labelClass}>Full Details</span>
                <textarea
                  name="full_details"
                  rows={4}
                  value={editingProject.full_details}
                  onChange={(event) =>
                    updateProjectField("full_details", event.target.value)
                  }
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </label>
            </div>
          </section>

          <label className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
            <input
              type="checkbox"
              name="remove_image"
              value="true"
              className="mt-1 accent-[#DE8A61]"
            />

            <span>
              <span className="block text-sm text-red-300">
                Remove current project image
              </span>
              <span className="mt-1 block text-xs text-[#C5BFD0]">
                This removes the existing image unless you upload a replacement.
              </span>
            </span>
          </label>

          {!advancedMode ? (
            <>
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
                  <label>
                    <span className={labelClass}>Project Type</span>
                    <select
                      value={content.kind}
                      onChange={(event) =>
                        updateContent(
                          "kind",
                          event.target.value as ProjectContent["kind"]
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Game">Games</option>
                      <option value="App">Application</option>
                      <option value="Web">Website</option>
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>Project Label</span>
                    <input
                      value={content.category}
                      onChange={(event) =>
                        updateContent("category", event.target.value)
                      }
                      placeholder="e.g. Game Development"
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Tagline</span>
                    <input
                      value={content.tagline}
                      onChange={(event) =>
                        updateContent("tagline", event.target.value)
                      }
                      placeholder="A short, memorable phrase."
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Details ID</span>
                    <input
                      value={content.detailsId}
                      onChange={(event) =>
                        updateContent("detailsId", event.target.value)
                      }
                      placeholder="e.g. cosmic-shunner-details"
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Primary Genre</span>
                    <input
                      value={content.genre}
                      onChange={(event) =>
                        updateContent("genre", event.target.value)
                      }
                      placeholder="e.g. Arcade"
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Availability</span>
                    <select
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
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Project Description</label>
                  <textarea
                    rows={6}
                    value={content.description.join("\n")}
                    onChange={(event) =>
                      updateContent(
                        "description",
                        splitLines(event.target.value)
                      )
                    }
                    placeholder={
                      "Write one paragraph per line.\nEach line becomes a separate paragraph."
                    }
                    className={`${inputClass} resize-y leading-relaxed`}
                  />
                  <p className="mt-2 text-xs text-[#8F8AA3]">
                    Enter each paragraph on a separate line.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Secondary Genres</span>
                    <textarea
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
                  </label>

                  <label>
                    <span className={labelClass}>Platforms</span>
                    <textarea
                      rows={3}
                      value={content.platforms.join("\n")}
                      onChange={(event) =>
                        updateContent(
                          "platforms",
                          splitLines(event.target.value)
                        )
                      }
                      placeholder={"Android\nWindows\nWeb"}
                      className={`${inputClass} resize-y`}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>
                      Built With / Technologies
                    </span>
                    <textarea
                      rows={3}
                      value={content.builtWith.join("\n")}
                      onChange={(event) =>
                        updateContent(
                          "builtWith",
                          splitLines(event.target.value)
                        )
                      }
                      placeholder={"Unity\nC#\nFlutter"}
                      className={`${inputClass} resize-y`}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Display Icon</span>
                    <select
                      value={content.icon}
                      onChange={(event) =>
                        updateContent("icon", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="Gamepad2">Gamepad2 — Games</option>
                      <option value="Smartphone">
                        Smartphone — Applications
                      </option>
                      <option value="Globe">Globe — Websites</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className={sectionClass}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-[#F0CA77]">
                      Project Features
                    </h4>
                    <p className="mt-1 text-xs text-[#8F8AA3]">
                      Add the features that explain what makes this project useful or distinctive.
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
                      <label>
                        <span className={labelClass}>Feature Icon</span>
                        <select
                          value={
                            FEATURE_ICON_OPTIONS.some(
                              (option) => option.value === feature.icon
                            )
                              ? feature.icon
                              : feature.icon || "✨"
                          }
                          onChange={(event) =>
                            updateFeature(index, "icon", event.target.value)
                          }
                          className={inputClass}
                        >
                          {feature.icon &&
                            !FEATURE_ICON_OPTIONS.some(
                              (option) => option.value === feature.icon
                            ) && (
                              <option value={feature.icon}>
                                Current: {feature.icon}
                              </option>
                            )}

                          {FEATURE_ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span className={labelClass}>Feature Title</span>
                        <input
                          value={feature.title}
                          onChange={(event) =>
                            updateFeature(index, "title", event.target.value)
                          }
                          placeholder="e.g. Endless Cosmic Journey"
                          className={inputClass}
                        />
                      </label>

                      <label className="sm:col-span-2">
                        <span className={labelClass}>
                          Feature Description
                        </span>
                        <textarea
                          rows={2}
                          value={feature.description}
                          onChange={(event) =>
                            updateFeature(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Explain this feature."
                          className={`${inputClass} resize-y`}
                        />
                      </label>
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

                <label>
                  <span className={labelClass}>
                    Tailwind Gradient Classes
                  </span>
                  <input
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
                </label>
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
                  <label>
                    <span className={labelClass}>Closing Prompt</span>
                    <input
                      value={content.closing.prompt}
                      onChange={(event) =>
                        updateClosing("prompt", event.target.value)
                      }
                      placeholder="e.g. Can you survive the infinite void?"
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Closing Subline</span>
                    <input
                      value={content.closing.subline}
                      onChange={(event) =>
                        updateClosing("subline", event.target.value)
                      }
                      placeholder="A supporting closing message."
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Closing Brand</span>
                    <input
                      value={content.closing.brand}
                      onChange={(event) =>
                        updateClosing("brand", event.target.value)
                      }
                      placeholder="e.g. Cosmic Shunner"
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Closing Tagline</span>
                    <input
                      value={content.closing.tagline}
                      onChange={(event) =>
                        updateClosing("tagline", event.target.value)
                      }
                      placeholder="A final project tagline."
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>
            </>
          ) : (
            <section className={sectionClass}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-semibold text-[#F0CA77]">
                    Advanced JSON Editor
                  </h4>
                  <p className="mt-1 text-xs text-[#8F8AA3]">
                    Edit the underlying portfolio content directly. Only use this if you are comfortable editing JSON.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={returnToVisualEditor}
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs text-[#C5BFD0] transition hover:border-[#F0CA77] hover:text-[#F0CA77]"
                >
                  Return to Visual Editor
                </button>
              </div>

              <textarea
                rows={22}
                spellCheck={false}
                value={advancedJson}
                onChange={(event) => {
                  setAdvancedJson(event.target.value);
                  setJsonError("");
                }}
                className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
              />

              {jsonError && (
                <p className="text-sm text-red-300">{jsonError}</p>
              )}
            </section>
          )}

          {!advancedMode && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={enableAdvancedEditor}
                className="self-start rounded-lg border border-white/15 px-4 py-2 text-xs text-[#C5BFD0] transition hover:border-[#F0CA77] hover:text-[#F0CA77]"
              >
                Advanced JSON Editor
              </button>

              <p className="text-xs text-[#8F8AA3]">
                The visual editor is recommended. Advanced mode is optional.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
            <button
              type="submit"
              className="rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77]"
            >
              Save Project Changes
            </button>

            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-8 text-center">
          <h3 className="font-ethnocentric text-sm text-[#FFFDF8]">
            No Projects to Manage
          </h3>

          <p className="mt-3 text-sm text-[#C5BFD0]">
            Projects will appear here after you create them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const category = categories.find(
              (item) => item.id === project.category_id
            );

            return (
              <article
                key={project.id}
                className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-5 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#15162D] via-[#0D1023] to-[#1B1A35] sm:w-40">
                    <img
                      src={project.image_url || "/images/a-logo.png"}
                      alt={project.image_url ? project.title : "AKIVSOFT logo"}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/a-logo.png";
                        event.currentTarget.className =
                          "h-full w-full object-contain p-5";
                      }}
                      className={
                        project.image_url
                          ? "h-full w-full object-cover"
                          : "h-full w-full object-contain p-5"
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-ethnocentric text-sm text-[#FFFDF8]">
                      {project.project_number
                        ? `${project.project_number} · `
                        : ""}
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#C5BFD0]">
                      {category?.name ?? "Uncategorized"}
                    </p>

                    <p className="mt-2 text-sm text-[#C5BFD0]">
                      {project.short_description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#DE8A61]">
                      <span>Order: {project.display_order}</span>
                      <span>/{project.slug}</span>
                    </div>
                  </div>

                  <span
                    className={`self-start rounded-full border px-3 py-1 text-xs ${
                      project.is_published
                        ? "border-green-400/20 bg-green-400/10 text-green-300"
                        : "border-white/15 bg-white/5 text-[#C5BFD0]"
                    }`}
                  >
                    {project.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => startEditing(project)}
                    className="rounded-lg border border-white/15 px-4 py-2 text-xs text-[#FFFDF8] transition hover:border-[#F0CA77] hover:text-[#F0CA77]"
                  >
                    Edit
                  </button>

                  <form action={togglePortfolioProjectPublished}>
                    <input
                      type="hidden"
                      name="id"
                      value={project.id}
                    />
                    <input
                      type="hidden"
                      name="is_published"
                      value={String(!project.is_published)}
                    />

                    <button
                      type="submit"
                      className="rounded-lg border border-white/15 px-4 py-2 text-xs text-[#C5BFD0] transition hover:border-[#F0CA77] hover:text-[#F0CA77]"
                    >
                      {project.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>

                  <form
                    action={deletePortfolioProject}
                    onSubmit={(event) => {
                      if (
                        !window.confirm(
                          `Are you sure you want to delete "${project.title}"? This will also delete its detail record and stored image.`
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={project.id}
                    />

                    <button
                      type="submit"
                      className="rounded-lg border border-red-400/20 px-4 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
