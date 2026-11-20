
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AKIV_BASE_COOKIE_NAME,
  AKIV_BASE_SESSION_DURATION,
  createAccessToken,
  verifyAccessPassword,
} from "@/lib/akiv-base-access";

type AccessPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

async function unlockWorkspace(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");

  const isValid = await verifyAccessPassword(password);

  if (!isValid) {
    const configured =
      Boolean(process.env.AKIV_BASE_PASSWORD) &&
      Boolean(process.env.AKIV_BASE_SESSION_SECRET) &&
      process.env.AKIV_BASE_SESSION_SECRET!.length >= 32;

    redirect(
      configured
        ? "/akiv-base/access?error=invalid-password"
        : "/akiv-base/access?error=configuration"
    );
  }

  const token = await createAccessToken();

  if (!token) {
    redirect("/akiv-base/access?error=configuration");
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: AKIV_BASE_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/akiv-base",
    maxAge: AKIV_BASE_SESSION_DURATION,
  });

  redirect("/akiv-base/admin/login");
}

export default async function AkivBaseAccessPage({
  searchParams,
}: AccessPageProps) {
  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    "invalid-password": "The workspace password is incorrect.",
    configuration:
      "Workspace access is not configured correctly. Please contact the administrator.",
  };

  return (
    <main className="artsy-background relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="art-grid absolute inset-0 opacity-25" />
        <div className="noise absolute inset-0" />

        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#3B4895]/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#934C60]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/images/a-logo.png"
            alt="AKIVSOFT"
            className="mx-auto mb-6 h-20 w-20 object-contain"
          />

          <p className="font-ethnocentric text-sm tracking-[0.2em] text-[#F0CA77]">
            AKIVSOFT
          </p>

          <h1 className="mt-4 font-ethnocentric text-2xl text-[#FFFDF8]">
            Private Access
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
            Enter the workspace password to continue to the
            administration area.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#15162D]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          {error && errorMessages[error] && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {errorMessages[error]}
            </div>
          )}

          <form action={unlockWorkspace} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#FFFDF8]"
              >
                Workspace Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-white/15 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#C5BFD0]/50 focus:border-[#F0CA77]"
                placeholder="Enter your workspace password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#DE8A61] px-5 py-3.5 font-semibold text-[#15162D] transition hover:bg-[#F0CA77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0CA77]"
            >
              Unlock Workspace
            </button>
          </form>
        </div>

        <p className="mt-7 text-center text-xs text-[#C5BFD0]/60">
          Restricted workspace · Authorized access only
        </p>
      </div>
    </main>
  );
}
