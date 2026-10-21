import type { Metadata, Viewport } from "next";
import "../globals.css";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { OrganizationJsonLd } from "@/components/layout/OrganizationJsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { PORTAL_URL, routes, site } from "@/content/site";
import { SITE_URL, dirOf, href, locales } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { fontVariables } from "@/lib/fonts";
import { navMenus } from "@/lib/navMenus";
import { getLocale } from "@/lib/params";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "SWYV",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const locale = await getLocale(params);
  const s = localize(site, locale);
  const link = (route: keyof typeof routes, hash = "") => href(locale, routes[route]) + hash;
  const menus = navMenus(locale);

  return (
    // data-theme follows the section under the header (SiteHeader); pages open on a dark hero.
    <html lang={locale} dir={dirOf(locale)} data-theme="dark" className={`${fontVariables} h-full`}>
      {/* The intro's boot script sets body overflow before hydration. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <IntroLoader />
        <a
          href="#main"
          className="sr-only z-[60] bg-red px-4 py-2 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {s.skipToContent}
        </a>
        <SiteHeader
          locale={locale}
          copy={{
            homeHref: link("home"),
            nav: s.nav.map((item) => ({
              href: link(item.route),
              label: item.label,
              children: "menu" in item && item.menu ? menus[item.menu] : undefined,
            })),
            showMenu: s.showMenu,
            login: { href: PORTAL_URL || link("portal"), label: s.clientLogin },
            cta: { href: link("pilot"), label: s.primaryCta },
            switchLanguage: s.switchLanguage,
            switchLanguageLabel: s.switchLanguageLabel,
            openMenu: s.openMenu,
            closeMenu: s.closeMenu,
          }}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter
          copy={{
            about: s.footer.about,
            servicesTitle: s.footer.servicesTitle,
            services: s.footer.services.map((item) => ({ href: link(item.route, item.hash), label: item.label })),
            companyTitle: s.footer.companyTitle,
            company: s.footer.company.map((item) => ({ href: link(item.route), label: item.label })),
            copyright: s.footer.copyright,
            legal: [
              { href: link("privacy"), label: s.footer.privacy },
              { href: link("terms"), label: s.footer.terms },
            ],
          }}
        />
        <SmoothScrollProvider />
        <CookieBanner copy={{ ...s.cookies, moreHref: link("privacy") }} />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
