
"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Eye, EyeOff, Maximize2, Minimize2, Trash2 } from "lucide-react";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  updatePortfolioProject,
  togglePortfolioProjectPublished,
  deletePortfolioProject,
  reorderPortfolioProjects,
} from "@/app/akiv-base/admin/portfolio/actions";

import PendingSubmitButton from "@/components/admin/PendingSubmitButton";
import PortfolioProjectForm from "@/components/admin/PortfolioProjectForm";

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
  [key: string]: unknown;
};

type EditingProject = {
  id: string;
  title: string;
  category_id: string;
  short_description: string;
};

type PortfolioProjectManagerProps = {
  category: PortfolioCategoryRecord;
  categories: PortfolioCategoryRecord[];
  projects: PortfolioProjectRecord[];
  details: PortfolioProjectDetailRecord[];
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
  "Role-Playing Game (RPG)",
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
  "Creative",
  "Other",
] as const;

const PLATFORM_OPTIONS = ["Mobile", "PC/Desktop", "Web"] as const;

const DISPLAY_ICON_OPTIONS = [
  { value: "Gamepad2", label: "Gamepad2 — Gaming" },
  { value: "Smartphone", label: "Smartphone — Mobile" },
  { value: "Globe", label: "Globe — Web / Internet" },
  { value: "Monitor", label: "Monitor — Desktop" },
  { value: "Laptop", label: "Laptop — Computing" },
  { value: "Tablet", label: "Tablet — Tablet apps" },
  { value: "Code2", label: "Code2 — Development" },
  { value: "Layers", label: "Layers — Multi-layered projects" },
  { value: "Brain", label: "Brain — Intelligence / AI" },
  { value: "BookOpen", label: "BookOpen — Education / Reading" },
  { value: "BriefcaseBusiness", label: "Briefcase — Business" },
  { value: "Calculator", label: "Calculator — Finance / Calculations" },
  { value: "CalendarDays", label: "Calendar — Scheduling" },
  { value: "Camera", label: "Camera — Photography" },
  { value: "Cloud", label: "Cloud — Cloud services" },
  { value: "Compass", label: "Compass — Navigation" },
  { value: "Cpu", label: "CPU — Technology" },
  { value: "Database", label: "Database — Data management" },
  { value: "GraduationCap", label: "Graduation Cap — Learning" },
  { value: "HeartPulse", label: "Heart Pulse — Health" },
  { value: "Image", label: "Image — Visual media" },
  { value: "LayoutDashboard", label: "Dashboard — Management" },
  { value: "Map", label: "Map — Maps / Location" },
  { value: "MessageCircle", label: "Message — Communication" },
  { value: "Music2", label: "Music — Audio" },
  { value: "Palette", label: "Palette — Design" },
  { value: "Puzzle", label: "Puzzle — Problem solving" },
  { value: "Rocket", label: "Rocket — Launch / Innovation" },
  { value: "ShoppingCart", label: "Shopping Cart — E-commerce" },
  { value: "Sparkles", label: "Sparkles — Creative projects" },
  { value: "Terminal", label: "Terminal — Programming" },
  { value: "Wallet", label: "Wallet — Money / Payments" },
  { value: "Wrench", label: "Wrench — Tools / Utilities" },
  { value: "Zap", label: "Zap — Power / Performance" },
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
  { value: "🌐", label: "🌐 Web / Online" },
  { value: "🎨", label: "🎨 Design / Creativity" },
  { value: "☁️", label: "☁️ Cloud / Online" },
  { value: "🔥", label: "🔥 Intensity" },
  { value: "⭐", label: "⭐ Highlights / Favorites" },
  { value: "🌟", label: "🌟 Special Features" },
  { value: "🎯", label: "🎯 Goals / Precision" },
  { value: "🧠", label: "🧠 Intelligence / AI" },
  { value: "🧩", label: "🧩 Puzzles / Problem Solving" },
  { value: "💎", label: "💎 Premium / Collectibles" },
  { value: "🪙", label: "🪙 Coins / Currency" },
  { value: "🧲", label: "🧲 Magnet / Attraction" },
  { value: "🎲", label: "🎲 Random / Chance" },
  { value: "🏁", label: "🏁 Racing / Competition" },
  { value: "🎵", label: "🎵 Music / Audio" },
  { value: "🎧", label: "🎧 Sound / Listening" },
  { value: "📚", label: "📚 Education / Knowledge" },
  { value: "🔔", label: "🔔 Notifications" },
  { value: "💬", label: "💬 Communication" },
  { value: "🔍", label: "🔍 Search / Discovery" },
  { value: "📊", label: "📊 Analytics / Statistics" },
  { value: "📈", label: "📈 Progress / Growth" },
  { value: "💳", label: "💳 Payments" },
  { value: "🛒", label: "🛒 Shopping" },
  { value: "📦", label: "📦 Organization / Storage" },
  { value: "⚙️", label: "⚙️ Settings / Configuration" },
  { value: "🛠️", label: "🛠️ Tools / Customization" },
  { value: "🌱", label: "🌱 Growth / Sustainability" },
  { value: "🗺️", label: "🗺️ Maps / Exploration" },
  { value: "🤖", label: "🤖 Automation / AI" },
  { value: "🔄", label: "🔄 Sync / Updates" },
  { value: "👥", label: "👥 Community / Users" },
  { value: "🎁", label: "🎁 Rewards / Bonuses" },
  { value: "⏱️", label: "⏱️ Time / Scheduling" },
  { value: "🌈", label: "🌈 Themes / Appearance" },
] as const;

