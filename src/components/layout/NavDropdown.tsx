"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { NavChild } from "@/lib/navMenus";

type NavDropdownProps = {
  id: string;
  label: string;
  href: string;
  active: boolean;
  items: NavChild[];
  open: boolean;
  showMenuLabel: string;
  onOpen: () => void;
  onClose: () => void;
};

/** How long the pointer may leave the item before the panel closes (crossing the gap). */
const CLOSE_DELAY = 120;

/**
 * Top-level link with a full-width, two-column panel: the item's pages on one side
 * (30%), the hovered or focused one's description on the other (70%). Opens on
 * hover or with its toggle button; closes on Escape, on leaving, or on focus leaving.
 */
export function NavDropdown({
  id,
  label,
  href,
  active,
  items,
  open,
  showMenuLabel,
  onOpen,
  onClose,
}: NavDropdownProps) {
  const [current, setCurrent] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = `${id}-panel`;

  const cancelClose = () => clearTimeout(closeTimer.current);
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY);
  };
  useEffect(() => cancelClose, []);

  // The first page is the active tab each time the panel opens.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setCurrent(0);
  }

  const shown = items[current] ?? items[0];

  return (
    <li
      onMouseEnter={() => {
        cancelClose();
        onOpen();
      }}
      onMouseLeave={closeSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onClose();
          toggleRef.current?.focus();
        }
      }}
      className="flex items-center"
    >
      <Link href={href} aria-current={active ? "page" : undefined} className="nav-link">
        {active && <span aria-hidden className="nav-dot" />}
        {label}
      </Link>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${showMenuLabel} ${label}`}
        onClick={() => (open ? onClose() : onOpen())}
        className="grid size-6 place-items-center text-muted transition-colors hover:text-fg"
      >
        <ChevronDownIcon className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div id={panelId} data-lenis-prevent data-open={open || undefined} className="nav-panel">
        <Container className="flex gap-8 py-8">
          <ul className="flex w-[30%] shrink-0 flex-col border-e border-rule pe-6">
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setCurrent(i)}
                  onFocus={() => setCurrent(i)}
                  onClick={onClose}
                  className={cn(
                    "flex items-baseline gap-3 py-2 text-sm transition-colors",
                    i === current ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <span className={cn("num text-[11px]", i === current ? "text-accent" : "text-muted")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {shown && (
            <div className="flex min-w-0 flex-1 flex-col gap-4 py-2">
              <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
                <span className="text-accent">{String(current + 1).padStart(2, "0")}</span> · {label}
              </p>
              <Link
                href={shown.href}
                onClick={onClose}
                tabIndex={-1}
                className="max-w-2xl text-2xl font-semibold text-balance hover:text-accent"
              >
                {shown.label}
              </Link>
              <p className="max-w-2xl leading-relaxed text-pretty text-muted">{shown.description}</p>
            </div>
          )}
        </Container>
      </div>
    </li>
  );
}
