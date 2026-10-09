"""Maison Arden arrival film: builds the storefront and dining room and saves an editable .blend.

    blender -b --factory-startup --python media/restaurant-film/build_scene.py -- --variant desktop

One continuous take: the street at dusk, a walk to the open door, through it, and a settle on
the dining room. Exterior and interior are the same model, so the journey is physically continuous.
Furniture, lighting fixtures, plants and surface textures are Poly Haven (CC0); the building
itself is modelled here. Maison Arden is fictional; no signage text is rendered (branding is HTML).

Run `node media/fetch_assets.mjs` first.
"""
import argparse
import math
import os
import random
import sys

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(os.path.dirname(HERE), "assets")
FPS = 24
FRAMES = 336  # 14 s

VARIANTS = {
    "desktop": {
        "res": (1600, 900),
        "lens": 22,
        "keys": {  # frame: (camera, look-at)
            1: ((0.9, -7.6, 1.62), (0.0, 0.0, 1.75)),
            110: ((0.25, -2.2, 1.58), (0.0, 2.5, 1.45)),
            190: ((0.0, 0.9, 1.52), (0.25, 6.0, 1.30)),
            290: ((-0.45, 3.1, 1.46), (0.75, 9.0, 1.28)),
            336: ((-0.5, 3.25, 1.45), (0.78, 9.0, 1.28)),
        },
    },
    "mobile": {
        "res": (720, 1280),
        "lens": 20,
        "keys": {
            1: ((0.3, -8.6, 1.62), (0.0, 0.0, 1.9)),
            110: ((0.1, -2.6, 1.58), (0.0, 2.5, 1.5)),
            190: ((0.0, 0.9, 1.52), (0.1, 6.0, 1.35)),
            290: ((-0.2, 3.0, 1.48), (0.3, 9.0, 1.35)),
            336: ((-0.22, 3.15, 1.47), (0.32, 9.0, 1.35)),
        },
    },
}

PAINT = (0.018, 0.035, 0.030)   # shopfront: deep bottle green
WARM = (1.0, 0.62, 0.30)


def args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--variant", choices=sorted(VARIANTS), default="desktop")
    return p.parse_args(argv)


