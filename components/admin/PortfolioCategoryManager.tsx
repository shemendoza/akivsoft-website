
"use client";

import { useState } from "react";

import {
  createPortfolioCategory,
  updatePortfolioCategory,
  togglePortfolioCategoryPublished,
  deletePortfolioCategory,
} from "@/app/akiv-base/admin/portfolio/actions";

import type { PortfolioCategoryRecord } from "@/types/portfolio";

type PortfolioCategoryManagerProps = {
  categories: PortfolioCategoryRecord[];
  projectCounts: Record<string, number>;
};

type CategoryFormState = {
  name: string;
  slug: string;
  section_title: string;
  section_description: string;
  display_order: string;
};

const EMPTY_FORM: CategoryFormState = {
  name: "",
  slug: "",
  section_title: "",
  section_description: "",
  display_order: "1",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PortfolioCategoryManager({
  categories,
  projectCounts,
}: PortfolioCategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  function updateField(
    field: keyof CategoryFormState,
    value: string
  ) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !slugManuallyEdited) {
        next.slug = createSlug(value);
      }

      return next;
    });
  }

  function startAdding() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      display_order: String(categories.length + 1),
    });
    setSlugManuallyEdited(false);
    setIsAdding(true);
  }

  function startEditing(category: PortfolioCategoryRecord) {
    setIsAdding(false);
    setEditingId(category.id);
    setSlugManuallyEdited(true);

    setForm({
      name: category.name,
      slug: category.slug,
      section_title: category.section_title,
      section_description: category.section_description,
      display_order: String(category.display_order),
    });
  }

  function cancelForm() {
    setIsAdding(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugManuallyEdited(false);
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-5 backdrop-blur-xl sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-ethnocentric text-lg text-[#F0CA77]">
            Portfolio Categories
          </h2>

          <p className="mt-2 text-sm text-[#C5BFD0]">
            Create and manage the sections displayed on your website.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={startAdding}
            className="rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77]"
          >
            + Add Category
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form
          action={isAdding ? createPortfolioCategory : updatePortfolioCategory}
          className="mt-7 space-y-5 rounded-xl border border-white/10 bg-[#0D1023] p-5"
        >
          {editingId && (
            <input type="hidden" name="id" value={editingId} />
          )}

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

            <label className="block">
              <span className="text-sm text-[#C5BFD0]">
                URL Slug *
              </span>

              <input
                required
                name="slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  updateField("slug", createSlug(event.target.value));
                }}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
                placeholder="unity-games"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm text-[#C5BFD0]">
                Website Section Title *
              </span>

              <input
                required
                name="section_title"
                value={form.section_title}
                onChange={(event) =>
                  updateField("section_title", event.target.value)
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

            <label className="block">
              <span className="text-sm text-[#C5BFD0]">
                Display Order *
              </span>

              <input
                required
                type="number"
                min="0"
                step="1"
                name="display_order"
                value={form.display_order}
                onChange={(event) =>
                  updateField("display_order", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-4 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#F0CA77]"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[#DE8A61] px-5 py-3 text-sm font-semibold text-[#15162D] transition hover:bg-[#F0CA77]"
            >
              {isAdding ? "Create Category" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm text-[#C5BFD0] transition hover:border-white/40 hover:text-[#FFFDF8]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-7 space-y-4">
        {categories.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-[#0D1023] p-6 text-center text-sm text-[#C5BFD0]">
            No categories have been created yet.
          </p>
        ) : (
          categories.map((category) => {
            const projectCount = projectCounts[category.id] ?? 0;

            return (
              <article
                key={category.id}
                className="rounded-xl border border-white/10 bg-[#0D1023] p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-ethnocentric text-sm text-[#FFFDF8]">
                        {category.section_title}
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

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#DE8A61]">
                      <span>{category.name}</span>
                      <span>/{category.slug}</span>
                      <span>Order: {category.display_order}</span>
                      <span>{projectCount} projects</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      disabled={isAdding || Boolean(editingId)}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#FFFDF8] transition hover:border-[#F0CA77] hover:text-[#F0CA77] disabled:cursor-not-allowed disabled:opacity-40"
                    >
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

                      <button
                        type="submit"
                        disabled={isAdding || Boolean(editingId)}
                        className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#C5BFD0] transition hover:border-[#F0CA77] hover:text-[#F0CA77] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {category.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>

                    <form action={deletePortfolioCategory}>
                      <input
                        type="hidden"
                        name="id"
                        value={category.id}
                      />

                      <button
                        type="submit"
                        disabled={
                          projectCount > 0 ||
                          isAdding ||
                          Boolean(editingId)
                        }
                        className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        title={
                          projectCount > 0
                            ? "Move or delete this category's projects first."
                            : "Delete category"
                        }
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>

                {projectCount > 0 && (
                  <p className="mt-4 text-xs text-[#C5BFD0]/70">
                    This category cannot be deleted while it contains projects.
                  </p>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
