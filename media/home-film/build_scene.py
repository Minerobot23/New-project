"""Saltbox Home Co. arrival film: builds a two-storey house at dusk and saves an editable .blend.

    blender -b --factory-startup --python media/home-film/build_scene.py -- --variant desktop

One continuous take: from the street, past the tree and along the front path, while the lights
in the house come on room by room, settling on the whole house. The last frame is the backdrop
of the demo's house scene, so roof, siding, windows, kitchen, bathroom and yard are all in frame.
Plants, lamps and surface textures are Poly Haven (CC0); the house is modelled here.
Saltbox Home Co. is fictional.

Run `node media/fetch_assets.mjs` first.
"""
import argparse
import math
import os
import random
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import filmkit as fk  # noqa: E402

FRAMES = 288  # 12 s

VARIANTS = {
    "desktop": {
        "res": (1600, 900),
        "lens": 24,
        "keys": {  # frame: (camera, look-at)
            1: ((11.5, -24.0, 1.25), (2.0, 0.0, 3.6)),
            120: ((6.5, -18.5, 1.45), (1.2, 0.0, 3.5)),
            230: ((2.6, -15.2, 1.6), (1.0, 0.0, 3.4)),
            288: ((2.2, -14.8, 1.62), (1.0, 0.0, 3.4)),
        },
    },
    "mobile": {
        "res": (720, 1280),
        "lens": 22,
        "keys": {
            1: ((7.0, -25.0, 1.25), (0.0, 0.0, 4.4)),
            120: ((3.5, -19.0, 1.45), (0.0, 0.0, 4.2)),
            230: ((0.9, -14.6, 1.6), (0.0, 0.0, 4.1)),
            288: ((0.7, -14.2, 1.62), (0.0, 0.0, 4.1)),
        },
    },
}

# House: front wall on y = 0, facing -y. Main block two storeys, a one-storey wing on the right.
W, DEPTH, WALL_H, RIDGE = 5.2, 8.0, 5.7, 8.3   # half width, depth, eave height, ridge height
WING_X, WING_H = 10.2, 3.0
TRIM = (0.86, 0.85, 0.82)
DOOR = (0.05, 0.09, 0.13)


def args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--variant", choices=sorted(VARIANTS), default="desktop")
    return p.parse_args(argv)


def window(x, z, w, h, mats, grid=(2, 2)):
    """A trimmed window in the front wall (the wall has a hole behind it)."""
    trim, glass = mats
    t = 0.09
    fk.box("WinHead", x - w / 2 - t, x + w / 2 + t, -0.07, 0.06, z + h, z + h + t * 1.4, trim, 0.004)
    fk.box("WinSill", x - w / 2 - t * 1.3, x + w / 2 + t * 1.3, -0.11, 0.06, z - t, z, trim, 0.004)
    for sx in (-1, 1):
        fk.box("WinJamb", x + sx * (w / 2 + t / 2) - t / 2, x + sx * (w / 2 + t / 2) + t / 2, -0.07, 0.06, z, z + h, trim, 0.004)
    fk.box("WinGlass", x - w / 2, x + w / 2, 0.0, 0.008, z, z + h, glass)
    for i in range(1, grid[0]):
        mx = x - w / 2 + w * i / grid[0]
        fk.box("WinBar", mx - 0.015, mx + 0.015, -0.02, 0.02, z, z + h, trim)
    for j in range(1, grid[1]):
        mz = z + h * j / grid[1]
        fk.box("WinBar", x - w / 2, x + w / 2, -0.02, 0.02, mz - 0.015, mz + 0.015, trim)


def wall_with_openings(name, x0, x1, z0, z1, openings, mat, y0=0.0, y1=0.18):
    """A front wall built from boxes around rectangular openings: (x, z, w, h)."""
    cols = sorted(openings, key=lambda o: o[0])
    edge = x0
    for (x, z, w, h) in cols:
        fk.box(name, edge, x - w / 2, y0, y1, z0, z1, mat)
        fk.box(name, x - w / 2, x + w / 2, y0, y1, z0, z, mat)
        fk.box(name, x - w / 2, x + w / 2, y0, y1, z + h, z1, mat)
        edge = x + w / 2
    fk.box(name, edge, x1, y0, y1, z0, z1, mat)


