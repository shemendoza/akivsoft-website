
"use client";

import { useState, type ReactNode } from "react";

import ServiceContentBlockManager from "@/components/admin/ServiceContentBlockManager";
import PendingSubmitButton from "@/components/admin/PendingSubmitButton";

import type { ServiceContentBlockRecord } from "@/lib/admin-services";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
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
  Activity,
  Blocks,
  Box,
  Braces,
  Bug,
  Camera,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Fingerprint,
  Gamepad2,
  Gauge,
  GitBranch,
  Globe,
  GripVertical,
  HardDrive,
  Image,
  Joystick,
  Laptop,
  Layers,
  Lightbulb,
  Lock,
  LayoutDashboard,
  Monitor,
  MousePointer2,
  Music,
  Network,
  Palette,
  PenTool,
  Puzzle,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
  Video,
  Wifi,
  Workflow,
  Wrench,
  Zap,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Pencil,
  Eye,
  EyeOff,
  Minimize2,
  Maximize2,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  createServiceSection,
  updateServiceSection,
  toggleServiceSectionPublished,
  deleteServiceSection,
  reorderServiceSections,
  createService,
  updateService,
  toggleServicePublished,
  deleteService,
  reorderServices,
} from "@/app/akiv-base/admin/services/actions";

type ServiceSectionRecord = {
  id: string;
  title: string;
  description: string;
  display_order: number;
  is_published: boolean;
};

type ServiceRecord = {
  id: string;
  section_id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  tags: string[];
  display_order: number;
  is_published: boolean;
};

type ServiceManagerProps = {
  sections: ServiceSectionRecord[];
  services: ServiceRecord[];
  contentBlocks: ServiceContentBlockRecord[];
};

type SectionFormState = {
  title: string;
  description: string;
};

type ServiceFormState = {
  section_id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  tags: string;
};

const EMPTY_SECTION_FORM: SectionFormState = {
  title: "",
  description: "",
};

const EMPTY_SERVICE_FORM: ServiceFormState = {
  section_id: "",
  title: "",
  description: "",
  icon: "Sparkles",
  accent: "blue",
  tags: "",
};

const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "Gamepad2", label: "Gamepad", icon: Gamepad2 },
  { value: "Lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "Gauge", label: "Gauge", icon: Gauge },
  { value: "Rocket", label: "Rocket", icon: Rocket },
  { value: "Smartphone", label: "Smartphone", icon: Smartphone },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "Code2", label: "Code", icon: Code2 },
  { value: "Braces", label: "Braces", icon: Braces },
  { value: "Terminal", label: "Terminal", icon: Terminal },
  { value: "Monitor", label: "Monitor", icon: Monitor },
  { value: "Laptop", label: "Laptop", icon: Laptop },
  { value: "Layers", label: "Layers", icon: Layers },
  { value: "Palette", label: "Palette", icon: Palette },
  { value: "PenTool", label: "Pen Tool", icon: PenTool },
  { value: "Activity", label: "Activity", icon: Activity },
  { value: "Blocks", label: "Blocks", icon: Blocks },
  { value: "Box", label: "Box", icon: Box },
  { value: "Bug", label: "Bug", icon: Bug },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "Cpu", label: "CPU", icon: Cpu },
  { value: "Database", label: "Database", icon: Database },
  { value: "FileCode2", label: "File Code", icon: FileCode2 },
  { value: "Fingerprint", label: "Fingerprint", icon: Fingerprint },
  { value: "GitBranch", label: "Git Branch", icon: GitBranch },
  { value: "HardDrive", label: "Hard Drive", icon: HardDrive },
  { value: "Joystick", label: "Joystick", icon: Joystick },
  { value: "LayoutDashboard", label: "Dashboard Layout", icon: LayoutDashboard },
  { value: "MousePointer2", label: "Mouse Pointer", icon: MousePointer2 },
  { value: "Network", label: "Network", icon: Network },
  { value: "Puzzle", label: "Puzzle", icon: Puzzle },
  { value: "ShieldCheck", label: "Shield Check", icon: ShieldCheck },
  { value: "ShoppingCart", label: "Shopping Cart", icon: ShoppingCart },
  { value: "SlidersHorizontal", label: "Sliders", icon: SlidersHorizontal },
  { value: "Target", label: "Target", icon: Target },
  { value: "Workflow", label: "Workflow", icon: Workflow },
  { value: "Wrench", label: "Wrench", icon: Wrench },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Camera", label: "Camera", icon: Camera },
  { value: "Image", label: "Image", icon: Image },
  { value: "Music", label: "Music", icon: Music },
  { value: "Video", label: "Video", icon: Video },
  { value: "Wifi", label: "Wi-Fi", icon: Wifi },
  { value: "Server", label: "Server", icon: Server },
  { value: "Lock", label: "Lock", icon: Lock },
];

