"""Prints the size and object names of each downloaded Poly Haven model (layout aid).

    blender -b --factory-startup --python media/probe_models.py -- shrub_01 covered_car
"""
import os
import sys

import bpy
from mathutils import Vector

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "models")
ids = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sorted(os.listdir(ASSETS))
for asset_id in ids:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    with bpy.data.libraries.load(os.path.join(ASSETS, asset_id, f"{asset_id}.blend")) as (src, dst):
        dst.objects = list(src.objects)
    lo, hi = Vector((1e9,) * 3), Vector((-1e9,) * 3)
    names = []
    for o in dst.objects:
        bpy.context.scene.collection.objects.link(o)
    bpy.context.view_layer.update()
    for o in dst.objects:
        if o.type != "MESH":
            continue
        names.append(o.name)
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w))
            hi = Vector(map(max, hi, w))
    print("PROBE %s x[%.2f %.2f] y[%.2f %.2f] z[%.2f %.2f] %s" % (asset_id, lo.x, hi.x, lo.y, hi.y, lo.z, hi.z, ",".join(names[:8])))
