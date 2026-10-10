# Security and live-payment hardening (October 2026)

Branch `claude/peaceful-mayer-7bdvkn`, commits `4b2079a`..`f1280a6`. Production was at `3e63eb9`. The findings were checked against that commit and all of them still applied, because the only change since review was trimming Stripe config whitespace.

This work reduces specific risks. It does not make the site unhackable, and passing tests are not proof of that.

## What changed

| Area | Change |
|---|---|
| CSP | `src/proxy.ts` and `src/lib/csp.ts` send a per-request nonce with `'strict-dynamic'`. Scripts have no `unsafe-inline` or `unsafe-eval`. `frame-ancestors 'none'` and `object-src 'none'` are set, and `form-action` allows only self, Stripe Checkout and Stripe Billing. The policy runs report-only outside production and is enforced on Vercel production. `CSP_MODE` overrides this. Every HTML page now renders per request. |
| CSP reporting | `/api/csp-report` logs the directive, the blocked origin, and the page path. It never logs query strings, which can carry tokens. |
| Headers | `Referrer-Policy: no-referrer` on `/auth/*`, `/checkout/quote/*` and `/checkout/success`. `Cache-Control: private, no-store` on admin, client, auth, login, checkout and API routes. HSTS, nosniff, `X-Frame-Options: DENY` and Permissions-Policy are unchanged. |
| Rate limits | Postgres `rate_limits` table, updated with one atomic upsert per hit. Identifiers are stored as hashes. Limits: login per IP (10/15m) and per email (4/15m); checkout per IP, per email and per page (8 and 5 per 10m); support per user (6/h); uploads per user (40/h); step-up per user; leads per IP. Client IPs come only from Vercel's `x-vercel-forwarded-for` or `x-real-ip`. If the limiter fails, requests are refused, except on the public lead forms. |
| Website Care | One attempt per activation, claimed under a row lock. The Stripe idempotency key is `care-checkout:<attemptId>`, with identical parameters on every retry, including `expires_at`. The session URL is stored and reused. Expiry, or Stripe's `checkout.session.expired` event, releases the attempt. A second live subscription for the same project is cancelled immediately and quarantined. |
| Deposits | Before anything is created, these must match the stored checkout: session ID, `client_reference_id`, amount, currency, checkout mode, and livemode. Events from the wrong Stripe mode are refused. If an event arrives before the session ID was saved, the session is claimed atomically. Mismatches go to `billing_quarantine`, the admin is alerted, and nothing is fulfilled. |
| Email outbox | `email_log` statuses are queued, sending, sent, failed, dead and suppressed. Emails are enqueued in the same transaction as the change that causes them. Sending uses a lease-based claim and passes a provider idempotency key (`fluxline:<dedupeKey>`). A row is marked sent only after Resend accepts it. Backoff is 1m, 5m, 30m, 2h, then 12h, and an email is marked dead after 6 attempts. Sign-in links and step-up codes are minted at send time, so the outbox never stores a token. |
| Uploads | The route checks origin, session, project ownership, the rate limit, and Content-Length before it reads the body. The per-project quota is reserved atomically (`upload_count`). There is no malware scanning. Files are type-checked by their magic bytes only. |
| Admin step-up | Final invoices, refunds, Care cancellations and quotes require a 6-digit code sent by email. The code is single-use, valid for 10 minutes, allows 5 guesses, and is stored only as a hash. A correct code elevates that one session for 15 minutes. |

## How the outbox worker runs

1. **Inline:** each email is attempted right after its transaction commits.
2. **After every Stripe webhook:** `after()` in `/api/stripe/webhook` sends up to 20 due emails once the response has gone out.
3. **Admin dashboard:** "Emails waiting to send" shows counts and recent failures. "Retry now" requeues dead emails and sends them.
4. **Daily cron** (`/api/cron/reminders`, at 14:00 UTC; the Hobby plan only allows daily crons): retries up to 100 due emails. **This needs `CRON_SECRET`, which is not set yet. See below.**

Recovery after a crash:
- A crash after commit leaves the email `queued`.
- A crash while sending leaves it `sending` until the 2-minute lease expires. After that, any of the paths above picks it up.
- The provider idempotency key prevents a duplicate if the first send did go through.

## Migration

`drizzle/0001_hardening.sql` is additive: new tables, plus nullable or defaulted columns. Backfills:
- `upload_count` is set from the existing uploads.
- Existing sent emails get `sent_at`.
- Old failed emails become `dead`.
- Any consented Care activation without a session is reset to `invited`.

The migration ran automatically during the first preview build. That build used the shared Neon database (see risks), and the old production code stays compatible with the new schema.

## Environment variables (names only)