def clapboard(mat, exposure=0.15):
    """Horizontal lap lines: a sawtooth in height bumps the surface every `exposure` metres."""
    nt = mat.node_tree
    b = fk.bsdf(mat)
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(coord.outputs["Object"], sep.inputs["Vector"])
    saw = nt.nodes.new("ShaderNodeMath")
    saw.operation = "FRACT"
    scale = nt.nodes.new("ShaderNodeMath")
    scale.operation = "MULTIPLY"
    scale.inputs[1].default_value = 1 / exposure
    nt.links.new(sep.outputs["Z"], scale.inputs[0])
    nt.links.new(scale.outputs[0], saw.inputs[0])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 1.0
    bump.inputs["Distance"].default_value = 0.02
    nt.links.new(saw.outputs[0], bump.inputs["Height"])
    previous = b.inputs["Normal"].links[0].from_socket if b.inputs["Normal"].links else None
    if previous:
        nt.links.new(previous, bump.inputs["Normal"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])


def build_house():
    siding = fk.tex_mat("Siding", "siding", 0.55, tint=(0.80, 0.82, 0.84), rotate=90)
    clapboard(siding)
    roof = fk.tex_mat("Roof", "roof", 0.35, tint=(0.55, 0.56, 0.6))
    trim = fk.new_mat("Trim", TRIM, rough=0.45)
    glass = fk.glass_mat("WindowGlass")
    plaster = fk.new_mat("InteriorWall", (0.78, 0.72, 0.62), rough=0.9)
    wood = fk.new_mat("InteriorFloor", (0.30, 0.19, 0.11), rough=0.45)
    stone = fk.new_mat("Foundation", (0.30, 0.30, 0.31), rough=0.85)
    door = fk.new_mat("DoorPaint", DOOR, rough=0.3)
    brass = fk.new_mat("Brass", (0.80, 0.56, 0.24), rough=0.3, metallic=1)
    mats = (trim, glass)

    # Openings: (centre x, sill z, width, height).
    ground = [(-3.2, 1.0, 1.9, 1.6), (0.0, 0.3, 1.1, 2.2), (3.2, 1.0, 1.9, 1.6)]
    upper = [(-3.2, 3.75, 1.3, 1.45), (0.0, 3.75, 1.3, 1.45), (3.2, 3.75, 1.3, 1.45)]
    fk.box("Foundation", -W - 0.03, W + 0.03, -0.03, DEPTH, 0.0, 0.3, stone)
    wall_with_openings("FrontLower", -W, W, 0.3, 3.1, ground, siding)
    wall_with_openings("FrontUpper", -W, W, 3.1, WALL_H, upper, siding)
    for sx in (-1, 1):
        x0, x1 = (sx * W - 0.18, sx * W) if sx > 0 else (sx * W, sx * W + 0.18)
        fk.box("SideWall", x0, x1, 0.0, DEPTH, 0.3, WALL_H, siding)
        fk.box("CornerBoard", sx * W - 0.07, sx * W + 0.07, -0.03, 0.1, 0.3, WALL_H, trim)
        # Gable end.
        x = sx * W
        fk.mesh("Gable", [(x, 0, WALL_H), (x, DEPTH, WALL_H), (x, DEPTH / 2, RIDGE)], [(0, 1, 2)], siding)
    fk.box("BackWall", -W, W, DEPTH - 0.18, DEPTH, 0.3, WALL_H, siding)
    fk.box("Frieze", -W - 0.05, W + 0.05, -0.05, 0.05, WALL_H - 0.22, WALL_H, trim)
    fk.box("BeltBoard", -W - 0.04, W + 0.04, -0.035, 0.05, 3.02, 3.16, trim)
    # Roof: two slabs meeting at the ridge, with an overhang.
    over, thick = 0.5, 0.14
    rise, run = RIDGE - WALL_H, DEPTH / 2
    slope = math.atan2(rise, run)
    drop = over * rise / run  # how far the overhang falls below the eave line
    length = math.hypot(run + over, rise + drop) + 0.1
    for sy in (-1, 1):
        slab = fk.box("RoofSlope", -W - 0.45, W + 0.45, -length / 2, length / 2, -thick / 2, thick / 2, roof)
        slab.location = (0, DEPTH / 2 + sy * (run + over) / 2, (RIDGE + WALL_H - drop) / 2 + thick / 2)
        slab.rotation_euler = (-sy * slope, 0, 0)
    fk.box("RidgeCap", -W - 0.47, W + 0.47, DEPTH / 2 - 0.1, DEPTH / 2 + 0.1, RIDGE + 0.04, RIDGE + 0.12, fk.new_mat("RidgeMetal", (0.1, 0.1, 0.11), 0.4, 1))
    fk.box("Fascia", -W - 0.45, W + 0.45, -over - 0.04, -over + 0.02, WALL_H - 0.36, WALL_H - 0.14, trim)
    fk.box("Chimney", 2.3, 3.2, DEPTH / 2 + 0.6, DEPTH / 2 + 1.5, WALL_H, RIDGE + 1.0, fk.tex_mat("ChimneyBrick", "brick", 0.9, tint=(0.6, 0.52, 0.5)))

    for (x, z, w, h) in ground:
        if x != 0.0:
            window(x, z, w, h, mats, grid=(3, 2))
    for (x, z, w, h) in upper:
        window(x, z, w, h, mats)
    # Shutters on the upper windows.
    shutter = fk.new_mat("Shutter", DOOR, rough=0.4)
    for (x, z, w, h) in upper:
        for sx in (-1, 1):
            c = x + sx * (w / 2 + 0.09 + 0.24)
            fk.box("Shutter", c - 0.2, c + 0.2, -0.05, 0.0, z, z + h, shutter, 0.004)

    # Front door with sidelight trim, and a porch.
    fk.box("DoorLeaf", -0.47, 0.47, 0.03, 0.08, 0.3, 2.42, door, 0.006)
    for pz in (0.5, 1.3):
        fk.box("DoorPanel", -0.33, 0.33, 0.015, 0.035, pz, pz + 0.62, door, 0.01)
    fk.box("DoorLite", -0.3, 0.3, 0.02, 0.03, 2.02, 2.3, glass)
    fk.box("DoorKnob", 0.34, 0.39, -0.04, 0.03, 1.28, 1.33, brass, 0.01)
    fk.box("DoorHead", -0.72, 0.72, -0.07, 0.06, 2.5, 2.68, trim, 0.006)
    for sx in (-1, 1):
        fk.box("DoorCasing", sx * 0.63 - 0.08, sx * 0.63 + 0.08, -0.07, 0.06, 0.3, 2.5, trim, 0.006)
    deck = fk.new_mat("PorchDeck", (0.33, 0.31, 0.29), rough=0.6)
    fk.box("Porch", -2.0, 2.0, -1.9, 0.0, 0.0, 0.3, deck, 0.01)
    fk.box("Step", -1.0, 1.0, -2.25, -1.9, 0.0, 0.15, deck, 0.01)
    for sx in (-1, 1):
        fk.box("PorchPost", sx * 1.85 - 0.08, sx * 1.85 + 0.08, -1.82, -1.66, 0.3, 2.78, trim, 0.008)
    fk.box("PorchBeam", -2.05, 2.05, -1.86, -1.62, 2.78, 2.98, trim, 0.008)
    porch_roof = fk.box("PorchRoof", -2.2, 2.2, -1.1, 1.1, -0.05, 0.05, roof)
    porch_roof.location = (0, -0.98, 3.2)
    porch_roof.rotation_euler = (math.radians(12), 0, 0)
    fk.box("PorchCeiling", -2.0, 2.0, -1.8, 0.0, 2.94, 2.98, trim)

    # Wing on the right: one storey, garage door facing the street.
    fk.box("WingFoundation", W, WING_X, 0.8, DEPTH - 0.8, 0.0, 0.15, stone)
    wall_with_openings("WingFront", W, WING_X, 0.15, WING_H, [((W + WING_X) / 2, 0.15, 3.4, 2.25)], siding, y0=0.8, y1=0.98)
    fk.box("WingSide", WING_X - 0.18, WING_X, 0.8, DEPTH - 0.8, 0.15, WING_H, siding)
    fk.box("WingCorner", WING_X - 0.07, WING_X + 0.07, 0.77, 0.9, 0.15, WING_H, trim)
    half = (WING_X - W) / 2 + 0.3
    wing_roof = fk.box("WingRoof", -half, half, -3.6, 3.6, -0.07, 0.07, roof)
    wing_roof.location = ((W + WING_X) / 2 + 0.15, DEPTH / 2 - 0.2, WING_H + 0.72)
    wing_roof.rotation_euler = (math.radians(15), 0, 0)
    fk.box("WingFascia", W, WING_X + 0.4, 0.36, 0.42, WING_H - 0.12, WING_H + 0.08, trim)
    gx = (W + WING_X) / 2
    garage = fk.new_mat("GarageDoor", (0.80, 0.79, 0.76), rough=0.4)
    for row in range(4):
        z = 0.15 + row * 0.5625
        fk.box("GaragePanel", gx - 1.68, gx + 1.68, 0.9, 0.94, z + 0.015, z + 0.55, garage, 0.012)
    for sx in (-1, 1):
        fk.box("GarageCasing", gx + sx * 1.78 - 0.08, gx + sx * 1.78 + 0.08, 0.73, 0.9, 0.15, 2.4, trim, 0.006)
    fk.box("GarageHead", gx - 1.9, gx + 1.9, 0.73, 0.9, 2.4, 2.58, trim, 0.006)

    # Rooms behind the windows, lit one by one.
    fk.box("FloorGround", -W + 0.18, W - 0.18, 0.18, DEPTH - 0.18, 0.2, 0.3, wood)
    fk.box("FloorUpper", -W + 0.18, W - 0.18, 0.18, DEPTH - 0.18, 2.95, 3.1, wood)
    fk.box("CeilingUpper", -W + 0.18, W - 0.18, 0.18, DEPTH - 0.18, WALL_H - 0.05, WALL_H, plaster)
    fk.box("InnerBack", -W + 0.18, W - 0.18, 3.6, 3.7, 0.3, WALL_H, plaster)
    for x in (-1.45, 1.45):
        fk.box("Partition", x - 0.06, x + 0.06, 0.18, 3.6, 0.3, WALL_H, plaster)
    for sx in (-1, 1):
        fk.box("InnerSide", sx * (W - 0.2) - 0.02, sx * (W - 0.2) + 0.02, 0.18, 3.6, 0.3, WALL_H, plaster)
    fk.box("InnerFront", -W + 0.18, W - 0.18, 0.18, 0.2, 0.3, 0.98, plaster)
    # A few things to catch the light inside.
    fk.place("round_wooden_table_01", -3.2, 2.0, 0.3, 20)
    for ang in (30, 150, 270):
        a = math.radians(ang)
        fk.place("dining_chair_02", -3.2 + 0.85 * math.cos(a), 2.0 + 0.85 * math.sin(a), 0.3, ang + 90)
    fk.place("potted_plant_02", 4.2, 1.0, 0.3, 40, 1.4)
    fk.place("potted_plant_01", 2.1, 0.8, 0.3, 0)
    fk.place("hanging_picture_frame_01", 3.2, 3.55, 1.9, 180)
    fk.place("hanging_picture_frame_02", -3.2, 3.55, 4.6, 180)
    fk.place("modern_ceiling_lamp_01", -3.2, 2.0, 2.93, 0)
    fk.place("modern_ceiling_lamp_01", 3.2, 2.0, 2.93, 0)
    curtain = fk.new_mat("Curtain", (0.82, 0.76, 0.66), rough=0.95)
    bsdf = fk.bsdf(curtain)
    bsdf.inputs["Subsurface Weight"].default_value = 0.0
    for (x, z, w, h) in upper:
        for sx in (-1, 1):
            c = x + sx * (w / 2 - 0.12)
            fk.box("Curtain", c - 0.16, c + 0.16, 0.22, 0.25, z - 0.1, z + h + 0.1, curtain)

    # Room lights, switched on in sequence as the camera approaches.
    rooms = [((3.2, 1.9, 2.3), 150, 24), ((-3.2, 1.9, 2.3), 150, 52), ((0.0, 1.9, 2.4), 60, 78),
             ((-3.2, 1.9, 5.0), 95, 100), ((3.2, 1.9, 5.0), 95, 124), ((0.0, 1.9, 5.0), 70, 146)]
    for i, (loc, energy, frame) in enumerate(rooms):
        fk.switch_on(fk.point(f"Room{i}", loc, energy, (1.0, 0.70, 0.40), 0.25), frame)
    # Porch and garage lanterns.
    for x in (-0.95, 0.95):
        fk.place("industrial_wall_sconce", x, -0.02, 2.05, 180)
        fk.switch_on(fk.point("PorchLamp", (x, -0.32, 1.98), 22, fk.WARM, 0.04), 8)
    for x in (gx - 2.15, gx + 2.15):
        fk.place("industrial_wall_sconce", x, 0.78, 2.15, 180)
        fk.switch_on(fk.point("GarageLamp", (x, 0.5, 2.08), 20, fk.WARM, 0.04), 16)


