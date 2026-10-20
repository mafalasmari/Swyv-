import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/ui/icons";
import { system } from "@/content/system";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/thank-you">): Promise<Metadata> {
  return {
    ...pageMetadata(await getLocale(params), routes.thankYou, system.thankYou.seo),
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params }: PageProps<"/[lang]/thank-you">) {
  const locale = await getLocale(params);
  const c = localize(system.thankYou, locale);
  return (
    <section className="bg-grid border-b border-line">
      <Container className="flex min-h-[60vh] flex-col items-start justify-center gap-8 py-24">
        <span className="grid size-14 place-items-center bg-delivered text-night">
          <CheckIcon className="size-7" />
        </span>
        <h1 className="max-w-3xl text-3xl leading-tight font-semibold text-balance sm:text-5xl">{c.title}</h1>
        <Button href={href(locale)}>{c.button}</Button>
      </Container>
    </section>
  );
}
