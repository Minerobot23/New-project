# Asset capture guide: restaurant experience

This is the shot list for turning the **Maison Arden** concept (`/experiences/restaurant`) into a real restaurant's
website. Walk in with the camera, shoot every slot below, export to the listed path, and the experience becomes theirs.

Written for a **Canon EOS Rebel T7** (24 MP APS-C, 6000 × 4000) with the **EF-S 18-55mm f/3.5-5.6 IS II** kit lens.
Focal lengths below are what you set on the lens ring; multiply by 1.6 for the full-frame look (18 mm ≈ 29 mm).

---

## Before the shoot

**Kit:** camera, kit lens, tripod (any stable one; a cheap travel tripod is fine), two charged batteries, a fast SD card,
a lens cloth, gaffer tape, and a grey card or a sheet of white paper for white balance.

**Camera settings for every still (unless the slot says otherwise):**

| Setting | Value | Why |
| --- | --- | --- |
| File type | RAW + JPEG L | RAW recovers windows and dark corners; JPEG for quick review on site |
| Mode | Av (aperture priority) on the tripod | Lets the camera pick slow shutter speeds safely |
| Aperture | f/8 for rooms, f/4.5 to f/5.6 for food and details | Rooms sharp front to back; food with soft background |
| ISO | 100 to 400 on the tripod; up to 1600 handheld | The T7 gets noisy above ~1600 |
| Image stabilizer (lens switch) | **OFF** on the tripod, ON handheld | IS on a tripod can blur the frame |
| Drive | 2-second self-timer on the tripod | Removes the shake from pressing the shutter |
| Exposure bracketing (AEB) | ±2 stops for any frame with windows or bright lamps | Merge later so windows and the room both read |
| White balance | Custom from the grey card, under the room's real light | Keeps warm light warm, not orange |
| Focus | Single-point AF on the main subject; check at 10× in Live View | The kit lens is sharp at f/8 when focus is right |
| Grid | Turn on the Live View grid | Keeps verticals straight; crooked walls look cheap at full screen |

**Light:** shoot the room as guests see it at the hour that sells it (usually early evening: lamps on, a little daylight
left). Turn off any fluorescent or overhead office lights guests never see. No flash anywhere.

**People:** empty rooms, unless the owner wants staff in frame. Anyone recognisable signs a release first.

**Export (after editing):** WebP or AVIF, sRGB, quality ~80, to the exact filename below. Long edge **3840 px** for
full-screen slots, **2560 px** for the rest. Keep each file under ~700 KB. The site makes every smaller size
automatically.

---

## How the slots fit together

```
/public/experiences/restaurant/
  exterior/        street facade, front window
  entrance/        the doorway, and the optional walk-up sequence
  interior/        the main room (the experience's home screen)
  bar/             counter, bottles, a poured drink
  private-dining/  the private room, three framings
  food/            plated dishes, overhead and detail
  menu/            one photograph per menu course
  transitions/     optional video or image sequences for camera moves
  mobile/          optional portrait versions of key scenes
```

After you replace a file, open `src/experiences/restaurant/assets.ts` and update that slot's `alt` (what the photo
shows) and `focus` (where the subject sits, as fractions of width and height). If you replace the main room, re-place
the hotspots in `src/experiences/restaurant/scenes/interior.tsx` the same way: each hotspot's `at` is a fraction of the
photo (`x: 0.81` = 81% across).

Tip: to find fractions, open the photo in any editor that can show a 10% grid (Photopea, Photoshop, Affinity) and read
off where the object sits.

---

## The shot list

Status column: **Placeholder** means the concept currently uses licensed stock for that slot; **Constructed** means the
concept builds it without a photo; **Optional** means the experience works without it.

### 1. `interior/main-room.webp`: the dining room

