# Pricing, payments, and client portal: setup guide

This guide connects the Fluxline pricing and payment system to your own Stripe account, database, and email.
Everything in the code is ready; it stays switched off until you complete these steps.

**Ground rules**

- Never paste secret keys into a chat, an email, or a file in Git. They go only into Vercel's Environment Variables screen (or a local `.env.local`, which Git ignores).
- Work in **Stripe test mode** first. Live charges stay off until you set `BILLING_LIVE_ENABLED=true` **and** mark the service agreement approved (step 14).
- Stripe is the source of truth. The site records a payment only when Stripe's signed webhook confirms it.

## What the system does

| Stage | What happens | Who triggers it |
| --- | --- | --- |
| Deposit | Customer picks Essential or Business on `/pricing`, accepts the service agreement, pays 50% on Stripe Checkout | Customer |
| Confirmation | Stripe's webhook creates the customer, project, and payment; emails a receipt note and a single-use onboarding link | Stripe (verified) |
| Onboarding | Customer completes `/client/onboarding` (autosaves) and uploads logo and images | Customer |
| Development | You move the project through In Development → Client Review in `/admin` | You |
| Final balance | "Create and send invoice" in `/admin` sends a Stripe invoice for the remaining 50% | You |
| Paid in full | Stripe's `invoice.paid` webhook moves the project to Ready for Launch | Stripe (verified) |
| Website Care | You click "Offer Website Care"; the customer reviews the recurring terms, ticks the authorization, and adds a card on Stripe | You, then the customer |
| Live | You mark the project Live; with Care active it becomes Maintenance Active | You |

Premium: create a quote in `/admin/quotes`. The customer gets a private link to review the scope and pay the deposit.

## Step 1: Create a Stripe account

Sign up at https://dashboard.stripe.com/register with your business email. You start in test mode automatically.

## Step 2: Verify your identity and business

Dashboard → **Settings → Business → Account details** (or the "Activate payments" banner). Provide the legal business name (Fluxline LLC), EIN or SSN, business address, and representative details. Live payments need this; test mode doesn't.

## Step 3: Connect your bank account

**Settings → Business → Bank accounts and currencies**. Add the account that should receive payouts. Pick a payout schedule under **Settings → Payouts**.

## Step 4: Business information customers see

