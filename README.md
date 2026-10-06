# Fluxline Solutions

Website for **Fluxline LLC**, revenue recovery for home-service companies, at [fluxlinesolutions.com](https://fluxlinesolutions.com).

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Lucide icons. Deployed on Vercel.

## Development

```sh
npm install
cp .env.example .env.local   # optional; without it, form emails print to the console
npm run dev                  # http://localhost:3000
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run build` | Production build |

## Structure

```
src/
  app/                    routes, metadata, sitemap, robots, OG image
    api/call-request/     form endpoint (validation, spam protection, email)
    call/                 "Request a 15-Minute Call" page
  components/
    sections/             homepage sections
    layout/               header, footer, wordmark
    call/                 call-request form (client component)
    ui/                   small shared primitives
  lib/
    site.ts               public site config (URL, contact, mailing address)
    call-request/         shared validation schema + notification email template
    email/                transactional email provider (Resend), swappable
    rate-limit.ts
docs/
  LAUNCH.md               deployment, domain, Microsoft 365, SPF/DKIM/DMARC runbook
  email-signature/        Outlook HTML signature, plain-text version, install guide
```

## Call-request form

- The same Zod schema validates in the browser (for usability) and on the server (authoritative).
- Abuse protection includes:
  - a same-origin check, content-type check, and 8 KB body limit
  - a honeypot field and a minimum fill time
  - per-IP rate limiting (best-effort, in memory)
  - field length limits and control-character stripping
  - HTML escaping in the email
- Leads are not stored. They're emailed to `LEAD_NOTIFICATION_EMAIL` and nothing else. Logs record only delivery failures, never lead details.
- Submissions with "test" in the name or company get a `[TEST]` subject prefix.

See [docs/LAUNCH.md](docs/LAUNCH.md) for environment variables and launch steps.
