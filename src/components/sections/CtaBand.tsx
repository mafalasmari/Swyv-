import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowIcon, Chevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Closing call-to-action strip. Red is kept for the home page and short pages;
 * long pages use the dark variant so the red keeps its weight.
 */
export function CtaBand({
  title,
  description,
  button,
  href,
  tone = "red",
}: {
  title: string;
  description?: string;
  button: string;
  href: string;
  tone?: "red" | "dark";
}) {
  const red = tone === "red";
  return (
    <section
      data-header-theme={red ? "dark" : undefined}
      className={cn("relative overflow-hidden", red ? "bg-red text-white" : "section-dark")}
    >
      <Chevron
        aria-hidden
        direction="down"
        className={cn("absolute -end-10 -bottom-24 size-80", red ? "text-black/10" : "text-red/15")}
      />
      <Container className="relative flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-semibold text-balance sm:text-5xl">{title}</h2>
          {description && <p className={cn("mt-4 text-lg", red ? "text-white" : "text-muted")}>{description}</p>}
        </div>
        <Button
          href={href}
          size="lg"
          className={cn("self-start lg:self-auto", red && "bg-night! text-white hover:bg-black!")}
        >
          {button}
          <ArrowIcon className="size-4" />
        </Button>
      </Container>
    </section>
  );
}
