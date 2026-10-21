import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

type FooterLink = { href: string; label: string };

export type FooterCopy = {
  about: string;
  servicesTitle: string;
  services: FooterLink[];
  companyTitle: string;
  company: FooterLink[];
  copyright: string;
  legal: FooterLink[];
};

export function SiteFooter({ copy }: { copy: FooterCopy }) {
  return (
    <footer className="border-t border-line bg-ink">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:py-20">
        <div className="flex max-w-sm flex-col gap-5">
          <Logo withTagline className="w-[168px] lg:w-[220px]" taglineClassName="text-[10px] lg:text-[13px]" />
          <p className="text-sm leading-relaxed text-steel">{copy.about}</p>
        </div>
        <FooterColumn title={copy.servicesTitle} links={copy.services} />
        <FooterColumn title={copy.companyTitle} links={copy.company} />
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line py-6 text-xs text-steel sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.copyright}</p>
        <ul className="flex gap-6">
          {copy.legal.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-concrete">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <p className="mb-4 font-mono text-xs tracking-[0.16em] text-steel uppercase">{title}</p>
      <ul className="grid gap-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="text-concrete/85 transition-colors hover:text-red-bright">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
