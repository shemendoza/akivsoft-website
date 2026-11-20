
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase";
import { isAdministratorEmail } from "@/lib/supabase-admin";

async function requestPasswordReset(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect("/akiv-base/admin/forgot-password?error=missing-email");
  }

  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";

  if (!host) {
    redirect("/akiv-base/admin/forgot-password?error=server");
  }

  const origin = `${protocol}://${host}`;

  // Only administrator accounts may request password recovery.
  const isAdmin = await isAdministratorEmail(email);

  // Use the same response for authorized and unauthorized emails
  // to avoid revealing which email addresses are administrators.
  if (!isAdmin) {
    redirect("/akiv-base/admin/forgot-password?success=sent");
  }

  const supabase = await createClient();
const redirectTo =
  `${origin}/auth/confirm?next=/akiv-base/admin/reset-password`;

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo,
});

  if (error) {
    console.error(
      "Password recovery request failed:",
      error.message
    );

    redirect("/akiv-base/admin/forgot-password?error=request-failed");
  }

  redirect("/akiv-base/admin/forgot-password?success=sent");
}

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, success } = await searchParams;

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

          <h1 className="mt-4 font-ethnocentric text-xl text-[#FFFDF8] sm:text-2xl">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
            Enter your administrator email address and we'll send you a password recovery link.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#15162D]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          {success === "sent" && (
            <div
              role="status"
              className="mb-6 rounded-lg border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm leading-relaxed text-green-300"
            >
              If an account exists for that email, a password recovery link has been sent. Check your inbox.
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error === "missing-email"
                ? "Please enter your email address."
                : "We couldn't process your request. Please try again."}
            </div>
          )}

          <form action={requestPasswordReset} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#FFFDF8]"
              >
                Administrator Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-white/15 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#C5BFD0]/50 focus:border-[#F0CA77]"
                placeholder="Enter your admin email"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#DE8A61] px-5 py-3.5 font-semibold text-[#15162D] transition hover:bg-[#F0CA77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0CA77]"
            >
              Send Recovery Link
            </button>
          </form>

          <a
            href="/akiv-base/admin/login"
            className="mt-6 block text-center text-sm text-[#C5BFD0] transition hover:text-[#F0CA77]"
          >
            Back to Admin Login
          </a>
        </div>
      </div>
    </main>
  );
}
