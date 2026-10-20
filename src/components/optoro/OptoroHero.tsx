import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";

type Cta = { label: string; href: string };

type OptoroHeroProps = {
  title: string;
  description: string;
  image: string;
  primary: Cta;
  secondary: Cta;
};

export function OptoroHero({ title, description, image, primary, secondary }: OptoroHeroProps) {
  return (
    <section className="overflow-hidden bg-optoro-orange text-white">
      <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">{title}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-white/90 sm:text-xl">{description}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={primary.href} variant="light" size="lg">
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="outline-light" size="lg">
              {secondary.label}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[5/4] w-full">
          <SmartImage
            src={image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
          />
        </div>
      </Container>
    </section>
  );
}
