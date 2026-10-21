"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { GlobeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Props = { locale: Locale; label: string; ariaLabel: string; className?: string };

/** Links to the same page in the other language and remembers the choice. */
export function LanguageSwitch({ locale, label, ariaLabel, className }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === "ar" ? "en" : "ar";
  const nextPath = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${target}`);

  return (
    <Link
      href={nextPath}
      hrefLang={target}
      lang={target}
      title={ariaLabel}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className={cn("inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-fg", className)}
    >
      <GlobeIcon className="size-4" />
      {/* On the narrowest phones only the globe shows, to leave room for Swyv Portal. */}
      <span className="max-[379px]:sr-only">{label}</span>
    </Link>
  );
}