const ACCENT_OPTIONS = [
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "cyan", label: "Cyan" },
  { value: "pink", label: "Pink" },
  { value: "orange", label: "Orange" },
  { value: "gold", label: "Gold" },
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Violet" },
  { value: "rose", label: "Rose" },
];

function getServiceIcon(name: string): LucideIcon {
  return ICON_OPTIONS.find((item) => item.value === name)?.icon ?? Sparkles;
}

function SortableService({
  service,
  disabled,
  collapsed,
  onToggle,
  onEdit,
  editor,
}: {
  service: ServiceRecord;
  disabled: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onEdit: () => void;
  editor?: ReactNode;
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
    id: service.id,
    disabled,
  });

  const Icon = getServiceIcon(service.icon);

  return (
    <div className="relative min-w-0 w-full">
      <div className="absolute left-2 top-2 z-10">
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Reorder ${service.title}`}
          title="Drag to reorder"
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-white/15 bg-[#0D1023]/90 text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
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

      <article
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.55 : 1,
        }}
        className="box-border min-w-0 w-full max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#15162D] p-4 pl-12 sm:p-5 sm:pl-14"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h4 className="min-w-0 break-words [overflow-wrap:anywhere] font-ethnocentric text-xs text-[#FFFDF8]">
                {service.title}
              </h4>

              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-[10px] ${
                  service.is_published
                    ? "border-green-400/20 bg-green-400/10 text-green-300"
                    : "border-white/15 bg-white/5 text-[#C5BFD0]"
                }`}
              >
                {service.is_published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={onToggle}
                aria-label={collapsed ? "Expand service" : "Minimize service"}
                aria-expanded={!collapsed}
                title={collapsed ? "Expand service" : "Minimize service"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8]"
              >
                {collapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                {collapsed ? "Expand" : "Minimize"}
              </button>

              <button
                type="button"
                onClick={onEdit}
                disabled={disabled}
                className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span aria-hidden="true" className="mr-1.5">
                  ✎
                </span>
                {editor ? "Editing" : "Edit"}
              </button>

              <form action={toggleServicePublished}>
                <input type="hidden" name="id" value={service.id} />

                <PendingSubmitButton
                  pendingText={
                    service.is_published ? "Unpublishing..." : "Publishing..."
                  }
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {service.is_published ? (
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
                action={deleteService}
                onSubmit={(event) => {
                  if (!window.confirm(`Delete "${service.title}"?`)) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={service.id} />

                <PendingSubmitButton
                  pendingText="Deleting..."
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={13} />
                  Delete
                </PendingSubmitButton>
              </form>
            </div>
          </div>

          {!collapsed && (
            <div className="flex min-w-0 flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#15162D] via-[#0D1023] to-[#1B1A35]">
                <Icon size={30} className="text-[#DE8A61]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words text-sm leading-relaxed text-[#C5BFD0] [overflow-wrap:anywhere]">
                  {service.description}
                </p>

                <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                  {service.tags?.map((tag, index) => (
                    <span
                      key={`${service.id}-${index}`}
                      className="max-w-full break-words rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-[#C5BFD0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#DE8A61]">
                  <span>Display order: {service.display_order + 1}</span>
                  <span>Icon: {service.icon}</span>
                  <span>Accent: {service.accent}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {editor}
    </div>
  );
}

function SortableSection({
  section,
  order,
  children,
  disabled,
  collapsed,
  hasServices,
  hasContentBlock,
  onToggle,
  onEdit,
}: {
  section: ServiceSectionRecord;
  order: number;
  children: ReactNode;
  disabled: boolean;
  collapsed: boolean;
  hasServices: boolean;
  hasContentBlock: boolean;
  onToggle: () => void;
  onEdit: () => void;
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
    id: section.id,
    disabled,
  });

  const cannotDelete = hasServices || hasContentBlock;

  const deleteDisabledMessage = hasServices
    ? "Delete all individual services in this category before deleting it."
    : hasContentBlock
      ? "Delete the additional content block before deleting this category."
      : undefined;

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="box-border min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0D1023] p-4 sm:p-6"
    >
      <div className="flex min-w-0 items-center gap-3 border-b border-white/10 pb-3">
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Reorder ${section.title}`}
          className="inline-flex shrink-0 cursor-grab touch-none items-center gap-2 text-[#FFFDF8]/70 transition hover:text-[#FFFDF8] active:cursor-grabbing disabled:cursor-not-allowed"
        >
          <GripVertical size={19} />
          <span className="hidden text-xs sm:inline">
            Drag to change category order
          </span>
        </button>

        <span className="ml-auto shrink-0 text-xs text-[#FFFDF8]">
          Order {order}
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-4 pt-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="min-w-0 break-words [overflow-wrap:anywhere] font-ethnocentric text-sm text-[#FFFDF8]">
              {section.title}
            </h3>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                section.is_published
                  ? "border-green-400/20 bg-green-400/10 text-green-300"
                  : "border-white/15 bg-white/5 text-[#C5BFD0]"
              }`}
            >
              {section.is_published ? "Published" : "Draft"}
            </span>
          </div>

          <p className="mt-2 break-words text-sm leading-relaxed text-[#C5BFD0] [overflow-wrap:anywhere]">
            {section.description || "No category description."}
          </p>
        </div>

        <div className="flex min-w-0 w-full flex-wrap gap-2 lg:w-auto lg:shrink-0 lg:justify-end">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand category" : "Minimize category"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand category" : "Minimize category"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8]"
          >
            {collapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            {collapsed ? "Expand" : "Minimize"}
          </button>

          <button
            type="button"
            onClick={onEdit}
            disabled={disabled}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true" className="mr-1.5">
              ✎
            </span>
            Edit
          </button>

          <form
            action={toggleServiceSectionPublished}
          >
            <input type="hidden" name="id" value={section.id} />

            <PendingSubmitButton
              pendingText={
                section.is_published ? "Unpublishing..." : "Publishing..."
              }
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {section.is_published ? (
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
            action={deleteServiceSection}
            onSubmit={(event) => {
              if (
                !window.confirm(
                  `Delete "${section.title}"? This cannot be undone.`
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={section.id} />

            <PendingSubmitButton
              pendingText="Deleting..."
              disabled={disabled || cannotDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Trash2 size={13} />
              Delete
            </PendingSubmitButton>
          </form>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-5 min-w-0 w-full max-w-full">{children}</div>
      )}
    </article>
  );
}

function ServiceEditorForm({
  serviceForm,
  setServiceForm,
  editingServiceId,
  iconPickerOpen,
  setIconPickerOpen,
  onCancel,
}: {
  serviceForm: ServiceFormState;
  setServiceForm: React.Dispatch<React.SetStateAction<ServiceFormState>>;
  editingServiceId: string | null;
  iconPickerOpen: boolean;
  setIconPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
}) {
  const selectedIconOption =
    ICON_OPTIONS.find((item) => item.value === serviceForm.icon) ??
    ICON_OPTIONS.find((item) => item.value === "Sparkles")!;

  const SelectedIcon = selectedIconOption.icon;

  return (
    <form
      action={editingServiceId ? updateService : createService}
      className="mt-4 box-border min-w-0 w-full max-w-full space-y-5 overflow-hidden rounded-2xl border border-[#F0CA77]/20 bg-[#15162D]/90 p-5 backdrop-blur-xl sm:p-7"
    >
      {editingServiceId && (
        <input type="hidden" name="id" value={editingServiceId} />
      )}

      <input type="hidden" name="section_id" value={serviceForm.section_id} />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-ethnocentric text-sm text-[#F0CA77]">
            {editingServiceId ? "Edit Service" : "New Service"}
          </h3>

          <p className="mt-2 text-sm text-[#C5BFD0]">
            {editingServiceId
              ? "Editing service details."
              : "Create a new service."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-white/15 px-4 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8]"
        >
          <X size={13} />
          Close Editor
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block min-w-0 sm:col-span-2">
          <span className="text-sm text-[#C5BFD0]">Service Title *</span>
          <input
            required
            name="title"
            value={serviceForm.title}
            onChange={(event) =>
              setServiceForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            className="mt-2 box-border w-full min-w-0 rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
            placeholder="2D & 3D Game Development"
          />
        </label>

        <label className="block min-w-0 sm:col-span-2">
          <span className="text-sm text-[#C5BFD0]">Description *</span>
          <textarea
            required
            name="description"
            rows={4}
            value={serviceForm.description}
            onChange={(event) =>
              setServiceForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="mt-2 box-border w-full min-w-0 resize-y rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
            placeholder="Describe this service."
          />
        </label>

        <div className="relative min-w-0">
          <span className="text-sm text-[#C5BFD0]">Feature Icon</span>

          <input type="hidden" name="icon" value={serviceForm.icon} />

          <button
            type="button"
            aria-expanded={iconPickerOpen}
            aria-haspopup="true"
            onClick={() => setIconPickerOpen((current) => !current)}
            className="mt-2 flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-left text-sm text-[#FFFDF8] outline-none transition hover:border-white/40 focus:border-white/40"
          >
            <span className="flex min-w-0 items-center gap-3">
              <SelectedIcon size={20} className="shrink-0 text-[#DE8A61]" />
              <span className="truncate">{selectedIconOption.label}</span>
            </span>

            <ChevronDown
              size={17}
              className={`shrink-0 text-[#FFFDF8] transition-transform ${
                iconPickerOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {iconPickerOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/15 bg-[#15162D] p-3 shadow-2xl">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#C5BFD0]">
                  Choose a Feature Icon
                </p>
                <span className="text-[10px] text-[#C5BFD0]">
                  {ICON_OPTIONS.length} icons
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ICON_OPTIONS.map((option) => {
                  const OptionIcon = option.icon;
                  const isSelected = serviceForm.icon === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setServiceForm((current) => ({
                          ...current,
                          icon: option.value,
                        }));
                        setIconPickerOpen(false);
                      }}
                      className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-3 text-left transition ${
                        isSelected
                          ? "border-white/50 bg-white/10 text-[#FFFDF8]"
                          : "border-white/10 bg-[#0D1023] text-[#FFFDF8] hover:border-white/40 hover:bg-white/5"
                      }`}
                    >
                      <OptionIcon
                        size={19}
                        className="shrink-0 text-[#FFFDF8]"
                      />

                      <span className="min-w-0 flex-1 truncate text-xs">
                        {option.label}
                      </span>

                      {isSelected && (
                        <Check size={14} className="shrink-0 text-[#FFFDF8]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <label className="block min-w-0">
          <span className="text-sm text-[#C5BFD0]">Accent Color</span>
          <select
            name="accent"
            value={serviceForm.accent}
            onChange={(event) =>
              setServiceForm((current) => ({
                ...current,
                accent: event.target.value,
              }))
            }
            className="mt-2 box-border w-full min-w-0 rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
          >
            {ACCENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0 sm:col-span-2">
          <span className="text-sm text-[#C5BFD0]">Tags</span>
          <input
            name="tags"
            value={serviceForm.tags}
            onChange={(event) =>
              setServiceForm((current) => ({
                ...current,
                tags: event.target.value,
              }))
            }
            className="mt-2 box-border w-full min-w-0 rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
            placeholder="2D, 3D, Mobile, PC"
          />
          <span className="mt-2 block text-xs text-[#C5BFD0]/70">
            Separate each tag with a comma.
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
        <PendingSubmitButton
          pendingText={editingServiceId ? "Saving..." : "Creating..."}
          className="inline-flex items-center gap-2 rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={15} />
          {editingServiceId ? "Save Changes" : "Create Service"}
        </PendingSubmitButton>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8]"
        >
          <X size={15} />
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ServiceManager({
  sections: initialSections,
  services: initialServices,
  contentBlocks,
}: ServiceManagerProps) {
  const [sections, setSections] = useState(initialSections);
  const [services, setServices] = useState(initialServices);

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] =
    useState<SectionFormState>(EMPTY_SECTION_FORM);

  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormSectionId, setServiceFormSectionId] = useState<
    string | null
  >(null);
  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(EMPTY_SERVICE_FORM);

  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [collapsedServiceIds, setCollapsedServiceIds] = useState<Set<string>>(
    new Set()
  );

  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formIsOpen =
    isAddingSection ||
    Boolean(editingSectionId) ||
    serviceFormOpen;

  const orderedSections = [...sections].sort(
    (a, b) => a.display_order - b.display_order
  );

  function cancelSectionForm() {
    setIsAddingSection(false);
    setEditingSectionId(null);
    setSectionForm(EMPTY_SECTION_FORM);
  }

  function startAddingSection() {
    setEditingSectionId(null);
    setSectionForm(EMPTY_SECTION_FORM);
    setIsAddingSection(true);
  }

  function startEditingSection(section: ServiceSectionRecord) {
    setIsAddingSection(false);
    setEditingSectionId(section.id);
    setSectionForm({
      title: section.title,
      description: section.description,
    });
  }

  function cancelServiceForm() {
    setServiceFormOpen(false);
    setEditingServiceId(null);
    setServiceFormSectionId(null);
    setServiceForm(EMPTY_SERVICE_FORM);
    setIconPickerOpen(false);
  }

  function startAddingService(sectionId: string) {
    setEditingServiceId(null);
    setServiceFormSectionId(sectionId);
    setServiceForm({
      ...EMPTY_SERVICE_FORM,
      section_id: sectionId,
    });
    setIconPickerOpen(false);
    setServiceFormOpen(true);
  }

  function startEditingService(service: ServiceRecord) {
    setCollapsedServiceIds((current) => {
      const next = new Set(current);
      next.delete(service.id);
      return next;
    });

    setEditingServiceId(service.id);
    setServiceFormSectionId(service.section_id);
    setServiceForm({
      section_id: service.section_id,
      title: service.title,
      description: service.description,
      icon: service.icon || "Sparkles",
      accent: service.accent || "blue",
      tags: (service.tags ?? []).join(", "),
    });
    setIconPickerOpen(false);
    setServiceFormOpen(true);
  }

  function toggleCollapsed(sectionId: string) {
    setCollapsedIds((current) => {
      const next = new Set(current);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });
  }

  function toggleServiceCollapsed(serviceId: string) {
    setCollapsedServiceIds((current) => {
      const next = new Set(current);

      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }

      return next;
    });
  }

  async function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedSections.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = orderedSections.findIndex(
      (item) => item.id === over.id
    );

    if (oldIndex < 0 || newIndex < 0) return;

    const previousSections = sections;
    const reordered = arrayMove(orderedSections, oldIndex, newIndex).map(
      (section, index) => ({
        ...section,
        display_order: index,
      })
    );

    setSections(reordered);
    setIsReordering(true);

    try {
      await reorderServiceSections(reordered.map((item) => item.id));
    } catch (error) {
      console.error("Unable to reorder service categories:", error);
      setSections(previousSections);
      window.alert("Unable to save the new category order. Please try again.");
    } finally {
      setIsReordering(false);
    }
  }

  async function handleServiceDragEnd(
    sectionId: string,
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sectionServices = services
      .filter((item) => item.section_id === sectionId)
      .sort((a, b) => a.display_order - b.display_order);

    const oldIndex = sectionServices.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = sectionServices.findIndex(
      (item) => item.id === over.id
    );

    if (oldIndex < 0 || newIndex < 0) return;

    const previousServices = services;

    const reordered = arrayMove(sectionServices, oldIndex, newIndex).map(
      (service, index) => ({
        ...service,
        display_order: index,
      })
    );

    const otherServices = services.filter(
      (item) => item.section_id !== sectionId
    );

    setServices([...otherServices, ...reordered]);
    setIsReordering(true);

    try {
      await reorderServices(
        sectionId,
        reordered.map((item) => item.id)
      );
    } catch (error) {
      console.error("Unable to reorder services:", error);
      setServices(previousServices);
      window.alert("Unable to save the new service order. Please try again.");
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <section className="box-border min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#15162D]/80 p-4 backdrop-blur-xl sm:p-7">
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h2 className="break-words font-ethnocentric text-lg text-[#F0CA77]">
            Services Categories
          </h2>

          <p className="mt-2 break-words text-sm text-[#C5BFD0]">
            Manage your service categories and the services within each
            category.
          </p>

          <p className="mt-2 break-words text-xs leading-relaxed text-[#C5BFD0]/75">
            Drag categories to change their display order. You can also
            minimize categories without affecting their position.
          </p>

          {isReordering && (
            <div
              role="status"
              aria-live="polite"
              className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#F0CA77]"
            >
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
                aria-hidden="true"
              />
              Saving order...
            </div>
          )}
        </div>

        {!isAddingSection && !editingSectionId && (
          <button
            type="button"
            onClick={startAddingSection}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#DE8A61]/40 px-4 py-2.5 text-sm font-semibold text-[#F0CA77] transition hover:bg-[#DE8A61]/10"
          >
            <Plus size={15} />
            Add Category
          </button>
        )}
      </div>

      {(isAddingSection || editingSectionId) && (
        <form
          action={
            isAddingSection ? createServiceSection : updateServiceSection
          }
          className="mt-7 box-border min-w-0 w-full max-w-full space-y-5 overflow-hidden rounded-xl border border-white/10 bg-[#0D1023] p-4 sm:p-5"
        >
          {editingSectionId && (
            <input type="hidden" name="id" value={editingSectionId} />
          )}

          <h3 className="break-words font-ethnocentric text-sm text-[#FFFDF8]">
            {isAddingSection ? "New Category" : "Edit Category"}
          </h3>

          <label className="block min-w-0">
            <span className="text-sm text-[#C5BFD0]">Category Title *</span>
            <input
              required
              name="title"
              value={sectionForm.title}
              onChange={(event) =>
                setSectionForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="mt-2 box-border w-full min-w-0 rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
              placeholder="Game Development Services"
            />
          </label>

          <label className="block min-w-0">
            <span className="text-sm text-[#C5BFD0]">
              Category Description
            </span>
            <textarea
              name="description"
              rows={3}
              value={sectionForm.description}
              onChange={(event) =>
                setSectionForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="mt-2 box-border w-full min-w-0 resize-y rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
              placeholder="Describe this group of services."
            />
          </label>

          <div className="flex min-w-0 flex-wrap gap-3">
            <PendingSubmitButton
              pendingText={isAddingSection ? "Creating..." : "Saving..."}
              className="inline-flex items-center gap-2 rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={15} />
              {isAddingSection ? "Create Category" : "Save Changes"}
            </PendingSubmitButton>

            <button
              type="button"
              onClick={cancelSectionForm}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8]"
            >
              <X size={15} />
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-7 min-w-0 w-full max-w-full space-y-5">
        {orderedSections.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-[#0D1023] p-6 text-center text-sm text-[#C5BFD0]">
            No service categories have been created yet.
          </p>
        ) : (
          <DndContext
            id="service-sections-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={orderedSections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="min-w-0 w-full max-w-full space-y-5">
                {orderedSections.map((section, sectionIndex) => {
                  const sectionServices = services
                    .filter((service) => service.section_id === section.id)
                    .sort((a, b) => a.display_order - b.display_order);

                  const sectionContentBlock =
                    contentBlocks.find(
                      (block) => block.service_section_id === section.id
                    ) ?? null;

                  const collapsed = collapsedIds.has(section.id);

                  const sectionHasEditor =
                    serviceFormOpen &&
                    serviceFormSectionId === section.id;

                  return (
                    <SortableSection
                      key={section.id}
                      section={section}
                      order={sectionIndex + 1}
                      disabled={isReordering || formIsOpen}
                      collapsed={collapsed}
                      hasServices={sectionServices.length > 0}
                      hasContentBlock={Boolean(sectionContentBlock)}
                      onToggle={() => toggleCollapsed(section.id)}
                      onEdit={() => startEditingSection(section)}
                    >
                      <div className="min-w-0 w-full max-w-full border-t border-white/10 pt-5">
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-ethnocentric text-xs text-[#F0CA77]">
                              Services
                            </h4>

                            <p className="mt-2 break-words text-xs leading-relaxed text-[#C5BFD0]">
                              Manage the services belonging to {section.title}.
                              Drag services using the handle to change their
                              display order. Service numbers update
                              automatically.
                            </p>
                          </div>

                          <span className="shrink-0 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#C5BFD0] sm:ml-4">
                            {sectionServices.length}{" "}
                            {sectionServices.length === 1
                              ? "service"
                              : "services"}
                          </span>
                        </div>

                        {sectionServices.length === 0 ? (
                          <p className="mt-4 rounded-lg border border-white/10 bg-[#15162D] p-4 text-center text-xs text-[#C5BFD0]">
                            No services yet
                          </p>
                        ) : (
                          <div className="mt-4 min-w-0 w-full max-w-full overflow-hidden">
                            <DndContext
                              id={`services-dnd-${section.id}`}
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(event) =>
                                handleServiceDragEnd(section.id, event)
                              }
                            >
                              <SortableContext
                                items={sectionServices.map(
                                  (service) => service.id
                                )}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="min-w-0 w-full max-w-full space-y-3">
                                  {sectionServices.map((service) => (
                                    <SortableService
                                      key={service.id}
                                      service={service}
                                      disabled={formIsOpen || isReordering}
                                      collapsed={collapsedServiceIds.has(
                                        service.id
                                      )}
                                      onToggle={() =>
                                        toggleServiceCollapsed(service.id)
                                      }
                                      onEdit={() =>
                                        startEditingService(service)
                                      }
                                      editor={
                                        editingServiceId === service.id &&
                                        serviceFormOpen ? (
                                          <ServiceEditorForm
                                            serviceForm={serviceForm}
                                            setServiceForm={setServiceForm}
                                            editingServiceId={editingServiceId}
                                            iconPickerOpen={iconPickerOpen}
                                            setIconPickerOpen={setIconPickerOpen}
                                            onCancel={cancelServiceForm}
                                          />
                                        ) : null
                                      }
                                    />
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          </div>
                        )}

                        {sectionHasEditor && !editingServiceId && (
                          <ServiceEditorForm
                            serviceForm={serviceForm}
                            setServiceForm={setServiceForm}
                            editingServiceId={null}
                            iconPickerOpen={iconPickerOpen}
                            setIconPickerOpen={setIconPickerOpen}
                            onCancel={cancelServiceForm}
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => startAddingService(section.id)}
                          disabled={formIsOpen || isReordering}
                          className="mt-4 w-full rounded-xl border border-dashed border-[#F0CA77]/40 bg-[#F0CA77]/5 px-5 py-4 text-sm font-semibold text-[#F0CA77] transition hover:border-[#F0CA77] hover:bg-[#F0CA77]/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <span aria-hidden="true" className="mr-2">
                            +
                          </span>
                          Add Service
                        </button>
                      </div>

                      <ServiceContentBlockManager
                        sectionId={section.id}
                        sectionName={section.title}
                        block={sectionContentBlock}
                      />
                    </SortableSection>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}
