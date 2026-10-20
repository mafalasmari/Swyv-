"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

const KEY = "swyv-cookie-consent";

export type CookieCopy = { text: string; accept: string; decline: string; more: string; moreHref: string };

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return "unavailable";
  }
};
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/**
 * Stores the visitor's choice ("all" | "essential"). Analytics scripts should only
 * load when the stored value is "all".
 */
export function CookieBanner({ copy }: { copy: CookieCopy }) {
  // Server render and first paint assume a choice exists, so the banner never flashes for returning visitors.
  const choice = useSyncExternalStore(subscribe, read, () => "pending");

  if (choice !== null) return null;

  const save = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked: the banner simply shows again next visit */
    }
    listeners.forEach((fn) => fn());
  };

  return (
    <div
      role="region"
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-panel/95 backdrop-blur sm:inset-x-auto sm:end-6 sm:bottom-6 sm:max-w-md sm:border"
    >
      <div className="flex flex-col gap-4 p-5">
        <p className="text-sm leading-relaxed text-steel">
          {copy.text}{" "}
          <Link href={copy.moreHref} className="text-concrete underline underline-offset-4">
            {copy.more}
          </Link>
        </p>
        <div className="flex gap-3">
          <Button size="sm" onClick={() => save("all")}>
            {copy.accept}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => save("essential")}>
            {copy.decline}
          </Button>
        </div>
      </div>
    </div>
  );
}
