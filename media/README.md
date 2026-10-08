# Film production

Working files for the arrival films in the three interactive concepts. **All three films exist,
rendered in Blender from free (CC0) assets and playing in their concepts.** They are
computer-generated and below the photographic benchmark described here.

## The Maison Arden film

| File (under `public/experiences/restaurant/film/`) | What it is |
| :- | :- |
| `arrival-desktop.mp4` | 1600x900, 24 fps, 14 s, H.264, no audio, plays once |
| `arrival-mobile.mp4` | 720x1280 portrait cut with its own camera path, same length |
| `arrival-desktop-poster.jpg`, `arrival-mobile-poster.jpg` | First frame of each cut, shown while the film loads |
| `arrival-end.webp` | Last desktop frame; the dining-room scene uses it as its backdrop so the film hands over without a jump |

Final render and encode, from the repository root (the two renders take about 17 and 11 minutes
on an RTX 4080 SUPER; frames are resumable):

```
blender -b --factory-startup --python media/restaurant-film/build_scene.py -- --variant mobile
blender -b media/restaurant-film/maison-arden-desktop.blend --python media/render.py -- --mode final --out media/restaurant-film/renders
blender -b media/restaurant-film/maison-arden-mobile.blend --python media/render.py -- --mode final --out media/restaurant-film/renders-mobile
ffmpeg -framerate 24 -i media/restaurant-film/renders/final/frame_%04d.png -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an public/experiences/restaurant/film/arrival-desktop.mp4
```

The player is `src/experience/hero-film.tsx` (shared; all three concepts use it).

## The other two films

Same layout under `public/experiences/home/film/` and `public/experiences/automotive/film/`
(12 s each, 288 frames). Scenes: `home-film/build_scene.py` and `auto-film/build_scene.py`, both
built on the shared helpers in `filmkit.py`. Build and render exactly as above, with
`saltbox-<variant>.blend` and `halden-<variant>.blend`. `probe_models.py` prints model sizes.

- **Saltbox Home Co.**: up the street at dusk while the house lights come on; the last frame is
  the house scene's backdrop, so the film hands over with a cut.
- **Halden Motor Works**: from the driver's seat, the roller door lifts and the car rolls into an
  empty bay. There is no car in the film (no usable licensed car model), so it fades to the
  concept's existing photograph of a car on the bay.

## What is here

| Path | Contents | In Git |
| :- | :- | :- |
| `fetch_assets.mjs` | Downloads the Poly Haven (CC0) models, textures and sky used by the scene | yes |
| `render.py` | Stills / preview / final renderer; writes resumable PNG sequences | yes |
| `restaurant-film/build_scene.py` | Builds the Maison Arden storefront and dining room and saves a `.blend` | yes |
| `restaurant-film/preview-motion.mp4` | Low-resolution motion preview, 14 s of camera path at 4 fps, 800x450 | yes |
| `restaurant-film/preview-frames.jpg` | Nine frames from that preview | yes |
| `assets/` | Downloaded Poly Haven files (about 140 MB) | no |
| `restaurant-film/*.blend`, `renders/` | Generated scene and frames | no |

## Reproduce the preview

Requires Blender 4.5 and FFmpeg on PATH. Run from the repository root.

```
node media/fetch_assets.mjs
blender -b --factory-startup --python media/restaurant-film/build_scene.py -- --variant desktop
blender -b media/restaurant-film/maison-arden-desktop.blend --python media/render.py -- --mode stills --frames 1,110,190,300 --out media/restaurant-film/renders
blender -b media/restaurant-film/maison-arden-desktop.blend --python media/render.py -- --mode preview --step 6 --scale 50 --samples 48 --out media/restaurant-film/renders
```

## Reference: what the benchmark film does

The reference site's hero is one continuous 19.2 s take at 1920x1080 and 24 fps (H.264, about
13 MB), muted, played once and held on the last frame, with a separate poster. No cuts were
detected. Shot by shot:

1. Wide of the real storefront in low golden light.
2. Slow push toward the entrance; signage stays readable because it is the real sign.
3. Through the door; reflections in the glass slide past.
4. Drift past the counter into the dining room.
5. Settle on a composed, symmetrical room view.
6. The logo is composited onto the back wall with a spark effect; the film holds.

It is convincing because the frames are photographs of a real place. The movement between them is
consistent with a generative image-to-video model driven by start and end frames. That is an
inference from the footage; the tool used is not known.

## Honest status of each film

| Film | Status | Why |
| :- | :- | :- |
| Maison Arden (restaurant) | Rendered and integrated as an example | The Blender scene gives a real continuous move from street to dining room in one physically consistent building. It reads as clean 3D, not as a photographed place. Below the benchmark. |
| Saltbox Home Co. (home services) | Rendered and integrated | The house is modelled in the script (siding, roof, porch, lit rooms) and dressed with CC0 trees, plants and lamps. Reads as clean 3D. Below the benchmark. |
| Halden Motor Works (automotive) | Rendered and integrated | Shop front, roller door, lift and bay are modelled in the script and dressed with CC0 tools and shelving. No hero car: the only vehicle is the library's car under a cover, parked to one side. Below the benchmark. |

## What would close the gap

No image or video generation model is connected to this environment, and none was used. Options,
none of which were purchased or activated:

- **Generative image and video service** (start/end-frame image-to-video). Closest to how the
  benchmark appears to be made. Needs a paid account and an approved budget; costs vary by
  provider and were not researched.
- **Licensed 3D models** of a house and a car, plus more interior dressing, rendered in Blender.
  Stays fully controllable and consistent frame to frame; needs purchased or otherwise licensed
  assets and more scene work. The look would be high-quality CG rather than photographic.
- **Real footage or photographs** of a real restaurant, house and shop, with permission. This is
  what the benchmark is built on and what `ASSET_CAPTURE_GUIDE.md` already plans for client work.

## Licences

Everything downloaded by `fetch_assets.mjs` is Poly Haven, CC0 1.0; the exact list is written to
`assets/polyhaven-manifest.json`. The building is modelled in the script. No reference-site
footage, imagery, or branding is stored in this repository.
