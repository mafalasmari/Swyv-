"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "./LanguageSwitch";

export type HeaderCopy = {
  homeHref: string;
  nav: { href: string; label: string }[];
  login: { href: string; label: string };
  cta: { href: string; label: string };
  switchLanguage: string;
  switchLanguageLabel: string;
  openMenu: string;
  closeMenu: string;
};

export function SiteHeader({ locale, copy }: { locale: Locale; copy: HeaderCopy }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-night/90 backdrop-blur">
        <Container className="flex h-16 items-center gap-6">
          <Link href={copy.homeHref} aria-label="SWYV" className="flex shrink-0 items-center">
            <Logo className="w-[104px] xl:w-[140px]" />
          </Link>

          <nav aria-label="Main" className="hidden flex-1 xl:block">
            <ul className="flex items-center gap-1">
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative px-3 py-2 text-sm transition-colors",
                      isActive(item.href)
                        ? "text-concrete after:absolute after:inset-x-3 after:-bottom-[17px] after:h-0.5 after:bg-red"
                        : "text-steel hover:text-concrete",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto hidden items-center gap-4 xl:flex">
            <LanguageSwitch locale={locale} label={copy.switchLanguage} ariaLabel={copy.switchLanguageLabel} />
            <Link href={copy.login.href} className="text-sm text-steel transition-colors hover:text-concrete">
              {copy.login.label}
            </Link>
            <Button href={copy.cta.href} size="sm">
              {copy.cta.label}
            </Button>
          </div>

          <div className="ms-auto flex items-center gap-4 xl:hidden">
            <LanguageSwitch locale={locale} label={copy.switchLanguage} ariaLabel={copy.switchLanguageLabel} />
            <button
              type="button"
              aria-label={open ? copy.closeMenu : copy.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center border border-line"
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Outside <header>: its backdrop-filter would make this fixed panel position relative to the header. */}
      {open && (
        <div
          id="mobile-menu"
          data-lenis-prevent
          className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-night xl:hidden"
        >
          <Container as="nav" aria-label="Mobile" className="flex flex-col py-4">
            {copy.nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-center gap-4 border-b border-line py-4 text-lg"
              >
                <span className="num text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
            <div className="mt-6 grid gap-3">
              <Button href={copy.cta.href} size="lg">
                {copy.cta.label}
              </Button>
              <Button href={copy.login.href} variant="secondary" size="lg">
                {copy.login.label}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
