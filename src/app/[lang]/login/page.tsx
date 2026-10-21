import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { login } from "@/content/login";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  return {
    ...pageMetadata(await getLocale(params), routes.login, login.seo),
    robots: { index: false, follow: false },
  };
}

/** Client sign-in with a Saudi mobile number and an SMS code, then on to the portal. */
export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const locale = await getLocale(params);
  const c = localize(login, locale);
  return (
    <section className="section-dark bg-grid">
      <Container size="md" className="flex min-h-[75vh] flex-col justify-center py-16 sm:py-24">
        <div className="mx-auto flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow index="SWYV">{c.eyebrow}</Eyebrow>
            <h1 className="text-3xl leading-tight font-semibold text-balance sm:text-4xl">{c.title}</h1>
            <p className="leading-relaxed text-pretty text-muted">{c.lead}</p>
          </div>
          <div className="border border-rule bg-raised p-6 sm:p-8">
            <LoginForm
              locale={locale}
              copy={{
                phoneLabel: c.phoneLabel,
                phoneHint: c.phoneHint,
                send: c.send,
                codeLabel: c.codeLabel,
                sentTo: c.sentTo,
                verify: c.verify,
                resend: c.resend,
                resendIn: c.resendIn,
                change: c.change,
                demoNote: c.demoNote,
              }}
            />
          </div>
          <p className="text-sm text-muted">
            {c.notClient}{" "}
            <Link href={href(locale, routes.pilot)} className="text-accent underline-offset-4 hover:underline">
              {c.pilot}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
