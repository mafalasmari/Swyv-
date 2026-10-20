import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { MediaText } from "@/components/ui/MediaText";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";

type Slide = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

type PlatformTabsProps = {
  eyebrow: string;
  title: string;
  description: string;
  slides: Slide[];
};

export function PlatformTabs({ eyebrow, title, description, slides }: PlatformTabsProps) {
  return (
    <Section className="bg-white text-terminal-green">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} className="mb-10" />
      <Tabs
        listClassName="mb-10"
        items={slides.map((slide) => ({
          id: slide.id,
          label: slide.label,
          content: (
            <MediaText image={slide.image} imageClassName="bg-terminal-mist [&_img]:object-cover">
              <p className="font-mono text-xs tracking-widest text-terminal-orange uppercase">{slide.label}</p>
              <h3 className="text-2xl font-semibold text-balance sm:text-3xl">{slide.title}</h3>
              <p className="leading-relaxed opacity-80">{slide.description}</p>
              <Button href={slide.href} variant="dark" className="self-start">
                More
                <ArrowRightIcon className="size-4" />
              </Button>
            </MediaText>
          ),
        }))}
      />
    </Section>
  );
}
