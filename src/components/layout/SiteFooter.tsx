import type { ReactNode } from "react";
import type { FooterColumn, NavLink, SocialLink } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

type SiteFooterProps = {
  logo: ReactNode;
  columns: FooterColumn[];
  socials: SocialLink[];
  copyright: string;
  legalLinks?: NavLink[];
  /** Extra block shown next to the logo (e.g. a tagline or contact prompt). */
  aside?: ReactNode;
  className?: string;
};

export function SiteFooter({
  logo,
  columns,
  socials,
  copyright,
  legalLinks = [],
  aside,
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn("py-14 lg:py-20", className)}>
      <Container className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-6">
          {logo}
          {aside}
          <SocialLinks links={socials} />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="mb-4 font-mono text-xs tracking-[0.18em] uppercase opacity-60">
                {column.title}
              </p>
              <ul className="grid gap-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="opacity-85 transition-opacity hover:opacity-100 hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <Container className="mt-14 flex flex-col gap-4 border-t border-current/15 pt-6 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between">
        <p>{copyright}</p>
        {legalLinks.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}