def build_yard():
    random.seed(11)
    lawn = fk.tex_mat("Lawn", "lawn", 0.45, tint=(0.42, 0.62, 0.36))
    paving = fk.tex_mat("Path", "path", 0.6, tint=(0.62, 0.62, 0.64), rough_range=(0.5, 0.9))
    asphalt = fk.tex_mat("Asphalt", "asphalt", 0.3, tint=(0.5, 0.5, 0.52), rough_range=(0.4, 0.75))
    walk = fk.tex_mat("Sidewalk", "pavement", 0.5, tint=(0.6, 0.6, 0.62))
    fk.box("Lawn", -40, 40, -11.0, 30, -0.3, 0.0, lawn)
    fk.box("FrontPath", -0.75, 0.75, -11.0, -2.25, -0.25, 0.025, paving)
    gx = (W + WING_X) / 2
    fk.box("Driveway", gx - 1.9, gx + 1.9, -11.0, 0.9, -0.25, 0.02, fk.tex_mat("Drive", "pavement", 0.35, tint=(0.5, 0.5, 0.52)))
    fk.box("Sidewalk", -40, 40, -13.0, -11.0, -0.3, 0.05, walk)
    fk.box("Kerb", -40, 40, -13.2, -13.0, -0.3, 0.05, fk.new_mat("Kerb", (0.4, 0.4, 0.4), 0.8))
    fk.box("Road", -40, 40, -40, -13.2, -0.4, -0.1, asphalt)

    lod0 = lambda letter: (lambda n: n.endswith(f"_{letter}_LOD0"))
    # Foundation planting along the front of the house.
    beds = [x for x in (-4.9, -4.2, -3.5, -2.8, 2.6, 3.3, 4.0, 4.7)]
    for i, x in enumerate(beds):
        fk.place("shrub_02", x, -0.75 + random.uniform(-0.15, 0.15), 0.0, random.uniform(0, 360), random.uniform(0.75, 1.0), names=lod0("abcd"[i % 4]), center=True)
    for x in (-1.5, 1.5):
        fk.place("planter_box_01", x, -1.3, 0.3, 0, 0.9)
        fk.place("potted_plant_02", x, -1.3, 0.62, random.uniform(0, 360), 0.9, names=["potted_plant_02_leaves"])
    fk.place("painted_wooden_bench", -1.25, -0.4, 0.3, 0)
    # Path lights.
    glow = fk.emission("PathGlow", (1.0, 0.72, 0.42), 30)
    metal = fk.new_mat("PathLightMetal", (0.03, 0.03, 0.03), 0.4, 1)
    for i, y in enumerate((-3.6, -5.6, -7.6, -9.6)):
        for sx in (-1, 1):
            x = sx * 1.05
            fk.box("PathLightStem", x - 0.015, x + 0.015, y - 0.015, y + 0.015, 0.0, 0.42, metal)
            fk.box("PathLightCap", x - 0.07, x + 0.07, y - 0.07, y + 0.07, 0.42, 0.45, metal, 0.01)
            fk.box("PathLightLens", x - 0.03, x + 0.03, y - 0.03, y + 0.03, 0.37, 0.42, glow)
            fk.switch_on(fk.point("PathLight", (x, y, 0.33), 3.0, fk.WARM, 0.03), 4 + i * 5)
    # Trees: one near the street the camera passes, one beside the house.
    tree = lambda n: "LOD1" not in n
    fk.place("tree_small_02", 15.0, -11.0, 0.0, 40, 1.45, names=tree)
    fk.place("tree_small_02", -8.2, -3.0, 0.0, 190, 1.9, names=tree)
    fk.place("tree_small_02", -15.0, 12.0, 0.0, 80, 2.3, names=tree)
    fk.place("tree_small_02", 15.5, 10.0, 0.0, 300, 2.2, names=tree)
    # A line of trees behind the house and two neighbouring houses, so the horizon is not empty.
    for i, x in enumerate((-22, -11, -3, 6, 13, 24)):
        fk.place("tree_small_02", x, 15.0 + (i % 2) * 4, 0.0, i * 67, 2.6 + (i % 3) * 0.4, names=tree)
    dark = fk.new_mat("NeighbourWall", (0.10, 0.11, 0.13), rough=0.9)
    dark_roof = fk.new_mat("NeighbourRoof", (0.03, 0.035, 0.045), rough=0.8)
    lit = fk.emission("NeighbourWindow", (1.0, 0.68, 0.38), 2.5)
    for nx, ny in ((-25.0, 2.0), (27.0, 3.0)):
        fk.box("Neighbour", nx - 5, nx + 5, ny, ny + 8, 0, 5.6, dark)
        fk.mesh("NeighbourRoof", [(nx - 5.5, ny - 0.5, 5.6), (nx + 5.5, ny - 0.5, 5.6), (nx + 5.5, ny + 4, 8.2), (nx - 5.5, ny + 4, 8.2)], [(0, 1, 2, 3)], dark_roof)
        for wx, wz in ((-2.8, 1.2), (2.6, 3.9), (-2.8, 3.9)):
            fk.box("NeighbourWindow", nx + wx - 0.6, nx + wx + 0.6, ny - 0.02, ny, wz, wz + 1.3, lit)
    for x, y in ((12.2, -10.4), (8.8, -10.6), (-6.5, -10.2), (-9.5, -5.0)):
        fk.place("shrub_02", x, y, 0.0, random.uniform(0, 360), 0.9, names=lod0("abcd"[int(abs(x)) % 4]), center=True)
    fk.place("street_lamp_01", -4.5, -12.0, 0.05, -90)
    fk.point("StreetLamp", (-4.5, -11.7, 3.65), 420, (1.0, 0.76, 0.5), 0.12)
    # Uplights washing the facade, as a landscape-lighting job would.
    for x in (-4.6, -1.9, 1.9, 4.6):
        bpy.ops.object.light_add(type="SPOT", location=(x, -1.6, 0.1))
        s = bpy.context.object
        s.name = "Uplight"
        s.data.energy, s.data.color, s.data.spot_size, s.data.spot_blend = 260, (1.0, 0.78, 0.55), math.radians(70), 0.6
        s.rotation_euler = (math.radians(70), 0, 0)
        fk.switch_on(s, 30 + int(abs(x) * 6), 18)


def main():
    a = args()
    conf = VARIANTS[a.variant]
    fk.setup(f"Saltbox_{a.variant}", conf["res"], FRAMES, samples=96, exposure=0.6)
    fk.dusk_sky(0.55)
    build_house()
    build_yard()
    fk.camera(conf["lens"], conf["keys"])
    fk.save(os.path.join(HERE, f"saltbox-{a.variant}.blend"))


main()
