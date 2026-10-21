"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import type { NavChild } from "@/lib/navMenus";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileDrawer } from "./MobileDrawer";
import { NavDropdown } from "./NavDropdown";

export type HeaderNavItem = { href: string; label: string; children?: NavChild[] };

export type HeaderCopy = {
  homeHref: string;
  nav: HeaderNavItem[];
  login: { href: string; label: string };
  cta: { href: string; label: string };
  switchLanguage: string;
  switchLanguageLabel: string;
  openMenu: string;
  closeMenu: string;
  showMenu: string;
};

const THEMED = ".section-dark, .section-light, .section-muted, [data-header-theme]";

/**
 * Keeps html[data-theme] in step with the section under the header's bottom edge,
 * so the header switches between its dark and light glass. An IntersectionObserver
 * watches a 1px band at that edge; when sections nest (a light card in a dark
 * page), the innermost one wins. Sections in hidden pages never intersect.
 */
function useHeaderTheme(header: React.RefObject<HTMLElement | null>, pathname: string | null) {
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const hits = new Set<Element>();

    const apply = () => {
      const inner = [...hits].find((el) => ![...hits].some((other) => other !== el && el.contains(other)));
      if (!inner) return;
      const tone = inner.getAttribute("data-header-theme") ?? (inner.classList.contains("section-light") ? "light" : "dark");
      document.documentElement.dataset.theme = tone;
    };

    const setup = () => {
      io?.disconnect();
      hits.clear();
      const edge = header.current?.offsetHeight ?? 64;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target);
            else hits.delete(e.target);
          }
          apply();
        },
        { rootMargin: `-${edge}px 0px -${Math.max(0, window.innerHeight - edge - 1)}px 0px` },
      );
      document.querySelectorAll(THEMED).forEach((el) => {
        if (!el.closest(".site-header, #mobile-menu")) io!.observe(el);
      });
    };

    // After the new page has rendered.
    const id = requestAnimationFrame(setup);
    window.addEventListener("resize", setup);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", setup);
      io?.disconnect();
    };
  }, [header, pathname]);
}

export function SiteHeader({ locale, copy }: { locale: Locale; copy: HeaderCopy }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  useHeaderTheme(headerRef, pathname);

  // Close everything whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setMenu(null);
  }

  // A click outside the header closes an open menu.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const isActive = (href: string) =>
    href === copy.homeHref ? pathname === href : pathname === href || Boolean(pathname?.startsWith(`${href}/`));

  return (
    <>
      <header ref={headerRef} className="site-header sticky top-0 z-50 border-b border-rule">
        <Container className="flex h-14 items-center gap-4 sm:gap-6 xl:h-16">
          <Link href={copy.homeHref} aria-label="SWYV" className="flex shrink-0 items-center">
            <Logo className="w-[104px] xl:w-[140px]" />
          </Link>

          <nav aria-label="Main" className="hidden flex-1 justify-center xl:flex">
            <ul className="flex items-center">
              {copy.nav.map((item, i) =>
                item.children ? (
                  <NavDropdown
                    key={item.href}
                    id={`nav-${i}`}
                    label={item.label}
                    href={item.href}
                    active={isActive(item.href)}
                    items={item.children}
                    open={menu === item.href}
                    showMenuLabel={copy.showMenu}
                    onOpen={() => setMenu(item.href)}
                    onClose={() => setMenu((m) => (m === item.href ? null : m))}
                  />
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="nav-link"
                      onMouseEnter={() => setMenu(null)}
                    >
                      {isActive(item.href) && <span aria-hidden className="nav-dot" />}
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="ms-auto hidden items-center gap-4 xl:flex">
            <LanguageSwitch locale={locale} label={copy.switchLanguage} ariaLabel={copy.switchLanguageLabel} />
            <Button href={copy.login.href} variant="secondary" size="sm">
              {copy.login.label}
            </Button>
            <Button href={copy.cta.href} size="sm">
              {copy.cta.label}
            </Button>
          </div>

          <div className="ms-auto flex items-center gap-3 xl:hidden">
            <LanguageSwitch locale={locale} label={copy.switchLanguage} ariaLabel={copy.switchLanguageLabel} />
            <Button href={copy.login.href} variant="secondary" size="sm" className="whitespace-nowrap">
              {copy.login.label}
            </Button>
            <button
              type="button"
              aria-label={drawerOpen ? copy.closeMenu : copy.openMenu}
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
              onClick={() => setDrawerOpen((v) => !v)}
              className="grid size-10 place-items-center border border-rule"
            >
              {drawerOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      <MobileDrawer
        open={drawerOpen}
        items={copy.nav}
        isActive={isActive}
        showMenuLabel={copy.showMenu}
        cta={copy.cta}
        login={copy.login}
        onClose={closeDrawer}
      />
    </>
  );
}
