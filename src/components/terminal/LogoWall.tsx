import type { LogoAsset } from "@/lib/types";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { Section } from "@/components/ui/Section";

export function LogoWall({ title, logos }: { title: string; logos: LogoAsset[] }) {
  return (
    <Section spacing="sm" className="bg-terminal-mist text-terminal-green">
      <h2 className="mb-10 text-center text-lg font-medium sm:text-xl">{title}</h2>
      <LogoMarquee logos={logos} logoClassName="grayscale opacity-80" />
    </Section>
  );
}
