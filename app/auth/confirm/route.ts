
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/admin/reset-password";

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/login?error=recovery-failed", origin)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Authentication confirmation failed:", error.message);

    return NextResponse.redirect(
      new URL("/admin/login?error=recovery-failed", origin)
    );
  }

  return NextResponse.redirect(new URL(next, origin));
}
