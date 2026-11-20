
import { redirect } from "next/navigation";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase";

async function logout() {
  "use server";

  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/akiv-base/admin/login");
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  return (
    <main className="artsy-background relative min-h-screen overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="art-grid absolute inset-0 opacity-25" />
        <div className="noise absolute inset-0" />

        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#3B4895]/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#934C60]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <img
              src="/images/a-logo.png"
              alt="AKIVSOFT"
              className="h-14 w-14 object-contain"
            />

            <div>
              <p className="font-ethnocentric text-sm tracking-[0.15em] text-[#F0CA77]">
                AKIVSOFT
              </p>

              <p className="mt-1 text-sm text-[#C5BFD0]">
                Administration
              </p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-[#FFFDF8] transition hover:border-[#F0CA77] hover:text-[#F0CA77]"
            >
              Sign Out
            </button>
          </form>
        </header>

        <section className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#DE8A61]">
            Dashboard
          </p>

          <h1 className="mt-3 font-ethnocentric text-2xl leading-relaxed text-[#FFFDF8] sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-4 text-sm text-[#C5BFD0] sm:text-base">
            Manage your AKIVSOFT website portfolio and content.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl sm:p-8">
            <h2 className="font-ethnocentric text-lg text-[#F0CA77]">
              Administrator Account
            </h2>

            <p className="mt-4 text-sm text-[#C5BFD0]">
              Signed in as
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[#FFFDF8]">
              {user.email}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              href="/akiv-base/admin/portfolio"
              className="group rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl transition hover:border-[#F0CA77]/50 hover:bg-[#1B1A35]"
            >
              <h2 className="font-ethnocentric text-base text-[#FFFDF8] transition group-hover:text-[#F0CA77]">
                Portfolio Management
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
                Manage your Unity games, applications, website projects, and portfolio categories.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#DE8A61]">
                Manage Portfolio →
              </p>
            </Link>

            <Link
              href="/akiv-base/admin/services"
              className="group rounded-2xl border border-white/10 bg-[#15162D]/80 p-6 backdrop-blur-xl transition hover:border-[#F0CA77]/50 hover:bg-[#1B1A35]"
            >
              <h2 className="font-ethnocentric text-base text-[#FFFDF8] transition group-hover:text-[#F0CA77]">
                Services Management
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
                Manage service sections, descriptions, individual services, publication status, and display order.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#DE8A61]">
                Manage Services →
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
