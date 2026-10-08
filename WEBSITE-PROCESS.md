# How we build a website: the thinking and the process

This is the method behind the Fluxline experiences (Maison Arden, Saltbox Home Co., Halden Motor Works). Nothing in it
is specific to restaurants, contractors, or garages. Use it for any website, immersive or plain.

---

## Part 1: How to think about it

### 1. Find the job before the design

A website has one job for the business and one for the visitor. Write both down before opening a design tool.

- **The business's job:** the one action that makes them money. Book a table. Request an estimate. Schedule a drop-off.
  Call. Buy.
- **The visitor's job:** the question they arrived with. "Is this place nice enough for Friday?" "Can they do my roof
  and what will it look like?" "Can they fix my brakes this week?"

Every page, scene, and button either answers the visitor's question or moves them toward the business's action.
Anything that does neither gets cut.

### 2. Show, don't describe

The weakest version of a website talks about the business: "We create unforgettable dining experiences." The strongest
lets the visitor feel it: they walk through the door and see the room.

The question to ask: **what is the real thing this business is about, and can the website be that thing?**

| Business | The real thing | So the interface is |
| --- | --- | --- |
| Restaurant | The room, the table, the food | Walking in through the door and sitting down |
| Home remodeler | The client's house | The house itself; tap the part you want to change |
| Auto shop | The car in the bay | The car itself; tap the part that needs work |

Once you've found it, the navigation designs itself: hotspots go on real objects, and moving between sections is
moving through a place.

This doesn't mean every site needs to be immersive. A plain site still benefits from the question. Lead with a real
photo of the room instead of a stock graphic, and with the menu instead of a mission statement.

### 3. Photography carries the site

Real photos of the real place do more than any layout, font, or animation. A design built around strong photos looks
expensive; the same design with generic stock looks like a template.

- Plan the shots before the shoot (see `ASSET_CAPTURE_GUIDE.md` for how detailed that plan should be).
- Design around the photo's focal point, not the center of the frame, so phones crop it properly.
- Use licensed stand-ins only until the real shoot, label them as stand-ins, and record where each came from.

### 4. Motion has to mean something

Every animation should explain where the visitor is going or what just happened: zooming toward the hotspot they
tapped, a door that opens to reveal a room, a garage door that lifts. Motion that is only decoration makes a site feel
slower and more "AI-made."

Rules of thumb:
- One idea per transition. Ease out, not bounce.
- Never make the visitor wait for an animation to do something.
- Always respect "reduce motion": the site must work as a series of simple cuts.

### 5. Honesty is a design rule, not a legal footnote

People can tell when something is fake, and once they notice one fake thing they doubt the rest.

- No invented reviews, ratings, clients, statistics, awards, or results.
- No guaranteed rankings or leads, and no fake urgency ("only 2 spots left").
- Concept and demo work is labeled as concept work, on the page, where people will see it.
- A before/after must be the same job from the same spot, or it doesn't belong on the site. We removed the
  comparison sliders from the concepts for exactly this reason: the stand-in photos were from different homes and cars.

### 6. The phone is the main version

Most visitors arrive on a phone, often one-handed. Design the phone layout first, then let it grow.

- The main action is always one tap away (a sticky button at the bottom).
- Anything you can hover on desktop needs a tap equivalent.
- Wide scenes get cropped on a phone. If an important hotspot falls off the edge, add another way to reach it (we added a
  row of service buttons under the car for exactly that reason).

### 7. Make it feel human-made

What makes a site read as generic: centered everything, gradients and glows, three identical cards in a row, vague
copy ("elevate your experience"), icons standing in for photos.

