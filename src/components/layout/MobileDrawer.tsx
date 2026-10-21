"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { HeaderNavItem } from "./SiteHeader";

type MobileDrawerProps = {
  open: boolean;
  items: HeaderNavItem[];
  isActive: (href: string) => boolean;
  showMenuLabel: string;
  cta: { href: string; label: string };
  login: { href: string; label: string };
  onClose: () => void;
};

/**
 * Menu below 1280px: a dimmed backdrop and a panel of large links, each menu item
 * expandable to its pages. Closes on Escape, on the backdrop and on any link.
 * Rendered outside <header>: its backdrop-filter would make this fixed layer
 * position relative to the header. Scrolls on its own (data-lenis-prevent) while
 * the page is locked; the body lock also stops Lenis (SmoothScrollProvider).
 */
export function MobileDrawer({ open, items, isActive, showMenuLabel, cta, login, onClose }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Every opening starts with all sections collapsed.
  if (!open && expanded) setExpanded(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 top-(--header-h) bottom-0 z-50 xl:hidden">
      <div aria-hidden className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        id="mobile-menu"
        data-lenis-prevent
        className="section-dark relative max-h-full overflow-y-auto border-b border-rule"
      >
        <Container as="nav" aria-label="Mobile" className="flex flex-col py-4">
          <ul>
            {items.map((item, i) => (
              <li key={item.href} className="border-b border-rule">
                <div className="flex items-center gap-4">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex flex-1 items-center gap-4 py-4 text-2xl font-medium"
                  >
                    <span className="num text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-expanded={expanded === item.href}
                      aria-controls={`m-${i}`}
                      aria-label={`${showMenuLabel} ${item.label}`}
                      onClick={() => setExpanded((v) => (v === item.href ? null : item.href))}
                      className="grid size-11 place-items-center border border-rule"
                    >
                      <ChevronDownIcon
                        className={cn("size-4 transition-transform duration-300", expanded === item.href && "rotate-180")}
                      />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.href && (
                  <ul id={`m-${i}`} className="flex flex-col pb-4 ps-8">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} onClick={onClose} className="block py-2 text-muted hover:text-fg">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3">
            <Button href={cta.href} size="lg" onClick={onClose}>
              {cta.label}
            </Button>
            <Button href={login.href} variant="secondary" size="lg" onClick={onClose}>
              {login.label}
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
