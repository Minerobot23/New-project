# Google Search Console & Bing Webmaster Tools

The site is already technically ready for indexing:

- `https://fluxlinesolutions.com/robots.txt` allows crawling (except `/api/`) and points to the sitemap.
- `https://fluxlinesolutions.com/sitemap.xml` lists every public page.
- Every page has a canonical URL on `https://fluxlinesolutions.com` (no www).
- `www` permanently redirects (308) to the apex domain.
- Structured data: Organization, WebSite, Service, BreadcrumbList, FAQPage, and Article, where relevant.

Indexing is not automatic or guaranteed. Don't assume the site is indexed until Search Console confirms it.

## Google Search Console (recommended: Domain property)

1. **YOU:** Go to https://search.google.com/search-console and sign in. `fluxlinellc@gmail.com` works as the owner account.
2. Click **Add property** and choose **Domain**. Enter `fluxlinesolutions.com`, with no `https://` and no `www`.
3. Google shows a TXT record that looks like `google-site-verification=...`. Copy it exactly.
4. **YOU:** In GoDaddy → DNS → **Add New Record**:
   - Type `TXT`
   - Name `@`
   - Value: the full string Google gave you
   - TTL 1 hour

   This is an **additional** TXT record. Do not edit or remove the existing SPF (`v=spf1 …`) or Microsoft (`NETORGFT…`) TXT records.
5. Back in Search Console, click **Verify**. If it fails, wait 15–60 minutes and try again.
6. Open **Sitemaps** and submit `https://fluxlinesolutions.com/sitemap.xml`.
7. Optional: use **URL Inspection** on the homepage, then **Request indexing**.

**Alternative (HTML tag):** choose the **URL prefix** property instead. Copy only the `content` value of the meta tag into the Vercel environment variable `GOOGLE_SITE_VERIFICATION`, then redeploy.

## Bing Webmaster Tools

1. **YOU:** Go to https://www.bing.com/webmasters and sign in.
2. The easiest option is **Import from Google Search Console**, once Google is verified. It brings over the site and sitemap.
3. Otherwise, add `https://fluxlinesolutions.com` and verify by:
   - DNS: a CNAME record Bing provides, or
   - HTML meta tag: put the value in the Vercel env var `BING_SITE_VERIFICATION`, then redeploy.
4. Submit `https://fluxlinesolutions.com/sitemap.xml`.

## After verification

- Check **Pages** in Search Console over the next few weeks. New sites often take days to weeks to be crawled and indexed.
- Watch for "Duplicate without user-selected canonical" or "Page with redirect". The redirect report for `www` URLs is expected and correct.
- Make sure the website URL on the Google Business Profile, if you create one, is `https://fluxlinesolutions.com`.
