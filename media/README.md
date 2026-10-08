# Film production

Working files for the arrival films in the three interactive concepts. **No film is finished or
integrated yet.** This folder holds the reference analysis, one motion preview, and the scripts that
made it, so the decision about how to produce the films can be made with evidence.

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

A `mobile` variant (720x1280, its own camera path) is defined in the script but has not been rendered.

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
| Maison Arden (restaurant) | Preview only | The Blender scene gives a real continuous move from street to dining room in one physically consistent building. It reads as clean 3D previsualization, not as a photographed place. Below the benchmark. |
| Saltbox Home Co. (home services) | Not started | No licensed house model exists in the CC0 library used here. Modelling a house from primitives would give the crude result the brief rules out. |
| Halden Motor Works (automotive) | Not started | No usable licensed car model is available (the library's only vehicle is a car under a tarp). A believable car is the centre of this film. |

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
