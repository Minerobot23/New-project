"""Consistent stills / preview / final renders for Blender, run in background mode.

    blender -b scene.blend --python render.py -- --mode stills --frames 1,60,120 --out renders

Output is a PNG sequence in <out>/<mode>/frame_####.png. Existing frames are
skipped, so an interrupted render resumes. Ends with a RENDER_SUMMARY line.
"""
import argparse
import json
import os
import sys
import time

import bpy

DEFAULTS = {
    "stills": {"scale": 50, "samples": 64, "step": 1},
    "preview": {"scale": 50, "samples": 32, "step": 2},
    "final": {"scale": None, "samples": None, "step": 1},
}


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser(prog="render.py")
    p.add_argument("--mode", choices=sorted(DEFAULTS), required=True)
    p.add_argument("--out", default="renders")
    p.add_argument("--frames", help="comma-separated frames (stills mode)")
    p.add_argument("--scale", type=int, help="resolution percentage")
    p.add_argument("--samples", type=int, help="upper limit on render samples")
    p.add_argument("--step", type=int)
    p.add_argument("--start", type=int)
    p.add_argument("--end", type=int)
    return p.parse_args(argv)


def enable_gpu(scene):
    """Switch Cycles to the GPU if one is usable. Returns the device label."""
    addon = bpy.context.preferences.addons.get("cycles")
    if addon is None:
        return "CPU"
    prefs = addon.preferences
    for backend in ("OPTIX", "CUDA", "METAL", "HIP", "ONEAPI"):
        try:
            prefs.compute_device_type = backend
        except TypeError:
            continue
        if hasattr(prefs, "refresh_devices"):
            prefs.refresh_devices()
        else:
            prefs.get_devices()
        gpus = [d for d in prefs.devices if d.type == backend]
        if not gpus:
            continue
        for d in prefs.devices:
            d.use = d.type == backend
        scene.cycles.device = "GPU"
        return f"GPU {backend}: " + ", ".join(d.name for d in gpus)
    scene.cycles.device = "CPU"
    return "CPU"


def cap_samples(scene, limit):
    if limit is None:
        return
    if scene.render.engine == "CYCLES":
        scene.cycles.samples = min(scene.cycles.samples, limit)
    elif hasattr(scene, "eevee") and hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = min(scene.eevee.taa_render_samples, limit)


def main():
    args = parse_args()
    scene = bpy.context.scene
    conf = DEFAULTS[args.mode]

    if scene.camera is None:
        sys.exit("render.py: scene has no active camera")

    scale = args.scale if args.scale is not None else conf["scale"]
    if scale is not None:
        scene.render.resolution_percentage = scale
    cap_samples(scene, args.samples if args.samples is not None else conf["samples"])

    device = enable_gpu(scene) if scene.render.engine == "CYCLES" else "n/a"

    start = args.start if args.start is not None else scene.frame_start
    end = args.end if args.end is not None else scene.frame_end
    step = args.step if args.step is not None else conf["step"]
    if args.mode == "stills":
        if not args.frames:
            sys.exit("render.py: --mode stills needs --frames, e.g. --frames 1,60,120")
        frames = [int(f) for f in args.frames.split(",") if f.strip()]
    else:
        frames = list(range(start, end + 1, max(step, 1)))

    out_dir = os.path.abspath(os.path.join(args.out, args.mode))
    os.makedirs(out_dir, exist_ok=True)
    scene.render.image_settings.file_format = "PNG"

    rendered, skipped = [], []
    t0 = time.time()
    for frame in frames:
        path = os.path.join(out_dir, f"frame_{frame:04d}.png")
        if os.path.exists(path) and os.path.getsize(path) > 0:
            skipped.append(frame)
            continue
        scene.frame_set(frame)
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        if not os.path.exists(path):
            sys.exit(f"render.py: frame {frame} produced no file at {path}")
        rendered.append(frame)
    elapsed = time.time() - t0

    r = scene.render
    summary = {
        "mode": args.mode,
        "engine": r.engine,
        "device": device,
        "resolution": [
            r.resolution_x * r.resolution_percentage // 100,
            r.resolution_y * r.resolution_percentage // 100,
        ],
        "fps": r.fps,
        "rendered": len(rendered),
        "skipped_existing": len(skipped),
        "seconds": round(elapsed, 1),
        "seconds_per_frame": round(elapsed / len(rendered), 2) if rendered else None,
        "out_dir": out_dir,
    }
    print("RENDER_SUMMARY " + json.dumps(summary))


main()
