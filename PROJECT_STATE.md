# PROJECT_STATE

Last updated: 2026-10-08 · Branch: `upgrade/films-and-access` (not pushed; deployed to Vercel previews only, production untouched)

## Objective

Upgrade fluxlinesolutions.com and its three interactive concepts: remove blocking entrances,
make the offer clear on the first screen, simplify the call-request form, and replace the
arrival animations with real films at the level of the Inti reference.

## Acceptance criteria

- [x] No blocking homepage gate; offer, navigation, demos and contact action visible at once
- [x] Automotive lock-up reproduced, diagnosed and fixed
- [x] No failed asset or stalled animation can lock navigation; intros can be skipped
- [x] Reduced motion reaches the same content
- [x] Controls available during every intro; no repeated Enter clicks
- [x] Homepage copy states the offer; concepts labelled as fictional; no invented claims
- [x] Call-request form reduced to three required fields; delivery states honest
- [x] Clear route from each demo into the real inquiry flow
- [x] Lint, type check and production build pass
- [ ] Three finished films, mobile exports and posters — **one of three: Maison Arden, as a CG example below the benchmark**
- [x] Shared film component (`src/experience/hero-film.tsx`), used by the restaurant concept

## Decisions

- 2026-10-08: The repository is `Minerobot23/New-project` (Next.js 16). It was not on this
  machine; cloned to `C:\Users\crisg\OneDrive\Desktop\fluxline-solutions`. Confirmed as the live
  site: its last push (02:24:48 UTC) matches the production deployment created two seconds later.
- 2026-10-08: Removed the homepage loader-and-Enter overlay entirely rather than making it
  skippable. The demo panels are plain links; the animated "curtain" navigation was removed
  because it made navigation wait on an animation.
- 2026-10-08: Animations never own access. Every animation that used to gate something now has a
  plain timer behind it and writes its end state directly to the element.
- 2026-10-08: Film production stopped at a preview. The brief says to report rather than ship a
  substantially weaker substitute, and the preview is below the benchmark. See `media/README.md`.
- 2026-10-08: At the owner's request the Maison Arden Blender film was rendered in full and
  integrated as a working example, knowing it is CG and below the benchmark. The dining-room scene
  now uses the film's last frame as its backdrop (hotspots repositioned) so the handover is a cut.
- 2026-10-08: No pricing, reviews, client counts or guarantees were added or changed.

## The automotive lock-up: diagnosis

- "Pull in" was `disabled` until `ShutterReveal`'s GSAP timeline called `onComplete`.
- GSAP advances on animation frames. When frames are not delivered (a background or non-painting
  tab, some embedded and automated browsers, heavy throttling), the timeline never completes.
- Reproduced on the live site: with frames delivered the button was disabled for 5 to 8 seconds;
  with `requestAnimationFrame` stubbed out it stayed disabled after 15 seconds.
- No asset failure was involved. The loader already had a timeout; the door did not.
- The same pattern existed in scene changes: `runSceneTransition` resolved only from a GSAP
  callback, and the scene director refuses new navigation while a change is in progress, so one
  stalled transition froze the whole demo. The restaurant entrance had the same dependency.

## What changed

