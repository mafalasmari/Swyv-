import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaText } from "@/components/ui/MediaText";
import { Section } from "@/components/ui/Section";

type ReportPromoProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta: { label: string; href: string };
};

export function ReportPromo({ eyebrow, title, description, image, cta }: ReportPromoProps) {
  return (
    <Section spacing="sm" className="bg-optoro-graphite text-white">
      <MediaText image={image} reverse>
        <Eyebrow className="text-optoro-orange">{eyebrow}</Eyebrow>
        <h3 className="text-3xl font-bold sm:text-4xl">{title}</h3>
        <p className="leading-relaxed text-white/80">{description}</p>
        <Button href={cta.href} variant="orange" className="self-start">
          {cta.label}
        </Button>
      </MediaText>
    </Section>
  );
}
