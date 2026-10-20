import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SmartImage } from "@/components/ui/SmartImage";

type CaseStudy = {
  segment: string;
  stat: string;
  label: string;
  image: string;
};

type CaseStudiesProps = {
  title: string;
  items: CaseStudy[];
  cta: { label: string; href: string };
};

export function CaseStudies({ title, items, cta }: CaseStudiesProps) {
  return (
    <Section className="bg-optoro-mist text-optoro-graphite">
      <SectionHeader title={title} align="center" className="mb-12" />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.segment + item.stat} className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm">
            <div className="relative aspect-square">
              <SmartImage
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 p-6">
              <p className="text-xs font-semibold tracking-widest text-optoro-gray uppercase">{item.segment}</p>
              <p className="text-5xl font-bold text-optoro-orange">{item.stat}</p>
              <p className="leading-snug text-optoro-gray">{item.label}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center">
        <Button href={cta.href} variant="orange">
          {cta.label}
        </Button>
      </div>
    </Section>
  );
}