| | |
| --- | --- |
| Status | Placeholder (most important photo in the experience) |
| Purpose | The home screen of the experience. Visitors land here after walking through the door, drag to look around on phones, and tap hotspots on real objects: the bar, a table, the menu board, the way to private dining, a window. |
| Used in | Scene 04 (interior), the doorway transition, the process section on the Fluxline homepage, the gallery |
| Orientation | Landscape 3:2 (the camera's native shape) |
| Resolution | Full 6000 × 4000; export 3840 long edge |
| Camera position | Standing just inside the front door, where a guest pauses. Lens at chest height (~1.3 m / 4.5 ft), level, pointed at the far wall. Make sure the bar, at least one set table in the foreground, and a window are all in frame. |
| Focal length | 18 mm (widest) |
| Tripod | Yes |
| Lighting | Evening look: all guest-facing lamps on, candles lit, blinds as they are during service. Bracket ±2 and merge so windows don't blow out. |
| Photo / video | Photo. Optional: a 10-second locked-off 1080p clip of the same frame for subtle movement (candle flicker, a server crossing far in the back). |
| Transitions | End frame of the doorway transition (the doorway opens onto exactly this frame), start point of every "travel" into the bar, menu, table, private dining, and window scenes. Keep the composition centred so the doorway reveal lands well. |

### 2. `exterior/street-facade.webp`: the front of the restaurant

| | |
| --- | --- |
| Status | Constructed (the concept builds a dark facade around a lit doorway) |
| Purpose | Scene 01: the street. The visitor sees the building and the door before entering. |
| Orientation | Landscape 3:2, plus a portrait version (see slot 12) |
| Resolution | Full resolution; export 3840 |
| Camera position | Across the street or 6 to 10 m back on the pavement, centred on the front door. Lens at eye height, perfectly level so the facade isn't leaning. The door should sit near the middle of the frame with some street on both sides. |
| Focal length | 24 to 35 mm |
| Tripod | Yes |
| Lighting | Blue hour (15 to 30 minutes after sunset) with the interior lights on, so the windows and door glow. Bracket ±2. |
| Photo / video | Photo |
| Transitions | The walk to the door. After export, measure the doorway rectangle in the photo (left, top, width, height as fractions) and pass it to `EntranceSequence` as `exterior.door`; the camera will push into that exact door. |

### 3. `entrance/doorway.webp`: the open door from the pavement

| | |
| --- | --- |
| Status | Optional (improves the walk-in) |
| Purpose | A closer frame of the open front door, looking into the room, used as the middle beat of the approach. |
| Orientation | Portrait 2:3 (turn the camera) |
| Resolution | Full; export 2560 |
| Camera position | 2 to 3 m from the door, centred on the doorway, the room visible through it. Chest height. |
| Focal length | 24 mm |
| Tripod | Yes |
| Lighting | Same evening light as the facade; door open. |
| Photo / video | Photo |
| Transitions | Doorway mask: the arch/door outline in the entrance sequence is aligned to this frame. |

### 4. `transitions/approach.mp4` (and `approach-poster.webp`): walking to the door

| | |
| --- | --- |
| Status | Optional |
| Purpose | A real "camera walks to the entrance" move to replace the scaling approach. |
| Orientation | Landscape 16:9 (and a portrait crop is made in editing) |
| Resolution | 1920 × 1080, 30 fps (the T7's best video mode). Export H.264, 4 to 6 Mbps, no audio, 4 to 6 seconds. Poster: the first frame as WebP. |
| Camera position | Start at the facade position (slot 2), walk slowly and steadily to the open door, stop on the threshold looking into the room. |
| Focal length | 18 mm (widest is steadiest) |
| Tripod | No: hold the camera with both hands against your chest, elbows in, IS on, walk heel-to-toe. Do 5 to 6 takes and keep the smoothest. |
| Lighting | Blue hour, same as slot 2 |
| Photo / video | Video |
| Transitions | Plays during the approach beat of the entrance, then hands over to the doorway mask. |

### 5. `bar/counter.webp`: the bar

| | |
| --- | --- |
| Status | Placeholder (the concept uses `bar/wine-glass.webp`) |
| Purpose | The bar scene: the camera has walked up to the counter; the drinks list appears beside it. |
| Orientation | Landscape 3:2 |
| Resolution | Full; export 3840 |
| Camera position | Seated-guest height at the bar (~1.1 m), one or two stools back, angled along the counter toward the back bar and bottles. Leave the right third quieter (darker bottles, wall) for text. |
| Focal length | 24 to 35 mm |
| Tripod | Yes |
| Lighting | Back-bar lights on; switch off harsh overheads. Bracket ±1. |
| Photo / video | Photo |
| Transitions | Travel target from the BAR hotspot in the main room. Matching the bar's position in the main room photo makes the move feel continuous. |

### 6. `bar/wine-glass.webp`: a poured drink at the bar

| | |
| --- | --- |
| Status | Placeholder |
| Purpose | Detail frame for the bar and the menu's Wine & Cocktails course. |
| Orientation | Landscape 3:2 |
| Resolution | Full; export 2560 |
| Camera position | Glass on the bar, camera at glass height, 40 to 60 cm away, bar lights behind for glow. Place the glass on the left third. |
| Focal length | 55 mm |
| Tripod | Yes (or brace on the bar) |
| Lighting | Backlight from the bar; a white card camera-left to lift the glass. |
| Photo / video | Photo (optional: 5-second clip of the pour) |
| Transitions | Bar scene background; menu course V. |

### 7. `private-dining/sala.webp`: the private room

| | |
| --- | --- |
| Status | Placeholder |
| Purpose | Private dining scene. The camera re-frames this one photo for each event type (cocktail event, seated dinner, private party), then the enquiry form opens. |
| Orientation | Landscape 3:2 |
| Resolution | Full 6000 × 4000 (the re-framing zooms up to 1.4×, so use every pixel); export 3840 |
| Camera position | From the doorway or a corner, chest height, so you see the set table in the foreground, the windows or a feature wall, and the room's full depth. |
| Focal length | 18 mm |
| Tripod | Yes |
| Lighting | Set for service: table fully laid, candles, flowers. Daylight plus lamps. Bracket ±2. |
| Photo / video | Photo |
| Transitions | Travel target from the PRIVATE DINING hotspot. After export, update the three `focus` points in `EVENT_TYPES` (`src/experiences/restaurant/content.ts`): cocktail = the window/standing area, seated = the set table, party = the whole room. |

### 8. `food/pasta-overhead.webp`: the signature dish from above

| | |
| --- | --- |
| Status | Placeholder |
| Purpose | "Tonight's plate" scene (the plate turns slowly under the camera) and menu course II. |
| Orientation | Landscape 3:2 |
| Resolution | Full; export 3840 |
| Camera position | Directly overhead, camera parallel to the table, ~60 to 80 cm above. Plate on the left third, cutlery and a glass in frame. |
| Focal length | 35 to 45 mm |
| Tripod | Yes, with the centre column angled out, or stand on a sturdy chair and shoot handheld at 1/125 s |
| Lighting | Window light from one side, a white card on the other. No overhead light. |
| Photo / video | Photo |
| Transitions | Travel target from the TONIGHT'S PLATE hotspot; the plate rotates around its centre, so keep the plate fully in frame. |

### 9. `food/table-service.webp`: a dish being served

| | |
| --- | --- |
| Status | Placeholder |
| Purpose | Reservation scene background and menu course III (mains). |
| Orientation | Landscape 3:2 |
| Resolution | Full; export 3840 |
| Camera position | Seated-guest height across the table, the plate arriving in frame (a server's hand is good), glasses and bread around it. Keep the left half calmer for the booking controls. |
| Focal length | 35 to 55 mm |
| Tripod | Optional; handheld at 1/125 s, ISO up to 1600 |
| Lighting | Candles and table lamps; open the aperture to f/4.5 for soft background lights. |
| Photo / video | Photo |
| Transitions | Travel target from the RESERVE hotspot on a set table. |

### 10. `food/pasta-detail.webp`: a close detail

| | |
| --- | --- |
| Status | Placeholder |
| Purpose | Gallery, and texture between scenes. |
| Orientation | Landscape 3:2 or 4:3 |
| Resolution | Export 2560 |
| Camera position | 30 to 45° above the plate, close. |
| Focal length | 55 mm |
| Tripod | Optional |
| Lighting | Side window light |
| Photo / video | Photo |
| Transitions | Gallery strip only |

### 11. `menu/*.webp`: one photograph per course

| File | Course | Status |
| --- | --- | --- |
| `menu/starters.webp` | I. Starters | Placeholder (re-framed `food/table-service`) |
| `menu/pasta.webp` | II. Pasta | Placeholder (`food/pasta-overhead`) |
| `menu/mains.webp` | III. Mains | Placeholder (re-framed `food/table-service`) |
| `menu/dessert.webp` | IV. Dessert | Placeholder (re-framed `private-dining/sala`) |
| `menu/drinks.webp` | V. Wine & Cocktails | Placeholder (re-framed `bar/wine-glass`) |

| | |
| --- | --- |
| Purpose | The menu experience: each course change wipes the next photograph up over the last. |
| Orientation | Portrait 4:5 works best (the photo fills the right half on desktop and the top on phones); landscape also works. |
| Resolution | Export 2560 long edge |
| Camera position | Consistent for all five: same table, same height (~45° above), same distance, so the wipe reads as one sequence. Hero dish centred. |
| Focal length | 45 to 55 mm |
| Tripod | Yes: lock it off and swap the plates, so the set reads as one sequence |
| Lighting | Identical across all five (same window, same card, same time). |
| Photo / video | Photo |
| Transitions | Course-to-course wipe. When a real photo exists, set its zoom in `COURSE_ZOOM` (`scenes/menu.tsx`) back to 1. |

### 12. `exterior/street-window.webp`: the front windows

| | |
| --- | --- |
| Status | Placeholder (re-framed `interior/main-room`) |
| Purpose | "Find us": hours, address, directions, and the call button. |
| Orientation | Landscape 3:2 |
| Resolution | Export 3840 |
| Camera position | Inside, looking out through the front window to the street, or outside showing the signage and entrance. Leave the left half calm for text. |
| Focal length | 24 to 35 mm |
| Tripod | Yes |
| Lighting | Late afternoon; bracket ±2 for the window. |
| Photo / video | Photo |
| Transitions | Travel target from the FIND US hotspot on the main room's window. |

### 13. `mobile/*.webp`: portrait versions (optional)

| File | Of |
| --- | --- |
| `mobile/main-room-portrait.webp` | Slot 1 |
| `mobile/street-facade-portrait.webp` | Slot 2 |

| | |
| --- | --- |
| Purpose | Phones crop landscape photos to a narrow slice. The engine already lets visitors drag to look around, but a dedicated portrait frame composes better for key scenes. |
| Orientation | Portrait 2:3 (camera turned) |
| Resolution | Export 2560 tall |
| Camera position | Same spot and height as the landscape version, turned to portrait, the key subject (bar, door) centred. |
| Focal length | 18 mm |
| Tripod | Yes |
| Lighting | Same session as the landscape version |
| Photo / video | Photo |
| Transitions | Same as the landscape slot |

### 14. `interior/pano.webp`: a wide panorama (optional)

| | |
| --- | --- |
| Status | Optional |
| Purpose | A wider-than-the-eye view of the room for the drag-to-look-around interaction (`InteractivePanorama`). |
| Orientation | Landscape, 3:1 or wider |
| Resolution | Stitched; export 6000 px wide |
| Camera position | Same spot as slot 1. Shoot 5 to 7 overlapping frames (about 30% overlap) rotating the camera on the tripod, then stitch in Lightroom (Photo Merge > Panorama). |
| Focal length | 24 mm, camera in portrait orientation |
| Tripod | Yes, level |
| Lighting | Same as slot 1, manual exposure locked so frames match |
| Photo / video | Photo (stitched) |
| Transitions | Replaces the main room on phones if provided. |

---

## On-site order (about 2 hours)

1. **Golden/blue hour, outside:** facade (2), doorway (3), the walk-in video (4), portrait facade (13).
2. **Room set for service, lights as guests see them:** main room (1) and its portrait (13), pano (14), front window (12).
3. **Private room:** fully laid table (7).
4. **Bar:** counter (5), poured drink (6).
5. **Food, by the window, tripod locked:** five menu courses (11), overhead hero (8), service shot (9), detail (10).

Back home: merge brackets, straighten verticals, match white balance across the set, export to the paths above, update
`assets.ts`, and check every scene on a phone.
