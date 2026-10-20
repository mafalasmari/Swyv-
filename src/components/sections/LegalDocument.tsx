import { Container } from "@/components/ui/Container";

export type LegalSection = { title: string; points: string[] };

export function LegalDocument({ note, pending, sections }: { note: string; pending: string; sections: LegalSection[] }) {
  return (
    <Container size="md" className="py-14 sm:py-20">
      <p className="mb-12 border-s-2 border-pending bg-pending/5 p-4 text-sm leading-relaxed text-concrete/90">{note}</p>
      <ol className="grid gap-10">
        {sections.map((section, i) => (
          <li key={section.title} className="grid gap-3 border-t border-line pt-6 sm:grid-cols-[4rem_1fr]">
            <span className="num text-sm text-red">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.points.length ? (
                <ul className="mt-3 grid list-disc gap-2 ps-5 text-steel marker:text-red">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-steel italic">{pending}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Container>
  );
}
