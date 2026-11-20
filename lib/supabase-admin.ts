
import "server-only";

import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Admin environment variables are not configured."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export async function isAdministratorEmail(
  email: string
): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const normalizedEmail = email.trim().toLowerCase();

    let page = 1;
    const perPage = 1000;

    while (true) {
      const {
        data: { users },
        error: usersError,
      } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

      if (usersError) {
        console.error(
          "Unable to verify administrator email:",
          usersError.message
        );

        return false;
      }

      const matchingUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() === normalizedEmail
      );

      if (matchingUser) {
        const { data: admin, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", matchingUser.id)
          .maybeSingle();

        if (adminError) {
          console.error(
            "Administrator membership verification failed:",
            adminError.message
          );

          return false;
        }

        return Boolean(admin);
      }

      if (users.length < perPage) {
        return false;
      }

      page += 1;
    }
  } catch (error) {
    console.error(
      "Administrator email verification failed:",
      error
    );

    return false;
  }
}