const LEGACY_FEATURE_ICON_MAP: Record<string, string> = {
  Move: "🚀",
  Shield: "🛡️",
  Zap: "⚡",
};

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

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  return {
    ...DEFAULT_CONTENT,
    ...source,
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
      prompt: stringValue(rawClosing.prompt),
      subline: stringValue(rawClosing.subline),
      brand: stringValue(rawClosing.brand),
    },
  };
}

function SortableProject({
  project,
  children,
  disabled,
}: {
  project: PortfolioProjectRecord;
  children: ReactNode;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
      }}
      className="relative"
    >
      <div className="absolute left-2 top-2 z-10">
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Reorder ${project.title}`}
          title="Drag to reorder"
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-white/15 bg-[#0D1023]/90 text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M8 5h.01M16 5h.01M8 12h.01M16 12h.01M8 19h.01M16 19h.01" />
          </svg>
        </button>
      </div>

      {children}
    </div>
  );
}

export default function PortfolioProjectManager({
  category,
  projects,
  details,
}: PortfolioProjectManagerProps) {
  const [orderedProjects, setOrderedProjects] = useState(projects);
  const [isReordering, setIsReordering] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingProject, setEditingProject] =
    useState<EditingProject | null>(null);

  const [collapsedProjectIds, setCollapsedProjectIds] = useState<Set<string>>(
    () => new Set()
  );

  const [content, setContent] = useState<ProjectContent>(DEFAULT_CONTENT);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedJson, setAdvancedJson] = useState("");
  const [jsonError, setJsonError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setOrderedProjects(projects);
  }, [projects]);

  const detailsByProject = new Map(
    details.map((detail) => [detail.project_id, detail.content])
  );

  function toggleCollapsed(projectId: string) {
    setCollapsedProjectIds((current) => {
      const next = new Set(current);

      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }

      return next;
    });
  }

  function startEditing(project: PortfolioProjectRecord) {
    setCollapsedProjectIds((current) => {
      const next = new Set(current);
      next.delete(project.id);
      return next;
    });

    const projectContent = normalizeContent(
      detailsByProject.get(project.id) ?? {}
    );

    setEditingProject({
      id: project.id,
      title: project.title,
      category_id: project.category_id,
      short_description: project.short_description,
    });

    setContent({
      ...projectContent,
      detailsId: `${slugify(project.title)}-details`,
    });

    setAdvancedJson(
      JSON.stringify(
        {
          ...projectContent,
          detailsId: `${slugify(project.title)}-details`,
        },
        null,
        2
      )
    );

    setAdvancedMode(false);
    setJsonError("");
    setShowCreateForm(false);
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
    setEditingProject((current) => {
      if (!current) return current;

      const updated = { ...current, [field]: value };

      if (field === "title") {
        const generatedDetailsId = `${slugify(value)}-details`;

        setContent((currentContent) => ({
          ...currentContent,
          detailsId: generatedDetailsId,
        }));
      }

      return updated;
    });
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

  function toggleStringSelection(
    key: "secondaryGenres" | "platforms",
    value: string
  ) {
    setContent((current) => {
      const selected = current[key];

      return {
        ...current,
        [key]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
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

  function validateForm(event: FormEvent<HTMLFormElement>) {
    if (!advancedMode) return;

    try {
      JSON.parse(advancedJson);
      setJsonError("");
    } catch {
      event.preventDefault();
      setJsonError("Please correct the JSON syntax before saving.");
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || isReordering) {
      return;
    }

    const oldIndex = orderedProjects.findIndex(
      (project) => project.id === active.id
    );

    const newIndex = orderedProjects.findIndex(
      (project) => project.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousProjects = orderedProjects;

    const reorderedProjects = arrayMove(
      orderedProjects,
      oldIndex,
      newIndex
    ).map((project, index) => ({
      ...project,
      display_order: index + 1,
      project_number: String(index + 1).padStart(2, "0"),
    }));

    setOrderedProjects(reorderedProjects);
    setIsReordering(true);

    try {
      const result = await reorderPortfolioProjects(
        category.id,
        reorderedProjects.map((project) => project.id)
      );

      if (!result.success) {
        setOrderedProjects(previousProjects);

        window.alert(
          result.error ||
            "Unable to save the new project order. Please try again."
        );
      }
    } catch {
      setOrderedProjects(previousProjects);

      window.alert(
        "An unexpected error occurred while saving the project order."
      );
    } finally {
      setIsReordering(false);
    }
  }

  function renderProject(project: PortfolioProjectRecord) {
    const isCollapsed = collapsedProjectIds.has(project.id);

    return (
      <article className="rounded-xl border border-white/10 bg-[#15162D] p-4 pl-12 sm:p-5 sm:pl-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words font-ethnocentric text-xs text-[#FFFDF8]">
                {project.project_number
                  ? `${project.project_number} · `
                  : ""}
                {project.title}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-[10px] ${
                  project.is_published
                    ? "border-green-400/20 bg-green-400/10 text-green-300"
                    : "border-white/15 bg-white/5 text-[#C5BFD0]"
                }`}
              >
                {project.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => toggleCollapsed(project.id)}
              aria-expanded={!isCollapsed}
              aria-label={
                isCollapsed
                  ? `Expand ${project.title}`
                  : `Minimize ${project.title}`
              }
              title={isCollapsed ? "Maximize" : "Minimize"}
              className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:bg-white/5"
            >
              {isCollapsed ? (
                <Maximize2
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              ) : (
                <Minimize2
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              )}
              {isCollapsed ? "Maximize" : "Minimize"}
            </button>

            <button
              type="button"
              onClick={() => startEditing(project)}
              disabled={
  editingProject !== null &&
  editingProject.id !== project.id
}
              className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true" className="mr-1.5">
                ✎
              </span>
              {editingProject?.id === project.id ? "Editing" : "Edit"}
            </button>

            <form action={togglePortfolioProjectPublished}>
              <input type="hidden" name="id" value={project.id} />

              <input
                type="hidden"
                name="is_published"
                value={String(!project.is_published)}
              />

              <PendingSubmitButton
                pendingText={
                  project.is_published
                    ? "Unpublishing..."
                    : "Publishing..."
                }
               className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {project.is_published ? (
                    <>
                      <EyeOff size={13} />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      Publish
                    </>
                  )}
              </PendingSubmitButton>
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
              <input type="hidden" name="id" value={project.id} />

              <PendingSubmitButton
                pendingText="Deleting..."
                className="inline-flex items-center rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
              >
                <Trash2
                  className="mr-1.5 h-4 w-4"
                  aria-hidden="true"
                />
                Delete
              </PendingSubmitButton>
            </form>
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#15162D] via-[#0D1023] to-[#1B1A35] sm:w-36">
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
              <p className="break-words text-sm text-[#C5BFD0]">
                {project.short_description}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#DE8A61]">
                <span>/{project.slug}</span>
                <span>
                  {project.image_url
                    ? "Image uploaded"
                    : "No project image"}
                </span>
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  function renderEditor() {
    if (!editingProject) return null;

    const selectedSecondaryGenres = new Set(content.secondaryGenres);
    const selectedPlatforms = new Set(content.platforms);

    const availableGenres = [
      ...GENRE_OPTIONS,
      ...(content.genre &&
      !GENRE_OPTIONS.includes(
        content.genre as (typeof GENRE_OPTIONS)[number]
      )
        ? [content.genre]
        : []),
    ];

    const availableSecondaryGenres = [
      ...GENRE_OPTIONS,
      ...content.secondaryGenres.filter(
        (genre) =>
          !GENRE_OPTIONS.includes(
            genre as (typeof GENRE_OPTIONS)[number]
          )
      ),
    ];

    const availablePlatforms = [
      ...PLATFORM_OPTIONS,
      ...content.platforms.filter(
        (platform) =>
          !PLATFORM_OPTIONS.includes(
            platform as (typeof PLATFORM_OPTIONS)[number]
          )
      ),
    ];

    return (
      <form
        action={updatePortfolioProject}
        onSubmit={validateForm}
        className="mt-4 space-y-6 rounded-2xl border border-[#F0CA77]/20 bg-[#15162D]/90 p-5 backdrop-blur-xl sm:p-7"
      >
        <input type="hidden" name="id" value={editingProject.id} />

        <input
          type="hidden"
          name="category_id"
          value={editingProject.category_id}
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
              Editing: {editingProject.title}
            </p>
          </div>

          <button
            type="button"
            onClick={closeEditor}
            className="self-start rounded-lg border border-white/15 px-4 py-2 text-xs text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
          >
            <span aria-hidden="true" className="mr-1.5">
              ×
            </span>
            Close Editor
          </button>
        </div>

        <section className={sectionClass}>
          <div>
            <h4 className="font-semibold text-[#F0CA77]">
              Basic Information
            </h4>

            <p className="mt-1 text-xs text-[#8F8AA3]">
              Update the project's title, image, and short description.
              Project numbers and URL slugs are generated automatically.
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

              <span className="mt-2 block text-xs text-[#8F8AA3]">
                URL slug: {slugify(editingProject.title) || "—"}
              </span>
            </label>

            <div>
              <span className={labelClass}>Portfolio Category</span>

              <div className={`${inputClass} flex items-center`}>
                {category.name}
              </div>
            </div>

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

              <label className="mt-4 flex items-start gap-3 rounded-lg border border-red-400/20 bg-red-400/5 p-3">
                <input
                  type="checkbox"
                  name="remove_image"
                  value="true"
                  className="mt-1 accent-[#DE8A61]"
                />

                <span>
                  <span className="block text-xs text-red-300">
                    Remove current project image
                  </span>

                  <span className="mt-1 block text-xs text-[#C5BFD0]">
                    Removes the existing image unless you upload a replacement.
                  </span>
                </span>
              </label>
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
          </div>
        </section>

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
                    readOnly
                    value={`${slugify(editingProject.title)}-details`}
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />

                  <span className="mt-2 block text-xs text-[#8F8AA3]">
                    Automatically generated from the project title.
                  </span>
                </label>

                <label>
                  <span className={labelClass}>Primary Genre</span>

                  <select
                    value={content.genre}
                    onChange={(event) =>
                      updateContent("genre", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select a primary genre</option>

                    {availableGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
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

                <label>
                  <span className={labelClass}>Display Icon</span>

                  <select
                    value={content.icon}
                    onChange={(event) =>
                      updateContent("icon", event.target.value)
                    }
                    className={inputClass}
                  >
                    {!DISPLAY_ICON_OPTIONS.some(
                      (option) => option.value === content.icon
                    ) && (
                      <option value={content.icon}>
                        Current: {content.icon}
                      </option>
                    )}

                    {DISPLAY_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
                <div>
                  <span className={labelClass}>Secondary Genres</span>

                  <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-white/10 bg-[#15162D] p-3 sm:grid-cols-2">
                    {availableSecondaryGenres.map((genre) => (
                      <label
                        key={genre}
                        className="flex cursor-pointer items-center gap-2 text-xs text-[#C5BFD0]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSecondaryGenres.has(genre)}
                          onChange={() =>
                            toggleStringSelection("secondaryGenres", genre)
                          }
                          className="accent-[#DE8A61]"
                        />
                        {genre}
                      </label>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-[#8F8AA3]">
                    Select all genres that also describe this project.
                  </p>
                </div>

                <div>
                  <span className={labelClass}>Platforms</span>

                  <div className="space-y-3 rounded-lg border border-white/10 bg-[#15162D] p-4">
                    {availablePlatforms.map((platform) => (
                      <label
                        key={platform}
                        className="flex cursor-pointer items-center gap-3 text-sm text-[#C5BFD0]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPlatforms.has(platform)}
                          onChange={() =>
                            toggleStringSelection("platforms", platform)
                          }
                          className="h-4 w-4 accent-[#DE8A61]"
                        />
                        {platform}
                      </label>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-[#8F8AA3]">
                    Select every platform supported by this project.
                  </p>
                </div>

                <label className="sm:col-span-2">
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
                  <span aria-hidden="true" className="mr-1.5">
                    +
                  </span>
                  Add Feature
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
                      <span aria-hidden="true" className="mr-1">
                        ×
                      </span>
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className={labelClass}>Feature Icon</span>

                      <select
                        value={feature.icon || "✨"}
                        onChange={(event) =>
                          updateFeature(index, "icon", event.target.value)
                        }
                        className={inputClass}
                      >
                        {!FEATURE_ICON_OPTIONS.some(
                          (option) => option.value === feature.icon
                        ) && feature.icon && (
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
                <span aria-hidden="true" className="mr-1.5">
                  ↩
                </span>
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
              <span aria-hidden="true" className="mr-1.5">
                {"</>"}
              </span>
              Advanced JSON Editor
            </button>

            <p className="text-xs text-[#8F8AA3]">
              The visual editor is recommended. Advanced mode is optional.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <PendingSubmitButton
            pendingText="Saving..."
            className="rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77]"
          >
            <span aria-hidden="true" className="mr-2">
              ✓
            </span>
            Save Project Changes
          </PendingSubmitButton>

          <button
            type="button"
            onClick={closeEditor}
            className="rounded-lg border border-white/15 px-5 py-3 text-sm text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
          >
            <span aria-hidden="true" className="mr-2">
              ×
            </span>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-ethnocentric text-xs text-[#F0CA77]">
            Projects
          </h3>

          <p className="mt-2 break-words text-xs leading-relaxed text-[#C5BFD0]">
            Manage the projects belonging to {category.name}. Drag projects
            using the handle to change their display order. Project numbers
            update automatically.
          </p>
        </div>

        <span className="shrink-0 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#C5BFD0] sm:ml-4">
          {orderedProjects.length}{" "}
          {orderedProjects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {orderedProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0D1023]/40 p-7 text-center">
          <h4 className="font-ethnocentric text-xs text-[#FFFDF8]">
            No Projects Yet
          </h4>

          <p className="mt-3 text-sm text-[#8F8AA3]">
            Add the first project to the {category.name} category.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {isReordering && (
            <p className="text-xs text-[#F0CA77]" aria-live="polite">
              Saving project order...
            </p>
          )}

          <DndContext
            id={`portfolio-projects-${category.id}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedProjects.map((project) => project.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedProjects.map((project) => (
                <SortableProject
                  key={project.id}
                  project={project}
                  disabled={
                    isReordering ||
                    Boolean(editingProject) ||
                    showCreateForm
                  }
                >
                  <>
                    {renderProject(project)}

                    {editingProject?.id === project.id &&
                      renderEditor()}
                  </>
                </SortableProject>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <div className="border-t border-white/10 pt-5">
        {showCreateForm ? (
          <PortfolioProjectForm
            categoryId={category.id}
            categoryName={category.name}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              closeEditor();
              setShowCreateForm(true);
            }}
            className="w-full rounded-xl border border-dashed border-[#F0CA77]/40 bg-[#F0CA77]/5 px-5 py-4 text-sm font-semibold text-[#F0CA77] transition hover:border-[#F0CA77] hover:bg-[#F0CA77]/10"
          >
            <span aria-hidden="true" className="mr-2">
              +
            </span>
            Add Project
          </button>
        )}
      </div>
    </div>
  );
}