- New, optional: `CSP_MODE` (`enforce` or `report-only`). Leave it unset to enforce on production and run report-only on preview.
- **Missing:** `CRON_SECRET`. Add it to Production (sensitive) as a long random value. Until then the daily cron answers 401, so onboarding reminders, checkout reconciliation, and the cron outbox retry don't run.
- Existing and checked: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `AUTH_SECRET` are set separately for Production and Preview. `BILLING_LIVE_ENABLED` and `EMAIL_DELIVERY=live` are Production-only. Preview uses `EMAIL_DELIVERY=sandbox` and `EMAIL_SANDBOX_TO`. `RESEND_API_KEY`, `LEAD_FROM_EMAIL` and `LEAD_NOTIFICATION_EMAIL` are shared by both environments.

## Verification

| Check | Result |
|---|---|
| `npm test` | 79 of 79 pass. |
| `tsc --noEmit` | Clean. |
| `npm run lint` | 0 errors. 20 warnings, all pre-existing. |
| `next build --webpack` | Passes locally. The Vercel builds use Turbopack and also passed. |
| Preview, report-only | 19 pages hydrate. No violations except the browser notice that `upgrade-insecure-requests` is ignored in report-only mode. The login server action works, client navigation works, and the checkout redirect reaches `checkout.stripe.com` in Stripe test mode, with no card entered. This check found Zod's `new Function` probe; fixed with `jitless`. |
| Production, enforced | 16 pages, 0 CSP violations, all hydrated. Nonce is unique per request. Headers are as listed above. The webhook without a signature returns 400, the cron without a secret returns 401, an upload without a session returns 401, and the CSP report endpoint returns 204. No runtime errors after deploy. |
| Secret scan | `git log -p --all`, the working tree, and `.next` build output. No keys or credentials found; the only hit was a database column name. Only `.env.example` was ever committed. Nothing needed rotating. |
| `npm audit` | Production dependencies: 0 vulnerabilities. Dev-only: 9 findings in eslint-config-next and drizzle-kit tooling. The offered fixes are major-version downgrades, so they were left alone. |

Coverage of the new tests:
- **Rate limits:** two DB handles share one quota; 40 concurrent hits produce exactly 5 allowed; the window resets; fail-closed behaviour.
- **Care checkout:** sequential retry, concurrent calls, crash after Stripe creation, expiry, cancel and reactivate, duplicate subscription.
- **Deposits:** wrong amount, currency, session, mode and reference; wrong environment; unknown intent; unpaid; duplicate; out-of-order.
- **Outbox:** provider failure and backoff, crash after commit, rollback, lease recovery, concurrent delivery, dead and requeue, fresh tokens on retry.
- **Uploads:** concurrent quota and other users' access.
- **Step-up:** single use, guess limit under concurrency, expiry.
- **CSP:** policy contents and mode.

Not run:
- Anything that charges a live card, issues a refund, or sends real customer mail.
- Load or attack traffic.
- The tests run on PGlite, which serializes queries. They prove the atomic SQL logic, not Postgres lock contention under real parallel connections.
- The upload route's body-ordering checks were verified by code review and production probes, not by an automated route test.
- Past webhook delivery history: the Hobby plan keeps runtime logs for only 1 hour. Check the delivery list on the webhook endpoint in Stripe Dashboard → Developers → Webhooks.

## Rollback

- Redeploy `dpl_AEY7A6hzWoM9kQrMh7kok5ADpmkk` (commit `3e63eb9`) from Vercel Deployments → Instant Rollback.
- The migration is additive and compatible with that code, so it doesn't need reverting.
- To loosen only the CSP without a rollback, set `CSP_MODE=report-only` on Production and redeploy.

## Remaining risks and recommendations

- **Shared database:** Preview and Production use the same Neon `DATABASE_URL`, so preview builds run migrations against production data and preview test checkouts write test-mode rows there. Recommended fix: Neon branching for Preview (the integration supports it).
- **Shared Resend key:** Preview and Production use the same `RESEND_API_KEY`. Preview's sandbox mode limits who receives mail, but a separate key would isolate them fully.
- **Stripe key scope:** use a restricted live key that has only checkout sessions, customers, invoices, invoice items, subscriptions, refunds, prices and billing portal, instead of the full secret key.
- **Inline styles:** `style-src` still allows `'unsafe-inline'`, because React style attributes can't carry nonces. This lets injected markup change styling but not run scripts.
- **No CDN caching:** every HTML page now renders per request because the nonce requires it. Performance and function usage should be watched on the Hobby plan.
- **Step-up uses the admin inbox:** whoever controls that mailbox can approve financial actions. Protect the mailbox accordingly.
- **Daily-only cron:** emails that fail with no later webhook or admin visit wait up to a day for retry.
- **MFA:** turn on MFA for GitHub, Vercel, Stripe and the email account, preferably with passkeys or an authenticator app. Nothing in this code enables it.
- **Database credentials:** the app uses the integration's owner-level credentials. A least-privilege role (no DDL at runtime) and Neon's point-in-time restore window should be reviewed in the Neon console.
- **Stale branch:** `upgrade/films-and-access` was reset to `60c9ee8`, an ancestor of production. No work was lost, but that branch has none of the payment work. Don't deploy from it.
