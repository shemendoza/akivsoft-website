
import Link from "next/link";

import {
  getAdminServices,
  getAdminServiceContentBlocks,
} from "@/lib/admin-services";
import ServiceManager from "@/components/admin/ServiceManager";

type ServicesPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

const SUCCESS_MESSAGES: Record<string, string> = {
  sectionCreated: "Service category created successfully as a draft.",
  sectionUpdated: "Service category updated successfully.",
  sectionPublished: "Category publication status updated.",
  sectionDeleted: "Service category deleted successfully.",
  serviceCreated: "Service created successfully as a draft.",
  serviceUpdated: "Service updated successfully.",
  servicePublished: "Service publication status updated.",
  serviceDeleted: "Service deleted successfully.",
  contentBlockCreated:
    "Additional content block created successfully as a draft.",
  contentBlockUpdated: "Additional content block updated successfully.",
  contentBlockPublished:
    "Additional content block publication status updated.",
  contentBlockDeleted: "Additional content block deleted successfully.",
};

export default async function AdminServicesPage({
  searchParams,
}: ServicesPageProps) {
  const [{ sections, services }, contentBlocks, params] = await Promise.all([
    getAdminServices(),
    getAdminServiceContentBlocks(),
    searchParams,
  ]);

  const publishedSections = sections.filter(
    (section) => section.is_published
  ).length;

  const publishedServices = services.filter(
    (service) => service.is_published
  ).length;

  const draftSectionCount = sections.length - publishedSections;
  const draftServiceCount = services.length - publishedServices;

  // Every unpublished category and individual service counts as a draft.
  const draftServices = draftSectionCount + draftServiceCount;

  const successMessage = params.success
    ? SUCCESS_MESSAGES[params.success]
    : undefined;

  return (
    <main className="min-h-screen bg-[#0D1023] px-5 py-10 text-[#FFFDF8] sm:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="artsy-background absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.035]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/akiv-base/admin"
            className="inline-flex items-center gap-2 text-sm text-[#C5BFD0] transition hover:text-[#F0CA77]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="font-ethnocentric text-xl text-[#F0CA77] sm:text-2xl">
            Services Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#C5BFD0]">
            Manage your service categories, organize individual services,
            and control the content displayed on your website.
          </p>
        </header>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-sm text-green-300">
            {successMessage}
          </div>
        )}

        {params.error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {params.error}
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-5 font-ethnocentric text-sm text-[#FFFDF8]">
            Services Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Total Categories
              </p>
              <p className="mt-3 font-ethnocentric text-3xl text-[#F0CA77]">
                {sections.length}
              </p>
              <p className="mt-2 text-xs text-[#C5BFD0]">
                {publishedSections} published
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Total Services
              </p>
              <p className="mt-3 font-ethnocentric text-3xl text-[#DE8A61]">
                {services.length}
              </p>
              <p className="mt-2 text-xs text-[#C5BFD0]">
                {publishedServices} published
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Draft Services
              </p>
              <p className="mt-3 font-ethnocentric text-3xl text-[#C59DD3]">
                {draftServices}
              </p>
              <p className="mt-2 text-xs text-[#C5BFD0]">
                Includes unpublished categories and services
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#C5BFD0]">
                Total Content
              </p>
              <p className="mt-3 font-ethnocentric text-3xl text-[#3B4895]">
                {contentBlocks.length}
              </p>
              <p className="mt-2 text-xs text-[#C5BFD0]">
                Additional content blocks
              </p>
            </div>
          </div>
        </section>

        <ServiceManager
          sections={sections}
          services={services}
          contentBlocks={contentBlocks}
        />
      </div>
    </main>
  );
}
