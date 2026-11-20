
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAccessToken, AKIV_BASE_COOKIE_NAME } from "@/lib/akiv-base-access";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAkivBaseRoute =
    pathname === "/akiv-base" ||
    pathname.startsWith("/akiv-base/");

  const isAccessPage = pathname === "/akiv-base/access";

  if (isAkivBaseRoute && !isAccessPage) {
    const token = request.cookies.get(AKIV_BASE_COOKIE_NAME)?.value;
    const hasAccess = await verifyAccessToken(token);

    if (!hasAccess) {
      const accessUrl = request.nextUrl.clone();

      accessUrl.pathname = "/akiv-base/access";
      accessUrl.search = "";

      const response = NextResponse.redirect(accessUrl);

      if (token) {
        response.cookies.set({
          name: AKIV_BASE_COOKIE_NAME,
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/akiv-base",
          maxAge: 0,
        });
      }

      return response;
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
