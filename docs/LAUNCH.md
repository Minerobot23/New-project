# Fluxline launch runbook

This runbook covers deploying the website, connecting the domain, and setting up email. Steps that need an account login or tenant-specific values are marked **YOU**. Never paste API keys or DNS tokens into Git.

---

## Current state (verified October 6, 2026)

**DNS** is hosted at GoDaddy (nameservers `ns69` and `ns70.domaincontrol.com`).

**Website (Vercel project `fluxline-solutions`):**
- `A @` → `216.198.79.1`
- `CNAME www` → `81ebb3581a4aed96.vercel-dns-017.com`
- `www` redirects (308) to the apex.
- These are the project-specific values shown in Vercel → Settings → Domains. They replaced GoDaddy Website Builder.

**Email: Microsoft 365, provisioned through GoDaddy** (tenant `NETORGFT21197997.onmicrosoft.com`). All of these were already present:

| Record | Value |
| --- | --- |
| MX | `fluxlinesolutions-com.mail.protection.outlook.com` (priority 0), the only MX |
| TXT | `NETORGFT21197997.onmicrosoft.com` (tenant verification) |
| DKIM | `selector1` / `selector2._domainkey` CNAMEs to `…netorgft21197997.p-v1.dkim.mail.microsoft` |
| Outlook/Teams | `autodiscover`, `sip`, `lyncdiscover`, `msoid`, and the SRV records `_sip._tls` and `_sipfederationtls._tcp` |
| SPF | `v=spf1 include:secureserver.net -all` (GoDaddy's value; see section 5) |
| DMARC | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` (GoDaddy's reporting mailbox) |

**Test message results:** a message from cristhian@fluxlinesolutions.com to Gmail was checked via the headers. SPF, DKIM, and DMARC all **passed**. DKIM was `d=fluxlinesolutions.com`, `s=selector1`, so it is enabled and aligned. The message still landed in Spam. That is reputation (a brand-new domain plus a near-empty test message), not authentication.

**Decision:** keep DMARC at `p=quarantine`. Enforcement is already live and legitimate mail passes with alignment, so dropping to `p=none` would only weaken protection. Before launch, verify that Resend notifications pass DKIM with `d=fluxlinesolutions.com`.

**Vercel environment variables already set:** `LEAD_NOTIFICATION_EMAIL` and `LEAD_FROM_EMAIL`. Still required: `RESEND_API_KEY`.

---

## 1. Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Required | Environments | Value |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Yes | Production, Preview | Resend API key with sending access (section 4) |
| `LEAD_FROM_EMAIL` | Yes | Production, Preview | `Fluxline Website <notifications@fluxlinesolutions.com>` (the domain must be verified in Resend) |
| `LEAD_NOTIFICATION_EMAIL` | Yes | Production, Preview | `cristhian@fluxlinesolutions.com` (until the mailbox is live, `fluxlinellc@gmail.com` works as an interim recipient) |
| `LEAD_NOTIFICATION_TIMEZONE` | Optional | All | IANA zone for the "Submitted" time, e.g. `America/New_York`. Defaults to UTC. |

All variables are server-only. None use the `NEXT_PUBLIC_` prefix, so they never reach the browser.

In local development with no variables set, the form works and prints the notification to the dev-server console instead of sending it.

---

## 2. Vercel deployment

- Framework: Next.js (auto-detected). Build command `next build`. No other settings needed.
- Import the GitHub repository in Vercel (**Add New → Project**), set the environment variables, and deploy.
- `main` deploys to production. Other branches get preview URLs.

## 3. Domain: fluxlinesolutions.com

In **Vercel → Project → Settings → Domains**:

1. Add `fluxlinesolutions.com`. This is the primary, canonical domain.
2. Add `www.fluxlinesolutions.com` and set it to **Redirect to `fluxlinesolutions.com`** (308).
3. Vercel shows the exact DNS records to create. Typically these are an `A` record for the apex and a `CNAME` for `www`. **Use the values Vercel displays for your project.**

The app also redirects `www` → apex in `next.config.ts` as a backstop. Both point the same way, so there is no loop.

**DNS safety:** Only add or replace the apex `A` record(s) and the `www` record. Leave MX, TXT (SPF and verification), `_dmarc`, `autodiscover`, and `*._domainkey` records alone. If a registrar "parking" or "forwarding" record exists on the apex, it must be replaced for the site to load. Note it down before changing it.

HTTPS certificates are issued automatically by Vercel once DNS resolves.

---

## 4. Website notification email (Resend)

Resend sends the call-request notifications. The provider code is isolated in `src/lib/email/`; to switch providers, add a module beside `resend.ts`.

1. **YOU:** Create a Resend account at https://resend.com (fluxlinellc@gmail.com is fine as the admin login).
2. **YOU:** In Resend → **Domains → Add Domain**, add `fluxlinesolutions.com`.
3. Resend displays its DNS records. They normally include:
   - a DKIM `TXT` record at `resend._domainkey`
   - an `MX` and an SPF `TXT` record on the `send` subdomain (used for bounces)

   **Use the exact values Resend shows.** These live on `send.` and `resend._domainkey`, so they don't conflict with Microsoft 365's root MX or root SPF.
4. Add the records at the DNS provider, then click **Verify** in Resend.
5. **YOU:** In Resend → **API Keys**, create a key with **Sending access**, restricted to `fluxlinesolutions.com`. Put it in `RESEND_API_KEY` in Vercel. Don't paste it anywhere else.

DMARC alignment: Resend signs with `d=fluxlinesolutions.com` (aligned DKIM), and its bounce domain `send.fluxlinesolutions.com` aligns under relaxed SPF alignment.

---

## 5. Microsoft 365 for cristhian@fluxlinesolutions.com

One licensed mailbox is enough. `sales@` and `contact@` should be **aliases** on Cristhian's mailbox (free), not separate paid mailboxes.

1. **YOU:** Buy one Microsoft 365 Business Basic or Business Standard license.
2. **YOU:** In the Microsoft 365 admin center (https://admin.microsoft.com), go to **Settings → Domains → Add domain** and enter `fluxlinesolutions.com`.
3. Microsoft shows a verification `TXT` record (`MS=ms########`). Add it at the root (`@`), then click **Verify**.
4. Choose **"Add your own DNS records"** (manual). Microsoft then lists the tenant-specific records:

| Type | Host | Value | Notes |
| --- | --- | --- | --- |
| MX | `@` | **Copy from the admin center.** It's tenant-specific, e.g. `…mail.protection.outlook.com` or the newer `…mx.microsoft` format. | Priority as shown (usually 0). This must be the **only** MX on the root. Any registrar default MX must be removed, and only after the Microsoft MX exists. |
| TXT (SPF) | `@` | `v=spf1 include:spf.protection.outlook.com -all` | Microsoft's documented value. *This domain currently uses GoDaddy's `include:secureserver.net`. That passes, but it also authorizes GoDaddy's shared servers, so edit the existing record to this value rather than adding a second one.* There must be exactly **one** `v=spf1` record on the root. If one already exists, merge into it rather than adding a second. Resend does **not** need to be in the root SPF (it uses `send.`). |
| CNAME | `autodiscover` | `autodiscover.outlook.com` | Lets Outlook configure itself. Confirm against the value shown in the admin center. |

5. **YOU:** Create the user `cristhian@fluxlinesolutions.com` (Cristhian Garcia) and assign the license.
6. Optional: under **Users → Active users → Cristhian → Manage username and email**, add the aliases `sales@fluxlinesolutions.com` and `contact@fluxlinesolutions.com`.

## 6. DKIM (Microsoft 365)

1. **YOU:** Open the Defender portal: https://security.microsoft.com/authentication (**Email & collaboration → Policies & rules → Threat policies → Email authentication settings → DKIM**).
2. Select `fluxlinesolutions.com`. Microsoft shows **two CNAME records** (`selector1._domainkey` and `selector2._domainkey`) with tenant-specific targets. **Copy them exactly.** Do not construct them by hand.
3. Add both CNAMEs at the DNS provider.
4. Once they resolve (minutes to a few hours), toggle DKIM to **Enabled** in the same screen.

## 7. DMARC

> **This domain:** DMARC is already at `p=quarantine` and passing (see "Current state"). The steps below apply to a fresh domain, or if you ever need to step back down to monitoring while you add a new sending service.

Start in monitoring mode. Publish one `TXT` record at host `_dmarc`:

```
v=DMARC1; p=none; adkim=r; aspf=r; pct=100
```

**Aggregate reports (recommended):** first create a destination that actually exists, such as an alias `dmarc@fluxlinesolutions.com` on Cristhian's mailbox, or a free DMARC reporting service address. Then add it to the record:

```
v=DMARC1; p=none; rua=mailto:dmarc@fluxlinesolutions.com; adkim=r; aspf=r; pct=100
```

Don't add `rua` pointing at a mailbox that doesn't exist yet.

**Moving toward enforcement:**

1. **2–4 weeks at `p=none`.** Review reports. The only legitimate senders should be Microsoft 365 and Resend, and both should pass DKIM with alignment.
2. **`p=quarantine; pct=25`**, then 50, then 100 over a few weeks, as long as reports show no legitimate failures.
3. **`p=reject`** once quarantine at 100% has been clean for several weeks.

Before adding any new sending service (CRM, invoicing, newsletters), configure its DKIM for `fluxlinesolutions.com` first. Add an SPF include only if that service sends with the root domain as its envelope sender.

---

## 8. Verification

Run these from any machine (or use https://mxtoolbox.com):

```sh
dig +short NS fluxlinesolutions.com
dig +short A fluxlinesolutions.com
dig +short CNAME www.fluxlinesolutions.com
dig +short MX fluxlinesolutions.com            # exactly one Microsoft MX
dig +short TXT fluxlinesolutions.com           # exactly one "v=spf1 …" + MS= verification
dig +short CNAME autodiscover.fluxlinesolutions.com
dig +short CNAME selector1._domainkey.fluxlinesolutions.com
dig +short CNAME selector2._domainkey.fluxlinesolutions.com
dig +short TXT resend._domainkey.fluxlinesolutions.com
dig +short TXT _dmarc.fluxlinesolutions.com
curl -sI https://www.fluxlinesolutions.com | grep -i location   # → https://fluxlinesolutions.com/
```

**Mail authentication test:** From Outlook, send a message to the Gmail backup account. In Gmail, open **⋮ → Show original** and confirm `SPF: PASS`, `DKIM: PASS` (with `d=fluxlinesolutions.com`), and `DMARC: PASS`. Then reply from Gmail to confirm inbound delivery.

**Form test:** Submit the live form with "TEST" in the company name. The notification subject starts with `[TEST]`, so it's easy to filter out and delete.

---

## 9. Content that needs your factual input

These items are intentionally not filled in. Nothing placeholder-like is visible on the site.

- **Business mailing address:** set `mailingAddress` in `src/lib/site.ts`. It then appears in the footer and on the legal pages.
- **Privacy Policy and Terms:** review both. The Terms say they are governed by "the laws of the state in which Fluxline LLC is organized." Replace that with the named state if you prefer. Have counsel review if Fluxline will handle client customer data under contract.
- **Public email:** the site shows `cristhian@fluxlinesolutions.com`. Make sure that mailbox is receiving mail before launch.
