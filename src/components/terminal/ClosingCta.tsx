import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function ClosingCta() {
  return (
    <Section spacing="lg" className="relative overflow-hidden bg-terminal-lime text-terminal-green">
      <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          The yard of the future starts today.
        </h2>
        <div className="flex flex-col gap-6">
          <Button href="#contact" variant="dark" size="lg">
            Take charge of your yard
          </Button>
          <p className="font-mono text-xs leading-relaxed tracking-widest uppercase">
            Gartner® 2025 Market Guide
            <br />
            Yard Management — Featured Vendor
          </p>
        </div>
      </div>
    </Section>
  );
}
