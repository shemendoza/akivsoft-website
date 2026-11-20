
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
  sectionCreated: "Service section created successfully.",
  sectionUpdated: "Service section updated successfully.",
  sectionPublished: "Section publication status updated.",
  sectionDeleted: "Service section deleted successfully.",
  serviceCreated: "Service created successfully.",
  serviceUpdated: "Service updated successfully.",
  servicePublished: "Service publication status updated.",
  serviceDeleted: "Service deleted successfully.",
  contentBlockCreated: "Service content block created successfully.",
  contentBlockUpdated: "Service content block updated successfully.",
  contentBlockPublished: "Content block publication status updated.",
  contentBlockDeleted: "Service content block deleted successfully.",
};

export default async function AdminServicesPage({
  searchParams,
}: ServicesPageProps) {
  const [
    { sections, services },
    contentBlocks,
    params,
  ] = await Promise.all([
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#DE8A61]">
            AKIVSOFT Administration
          </p>

          <h1 className="font-ethnocentric text-2xl text-[#F0CA77] sm:text-3xl">
            Services Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#C5BFD0]">
            Manage the service sections and individual services displayed on
            your website. Changes here are independent of Portfolio Management.
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

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wider text-[#C5BFD0]">
              Total Sections
            </p>
            <p className="mt-3 font-ethnocentric text-3xl text-[#F0CA77]">
              {sections.length}
            </p>
            <p className="mt-2 text-xs text-[#C5BFD0]">
              {publishedSections} published
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wider text-[#C5BFD0]">
              Total Services
            </p>
            <p className="mt-3 font-ethnocentric text-3xl text-[#DE8A61]">
              {services.length}
            </p>
            <p className="mt-2 text-xs text-[#C5BFD0]">
              {publishedServices} published
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#15162D]/80 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wider text-[#C5BFD0]">
              Draft Services
            </p>
            <p className="mt-3 font-ethnocentric text-3xl text-[#C59DD3]">
              {services.length - publishedServices}
            </p>
            <p className="mt-2 text-xs text-[#C5BFD0]">
              Not currently published
            </p>
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
