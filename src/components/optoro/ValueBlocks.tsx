import { Button } from "@/components/ui/Button";
import { MediaText } from "@/components/ui/MediaText";
import { Section } from "@/components/ui/Section";

type ValueBlock = {
  title: string;
  body: string;
  image: string;
  cta?: { label: string; href: string };
};

/** Alternating image/text rows. */
export function ValueBlocks({ blocks }: { blocks: ValueBlock[] }) {
  return (
    <Section className="text-optoro-graphite" containerClassName="flex flex-col gap-20 lg:gap-28">
      {blocks.map((block, i) => (
        <MediaText key={block.title} image={block.image} reverse={i % 2 === 1}>
          <h3 className="text-2xl font-bold text-balance sm:text-3xl">{block.title}</h3>
          <p className="leading-relaxed text-optoro-gray">{block.body}</p>
          {block.cta && (
            <Button href={block.cta.href} variant="link" className="self-start text-optoro-orange">
              {block.cta.label} →
            </Button>
          )}
        </MediaText>
      ))}
    </Section>
  );
}