**Settings → Business → Public details**: public business name, support email (cristhian@fluxlinesolutions.com), website (https://fluxlinesolutions.com), and statement descriptor (for example `FLUXLINE`). Under **Settings → Branding**, upload the logo and set the accent color (#1D4FD8) so Checkout, invoices, and the portal match the site.

Under **Settings → Customer emails**, turn on **Successful payments** (receipts) and **Refunds**. In live mode, Stripe also emails invoices and failed-payment notices according to **Settings → Billing → Subscriptions and emails**.

## Step 5: Products and prices

Deposits and final invoices use amounts from `src/lib/billing/plans.ts`, so they need no setup. The monthly Website Care prices are created by a script, which also configures the Customer Portal.

After step 6, run locally with your **test** key in the environment (not committed):

```bash
STRIPE_SECRET_KEY=sk_test_... APP_URL=https://fluxlinesolutions.com npm run stripe:setup
```

It creates "Website Care: Essential / Business / Premium" at $59, $99, and $149 per month with lookup keys `fluxline_care_*_monthly`, and prints a Customer Portal configuration id (`bpc_...`) to save as `STRIPE_PORTAL_CONFIGURATION`. Re-running it is safe.

## Step 6: Get your test API keys

Dashboard (test mode) → **Developers → API keys**. Copy the **Secret key** (`sk_test_...`). For tighter security, create a **restricted key** with write access to Checkout Sessions, Customers, Invoices, Invoice Items, Prices, Products, Refunds, Subscriptions, Billing Portal, and read access to Charges, Invoice Payments, and Events.

The publishable key is not needed: the site uses hosted Checkout only.

## Step 7: Database and environment variables in Vercel

1. **Database.** Vercel → project **fluxline-solutions** → **Storage → Create → Neon (Postgres)**, connected to Production and Preview. This sets `DATABASE_URL`. Then apply the schema once, from your machine:
   ```bash
   DATABASE_URL="postgres://..." npm run db:migrate
   ```
   Run it again whenever a change adds files to `drizzle/`.
2. **Environment variables.** Vercel → **Settings → Environment Variables**. Add these, all as server-side variables (never `NEXT_PUBLIC_`):

| Variable | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_...` (test key for now) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from step 8 |
| `STRIPE_PORTAL_CONFIGURATION` | `bpc_...` from step 5 |
| `AUTH_SECRET` | output of `openssl rand -base64 48` |
| `ADMIN_EMAILS` | `cristhian@fluxlinesolutions.com` (comma-separate more) |
| `APP_URL` | `https://fluxlinesolutions.com` for Production; leave unset for Preview |
| `EMAIL_DELIVERY` | `sandbox` while testing (see below) |
| `EMAIL_SANDBOX_TO` | your own inbox |
| `CRON_SECRET` | output of `openssl rand -hex 32` |
| `BILLING_LIVE_ENABLED` | leave **unset** until step 14 |

Email reuses the existing Resend settings (`RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`). `EMAIL_DELIVERY` controls who receives billing emails:
- `log` (the default): nothing is sent.
- `sandbox`: every email goes to `EMAIL_SANDBOX_TO`, with the real recipient in the subject. Use this for all testing.
- `live`: emails go to customers. Set this only when you go live.

Sign-in links are emails too. While testing in `sandbox`, they arrive in your sandbox inbox.

Redeploy after changing variables.

## Step 8: Webhook endpoint

Dashboard (test mode) → **Developers → Webhooks → Add endpoint**.

- URL: `https://fluxlinesolutions.com/api/stripe/webhook` (or a preview URL with the protection bypass, for preview testing)
- Events:
  `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`,
  `invoice.finalized`, `invoice.paid`, `invoice.payment_failed`, `invoice.voided`, `invoice.marked_uncollectible`,
  `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`

Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` and redeploy.

For local testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`. It prints a temporary `whsec_...` for your `.env.local`.

## Step 9: Customer Portal

`npm run stripe:setup` created a portal configuration that lets customers update their card and billing details and download invoices. Cancellation stays off in the portal on purpose: customers cancel from their Fluxline dashboard with one click, which applies the disclosed three-month minimum and emails a confirmation. Review it under **Settings → Billing → Customer portal**.

## Step 10: Test a deposit

1. Open `/pricing` and choose **Start with Business**.
2. Fill in the form with your sandbox email, tick both boxes, and continue to Stripe.
3. Pay with `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
4. The success page shows "Confirming…", then "Your deposit is confirmed" once the webhook arrives.
5. Check that the sandbox inbox has the deposit confirmation and onboarding emails, and `/admin` shows the project as Deposit Paid.
6. Failure cases:
   - Card `4000 0000 0000 0002` is declined, and no project is created.
   - Leave Checkout with the back link and confirm the "Checkout cancelled" notice.
   - Resend the event from **Developers → Webhooks → (endpoint) → event → Resend**. The admin dashboard must still show exactly one project.

## Step 11: Test the final invoice

1. In `/admin/projects/<id>`, set the status to In Development.
2. Click **Create and send invoice**. The status becomes Final Payment Pending, and the sandbox inbox gets the invoice email.
3. Open the payment link and pay with `4242...`. The project moves to Ready for Launch.
4. Repeat with card `4000 0000 0000 0341` (it attaches, then fails on charge) to see the failed-payment email and the admin alert.

## Step 12: Test Website Care

1. On a Ready for Launch project, click **Offer Website Care**.
2. Sign in as the customer (`/login` with the customer email; the link arrives in the sandbox inbox), open the link in the dashboard, read the terms, tick the authorization, and add `4242...` on Stripe.
3. The dashboard shows Website Care active. Mark the project Live in admin; it becomes Maintenance Active.
4. Open **Manage billing** from the customer dashboard to check the portal.

## Step 13: Test failures and cancellation

- In the customer dashboard, click **Cancel Website Care**. The confirmation states the end date: the later of the current period end and the three-month minimum. Check the cancellation email, and confirm the subscription in Stripe shows "Cancels on" that date.
- Use **Test clocks** (Billing → Subscriptions → Test clocks) to advance time, and use card `4000 0000 0000 0341` to simulate failed renewals.
- Refund a test deposit from the admin project page. The payment shows Refunded once Stripe's `charge.refunded` webhook arrives.
- Click **Sync with Stripe** on a project, and **Reconcile checkouts with Stripe** on the overview, to confirm reconciliation finds nothing missing.

## Step 14: Go live (only after your explicit approval)

1. Have the service agreement and Website Care terms in `src/content/agreements.ts` reviewed by a lawyer, especially the cancellation, refund, and automatic-renewal language for your state. Edit them, bump `version`, and set `status: "approved"` on both.
2. Complete Stripe account activation (steps 2–4).
3. Switch the dashboard to **live mode**. Run `npm run stripe:setup -- --live` with `BILLING_LIVE_ENABLED=true` and your live key, create the live webhook endpoint (step 8), and copy the live signing secret.
4. In Vercel Production:
   - set `STRIPE_SECRET_KEY` to `sk_live_...`
   - set `STRIPE_WEBHOOK_SECRET` to the live `whsec_...`
   - set `STRIPE_PORTAL_CONFIGURATION` to the live `bpc_...`
   - set `EMAIL_DELIVERY=live`
   - set `BILLING_LIVE_ENABLED=true`

   Keep Preview on test keys.
5. Redeploy and promote. Make a real low-value purchase, refund it, and confirm both appear correctly.

Until all of this is done, live keys are refused: checkout shows "Online deposits aren't open yet" and the admin dashboard says why.

## Reference

- Prices and features: `src/lib/billing/plans.ts`, `src/content/pricing.ts`
- Agreement templates: `src/content/agreements.ts`
- Webhook handling and idempotency: `src/lib/billing/webhook.ts`
- Admin and customer billing actions: `src/lib/billing/service.ts`
- Tests: `npm test` (in-memory database and a Stripe stand-in, so there are no network calls and no emails)