What makes it read as designed by a person: a strong point of view, real photos, tight specific copy ("Pads, rotors, and
fluid, measured and explained before anything is replaced"), uneven compositions on purpose, details that only make
sense for this one business.

---

## Part 2: The process, step by step

### Step 1. Discovery (one conversation)

Ask the owner:

1. What is the one action you want a visitor to take?
2. Who is your best customer, and what do they worry about before choosing you?
3. What do customers say when they love you? (Use their words, not marketing words.)
4. What makes your place different, physically? What would someone notice walking in?
5. What do you already have: photos, logo, menu or price list, reviews you can share with permission, booking tools?
6. What must the site connect to: booking system, phone, email, maps, payments?
7. What does the current site get wrong?

Output: a one-page brief with the business's job, the visitor's job, the main action, and the "real thing."

### Step 2. Audit what exists

- Current site: what pages get traffic, what people search to find it, what works, what's broken on a phone.
- Content: what's accurate, what's outdated, what's missing.
- Technical: speed, mobile layout, accessibility, search basics (titles, descriptions, sitemap), broken links, forms.
- Competitors: two or three. Note what they all do (that's the minimum) and what none of them do (that's the opening).

Output: a short audit with what to keep, what to fix, and what to drop. (Ours is in `docs/AUDIT.md`.)

### Step 3. Concept: decide what the site is

- Pick the interface idea from Part 1, section 2. Write it as one sentence ("The car is the menu").
- Map the scenes or pages: where the visitor starts, what they can reach from there, and where every path ends (the
  main action).
- Decide what the visitor carries with them (a chosen material, the services they looked at) so the final form arrives
  already filled in.

Output: a scene map. Keep it small: a start, four to seven places to explore, one place to act.

### Step 4. Design system

Define it once and reuse it everywhere:

- Color: a background, a text color, one accent. Write them as tokens.
- Type: one display face with character, one readable body face. Set sizes for phone and desktop.
- Spacing, motion timings, and easing curves as tokens.
- Components: buttons, labels, hotspots, panels, forms, navigation, loader.

Each business gets its own color, type, and voice on top of the shared engine (Maison Arden is warm serif, Saltbox is
dusk blue and amber, Halden is condensed type and red light).

### Step 5. Asset plan and photo shoot

- List every photo and video slot: filename, purpose, orientation, resolution, camera position, focal length, tripod,
  lighting, photo or video, and which transition it feeds.
- Shoot in an order that follows the light (exteriors at blue hour, interiors with lights as customers see them, details
  by a window).
- Export to the agreed paths so dropping the files in replaces the stand-ins without code changes.

### Step 6. Build

- Build the engine first (scenes, transitions, hotspots, loader), then each business on top of it. A second and third
  site should mostly be content and photos.
- Keep content separate from code (`content.ts` and `assets.ts` per business) so copy and photos change without touching
  the layout.
- Load the first scene's photos first; load the rest in the background once the visitor is inside.
- Every scene has a real heading, keyboard focus moves to it on arrival, and every hotspot is a real button.

### Step 7. Copy

- Write like the owner talks to a good customer. Short sentences. Specifics over adjectives.
- Every section answers one question the visitor has.
- Buttons say what happens: "Get my estimate," "Book my drop-off," not "Submit" or "Learn more."
- Read it out loud. Cut anything that sounds like an ad.

### Step 8. Test

Test like a stranger would use it, on the devices they'd use.

- **Phones first:** a small iPhone and a mid-range Android. One-handed. Slow connection.
- **Every path:** start to the main action, from every entry point (homepage, direct link, search result).
- **Transitions:** what does the visitor see in the half second between scenes? (We found the restaurant photo flashing
  before the home and automotive experiences because the homepage transition used one fixed image.)
- **Loading:** nothing important should animate while a loader still covers it.
- **Forms:** empty, wrong, and correct input. Errors next to the field, in plain words.
- **Accessibility:** keyboard only, screen reader headings, reduce-motion setting, color contrast.
- **Speed and search:** production build, page titles and descriptions, sitemap, images sized for the screen.

### Step 9. Launch

- Preview link first. The owner clicks through it on their own phone.
- Ship only with the owner's go-ahead.
- Check the live site straight after: every page loads, forms deliver, phone links dial, analytics records a visit.

### Step 10. After launch

- Replace stand-in photos with the real shoot as soon as it's done.
- Look at what people actually tap and where they stop, after a few weeks, and adjust.
- Keep content current: hours, prices, menu, seasonal changes.

---

## Part 3: Applying the idea to other businesses

Starting points only; each one still goes through discovery.

| Business | The real thing | Interface idea | Main action |
| --- | --- | --- | --- |
| Hair salon | The chair and the mirror | Sit in the chair; tap the service you want and see the work | Book a time with a stylist |
| Dentist | A calm treatment room | Walk the visit from waiting room to chair; each step answers a worry | Request an appointment |
| Gym or studio | The room during a class | Step onto the floor; tap a class to see it and its schedule | Book a first class |
| Real estate agent | The homes they sold and listed | Walk the neighborhoods; tap a street to see homes and the area | Book a call or a showing |
| Law firm | The conversation in the office | Sit across the desk; pick the situation you're in | Request a consultation |
| Retail shop | The shelves | Walk the aisles; tap a shelf to see what's on it | Visit, call, or buy |
| Landscaper | The client's yard through the seasons | The yard is the interface; tap the lawn, beds, patio, lighting | Request an estimate |
| Bakery or café | The counter in the morning | Look over the counter; tap what's fresh today | Order ahead or get directions |

---

## Quick checklist

- [ ] Business's job, visitor's job, and main action written down
- [ ] The "real thing" found and turned into a one-sentence interface idea
- [ ] Scene or page map: one start, a few places to explore, one place to act
- [ ] Design tokens: color, type, spacing, motion
- [ ] Shot list with every slot specified; stand-ins labeled and credited
- [ ] Phone layout designed first; main action always one tap away
- [ ] Every animation explains movement; reduce-motion works
- [ ] Nothing invented: no fake reviews, numbers, guarantees, or urgency
- [ ] Every path tested on real phones, including transitions and loading
- [ ] Owner approved the preview before launch
