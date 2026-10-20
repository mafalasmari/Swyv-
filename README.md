# SWYV — Website

Marketing site for **SWYV Logistics Services Co.** (سوايف للخدمات اللوجستية): night cross-dock, daytime branch delivery, and returns pickup and inspection in Riyadh.

Built with **Next.js 16 (App Router)** and **Tailwind CSS v4**. Arabic is the default language (RTL); English is LTR. Both share one codebase and one set of components.

## Run it

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000 → redirects to /ar
npm run build && npm start
npm run lint
```

## Pages

Every page exists at `/ar/...` and `/en/...`, with `hreflang` alternates.

| Page | Path | Interactive parts |
| --- | --- | --- |
| Home | `/` | Savings calculator, live ops board (sample) |
| Services | `/services` | — |
| How it works | `/how-it-works` | **Return disposition engine** |
| Industries | `/industries` | — |
| SWYV Portal | `/portal` | **Asset telemetry & dwell-time dashboard**, **AI decision simulator** |
| Pilot program | `/pilot` | Pilot request form |
| About | `/about` | — |
| Become a carrier | `/carriers` | Carrier form with document upload |
| Careers | `/careers` | Application form with CV upload |
| FAQ | `/faq` | Accordion + FAQPage structured data |
| Contact | `/contact` | Contact form |
| Privacy / Terms | `/privacy`, `/terms` | Outline pending legal review |
| Thank you | `/thank-you` | Redirect target after any form |
| 404 | any unknown URL | Bilingual |

## Structure

```
src/
├── app/
│   ├── [lang]/            # Root layout (html lang/dir, fonts, header, footer) + all pages
│   ├── global-not-found.tsx
│   ├── sitemap.ts, robots.ts, icon.svg
│   └── globals.css        # Design tokens (brand colors, fonts, sharp radii)
├── proxy.ts               # Redirects locale-less URLs to /ar (or the remembered language)
├── i18n/                  # Locales, href(), localize() for bilingual content
├── content/               # ALL copy, authored once with Arabic + English side by side
├── components/
│   ├── ui/                # Primitives: Button, Logo, StatusTag, Stat, Tabs, Accordion, controls…
│   ├── layout/            # SiteHeader, SiteFooter, LanguageSwitch, CookieBanner, JSON-LD
│   ├── sections/          # Page blocks: PageHero, CardGrid, StepTimeline, CtaBand…
│   ├── tools/             # Interactive tools (client components)
│   └── forms/             # SchemaForm: renders any form from its schema
└── lib/
    ├── disposition.ts     # Return disposition engine (pure, rule-based)
    ├── simulator.ts       # Decision simulator model
    ├── telemetry.ts       # Seeded asset data + simulated clock
    ├── savings.ts         # Savings calculator formula
    ├── returns.ts         # Condition codes (ص ق م ت د ر) and routes
    ├── forms/             # Schemas, shared validation, server action, email delivery
    └── seo.ts             # Per-page metadata, canonical, hreflang, Open Graph
```

**Editing text:** change `src/content/*.ts`. Each string is `t("عربي", "English")`, so both languages stay in sync.

## Brand

From the SWYV brand sheet v0.1: Red `#D7141A`, Night Black `#121212`, Asphalt `#2A2A2C`, Concrete `#EDEDED`, Steel `#8A8D91`, Delivered `#1FA463`, Pending `#F2A900`. Fonts are Poppins (Latin and the wordmark), IBM Plex Sans Arabic (Arabic text) and IBM Plex Mono (numbers and data). The V chevron is the system's graphic device: down = inbound, up = returns.

The five disposition-route colors were checked for color-blind separation and contrast against the dark panel.

## The interactive tools

All three are demos running on illustrative data, labeled as such on the page.

- **Disposition engine** (`lib/disposition.ts`): for each returned line it evaluates five routes (restock, refurbish, liquidate, recycle, return to supplier). Inputs are the condition code, shelf life left, packaging, value and the client's rules, weighted by value / speed / environmental priority. It explains each blocked route and the recommendation. It is transparent rules, not machine learning, and it only proposes: SWYV doesn't buy or sell goods.
- **Telemetry dashboard** (`lib/telemetry.ts`): 36 seeded assets on a simulated clock (1 tick = 1 minute of dwell). It has filters, search, sortable columns, and dwell bars against each asset's limit.
- **Decision simulator** (`lib/simulator.ts`): runs the engine over a sector's typical return mix and compares it with an unsorted baseline. It shows recovered value, time to close, CO₂ avoided and trips saved. The coefficients are assumptions, documented in the file.

## Forms

All four forms use one server action (`lib/forms/actions.ts`):

- **Spam protection:** a hidden honeypot field plus a minimum fill time of 3 seconds.
- **Validation:** the same rules run in `validate.ts`, including Saudi mobile format, required fields, and file type and size (≤ 4 MB).
- **Delivery:** with `RESEND_API_KEY`, `FORMS_INBOX` and `FORMS_FROM` set, each submission is emailed to the inbox and the sender gets a confirmation in their language. Without them, submissions are only logged to the server console.

## Before going live

- Set `NEXT_PUBLIC_SITE_URL` (canonical URLs, sitemap, share image) and, when ready, `NEXT_PUBLIC_PORTAL_URL` for "Client login".
- Configure the Resend variables so forms actually reach you.
- Have the privacy policy and terms written and legally reviewed. The pages currently show the agreed outline only.
- Review the careers responsibilities and requirements. They are drafted from the operating model.
- Add company details once confirmed (CR, TGA licence, phone, email, address) to the footer, the contact page and `OrganizationJsonLd`.
- Analytics: the cookie banner stores `swyv-cookie-consent` = `all` | `essential`. Load analytics only for `all`.
