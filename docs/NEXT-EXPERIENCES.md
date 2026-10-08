# Next: Home Services and Automotive experiences

The restaurant experience (`/experiences/restaurant`, Maison Arden) set the bar. Home Services and Automotive must
reach the same level. They are currently the old simulator demos on `/websites-for-hvac-companies#demo` and
`/websites-for-auto-repair-shops#demo`.

## Ground rules (same as the restaurant)

- Build on the Fluxline Experience Engine in `src/experience/` (scene director, CoverStage, Hotspot, transitions,
  loader, BeforeAfter, ExperienceNavigation, MobileExperienceControls, ContextCTA, ConceptNote). Do not fork it;
  extend it if a new primitive is needed.
- One folder per concept in `src/experiences/<name>/` (assets.ts, content.ts, context.tsx, parts.tsx, scenes/,
  `<name>-experience.tsx`), and one route in `src/app/experiences/<name>/page.tsx`.
- Its own creative direction: own type, colour, and voice. Reusable architecture, not a template.
- Fictional business, labeled "Fluxline Interactive Concept". No fake reviews, ratings, clients, awards, or results.
  Simulated actions (calls, bookings, quotes) explain themselves with ConceptNote.
- Photography in `public/experiences/<name>/<slot-folders>/`, licensed (record the source in
  `docs/PHOTO-CREDITS.md`), at least 2400 px wide for full-screen scenes.
- Add a section per concept to `ASSET_CAPTURE_GUIDE.md` (every slot: filename, purpose, orientation, resolution,
  camera position, focal length for a Canon T7 + 18-55mm, tripod, lighting, photo/video, transition).
- Mobile-first, reduced-motion, keyboard, and no-JS fallbacks like the restaurant. Test at 1440×900 and 390×844.
- When live: point the Home and Automotive panels in `src/components/home/environments.tsx` and the entries in
  `src/app/experiences/page.tsx` at the new routes, add them to `sitemap.ts`, and enable them in the chooser.

## Home Services: "The house is the interface"

Route `/experiences/home`. Fictional company (e.g. a Long Island exterior and remodeling contractor).

Scenes:
1. **Arrival:** a house at dusk, full screen. "What do you want to transform?"
2. **The house:** hotspots on the real parts of the house photo: ROOF, SIDING, WINDOWS, KITCHEN (through the front
   window), BATHROOM, OUTDOOR (deck/patio). The camera travels to each.
3. **Each area:** full-bleed photo of that area; BeforeAfter slider (before/after pair); a short project gallery;
   material selections (e.g. shingle colours, siding profiles, window styles, kitchen finishes) that visibly change
   the scene where practical (swap photos or tint overlays); "Get my estimate".
4. **Estimate:** a short form prefilled with the area and materials chosen (name, phone, email, address/town,
   project, timeline), validated, concept confirmation.

Photo needs (search Unsplash/Pexels): house exterior at dusk (wide, straight-on), roof close-up, siding detail,
window from outside and inside, modern kitchen, bathroom, deck/patio, before/after pairs (or a dated vs renovated
pair of the same kind of room), material swatches.

## Automotive: "The vehicle is the website"

Route `/experiences/automotive`. Fictional independent shop (service + detailing).

Scenes:
1. **Arrival:** dark service bay, garage door rising or lights coming on over the car (photo/mask sequence).
2. **The vehicle:** car dominates the screen; hotspots on PAINT, WHEELS, INTERIOR, BRAKES, DETAILING, MAINTENANCE.
   The camera moves to each part.
3. **Each service:** close-up photo, what the shop does, how long it takes, and starting-price language only if
   clearly marked illustrative; before/after for paint correction and detailing.
4. **Schedule service:** vehicle (year/make/model), service, date and time slots, concept confirmation.
   CALL and GET DIRECTIONS always one tap away.

Photo needs: a car in a dark garage/service bay (wide, low angle), wheel/tyre, brake rotor and caliper, interior
(dash/seats), paint close-up with reflections, detailing in progress, lift/bay context, paint correction or
detailing before/after.

## Order

Home Services first, to restaurant quality; then Automotive. Commit each to `claude/wizardly-bohr-qnnjbt`, verify on
desktop and phone, then ship to production via `claude/confident-meitner-i1qdmy` when the owner approves.
