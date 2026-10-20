import { SITE_URL } from "@/i18n/config";

/** schema.org Organization data. Contact details are added once confirmed. */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SWYV Logistics Services Co.",
    alternateName: ["SWYV", "سوايف للخدمات اللوجستية"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Night cross-dock, daytime branch delivery and returns pickup and inspection in Riyadh.",
    areaServed: { "@type": "City", name: "Riyadh" },
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
