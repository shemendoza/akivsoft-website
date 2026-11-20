
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";

async function updatePassword(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? ""
  );

  if (password.length < 8) {
    redirect("/akiv-base/admin/reset-password?error=weak-password");
  }

  if (password !== confirmPassword) {
    redirect("/akiv-base/admin/reset-password?error=password-mismatch");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/akiv-base/admin/login?error=recovery-failed");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    redirect("/akiv-base/admin/login?error=unauthorized");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Password update failed:", error.message);
    redirect("/akiv-base/admin/reset-password?error=update-failed");
  }

  redirect("/akiv-base/admin/reset-password?success=updated");
}

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { error, success } = await searchParams;

  const errorMessages: Record<string, string> = {
    "weak-password": "Your password must contain at least 8 characters.",
    "password-mismatch": "The passwords do not match.",
    "update-failed": "Unable to update your password. Please try again.",
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

          <h1 className="mt-4 font-ethnocentric text-xl text-[#FFFDF8] sm:text-2xl">
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
            Create a new secure password for your administrator account.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#15162D]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          {success === "updated" ? (
            <>
              <div
                role="status"
                className="rounded-lg border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm leading-relaxed text-green-300"
              >
                Your password has been updated successfully.
              </div>

              <a
                href="/akiv-base/admin/login"
                className="mt-6 block w-full rounded-lg bg-[#DE8A61] px-5 py-3.5 text-center font-semibold text-[#15162D] transition hover:bg-[#F0CA77]"
              >
                Go to Admin Login
              </a>
            </>
          ) : (
            <>
              {error && errorMessages[error] && (
                <div
                  role="alert"
                  className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                >
                  {errorMessages[error]}
                </div>
              )}

              <form action={updatePassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#FFFDF8]"
                  >
                    New Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-white/15 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#C5BFD0]/50 focus:border-[#F0CA77]"
                    placeholder="Enter your new password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-[#FFFDF8]"
                  >
                    Confirm New Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-white/15 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#C5BFD0]/50 focus:border-[#F0CA77]"
                    placeholder="Confirm your new password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#DE8A61] px-5 py-3.5 font-semibold text-[#15162D] transition hover:bg-[#F0CA77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0CA77]"
                >
                  Update Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
