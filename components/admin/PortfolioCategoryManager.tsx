
"use client";

import { useEffect, useState } from "react";

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
  createPortfolioCategory,
  updatePortfolioCategory,
  togglePortfolioCategoryPublished,
  deletePortfolioCategory,
  reorderPortfolioCategories,
} from "@/app/akiv-base/admin/portfolio/actions";

import PendingSubmitButton from "@/components/admin/PendingSubmitButton";
import PortfolioProjectManager from "@/components/admin/PortfolioProjectManager";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";

import type {
  PortfolioCategoryRecord,
  PortfolioProjectRecord,
  PortfolioProjectDetailRecord,
} from "@/types/portfolio";

type PortfolioCategoryManagerProps = {
  categories: PortfolioCategoryRecord[];
  projects: PortfolioProjectRecord[];
  details: PortfolioProjectDetailRecord[];
};

type CategoryFormState = {
  name: string;
  section_description: string;
};

type SortableCategoryProps = {
  category: PortfolioCategoryRecord;
  disabled: boolean;
  children: React.ReactNode;
};

const EMPTY_FORM: CategoryFormState = {
  name: "",
  section_description: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function SortableCategory({
  category,
  disabled,
  children,
}: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-xl border bg-[#0D1023] ${
        isDragging
          ? "border-[#F0CA77] shadow-xl shadow-black/30"
          : "border-white/10"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#15162D]/70 px-4 py-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Drag ${category.name} category to reorder`}
          title="Drag to reorder category"
          className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg text-[#FFFDF8]/70 transition hover:bg-white/10 hover:text-[#FFFDF8] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        >
          <GripVertical size={18} />
        </button>

        <span className="min-w-0 flex-1 truncate text-xs text-[#C5BFD0]/70">
          Drag to change category order
        </span>

        <span className="shrink-0 text-xs font-medium text-[#FFFDF8]">
          Order {category.display_order}
        </span>
      </div>

      {children}
    </article>
  );
}

export default function PortfolioCategoryManager({
  categories,
  projects,
  details,
}: PortfolioCategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);

  const [orderedCategories, setOrderedCategories] =
    useState<PortfolioCategoryRecord[]>(categories);

  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(
    () => new Set()
  );

  const [isReordering, setIsReordering] = useState(false);
  const [reorderError, setReorderError] = useState("");

  useEffect(() => {
    setOrderedCategories(categories);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function updateField(
    field: keyof CategoryFormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startAdding() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsAdding(true);
  }

  function startEditing(category: PortfolioCategoryRecord) {
    setIsAdding(false);
    setEditingId(category.id);

    setForm({
      name: category.name,
      section_description: category.section_description,
    });
  }

  function cancelForm() {
    setIsAdding(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function toggleCollapsed(categoryId: string) {
    setCollapsedIds((current) => {
      const next = new Set(current);

      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || isReordering) {
      return;
    }

    const oldIndex = orderedCategories.findIndex(
      (category) => category.id === active.id
    );

    const newIndex = orderedCategories.findIndex(
      (category) => category.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousCategories = orderedCategories;

    const reordered = arrayMove(
      orderedCategories,
      oldIndex,
      newIndex
    ).map((category, index) => ({
      ...category,
      display_order: index + 1,
    }));

    setOrderedCategories(reordered);
    setReorderError("");
    setIsReordering(true);

    void (async () => {
      try {
        const result = await reorderPortfolioCategories(
          reordered.map((category) => category.id)
        );

        if (!result.success) {
          setOrderedCategories(previousCategories);
          setReorderError(
            result.error || "Unable to save the new category order."
          );
          return;
        }
      } catch (error) {
        console.error("Portfolio category reorder failed:", error);

        setOrderedCategories(previousCategories);
        setReorderError(
          "Unable to save the new category order. Please try again."
        );
      } finally {
        setIsReordering(false);
      }
    })();
  }

  const canReorder =
    !isAdding &&
    !editingId &&
    !isReordering &&
    orderedCategories.length > 1;

  const currentEditingCategory = editingId
    ? orderedCategories.find((category) => category.id === editingId)
    : undefined;

  const nextDisplayOrder = currentEditingCategory
    ? currentEditingCategory.display_order
    : orderedCategories.length + 1;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-5 backdrop-blur-xl sm:p-7">
      {/* Category Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-ethnocentric text-lg text-[#F0CA77]">
            Portfolio Categories
          </h2>

          <p className="mt-2 text-sm text-[#C5BFD0]">
            Create and manage portfolio sections and their projects.
          </p>

          <p className="mt-2 text-xs text-[#C5BFD0]/70">
            Drag categories to change their display order. You can also
            minimize categories without affecting their position.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={startAdding}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#DE8A61]/40 px-4 py-2.5 text-sm font-semibold text-[#F0CA77] transition hover:bg-[#DE8A61]/10"
          >
            <Plus size={15} />
            Add Category
          </button>
        )}
      </div>

      {/* Category Create / Edit Form */}
      {(isAdding || editingId) && (
        <form
          action={isAdding ? createPortfolioCategory : updatePortfolioCategory}
          className="mt-7 space-y-5 rounded-xl border border-white/10 bg-[#0D1023] p-5"
        >
          {editingId && (
            <input type="hidden" name="id" value={editingId} />
          )}

          {/* Generate the URL slug automatically from the category name. */}
          <input
            type="hidden"
            name="slug"
            value={createSlug(form.name)}
          />

          {/* The category name is also the website section title. */}
          <input type="hidden" name="section_title" value={form.name} />

          {/* Display order is managed automatically. */}
          <input
            type="hidden"
            name="display_order"
            value={nextDisplayOrder}
          />

          <h3 className="font-ethnocentric text-sm text-[#FFFDF8]">
            {isAdding ? "New Category" : "Edit Category"}
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-[#C5BFD0]">
                Category Name *
              </span>

              <input
                required
                name="name"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
                placeholder="Unity Games"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm text-[#C5BFD0]">
                Section Description *
              </span>

              <textarea
                required
                name="section_description"
                rows={3}
                value={form.section_description}
                onChange={(event) =>
                  updateField("section_description", event.target.value)
                }
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
                placeholder="Describe the projects in this section."
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <PendingSubmitButton
              pendingText={isAdding ? "Creating..." : "Saving..."}
              className="inline-flex items-center gap-2 rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77]"
            >
              <Check size={15} />
              {isAdding ? "Create Category" : "Save Changes"}
            </PendingSubmitButton>

            <button
              type="button"
              onClick={cancelForm}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
            >
              <X size={15} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reordering Status */}
      {isReordering && (
        <p className="mt-5 text-xs text-[#F0CA77]" role="status">
          Saving category order...
        </p>
      )}

      {reorderError && (
        <p
          className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {reorderError}
        </p>
      )}

      {/* Category Cards */}
      <div className="mt-7 space-y-5">
        {orderedCategories.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-[#0D1023] p-6 text-center text-sm text-[#C5BFD0]">
            No categories have been created yet.
          </p>
        ) : (
          <DndContext
            id="portfolio-categories"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedCategories.map((category) => category.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedCategories.map((category) => {
                const categoryProjects = projects
                  .filter(
                    (project) => project.category_id === category.id
                  )
                  .sort(
                    (a, b) => a.display_order - b.display_order
                  );

                const projectCount = categoryProjects.length;
                const isCollapsed = collapsedIds.has(category.id);

                return (
                  <SortableCategory
                    key={category.id}
                    category={category}
                    disabled={!canReorder}
                  >
                    {/* Category Information and Actions */}
                    <div className="p-5">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-ethnocentric text-sm text-[#FFFDF8]">
                              {category.name}
                            </h3>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs ${
                                category.is_published
                                  ? "border-green-400/20 bg-green-400/10 text-green-300"
                                  : "border-white/15 bg-white/5 text-[#C5BFD0]"
                              }`}
                            >
                              {category.is_published ? "Published" : "Draft"}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
                            {category.section_description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCollapsed(category.id)}
                            aria-expanded={!isCollapsed}
                            aria-label={
                              isCollapsed
                                ? `Expand ${category.name}`
                                : `Minimize ${category.name}`
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:bg-white/5"
                          >
                            {isCollapsed ? (
                              <>
                                <Maximize2 size={13} />
                                Expand
                              </>
                            ) : (
                              <>
                                <Minimize2 size={13} />
                                Minimize
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => startEditing(category)}
                            disabled={isAdding || Boolean(editingId)}
                           className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true" className="mr-1.5">
                ✎
              </span>
                            Edit
                          </button>

                          <form action={togglePortfolioCategoryPublished}>
                            <input
                              type="hidden"
                              name="id"
                              value={category.id}
                            />

                            <input
                              type="hidden"
                              name="is_published"
                              value={String(!category.is_published)}
                            />

                            <PendingSubmitButton
                              pendingText={
                                category.is_published
                                  ? "Unpublishing..."
                                  : "Publishing..."
                              }
                              disabled={isAdding || Boolean(editingId)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-white/40 hover:text-[#FFFDF8] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {category.is_published ? (
                                <EyeOff size={13} />
                              ) : (
                                <Eye size={13} />
                              )}
                              {category.is_published
                                ? "Unpublish"
                                : "Publish"}
                            </PendingSubmitButton>
                          </form>

                          <form action={deletePortfolioCategory}>
                            <input
                              type="hidden"
                              name="id"
                              value={category.id}
                            />

                            <span
                              title={
                                projectCount > 0
                                  ? "Move or delete this category's projects first."
                                  : "Delete category"
                              }
                            >
                              <PendingSubmitButton
                                pendingText="Deleting..."
                                disabled={
                                  projectCount > 0 ||
                                  isAdding ||
                                  Boolean(editingId)
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 size={13} />
                                Delete
                              </PendingSubmitButton>
                            </span>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Projects Belonging to This Category */}
                    {!isCollapsed && (
                      <div className="border-t border-white/10 bg-[#15162D]/40 p-4 sm:p-5">
                        <PortfolioProjectManager
                          category={category}
                          categories={categories}
                          projects={categoryProjects}
                          details={details}
                        />
                      </div>
                    )}
                  </SortableCategory>
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}
