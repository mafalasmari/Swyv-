import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 | SWYV",
  description: "يبدو أن هذه الصفحة سلكت طريقاً آخر. · Looks like this page took a different route.",
};

/** Served for URLs that match no route at all. Shows both languages. */
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>
        <header className="border-b border-line">
          <Container className="flex h-16 items-center">
            <Link href="/ar" aria-label="SWYV" className="flex items-center">
              <Logo className="w-[104px] xl:w-[140px]" />
            </Link>
          </Container>
        </header>
        <NotFoundView title="يبدو أن هذه الصفحة سلكت طريقاً آخر." button="العودة للرئيسية" homeHref="/ar" />
        <div dir="ltr" lang="en">
          <NotFoundView title="Looks like this page took a different route." button="Back to home" homeHref="/en" />
        </div>
      </body>
    </html>
  );
}
