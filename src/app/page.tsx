import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";

const pages = [
  {
    href: "/terminal",
    name: "Terminal",
    description: "AI-native Yard Operating System landing page.",
    className: "bg-terminal-green text-white hover:ring-terminal-lime",
  },
  {
    href: "/optoro",
    name: "Optoro",
    description: "Returns Management System landing page.",
    className: "bg-optoro-orange text-white hover:ring-optoro-graphite",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 items-center py-20">
      <Container size="md">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Landing pages</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Two marketing sites rebuilt with Next.js, Tailwind CSS and reusable React components.
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className={`flex h-full flex-col gap-3 rounded-md p-8 ring-2 ring-transparent transition ${page.className}`}
              >
                <span className="text-2xl font-semibold">{page.name}</span>
                <span className="opacity-85">{page.description}</span>
                <ArrowRightIcon className="mt-6 size-6" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
