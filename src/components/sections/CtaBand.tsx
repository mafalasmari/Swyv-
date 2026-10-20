import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowIcon, Chevron } from "@/components/ui/icons";

/** Closing call-to-action strip in SWYV red. */
export function CtaBand({
  title,
  description,
  button,
  href,
}: {
  title: string;
  description?: string;
  button: string;
  href: string;
}) {
  return (
    <section className="relative overflow-hidden bg-red text-white">
      <Chevron aria-hidden direction="down" className="absolute -end-10 -bottom-24 size-80 text-black/10" />
      <Container className="relative flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-semibold text-balance sm:text-5xl">{title}</h2>
          {description && <p className="mt-4 text-lg text-white/85">{description}</p>}
        </div>
        <Button href={href} size="lg" className="self-start bg-night! text-white hover:bg-black! lg:self-auto">
          {button}
          <ArrowIcon className="size-4" />
        </Button>
      </Container>
    </section>
  );
}