- `src/components/home/environments.tsx`: new first screen (headline, supporting copy, "Explore the
  demos", "Request a call") with the three demos directly beneath as links with still frames.
- `src/components/home/fluxline-intro.tsx`: deleted.
- `src/app/page.tsx`, `process-story.tsx`, `experiences/page.tsx`: shorter copy; process condensed
  to Plan, Capture, Build, Launch; "Explore what your website could feel like."
- `src/experience/transitions.ts`: every scene change finishes within 2.6 s, animated or not.
- `src/experience/shutter-reveal.tsx`: door opens on a timer if the animation has not; `skip` prop.
- `src/experience/entrance-sequence.tsx`: starts by itself, can be skipped, has a timer fallback,
  and cannot fire a late "entered" after the visitor has navigated elsewhere.
- `src/experiences/*`: navigation and "All demos" present from the first frame; "Pull in" always
  enabled; restaurant "Enter" replaced by an optional "Skip intro"; loaders shortened (300 ms
  minimum, 2.5 s ceiling); "Want this for your business?" link into `/request-a-call?from=…`.
- `src/components/forms/request-call-form.tsx`, `src/lib/leads/*`, `api/leads/request-call`:
  required fields are name, business name and phone. Email, website, business type, project type,
  preferred time and message are optional; business type is pre-selected from the originating
  demo and can be changed. The notification email handles a missing email address.
- `media/`: film preview, scripts and status (see `media/README.md`).

## Verification (2026-10-08, production build served locally, Chromium via Playwright)

| Check | Result |
| :- | :- |
| `npm run lint` | 0 errors (warnings are in vendored `.claude/skills` files) |
| `npm run typecheck` | passes |
| `npm run build` | passes |
| Homepage | no dialog, no scroll lock, no video elements; three demo links present |
| Automotive, normal | "Pull in" enabled at 1 s; reaches the bay |
| Automotive, no animation frames | "Pull in" enabled; reaches the bay, then Brakes (was stuck) |
| Restaurant, normal | enters by itself; "Skip intro" works; Menu opens mid-intro and stays open |
| Restaurant, no animation frames | reaches the dining room with no click |
| Reduced motion | restaurant opens in the dining room; automotive controls live |
| Form, empty submit | three field errors; focus on the first |
| Form, production build without email configured | HTTP 502; inline error; no success screen |
| Form, dev server | HTTP 200; success; message printed to console for `dev-inbox@localhost` only |
| Form, invalid optional email in the collapsed section | section opens; error shown; focus moved |
| Widths 390, 768, 1440 on all five pages | no horizontal overflow after fixing a 768 px overflow in the demo panels |
| Keyboard, homepage | skip link, header, then both hero actions, all with a focus ring |
| Console | only the Vercel analytics script, which is not served locally |

Film checks (same build, restaurant concept):

| Check | Result |
| :- | :- |
| ffprobe, desktop | H.264 yuv420p, 1600x900, 24 fps, 336 frames, 14.0 s, 3.4 MB, no audio |
| ffprobe, mobile | H.264 yuv420p, 720x1280, 336 frames, 14.0 s, 2.4 MB, no audio |
| Source chosen | 390 and 768 wide load only the mobile cut; 1440 loads only the desktop cut |
| Autoplay, pause, resume | plays muted; Pause holds the time; Play resumes |
| Plays to the end | dining room appears with all seven hotspots; no video element left |
| Skip, replay | Skip reaches the dining room; "Replay the arrival film" restarts it |
| Menu opened mid-film | menu opens and is still open after the film's length has passed |
| Reduced motion | no film; dining room at once; replay link hidden |
| Film file blocked | falls through to the dining room |
| No animation frames | film plays and hands over (media events and timers only) |
| Overflow at 390, 768, 1440 | none |

Screenshots: `docs/screenshots/before/` (live site) and `docs/screenshots/after/` (local build).

## Not verified

- Real phones, Safari and iOS.
- Lead delivery through Resend with real credentials. No test lead was sent to a real inbox.
- The website-check form, which shares field components that were extended.
- Hotspot positions and the service panels beyond reaching them; they were not changed.
- Focus restoration when returning from a panel was not separately tested.
- No visual or technical review agent was run on this branch.

## Remaining issues

- Saltbox Home Co. and Halden Motor Works have no film; they keep the original intros, now
  non-blocking. The home demo still opens on the dark dusk photograph the brief wants replaced.
- The Maison Arden film is CG and reads as 3D, not as a photographed place. The gallery and
  find-us scenes still show the stock photograph of a different room.
- On phones the dining-room backdrop is the landscape frame cropped, so the handover from the
  portrait film is a short fade, not a cut.
- On phones the demo panels start at the bottom edge of the first screen rather than inside it.
- The page title still reads "Websites Built to Turn Visitors Into Customers"; left unchanged.

## Next action

Decide how the home and automotive films will be produced (generative service with a budget,
licensed 3D models, or real footage); see `media/README.md`.
