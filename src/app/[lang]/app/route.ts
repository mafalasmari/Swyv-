import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, href, type Locale } from "@/i18n/config";
import { getAccount } from "@/lib/auth/session";
import { PORTAL_HTML } from "@/lib/portal/app-html";

/**
 * The SWYV Portal (built from portal/), served only to a signed-in account. The
 * account decides the dashboard: فيصل gets the client portal, محمد the operations
 * console. Without a session, this sends the visitor to the login page.
 */
export async function GET(req: NextRequest, ctx: RouteContext<"/[lang]/app">) {
  const { lang } = await ctx.params;
  const locale: Locale = hasLocale(lang) ? lang : "ar";
  const account = await getAccount();
  if (!account) return NextResponse.redirect(new URL(href(locale, "/login"), req.url));

  const user = { name: account.name, role: account.role, lang: locale, logout: `/api/logout?lang=${locale}` };
  // "<" is escaped so the JSON can't close the script tag.
  const script = `<script>window.__SWYV_USER__=${JSON.stringify(user).replace(/</g, "\\u003c")}</script>`;
  const html = PORTAL_HTML.replace('<html lang="ar" dir="rtl">', `<html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}">`).replace(
    "</head>",
    `${script}</head>`,
  );
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
