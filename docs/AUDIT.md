# Repository audit: immersive direction

Fluxline is moving from "a web design company with a nice site" to "a site that is itself the portfolio":
cinematic, photography-led, interactive. This audit decides what survives that shift.

## KEEP

These are sound and carry over unchanged or with restyling only.

| Area | Files | Why |
| --- | --- | --- |
| App Router structure, metadata, security headers | `src/app/layout.tsx`, `next.config.ts` | Solid foundation; only the visual shell changes. |
| SEO infrastructure | `src/lib/seo.ts`, `src/components/seo/*`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` | Crawlable pages, structured data, and canonical URLs must coexist with the immersive layer. |
| Industry and location landing pages | `src/components/templates/*`, `src/app/websites-for-*`, `src/app/web-design-*`, `src/content/{industries,locations}.ts` | They earn search traffic. Restyled through shared tokens. |
| Resources (articles) | `src/app/resources/*`, `src/content/resources/*` | Long-form SEO content; restyled only. |
| Lead capture | `src/app/api/leads/*`, `src/lib/leads/*`, `src/lib/email/*`, `src/components/forms/*`, `rate-limit.ts` | Working call and Website Check pipeline. |
| Analytics and attribution | `src/lib/analytics.ts`, `attribution.ts`, `src/components/analytics/*` | Measurement stays. |
| Legal pages | `src/app/privacy`, `src/app/terms`, `src/components/legal/*` | Required. |
| Interactive Before/After simulator | `src/components/simulator/*` | Still useful on industry pages until each industry has its own experience. |
| Licensed photography and credits | `public/demo`, `public/images`, `docs/PHOTO-CREDITS.md` | The only licensed imagery available; the restaurant demo is built from it until real shoots replace it. |

## REBUILD

| Area | Becomes |
| --- | --- |
| Homepage (`src/app/page.tsx`, `src/components/home/*`) | Cinematic loader → ENTER → environment chooser → editorial "You just experienced what we build" story. |
| Design system (`globals.css`, fonts, buttons, header, footer) | Dark, photography-first system: near-black stage, bone type, Fluxline blue as a rare accent, serif/expanded display pairing, almost no chrome. |
| Portfolio (`/work`) | `/experiences`: projects open as full-screen experiences, not cards. `/work` redirects. |
| Process section | Five-step "We visit, capture, design, build, convert" told with one restaurant photo that gains layers as you scroll. |
| Before/After component | Moves into the experience engine as a reusable `BeforeAfter`. |

## DELETE

| Area | Reason |
| --- | --- |
| `components/home/{hero,problems,phone-first}.tsx` | Conventional agency sections; replaced by the experience. |
| `components/shared/concept-cards.tsx` | Card portfolio; replaced by `/experiences`. |
| Light "print" token set | Replaced by the cinematic system. |

## NEW

- `src/experience/`: the reusable **Fluxline Experience Engine** (scenes, cover stage, hotspots, transitions, loader, panorama, controls). Client-specific creative lives in `src/experiences/<client>/`; the engine never hard-codes a business.
- `public/experiences/restaurant/{exterior,entrance,interior,bar,private-dining,food,menu,transitions,mobile}/`: one folder per capture category, mapped by a manifest so real photography drops in without code changes.
- `ASSET_CAPTURE_GUIDE.md`: shot list for every restaurant asset, written for a Canon EOS Rebel T7 with the 18-55mm kit lens.

## Constraints found during the audit

- This build environment cannot download new photography (stock sites are blocked by network policy), so the restaurant demo uses the licensed photos already in the repo. Several are 900-1100px wide and will look soft full-screen on large displays; the cinematic treatment (grade, vignette, grain) masks this, and the capture guide replaces every one of them.
- There is no exterior or bar photograph yet. The entrance is built from the interior photo seen through an architectural doorway mask, and the engine accepts a real exterior photo plus door coordinates when one is captured.
