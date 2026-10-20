import { Button } from "@/components/ui/Button";
import { MediaText } from "@/components/ui/MediaText";
import { Section } from "@/components/ui/Section";

type IntegrationsProps = {
  title: string;
  body: string;
  image: string;
  cta: { label: string; href: string };
};

export function Integrations({ title, body, image, cta }: IntegrationsProps) {
  return (
    <Section className="text-optoro-graphite">
      <MediaText image={image} imageClassName="[&_img]:object-cover">
        <h3 className="text-3xl font-bold sm:text-4xl">{title}</h3>
        <p className="leading-relaxed text-optoro-gray">{body}</p>
        <Button href={cta.href} variant="outline-dark" className="self-start text-optoro-orange">
          {cta.label}
        </Button>
      </MediaText>
    </Section>
  );
}
