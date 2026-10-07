# Fluxline Solutions

Website for **Fluxline Solutions** (Fluxline LLC), web design and development for businesses, at [fluxlinesolutions.com](https://fluxlinesolutions.com).

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Lucide icons. Deployed on Vercel.

## Development

```sh
npm install
cp .env.example .env.local   # optional; without it, lead emails print to the dev console
npm run dev                  # http://localhost:3000
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run build` | Production build |

## Site map

| Route | Purpose |
| --- | --- |
| `/` | Homepage with the interactive Before/After simulator |
| `/services`, `/work` | Capabilities, and concept projects plus future case studies |
| `/request-a-call`, `/website-check` | The two lead forms |
| `/websites-for-*` (8) | Industry pages, driven by `src/content/industries.ts` |
| `/web-design-*` (4) | Location pages, driven by `src/content/locations.ts` |
| `/resources`, `/resources/[slug]` | Articles: metadata in `src/content/resources/registry.ts`, bodies in `articles/` |
| `/privacy`, `/terms` | Legal pages |

`/call`, from the previous version of the site, permanently redirects to `/request-a-call`.

## Structure

```
src/
  app/                      routes, metadata, sitemap, robots, OG image
    api/leads/              request-call and website-check endpoints
  components/
    simulator/              Before/After simulator; demos/ holds each fictional business
    forms/                  lead forms and shared field components
    templates/              industry and location page templates
    home/, shared/, ui/     page sections and primitives
    seo/                    JSON-LD and breadcrumbs
    analytics/              Vercel Web Analytics, click tracking, page events
  content/                  industries, locations, services, work, resources
  lib/
    leads/                  validation schemas, shared guard, notification email
    email/                  transactional email provider (Resend), swappable
    analytics.ts            typed event tracking
    attribution.ts          first-touch UTM, referrer, and landing-page capture
    seo.ts, site.ts         metadata helpers and public site config
docs/
  LAUNCH.md                 deployment, domain, email, DNS runbook
  SEARCH-CONSOLE.md         Google Search Console and Bing setup
  email-signature/          Outlook HTML signature and install guide
```

## Lead forms

- The same Zod schemas validate in the browser and on the server, where validation is authoritative.
- Spam and abuse protection, shared by both endpoints (`src/lib/leads/handle-lead.ts`):
  - same-origin and content-type checks
  - a 12 KB body cap and per-IP rate limiting
  - a honeypot field and a minimum fill time
  - length limits and control-character stripping
  - HTML escaping in emails
- Leads are not stored. They're emailed to `LEAD_NOTIFICATION_EMAIL`, including attribution: channel, UTMs, gclid, referrer, and landing page. Logs record delivery failures only, never lead details.
- Submissions containing "test" in a name or business field get a `[TEST]` subject prefix.

## Simulator

The demo businesses are fictional, and every view is labeled "Interactive Concept Demo".

To add an industry:
1. Add a demo module in `src/components/simulator/demos/`.
2. Register it in `data.ts` and in `simulator.tsx`'s `DEMOS` map.

Demos load lazily per industry. Buttons inside demos never navigate; they show what the real site would do.

## Analytics events

Vercel Web Analytics is cookieless and must be enabled in the Vercel project (**Analytics** tab). **Custom events** (`track(...)`) depend on your Vercel plan. Check the Analytics tab after launch to confirm they appear; if your plan doesn't include them, the calls are harmless no-ops.

The full event list is in `src/lib/analytics.ts`.
