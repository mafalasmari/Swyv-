"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { isNavGroup, type NavItem } from "@/lib/types";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";

type SiteHeaderProps = {
  logo: ReactNode;
  homeHref: string;
  nav: NavItem[];
  actions: ButtonProps[];
  tone?: "dark" | "light";
};

const tones = {
  dark: {
    bar: "bg-terminal-green/90 text-white",
    panel: "bg-terminal-green text-white ring-white/10",
    link: "hover:text-terminal-lime",
  },
  light: {
    bar: "bg-white/95 text-optoro-graphite shadow-sm",
    panel: "bg-white text-optoro-graphite ring-black/5",
    link: "hover:text-optoro-orange",
  },
};

/** Sticky site header with hover dropdowns on desktop and a drawer on mobile. */
export function SiteHeader({ logo, homeHref, nav, actions, tone = "dark" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const theme = tones[tone];

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

  return (
    <header className={cn("sticky top-0 z-50 backdrop-blur", theme.bar)}>
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href={homeHref} className="shrink-0" aria-label="Home">
          {logo}
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              isNavGroup(item) ? (
                <li key={item.label} className="group relative">
                  <button
                    type="button"
                    className={cn("flex items-center gap-1 px-3 py-2 text-sm", theme.link)}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDownIcon className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul
                      className={cn(
                        "grid max-h-[70vh] w-72 gap-1 overflow-y-auto rounded-md p-3 shadow-xl ring-1",
                        theme.panel,
                      )}
                    >
                      {item.links.map((link) => (
                        <li key={link.label}>
                          <NavAnchor
                            href={link.href}
                            className={cn("block rounded-sm px-3 py-2 text-sm", theme.link)}
                          >
                            {link.label}
                          </NavAnchor>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <NavAnchor href={item.href} className={cn("px-3 py-2 text-sm", theme.link)}>
                    {item.label}
                  </NavAnchor>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {actions.map((action) => (
            <Button key={action.children as string} size="sm" {...action} />
          ))}
        </div>

        <button
          type="button"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
        </button>
      </Container>

      {open && (
        <div
          id="mobile-menu"
          className={cn("fixed inset-x-0 top-16 bottom-0 overflow-y-auto lg:hidden", theme.panel)}
        >
          <Container as="nav" aria-label="Mobile" className="flex flex-col gap-1 py-6">
            {nav.map((item) =>
              isNavGroup(item) ? (
                <details key={item.label} className="group border-b border-current/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg">
                    {item.label}
                    <ChevronDownIcon className="size-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="grid gap-1 pb-4 pl-2">
                    {item.links.map((link) => (
                      <li key={link.label}>
                        <NavAnchor
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm opacity-80"
                        >
                          {link.label}
                        </NavAnchor>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <NavAnchor
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-current/10 py-4 text-lg"
                >
                  {item.label}
                </NavAnchor>
              ),
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {actions.map((action) => (
                <Button key={action.children as string} {...action} className="w-full" />
              ))}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function NavAnchor({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const external = /^https?:\/\//.test(href);
  return external ? (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
