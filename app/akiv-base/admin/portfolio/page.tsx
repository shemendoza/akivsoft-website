
import Link from "next/link";

import { getAdminPortfolio } from "@/lib/admin-portfolio";
import PortfolioCategoryManager from "@/components/admin/PortfolioCategoryManager";

type AdminPortfolioPageProps = {
  searchParams: Promise<{
    error?: string;
    created?: string;
    categoryCreated?: string;
    categoryUpdated?: string;
    categoryPublished?: string;
    categoryDeleted?: string;
    projectUpdated?: string;
    projectPublished?: string;
    projectDeleted?: string;
  }>;
};

export default async function AdminPortfolioPage({
  searchParams,
}: AdminPortfolioPageProps) {
  const { categories, projects, details } = await getAdminPortfolio();
  const params = await searchParams;

  const publishedCount = projects.filter(
    (project) => project.is_published
  ).length;

  const publishedCategoryCount = categories.filter(
    (category) => category.is_published
  ).length;

  const draftProjectCount = projects.length - publishedCount;

  const draftCategoryCount =
    categories.length - publishedCategoryCount;

  // Every unpublished category and unpublished project counts as a draft.
  const draftCount = draftProjectCount + draftCategoryCount;

  return (
    <main className="artsy-background relative min-h-screen overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="art-grid absolute inset-0 opacity-25" />
        <div className="noise absolute inset-0" />

        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#3B4895]/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#934C60]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Page Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/akiv-base/admin"
              className="text-sm text-[#C5BFD0] transition hover:text-[#F0CA77]"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-4 font-ethnocentric text-xl text-[#F0CA77] sm:text-2xl">
              Portfolio Management
            </h1>

            <p className="mt-3 text-sm text-[#C5BFD0]">
              Manage your categories, projects, images, and published content.
            </p>
          </div>
        </header>

        {/* Success Notifications */}
        <div className="mt-6 space-y-3">
          {params.created === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Project created successfully as a draft.
            </div>
          )}

          {params.categoryCreated === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Category created successfully as a draft.
            </div>
          )}

          {params.categoryUpdated === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Category updated successfully.
            </div>
          )}

          {params.categoryPublished === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Category publication status updated successfully.
            </div>
          )}

          {params.categoryDeleted === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Category deleted successfully.
            </div>
          )}

          {params.projectUpdated === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Project updated successfully.
            </div>
          )}

          {params.projectPublished === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Project publication status updated successfully.
            </div>
          )}

          {params.projectDeleted === "1" && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
              Project deleted successfully.
            </div>
          )}

          {params.error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
              {params.error}
            </div>
          )}
        </div>

        {/* Portfolio Overview */}
        <section className="mt-10">
          <h2 className="mb-5 font-ethnocentric text-sm text-[#FFFDF8]">
            Portfolio Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Total Categories
              </p>

              <p className="mt-3 font-ethnocentric text-3xl text-[#FFFDF8]">
                {categories.length}
              </p>

              <p className="mt-2 text-xs text-[#C5BFD0]">
                {publishedCategoryCount} published
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Total Projects
              </p>

              <p className="mt-3 font-ethnocentric text-3xl text-[#F0CA77]">
                {projects.length}
              </p>

              <p className="mt-2 text-xs text-[#C5BFD0]">
                {publishedCount} published
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Draft Projects
              </p>

              <p className="mt-3 font-ethnocentric text-3xl text-[#DE8A61]">
                {draftCount}
              </p>

              <p className="mt-2 text-xs text-[#C5BFD0]">
                Includes unpublished categories and projects
              </p>
            </div>
          </div>
        </section>

        {/* Category-Based Portfolio Workspace */}
        <div className="mt-10">
          <PortfolioCategoryManager
            categories={categories}
            projects={projects}
            details={details}
          />
        </div>
      </div>
    </main>
  );
}
