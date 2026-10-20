import type { LogoAsset } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { Section } from "@/components/ui/Section";

type LogoStripProps = {
  title?: string;
  logos: LogoAsset[];
  cta?: { label: string; href: string };
  className?: string;
};

export function LogoStrip({ title, logos, cta, className }: LogoStripProps) {
  return (
    <Section spacing="sm" className={className}>
      {title && <h2 className="mb-10 text-center text-3xl font-bold sm:text-4xl">{title}</h2>}
      <LogoMarquee logos={logos} logoClassName="opacity-70 grayscale hover:opacity-100 hover:grayscale-0" />
      {cta && (
        <div className="mt-10 flex justify-center">
          <Button href={cta.href} variant="orange">
            {cta.label}
          </Button>
        </div>
      )}
    </Section>
  );
}