def bsdf(mat):
    return next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def new_mat(name, color=(0.8, 0.8, 0.8), rough=0.5, metallic=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = bsdf(m)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metallic
    return m


def find(folder, prefix):
    for f in sorted(os.listdir(folder)):
        if f.startswith(prefix):
            return os.path.join(folder, f)
    raise FileNotFoundError(f"{prefix}* not found in {folder}")


def tex_mat(name, slot, scale, tint=None, rough_range=None):
    """Material from a Poly Haven texture set, box-projected in world space so walls tile correctly."""
    m = new_mat(name)
    nt, b = m.node_tree, bsdf(m)
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    folder = os.path.join(ASSETS, "tex", slot)

    def img(prefix, space):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(find(folder, prefix), check_existing=True)
        n.image.colorspace_settings.name = space
        n.projection = "BOX"
        n.projection_blend = 0.2
        nt.links.new(mapping.outputs["Vector"], n.inputs["Vector"])
        return n

    diff = img("diff", "sRGB")
    out = diff.outputs["Color"]
    if tint:
        mix = nt.nodes.new("ShaderNodeMixRGB")
        mix.blend_type = "MULTIPLY"
        mix.inputs["Fac"].default_value = 1.0
        mix.inputs["Color2"].default_value = (*tint, 1)
        nt.links.new(out, mix.inputs["Color1"])
        out = mix.outputs["Color"]
    nt.links.new(out, b.inputs["Base Color"])
    rough = img("rough", "Non-Color")
    if rough_range:
        rr = nt.nodes.new("ShaderNodeMapRange")
        rr.inputs["To Min"].default_value, rr.inputs["To Max"].default_value = rough_range
        nt.links.new(rough.outputs["Color"], rr.inputs["Value"])
        nt.links.new(rr.outputs["Result"], b.inputs["Roughness"])
    else:
        nt.links.new(rough.outputs["Color"], b.inputs["Roughness"])
    nor = img("nor", "Non-Color")
    nmap = nt.nodes.new("ShaderNodeNormalMap")
    nt.links.new(nor.outputs["Color"], nmap.inputs["Color"])
    nt.links.new(nmap.outputs["Normal"], b.inputs["Normal"])
    return m


def box(name, x0, x1, y0, y1, z0, z1, mat, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object
    o.name = name
    o.scale = (abs(x1 - x0), abs(y1 - y0), abs(z1 - z0))
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("Bevel", "BEVEL")
        mod.width, mod.segments = bevel, 2
    o.data.materials.append(mat)
    return o


def append_model(asset_id, names=None):
    path = os.path.join(ASSETS, "models", asset_id, f"{asset_id}.blend")
    with bpy.data.libraries.load(path) as (src, dst):
        dst.objects = [n for n in src.objects if names is None or n in names]
    objs = [o for o in dst.objects if o is not None]
    bpy.ops.object.empty_add(type="PLAIN_AXES")
    root = bpy.context.object
    root.name = asset_id
    for o in objs:
        bpy.context.scene.collection.objects.link(o)
        if o.parent is None:
            o.parent = root
    return root


def place(asset_id, x, y, z=0.0, rot=0.0, scale=1.0, names=None):
    root = append_model(asset_id, names)
    root.location = (x, y, z)
    root.rotation_euler = (0, 0, math.radians(rot))
    root.scale = (scale, scale, scale)
    return root


def point(name, loc, energy, color=WARM, radius=0.05):
    bpy.ops.object.light_add(type="POINT", location=loc)
    l = bpy.context.object
    l.name = name
    l.data.energy, l.data.color, l.data.shadow_soft_size = energy, color, radius
    return l


def emission(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m.node_tree.nodes.clear()
    e = m.node_tree.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    o = m.node_tree.nodes.new("ShaderNodeOutputMaterial")
    m.node_tree.links.new(e.outputs[0], o.inputs[0])
    return m


def build_exterior():
    brick = tex_mat("Brick", "brick", 0.9, tint=(0.62, 0.55, 0.52))
    paving = tex_mat("Pavement", "pavement", 0.55, tint=(0.55, 0.55, 0.58), rough_range=(0.35, 0.8))
    paint = new_mat("ShopfrontPaint", PAINT, rough=0.32)
    bsdf(paint).inputs["Coat Weight"].default_value = 0.3
    glass = new_mat("WindowGlass", (1, 1, 1), 0.0)
    bsdf(glass).inputs["Transmission Weight"].default_value = 1.0
    bsdf(glass).inputs["IOR"].default_value = 1.45
    brass = new_mat("Brass", (0.80, 0.56, 0.24), rough=0.28, metallic=1)

    box("Sidewalk", -14, 14, -11, 0.0, -0.2, 0.0, paving)
    box("Road", -14, 14, -30, -11, -0.32, -0.12, new_mat("Asphalt", (0.03, 0.03, 0.035), 0.55))
    # Brick building around a 7 m shopfront opening.
    box("BrickLeft", -14, -3.5, -0.05, 0.3, 0, 7.5, brick)
    box("BrickRight", 3.5, 14, -0.05, 0.3, 0, 7.5, brick)
    box("BrickAbove", -3.5, 3.5, -0.05, 0.3, 3.35, 7.5, brick)
    # Timber shopfront.
    box("Fascia", -3.5, 3.5, -0.16, 0.2, 2.72, 3.35, paint, 0.01)
    box("Cornice", -3.6, 3.6, -0.26, 0.2, 3.35, 3.45, paint, 0.01)
    for x0, x1 in ((-3.5, -3.28), (3.28, 3.5), (-0.86, -0.58), (0.58, 0.86)):
        box("Pilaster", x0, x1, -0.12, 0.2, 0, 2.72, paint, 0.008)
    for x0, x1 in ((-3.28, -0.86), (0.86, 3.28)):
        box("StallRiser", x0, x1, -0.08, 0.2, 0, 0.62, paint, 0.008)
        box("Sill", x0, x1, -0.14, 0.2, 0.62, 0.68, paint, 0.006)
        box("WindowHead", x0, x1, -0.08, 0.2, 2.56, 2.72, paint, 0.006)
        box("Pane", x0, x1, 0.04, 0.052, 0.68, 2.56, glass)
        mid = (x0 + x1) / 2
        box("Mullion", mid - 0.025, mid + 0.025, 0.0, 0.1, 0.68, 2.56, paint)
    box("Transom", -0.58, 0.58, -0.06, 0.16, 2.22, 2.30, paint, 0.006)
    box("TransomGlass", -0.58, 0.58, 0.04, 0.052, 2.30, 2.72, glass)
    box("Threshold", -0.58, 0.58, -0.1, 0.25, 0.0, 0.02, brass)
    # Door leaf, hinged on the left jamb and standing open into the room.
    bpy.ops.object.empty_add(location=(-0.58, 0.1, 0))
    hinge = bpy.context.object
    hinge.name = "DoorHinge"
    parts = [box("DoorStileL", 0.0, 0.11, -0.022, 0.022, 0.02, 2.2, paint, 0.004),
             box("DoorStileR", 1.03, 1.14, -0.022, 0.022, 0.02, 2.2, paint, 0.004),
             box("DoorRailTop", 0.11, 1.03, -0.022, 0.022, 2.07, 2.2, paint, 0.004),
             box("DoorRailBottom", 0.11, 1.03, -0.022, 0.022, 0.02, 0.36, paint, 0.004),
             box("DoorGlass", 0.11, 1.03, -0.004, 0.004, 0.36, 2.07, glass),
             box("DoorPull", 0.98, 1.0, -0.07, -0.05, 0.95, 1.35, brass, 0.004)]
    for part in parts:
        part.location.x += -0.58
        part.location.y += 0.1
        bpy.context.view_layer.update()
        part.parent = hinge
        part.matrix_parent_inverse = hinge.matrix_world.inverted()
    hinge.rotation_euler = (0, 0, math.radians(96))
    canvas = new_mat("AwningCanvas", (0.56, 0.50, 0.40), rough=0.85)
    awning = box("Awning", -3.55, 3.55, -1.25, -0.16, 2.95, 2.99, canvas)
    awning.rotation_euler = (math.radians(-17), 0, 0)
    box("AwningValance", -3.55, 3.55, -1.27, -1.25, 2.52, 2.72, canvas)
    # Street furniture.
    for x in (-2.07, 2.07):
        place("planter_box_01", x, -0.42, 0.0, 0)
        place("potted_plant_02", x - 0.2, -0.42, 0.36, 20, 0.9, names=["potted_plant_02_leaves"])
        place("potted_plant_02", x + 0.22, -0.42, 0.36, 140, 0.8, names=["potted_plant_02_leaves"])
    for x in (-3.39, 3.39, -0.72, 0.72):
        place("industrial_wall_sconce", x, -0.14, 2.28, 180)
        point("SconceOut", (x, -0.38, 2.2), 26, WARM, 0.04)
    place("street_lamp_01", -5.4, -3.2, 0.0, -90)
    point("StreetLamp", (-5.4, -2.9, 3.6), 260, (1.0, 0.74, 0.46), 0.12)


def build_interior():
    floor = tex_mat("Parquet", "floor", 0.9, tint=(0.42, 0.30, 0.22), rough_range=(0.30, 0.62))
    plaster = tex_mat("Plaster", "plaster", 0.6, tint=(0.80, 0.74, 0.66))
    panel = new_mat("Wainscot", (0.020, 0.040, 0.034), rough=0.38)
    ceiling = new_mat("Ceiling", (0.16, 0.13, 0.10), rough=0.9)
    brass = new_mat("BrassInt", (0.80, 0.56, 0.24), rough=0.3, metallic=1)
    linen = new_mat("Linen", (0.86, 0.82, 0.74), rough=0.9)
    D = 11.0
    box("Floor", -3.5, 3.5, 0.2, D, -0.1, 0.0, floor)
    box("Ceiling", -3.5, 3.5, 0.2, D, 3.35, 3.45, ceiling)
    for side in (-1, 1):
        x0, x1 = (side * 3.5, side * 3.62) if side > 0 else (side * 3.62, side * 3.5)
        box("SideWall", x0, x1, 0.2, D, 0, 3.35, plaster)
        px0, px1 = (side * 3.46, side * 3.5) if side > 0 else (side * 3.5, side * 3.46)
        box("Wainscot", px0, px1, 0.2, D, 0, 1.05, panel)
        box("DadoRail", side * 3.44 if side > 0 else side * 3.5, side * 3.5 if side > 0 else side * 3.44, 0.2, D, 1.05, 1.1, brass)
    box("BackWall", -3.5, 3.5, D, D + 0.12, 0, 3.35, plaster)
    box("BackWainscot", -3.5, 3.5, D - 0.04, D, 0, 1.05, panel)
    # Bar along the back wall.
    box("BarCounter", -2.4, 2.4, D - 1.5, D - 0.95, 0, 1.08, panel, 0.01)
    box("BarTop", -2.5, 2.5, D - 1.56, D - 0.9, 1.08, 1.13, new_mat("BarTopWood", (0.10, 0.045, 0.02), rough=0.25), 0.008)
    timber = new_mat("BackBarTimber", (0.045, 0.022, 0.012), rough=0.3)
    box("BackBarPanel", -2.6, 2.6, D - 0.1, D, 1.13, 2.75, timber)
    glow = emission("ShelfGlow", (1.0, 0.60, 0.26), 6)
    names = ["wine_bottles_01_bordeaux", "wine_bottles_01_burgundy", "wine_bottles_01_champagne", "wine_bottles_01_alsace"]
    for level in (1.45, 1.92, 2.39):
        box("BackBarShelf", -2.5, 2.5, D - 0.34, D - 0.1, level - 0.035, level, timber, 0.004)
        box("ShelfStrip", -2.45, 2.45, D - 0.115, D - 0.105, level + 0.01, level + 0.025, glow)
        for j in range(24):
            if random.random() < 0.18:
                continue
            place("wine_bottles_01", -2.35 + j * 0.2 + random.uniform(-0.02, 0.02), D - 0.23, level, random.uniform(0, 360), names=[names[(j * 7 + int(level * 10)) % 4]])
    for x in (-1.5, 0.0, 1.5):
        place("bar_chair_round_01", x, D - 1.95, 0.0, 15 * x)
        point("BarGlow", (x, D - 0.6, 2.25), 22, WARM, 0.08)
    # Tables: two rows with a clear centre aisle for the camera.
    random.seed(4)
    candle = emission("Flame", (1.0, 0.55, 0.16), 45)
    wax = new_mat("Wax", (0.93, 0.87, 0.74), rough=0.5)
    spots = [(-2.05, 2.3), (-2.05, 4.75), (-2.05, 7.2), (2.05, 2.7), (2.05, 5.15), (2.05, 7.6)]
    for tx, ty in spots:
        place("round_wooden_table_01", tx, ty, 0.0, random.uniform(0, 90), 0.74)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.56, depth=0.012, vertices=64, location=(tx, ty, 0.752))
        bpy.context.object.data.materials.append(linen)
        for k in range(3):
            ang = math.radians(k * 120 + random.uniform(-14, 14) + (90 if tx < 0 else 30))
            cx, cy = tx + 0.78 * math.cos(ang), ty + 0.78 * math.sin(ang)
            place("dining_chair_02", cx, cy, 0.0, math.degrees(ang) + 90 + random.uniform(-10, 10))
            px, py = tx + 0.36 * math.cos(ang), ty + 0.36 * math.sin(ang)
            bpy.ops.mesh.primitive_cylinder_add(radius=0.135, depth=0.012, vertices=48, location=(px, py, 0.766))
            bpy.context.object.data.materials.append(new_mat("Plate", (0.9, 0.9, 0.88), rough=0.15))
        bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.11, vertices=24, location=(tx, ty, 0.815))
        bpy.context.object.data.materials.append(wax)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=16, ring_count=10, location=(tx, ty, 0.888))
        flame = bpy.context.object
        flame.scale = (0.006, 0.006, 0.017)
        flame.data.materials.append(candle)
        flame.visible_shadow = False
        point("Candle", (tx, ty, 0.93), 3.2, (1.0, 0.56, 0.22), 0.02)
    # Walls: sconces, frames, a mirror.
    for side in (-1, 1):
        for y in (1.6, 4.1, 6.6, 9.0):
            place("industrial_wall_sconce", side * 3.44, y, 2.0, 90 if side < 0 else -90)
            point("Sconce", (side * 3.18, y, 1.95), 16, WARM, 0.05)
        for i, y in enumerate((2.85, 5.35, 7.85)):
            frame = ["hanging_picture_frame_01", "hanging_picture_frame_02", "fancy_picture_frame_01"][(i + (side > 0)) % 3]
            place(frame, side * 3.44, y, 1.85, 90 if side < 0 else -90)
    for x, y in ((-3.0, 0.75), (3.0, 0.75), (-3.05, D - 0.5), (3.05, D - 0.5)):
        place("potted_plant_02", x, y, 0.0, random.uniform(0, 360), 1.5)
    for y in (3.6, 7.4):
        place("Chandelier_03", 0.0, y, 3.33, 0)
        point("Chandelier", (0.0, y, 2.45), 70, (1.0, 0.66, 0.34), 0.18)
    # Soft bounce so the room reads as warm rather than as pools of light.
    bpy.ops.object.light_add(type="AREA", location=(0, 5.5, 3.25))
    fill = bpy.context.object
    fill.name = "RoomFill"
    fill.data.shape = "RECTANGLE"
    fill.data.size, fill.data.size_y = 5.5, 9.0
    fill.data.energy, fill.data.color = 55, (1.0, 0.80, 0.60)
    fill.visible_glossy = False
    fill.visible_camera = False


