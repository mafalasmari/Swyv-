import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { NotchSeparator, type SectionTone } from "@/components/ui/NotchSeparator";
import { getLocale } from "@/lib/params";

// Temporary review page for phase 3. Not linked, not in the sitemap, not indexed.
export const metadata: Metadata = { title: "Notch test", robots: { index: false, follow: false } };

const SEQUENCE: SectionTone[] = ["dark", "light", "muted", "light", "dark"];

const COPY = {
  ar: { title: "قسم تجريبي", body: "رحلة واحدة. توصيل لفروعك، ومرتجعاتك تعود إليك." },
  en: { title: "Sample section", body: "One trip. Delivered to your branches, returns back to you." },
};

export default async function NotchTestPage({ params }: PageProps<"/[lang]/test-notch">) {
  const locale = await getLocale(params);
  const c = COPY[locale];

  return (
    <>
      {SEQUENCE.map((tone, i) => (
        <div key={i}>
          <section className={`section-${tone} py-20`}>
            <Container>
              <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
                {String(i + 1).padStart(2, "0")} · section-{tone}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">{c.title}</h2>
              <p className="mt-2 text-muted">{c.body}</p>
            </Container>
          </section>
          {i < SEQUENCE.length - 1 && <NotchSeparator from={tone} to={SEQUENCE[i + 1]} />}
        </div>
      ))}
    </>
  );
}
