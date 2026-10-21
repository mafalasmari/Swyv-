import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, href } from "@/i18n/config";
import { SESSION_COOKIE } from "@/lib/auth/session";

/** Ends the portal session and returns to the login page. */
export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") ?? "";
  (await cookies()).delete(SESSION_COOKIE);
  return NextResponse.redirect(new URL(href(hasLocale(lang) ? lang : "ar", "/login"), req.url));
}
