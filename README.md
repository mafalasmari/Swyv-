# Swyv

Two saved marketing pages (Terminal Industries and Optoro) rebuilt as a **Next.js App Router** project with **Tailwind CSS v4**, fully responsive and split into reusable React components.

| Route       | Page                                |
| ----------- | ----------------------------------- |
| `/`         | Index linking both pages            |
| `/terminal` | Terminal: Yard Operating System     |
| `/optoro`   | Optoro: Returns Management System   |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes are static)
npm run lint
```

## Structure

```
src/
├── app/                 # Routes: each site has its own layout (header + footer)
│   ├── terminal/
│   └── optoro/
├── components/
│   ├── ui/              # Generic building blocks shared by both sites
│   │                    #   Button, Container, Section, SectionHeader, Eyebrow,
│   │                    #   MediaCard, MediaText, LogoMarquee, SmartImage,
│   │                    #   Tabs, Accordion, FormField, SocialLinks, icons
│   ├── layout/          # SiteHeader (dropdowns + mobile drawer), SiteFooter
│   ├── terminal/        # Terminal-only sections (Hero, RoiCalculator, FeatureSteps…)
│   └── optoro/          # Optoro-only sections (OptoroHero, CaseStudies, BlogRoundup…)
├── content/             # All copy, links and image URLs as typed data
│   ├── terminal.ts
│   └── optoro.ts
└── lib/                 # cn() helper, shared types, ROI estimator
```

- **Content is separate from markup.** To edit text, links or images, change `src/content/*` without touching components.
- **Theme tokens** (`terminal-green`, `terminal-lime`, `optoro-orange`, …) are defined once in `src/app/globals.css` under `@theme`.
- **Interactive pieces** (`Hero`, `Tabs`, `RoiCalculator`, `FeatureSteps`, `ContactSection`, `SiteHeader`) are the only client components. Everything else renders on the server.
- **Images** load from the original CDNs (`a.storyblok.com`, `www.optoro.com`), which are allowed in `next.config.ts`.

## Notes

- The yard-savings formula in `src/lib/roi.ts` is an illustrative model. The original site's formula is not in the saved HTML, so the coefficients are tuned to reproduce its default result (~$642k / 23%).
- Forms show a success state on the client. Connect them to an API route or CRM before going live.
- The proprietary SuisseIntl font is replaced with Inter. Geist Mono is kept for labels.
