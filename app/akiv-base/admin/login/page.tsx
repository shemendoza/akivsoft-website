import { redirect } from "next/navigation";

import PendingSubmitButton from "@/components/admin/PendingSubmitButton";
import { createClient } from "@/lib/supabase";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/akiv-base/admin/login?error=missing-fields");
  }

  const supabase = await createClient();

  const { error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) {
    redirect("/akiv-base/admin/login?error=invalid-credentials");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    await supabase.auth.signOut();
    redirect("/akiv-base/admin/login?error=unauthorized");
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

  redirect("/akiv-base/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    "missing-fields": "Please enter your email and password.",
    "invalid-credentials": "Invalid email or password.",
    unauthorized: "You do not have administrator access.",
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
            Admin Login
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#C5BFD0]">
            Sign in to manage your portfolio and website content.
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

          <form action={login} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#FFFDF8]"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-white/15 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#C5BFD0]/50 focus:border-[#F0CA77]"
                placeholder="Enter your admin email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#FFFDF8]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-white/15 bg-[#0D1023] px-4 py-3 text-sm text-[#FFFDF8] outline-none transition placeholder:text-[#C5BFD0]/50 focus:border-[#F0CA77]"
                placeholder="Enter your password"
              />
            </div>

            <PendingSubmitButton
              pendingText="Signing in..."
              className="w-full rounded-lg bg-[#DE8A61] px-5 py-3.5 font-semibold text-[#15162D] transition hover:bg-[#F0CA77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0CA77]"
            >
              Sign In
            </PendingSubmitButton>

            <div className="flex justify-center">
              <a
                href="/akiv-base/admin/forgot-password"
                className="text-sm text-[#C5BFD0] transition hover:text-[#F0CA77]"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        <p className="mt-7 text-center text-xs text-[#C5BFD0]/60">
          Authorized administrators only.
        </p>
      </div>
    </main>
  );
}