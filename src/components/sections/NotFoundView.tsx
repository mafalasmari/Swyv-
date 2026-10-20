import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Chevron } from "@/components/ui/icons";

/** Shared 404 body: used inside the locale layout and by the global 404. */
export function NotFoundView({ title, button, homeHref }: { title: string; button: string; homeHref: string }) {
  return (
    <section className="bg-grid border-b border-line">
      <Container className="flex min-h-[60vh] flex-col items-start justify-center gap-8 py-24">
        <p className="num flex items-center gap-3 text-sm text-steel">
          <Chevron direction="up" className="size-3 text-red" /> ERR · 404 · ROUTE NOT FOUND
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">{title}</h1>
        <Button href={homeHref}>{button}</Button>
      </Container>
    </section>
  );
}
