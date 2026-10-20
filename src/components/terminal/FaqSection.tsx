import type { FaqItem } from "@/lib/types";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";

type FaqSectionProps = {
  title: string;
  description: string;
  categories: { id: string; label: string; items: FaqItem[] }[];
};

export function FaqSection({ title, description, categories }: FaqSectionProps) {
  return (
    <Section className="bg-white text-terminal-green">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <SectionHeader title={title} description={description} />
        <Tabs
          variant="pill"
          listClassName="mb-8"
          items={categories.map((category) => ({
            id: category.id,
            label: category.label,
            content: <Accordion items={category.items} />,
          }))}
        />
      </div>
    </Section>
  );
}
