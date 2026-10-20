import type { LogoAsset } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SmartImage } from "@/components/ui/SmartImage";

type TestimonialProps = {
  eyebrow: string;
  title: string;
  logos: LogoAsset[];
  quote: { quote: string; name: string; role: string; company: string; image: string };
};

export function Testimonial({ eyebrow, title, logos, quote }: TestimonialProps) {
  return (
    <Section className="bg-terminal-mist text-terminal-green">
      <SectionHeader eyebrow={eyebrow} title={title} className="mb-10" />

      <ul className="mb-14 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {logos.map((logo) => (
          <li key={logo.alt} className="flex justify-center">
            <SmartImage src={logo.src} alt={logo.alt} width={140} height={48} className="h-9 w-auto grayscale" />
          </li>
        ))}
      </ul>

      <figure className="grid overflow-hidden rounded-md bg-terminal-green text-white lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <SmartImage
            src={quote.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-8 p-8 sm:p-12">
          <blockquote className="text-2xl leading-snug font-medium text-balance sm:text-3xl">
            {quote.quote}
          </blockquote>
          <figcaption className="text-sm">
            <span className="block font-semibold text-terminal-lime">{quote.name}</span>
            <span className="opacity-80">
              {quote.role}, {quote.company}
            </span>
          </figcaption>
        </div>
      </figure>
    </Section>
  );
}
