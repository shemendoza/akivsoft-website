
import Link from "next/link";

import { getAdminPortfolio } from "@/lib/admin-portfolio";
import PortfolioCategoryManager from "@/components/admin/PortfolioCategoryManager";
import PortfolioProjectManager from "@/components/admin/PortfolioProjectManager";
import PortfolioProjectForm from "@/components/admin/PortfolioProjectForm";

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

  const draftCount = projects.length - publishedCount;

  const projectCounts = projects.reduce<Record<string, number>>(
    (counts, project) => {
      counts[project.category_id] =
        (counts[project.category_id] ?? 0) + 1;

      return counts;
    },
    {}
  );

  return (
    <main className="artsy-background relative min-h-screen overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="art-grid absolute inset-0 opacity-25" />
        <div className="noise absolute inset-0" />

        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#3B4895]/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#934C60]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/akiv-base/admin"
              className="text-sm text-[#C5BFD0] transition hover:text-[#F0CA77]"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-5 font-ethnocentric text-xl leading-relaxed text-[#FFFDF8] sm:text-3xl">
              Portfolio Management
            </h1>

            <p className="mt-3 text-sm text-[#C5BFD0]">
              Manage your categories, projects, images, and published content.
            </p>
          </div>

          <Link
            href="/akiv-base/admin"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm text-[#FFFDF8] transition hover:border-[#F0CA77] hover:text-[#F0CA77]"
          >
            Dashboard
          </Link>
        </header>

        {params.created === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Project created successfully as a draft.
          </div>
        )}

        {params.categoryCreated === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Category created successfully as a draft.
          </div>
        )}

        {params.categoryUpdated === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Category updated successfully.
          </div>
        )}

        {params.categoryPublished === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Category publication status updated successfully.
          </div>
        )}

        {params.categoryDeleted === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Category deleted successfully.
          </div>
        )}

        {params.projectUpdated === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Project updated successfully.
          </div>
        )}

        {params.projectPublished === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Project publication status updated successfully.
          </div>
        )}

        {params.projectDeleted === "1" && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
            Project deleted successfully.
          </div>
        )}

        {params.error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {params.error}
          </div>
        )}

        <section className="mt-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
            <p className="text-sm text-[#C5BFD0]">Total Projects</p>
            <p className="mt-3 font-ethnocentric text-3xl text-[#FFFDF8]">
              {projects.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
            <p className="text-sm text-[#C5BFD0]">Published Projects</p>
            <p className="mt-3 font-ethnocentric text-3xl text-[#F0CA77]">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
            <p className="text-sm text-[#C5BFD0]">Draft Projects</p>
            <p className="mt-3 font-ethnocentric text-3xl text-[#DE8A61]">
              {draftCount}
            </p>
          </div>
        </section>

        <div className="mt-10 space-y-5">
          <details className="group rounded-2xl border border-white/10 bg-[#15162D]/60 p-5 backdrop-blur-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="text-base font-semibold text-[#FFFDF8] sm:text-lg">
                  Portfolio Categories
                </h2>
                <p className="mt-1 text-sm text-[#C5BFD0]">
                  Create, edit, and organize your portfolio categories.
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#F0CA77] transition-transform duration-200 group-open:rotate-180">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>

            <div className="mt-6 border-t border-white/10 pt-6">
              <PortfolioCategoryManager
                categories={categories}
                projectCounts={projectCounts}
              />
            </div>
          </details>

          <details className="group rounded-2xl border border-white/10 bg-[#15162D]/60 p-5 backdrop-blur-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="text-base font-semibold text-[#FFFDF8] sm:text-lg">
                  Add New Project
                </h2>
                <p className="mt-1 text-sm text-[#C5BFD0]">
                  Add a new game, application, or website to your portfolio.
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#F0CA77] transition-transform duration-200 group-open:rotate-180">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>

            <div className="mt-6 border-t border-white/10 pt-6">
              <PortfolioProjectForm categories={categories} />
            </div>
          </details>

          <details
            open
            className="group rounded-2xl border border-white/10 bg-[#15162D]/60 p-5 backdrop-blur-xl"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="text-base font-semibold text-[#FFFDF8] sm:text-lg">
                  Project Management
                </h2>
                <p className="mt-1 text-sm text-[#C5BFD0]">
                  Edit projects, manage images, and control publication status.
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#F0CA77] transition-transform duration-200 group-open:rotate-180">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>

            <div className="mt-6 border-t border-white/10 pt-6">
              <PortfolioProjectManager
                categories={categories}
                projects={projects}
                details={details}
              />
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
