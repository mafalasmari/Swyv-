import { Container } from "@/components/ui/Container";

export type LegalSection = { title: string; points: string[] };

/** Legal text always sits on Concrete for maximum contrast (#121212 on #EDEDED, 16:1). */
export function LegalDocument({
  note,
  pending,
  sections,
}: {
  note: string;
  pending: string;
  sections: LegalSection[];
}) {
  return (
    <div className="section-light">
      <Container size="md" className="py-14 sm:py-20">
        {/* Pending (#F2A900) as text is 1.6:1 on Concrete, so the notice uses a pale amber fill,
            a dark amber border and body-colour text. */}
        <p
          role="note"
          className="mb-12 border border-s-4 border-[#8e6300] bg-[#fdf0c8] p-4 text-sm leading-relaxed text-swyv-black"
        >
          {note}
        </p>
        <ol className="grid gap-10">
          {sections.map((section, i) => (
            <li key={section.title} className="grid gap-3 border-t border-rule pt-6 sm:grid-cols-[4rem_1fr]">
              <span className="num text-sm text-red">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {section.points.length ? (
                  <ul className="mt-4 grid list-disc gap-3 ps-5 leading-relaxed text-fg marker:text-red">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted italic">{pending}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}
