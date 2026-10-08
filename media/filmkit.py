"""Shared helpers for the arrival-film scene scripts (materials, boxes, Poly Haven models, camera).

Imported by the scene scripts next to it:

    sys.path.insert(0, os.path.dirname(HERE)); import filmkit as fk
"""
import math
import os

import bpy

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
WARM = (1.0, 0.62, 0.30)


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


def glass_mat(name="Glass"):
    m = new_mat(name, (1, 1, 1), 0.0)
    bsdf(m).inputs["Transmission Weight"].default_value = 1.0
    bsdf(m).inputs["IOR"].default_value = 1.45
    return m


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


def find(folder, prefix):
    for f in sorted(os.listdir(folder)):
        if f.startswith(prefix):
            return os.path.join(folder, f)
    raise FileNotFoundError(f"{prefix}* not found in {folder}")


def tex_mat(name, slot, scale, tint=None, rough_range=None, rotate=0.0):
    """Material from a Poly Haven texture set, box-projected in object space so walls tile correctly."""
    m = new_mat(name)
    nt, b = m.node_tree, bsdf(m)
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    mapping.inputs["Rotation"].default_value = (0, math.radians(rotate), 0)
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


def mesh(name, verts, faces, mat):
    """A mesh from raw points (roof slopes, gable ends)."""
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    o = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(mat)
    return o


def place(asset_id, x, y, z=0.0, rot=0.0, scale=1.0, names=None, center=False):
    """Append a Poly Haven model. `names` is a list or a predicate; `center` moves each picked
    object to the model origin (for libraries that lay their variants out in a row)."""
    path = os.path.join(ASSETS, "models", asset_id, f"{asset_id}.blend")
    keep = names if callable(names) else (lambda n: names is None or n in names)
    with bpy.data.libraries.load(path) as (src, dst):
        dst.objects = [n for n in src.objects if keep(n)]
    objs = [o for o in dst.objects if o is not None]
    bpy.ops.object.empty_add(type="PLAIN_AXES")
    root = bpy.context.object
    root.name = asset_id
    for o in objs:
        bpy.context.scene.collection.objects.link(o)
        if o.parent is None:
            if center:
                o.location = (0, 0, 0)
            o.parent = root
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


def area(name, loc, size, energy, color=(1, 1, 1), rot=(0, 0, 0), camera=False):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=[math.radians(r) for r in rot])
    l = bpy.context.object
    l.name = name
    l.data.shape = "RECTANGLE"
    l.data.size, l.data.size_y = size
    l.data.energy, l.data.color = energy, color
    l.visible_camera = camera
    return l


def switch_on(light, frame, ramp=10):
    """Keyframe a light from off to its current energy, starting at `frame`."""
    full = light.data.energy
    light.data.energy = 0
    light.data.keyframe_insert("energy", frame=frame)
    light.data.energy = full
    light.data.keyframe_insert("energy", frame=frame + ramp)


def world(strength, rotation=0.0):
    scene = bpy.context.scene
    w = bpy.data.worlds.new("Sky")
    scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Rotation"].default_value = (0, 0, math.radians(rotation))
    nt.links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(find(os.path.join(ASSETS, "hdri"), ""), check_existing=True)
    nt.links.new(mapping.outputs["Vector"], env.inputs["Vector"])
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = strength
    nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs[0], out.inputs["Surface"])


def camera(lens, keys):
    """A camera that tracks an empty; `keys` is {frame: (camera position, look-at position)}."""
    scene = bpy.context.scene
    bpy.ops.object.empty_add(type="PLAIN_AXES")
    target = bpy.context.object
    target.name = "CameraTarget"
    bpy.ops.object.camera_add()
    cam = bpy.context.object
    cam.name = "FilmCamera"
    cam.data.lens = lens
    cam.data.clip_start = 0.05
    con = cam.constraints.new("TRACK_TO")
    con.target, con.track_axis, con.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"
    for frame, (loc, tgt) in keys.items():
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
    return cam


def setup(name, res, frames, fps=24, samples=160, exposure=0.0):
    """Empty scene with the render settings shared by every film."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.name = name
    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
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
    scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.fps = fps
    scene.render.use_persistent_data = True
    scene.frame_start, scene.frame_end = 1, frames
    scene.view_settings.view_transform = "AgX"
    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass
    scene.view_settings.exposure = exposure
    return scene


def save(path):
    bpy.ops.wm.save_as_mainfile(filepath=path)
    bpy.ops.file.make_paths_relative()
    bpy.ops.wm.save_mainfile()
    print("SCENE_SAVED", path, "objects", len(bpy.data.objects))


def dusk_sky(strength=1.0, horizon=(0.95, 0.52, 0.30), mid=(0.16, 0.24, 0.46), top=(0.015, 0.03, 0.09)):
    """Blue hour: a warm band on the horizon rising into deep blue. No sun, no stars."""
    scene = bpy.context.scene
    w = bpy.data.worlds.new("DuskSky")
    scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(coord.outputs["Generated"], sep.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "EASE"
    stops = [(0.0, (0.02, 0.025, 0.04)), (0.48, (0.05, 0.06, 0.09)), (0.505, horizon), (0.58, mid), (1.0, top)]
    els = ramp.color_ramp.elements
    els[0].position, els[0].color = stops[0][0], (*stops[0][1], 1)
    els[1].position, els[1].color = stops[-1][0], (*stops[-1][1], 1)
    for pos, col in stops[1:-1]:
        e = els.new(pos)
        e.color = (*col, 1)
    # Generated z runs -1..1 on the sky sphere; remap to 0..1.
    remap = nt.nodes.new("ShaderNodeMapRange")
    remap.inputs["From Min"].default_value, remap.inputs["From Max"].default_value = -1, 1
    nt.links.new(sep.outputs["Z"], remap.inputs["Value"])
    nt.links.new(remap.outputs["Result"], ramp.inputs["Fac"])
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = strength
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs[0], out.inputs["Surface"])
