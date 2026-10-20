import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { MediaCard } from "@/components/ui/MediaCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type ProductPath = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta: { label: string; href: string };
};

export function ProductPaths({ title, paths }: { title: string; paths: ProductPath[] }) {
  return (
    <Section className="bg-white text-terminal-green">
      <SectionHeader title={title} className="mb-12" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <MediaCard
            key={path.title}
            {...path}
            className="bg-terminal-mist"
            footer={
              <Button href={path.cta.href} variant="dark" className="w-full sm:w-auto">
                {path.cta.label}
                <ArrowRightIcon className="size-4" />
              </Button>
            }
          />
        ))}
      </div>
    </Section>
  );
}
