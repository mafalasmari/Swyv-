import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

type ContactBannerProps = {
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export function ContactBanner({ title, description, cta }: ContactBannerProps) {
  return (
    <Section spacing="sm" className="bg-optoro-orange text-white">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-balance sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-white/90">{description}</p>
        </div>
        <Button href={cta.href} variant="light" size="lg" className="self-start lg:self-center">
          {cta.label}
        </Button>
      </div>
    </Section>
  );
}