def build_world():
    scene = bpy.context.scene
    world = bpy.data.worlds.new("Dusk")
    scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(find(os.path.join(ASSETS, "hdri"), ""), check_existing=True)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = 0.35
    nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs[0], out.inputs["Surface"])


def build_camera(conf):
    scene = bpy.context.scene
    bpy.ops.object.empty_add(type="PLAIN_AXES")
    target = bpy.context.object
    target.name = "CameraTarget"
    bpy.ops.object.camera_add()
    cam = bpy.context.object
    cam.name = "FilmCamera"
    cam.data.lens = conf["lens"]
    cam.data.clip_start = 0.05
    con = cam.constraints.new("TRACK_TO")
    con.target, con.track_axis, con.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"
    for frame, (loc, tgt) in conf["keys"].items():
        cam.location, target.location = loc, tgt
        cam.keyframe_insert("location", frame=frame)
        target.keyframe_insert("location", frame=frame)
    for owner in (cam, target):
        for fc in owner.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "BEZIER"
                kp.handle_left_type = kp.handle_right_type = "AUTO_CLAMPED"
            fc.update()
    scene.camera = cam


def main():
    a = args()
    conf = VARIANTS[a.variant]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.name = f"MaisonArden_{a.variant}"
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 160
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.03
    scene.cycles.use_denoising = True
    try:
        scene.cycles.denoiser = "OPTIX"
    except TypeError:
        pass
    scene.cycles.max_bounces = 8
    scene.cycles.sample_clamp_indirect = 5
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    scene.render.resolution_x, scene.render.resolution_y = conf["res"]
    scene.render.fps = FPS
    scene.render.use_persistent_data = True
    scene.frame_start, scene.frame_end = 1, FRAMES
    scene.view_settings.view_transform = "AgX"
    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass
    scene.view_settings.exposure = -0.1

    build_world()
    build_exterior()
    build_interior()
    build_camera(conf)

    out = os.path.join(HERE, f"maison-arden-{a.variant}.blend")
    bpy.ops.wm.save_as_mainfile(filepath=out)
    bpy.ops.file.make_paths_relative()
    bpy.ops.wm.save_mainfile()
    print("SCENE_SAVED", out, "objects", len(bpy.data.objects))


main()
