
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AKIV_BASE_COOKIE_NAME,
  verifyAccessToken,
} from "@/lib/akiv-base-access";

import { createClient } from "@/lib/supabase";

export async function requireAdmin() {
  // Verify the shared workspace password session.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AKIV_BASE_COOKIE_NAME)?.value;

  const hasWorkspaceAccess = await verifyAccessToken(accessToken);

  if (!hasWorkspaceAccess) {
    redirect("/akiv-base/access");
  }

  // Verify the existing Supabase administrator session.
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/akiv-base/admin/login");
  }

  // Preserve the existing admin_users authorization check.
  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/akiv-base/admin/login?error=unauthorized");
  }

  return user;
}
