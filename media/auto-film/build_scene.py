"""Halden Motor Works arrival film: builds the shop front and service bay and saves an editable .blend.

    blender -b --factory-startup --python media/auto-film/build_scene.py -- --variant desktop

One continuous take from the driver's seat: the street at night, the roller door lifting as the
shop lights come on, under the door, and a stop in the empty bay beside the lift. The bay is
empty on purpose: the visitor's car is the one pulling in. The demo then fades to its own
photograph of a car on the bay.
Tools, shelving, lamps and surface textures are Poly Haven (CC0); the building, door and lift are
modelled here. Halden Motor Works is fictional; no signage text is rendered (branding is HTML).

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
        "lens": 21,
        "keys": {  # frame: (camera, look-at)
            1: ((0.5, -15.5, 1.3), (0.0, 0.0, 1.9)),
            110: ((0.2, -7.0, 1.3), (0.0, 2.0, 1.7)),
            200: ((0.0, 0.6, 1.3), (0.6, 8.0, 1.5)),
            270: ((0.0, 3.3, 1.32), (0.5, 11.0, 1.55)),
            288: ((0.0, 3.5, 1.32), (0.52, 11.0, 1.55)),
        },
    },
    "mobile": {
        "res": (720, 1280),
        "lens": 19,
        "keys": {
            1: ((0.2, -17.0, 1.3), (0.0, 0.0, 2.3)),
            110: ((0.1, -7.6, 1.3), (0.0, 2.0, 1.9)),
            200: ((0.0, 0.6, 1.3), (0.3, 8.0, 1.7)),
            270: ((0.0, 3.2, 1.32), (0.4, 11.0, 1.7)),
            288: ((0.0, 3.4, 1.32), (0.42, 11.0, 1.7)),
        },
    },
}

HALF, DEPTH, HEIGHT = 7.0, 13.0, 4.8          # interior half width, depth, ceiling height
DOOR_HALF, DOOR_H = 2.3, 3.5
RED = (0.85, 0.045, 0.03)
COOL = (0.86, 0.93, 1.0)
DOOR_OPEN = (36, 150)                          # frames over which the roller door lifts


def args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--variant", choices=sorted(VARIANTS), default="desktop")
    return p.parse_args(argv)


def no_widgets(name):
    return not name.startswith("wdg_")


def build_exterior():
    wall = fk.tex_mat("Facade", "brick", 0.9, tint=(0.16, 0.16, 0.18))
    asphalt = fk.tex_mat("Asphalt", "asphalt", 0.3, tint=(0.5, 0.5, 0.52), rough_range=(0.3, 0.7))
    apron = fk.tex_mat("Apron", "pavement", 0.4, tint=(0.5, 0.5, 0.52), rough_range=(0.35, 0.8))
    steel = fk.new_mat("DarkSteel", (0.03, 0.03, 0.035), rough=0.45, metallic=1)
    red = fk.new_mat("RedPaint", RED, rough=0.4)
    neon = fk.emission("RedStrip", (1.0, 0.07, 0.03), 9)
    shutter = fk.tex_mat("Shutter", "shutter", 1.2, tint=(0.55, 0.56, 0.6), rough_range=(0.3, 0.6))

    fk.box("Road", -40, 40, -40, -6.0, -0.3, -0.04, asphalt)
    fk.box("Apron", -40, 40, -6.0, 0.0, -0.3, 0.0, apron)
    # Facade around the door opening, with a taller parapet.
    top = HEIGHT + 1.4
    fk.box("FacadeLeft", -HALF - 0.3, -DOOR_HALF, -0.05, 0.3, 0, top, wall)
    fk.box("FacadeRight", DOOR_HALF, HALF + 0.3, -0.05, 0.3, 0, top, wall)
    fk.box("FacadeAbove", -DOOR_HALF, DOOR_HALF, -0.05, 0.3, DOOR_H, top, wall)
    fk.box("Parapet", -HALF - 0.36, HALF + 0.36, -0.1, 0.36, top, top + 0.12, steel)
    fk.box("SignBand", -HALF - 0.3, HALF + 0.3, -0.08, -0.05, DOOR_H + 0.45, DOOR_H + 1.25, steel)
    fk.box("SignStripe", -HALF - 0.3, HALF + 0.3, -0.085, -0.05, DOOR_H + 0.3, DOOR_H + 0.35, neon)
    fk.area("StripGlow", (0, -0.25, DOOR_H + 0.32), (12.0, 0.1), 160, (1.0, 0.1, 0.05), rot=(60, 0, 0))
    for sx in (-1, 1):
        fk.box("DoorJamb", sx * DOOR_HALF - 0.09, sx * DOOR_HALF + 0.09, -0.1, 0.32, 0, DOOR_H + 0.1, steel, 0.006)
        fk.box("Bollard", sx * (DOOR_HALF + 0.55) - 0.09, sx * (DOOR_HALF + 0.55) + 0.09, -0.75, -0.57, 0, 1.0, red, 0.03)
    fk.box("DoorHeadBox", -DOOR_HALF - 0.1, DOOR_HALF + 0.1, -0.1, 0.34, DOOR_H, DOOR_H + 0.3, steel, 0.006)
    # Roller door: one slatted curtain that rises into the head box.
    curtain = fk.box("RollerDoor", -DOOR_HALF, DOOR_HALF, 0.08, 0.13, 0.0, DOOR_H, shutter)
    for i in range(1, 18):
        z = i * DOOR_H / 18
        slat = fk.box("Slat", -DOOR_HALF, DOOR_HALF, 0.065, 0.08, z - 0.012, z + 0.012, steel)
        slat.parent = curtain
    bar = fk.box("BottomBar", -DOOR_HALF, DOOR_HALF, 0.05, 0.15, 0.0, 0.09, steel)
    bar.parent = curtain
    curtain.keyframe_insert("location", frame=DOOR_OPEN[0])
    curtain.location.z = DOOR_H - 0.12
    curtain.keyframe_insert("location", frame=DOOR_OPEN[1])
    for fc in curtain.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.handle_left_type = kp.handle_right_type = "AUTO_CLAMPED"
    # Side windows of frosted glass block, glowing once the shop lights are on.
    block = fk.new_mat("GlassBlock", (0.75, 0.82, 0.85), rough=0.35)
    fk.bsdf(block).inputs["Transmission Weight"].default_value = 0.9
    for sx in (-1, 1):
        x = sx * 4.7
        fk.box("WindowBlock", x - 1.1, x + 1.1, 0.0, 0.2, 1.5, 2.9, block)
        fk.box("WindowSill", x - 1.2, x + 1.2, -0.1, 0.1, 1.42, 1.5, steel)
    # Exterior lights.
    for x in (-DOOR_HALF - 0.9, DOOR_HALF + 0.9):
        fk.place("industrial_wall_sconce", x, -0.07, 2.9, 180)
        fk.point("DoorLamp", (x, -0.4, 2.8), 110, (1.0, 0.72, 0.45), 0.05)
    fk.place("street_lamp_01", -8.5, -5.4, 0.0, -90)
    fk.point("StreetLamp", (-8.5, -5.1, 3.65), 380, (1.0, 0.76, 0.5), 0.12)
    # Things an alley beside a shop collects.
    fk.place("Barrel_01", 5.9, -0.5, 0.0, 30)
    fk.place("Barrel_01", 6.5, -0.45, 0.0, 200)
    stack = fk.place("old_tyre", -5.6, -0.6, 0.085, 0)
    stack.rotation_euler = (math.radians(90), 0, 0)
    for i in (1, 2):
        t = fk.place("old_tyre", -5.6 + random.uniform(-0.03, 0.03), -0.6, 0.085 + i * 0.17, 0)
        t.rotation_euler = (math.radians(90), 0, math.radians(i * 40))


def lift(x, y, mats):
    """A two-post lift with its arms lowered, in the bay the visitor pulls up beside."""
    red, steel = mats
    for sx in (-1, 1):
        px = x + sx * 1.45
        fk.box("LiftBase", px - 0.3, px + 0.3, y - 0.35, y + 0.35, 0.0, 0.03, steel)
        fk.box("LiftPost", px - 0.12, px + 0.12, y - 0.16, y + 0.16, 0.0, 2.85, red, 0.01)
        fk.box("LiftCarriage", px - sx * 0.02 - 0.15, px - sx * 0.02 + 0.15, y - 0.2, y + 0.2, 0.25, 0.75, steel, 0.01)
        for sy in (-1, 1):
            arm = fk.box("LiftArm", 0.0, 1.05, -0.035, 0.035, -0.03, 0.03, steel, 0.006)
            arm.location = (px - sx * 0.1, y + sy * 0.12, 0.3)
            arm.rotation_euler = (0, 0, math.radians(90 - sx * 90 + sx * sy * -38))
            pad_x = arm.location.x + 1.05 * math.cos(arm.rotation_euler.z)
            pad_y = arm.location.y + 1.05 * math.sin(arm.rotation_euler.z)
            bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.05, vertices=32, location=(pad_x, pad_y, 0.345))
            bpy.context.object.data.materials.append(steel)
    fk.box("LiftCrossbar", x - 1.45, x + 1.45, y - 0.06, y + 0.06, 2.85, 2.97, red, 0.008)


def build_interior():
    random.seed(7)
    floor = fk.tex_mat("ShopFloor", "shopfloor", 0.32, tint=(0.30, 0.31, 0.33), rough_range=(0.08, 0.4))
    wall = fk.tex_mat("ShopWall", "plaster", 0.5, tint=(0.20, 0.21, 0.23))
    dark = fk.new_mat("WallBand", (0.035, 0.037, 0.042), rough=0.5)
    ceiling = fk.new_mat("Ceiling", (0.06, 0.06, 0.065), rough=0.9)
    red = fk.new_mat("RedGloss", RED, rough=0.3)
    steel = fk.new_mat("ShopSteel", (0.05, 0.05, 0.055), rough=0.4, metallic=1)
    bench_top = fk.new_mat("BenchTop", (0.16, 0.10, 0.06), rough=0.5)
    line = fk.new_mat("BayLine", (0.75, 0.6, 0.05), rough=0.5)
    neon = fk.emission("RedLine", (1.0, 0.07, 0.03), 7)

    fk.box("Floor", -HALF, HALF, 0.3, DEPTH, -0.1, 0.0, floor)
    fk.box("Ceiling", -HALF, HALF, 0.3, DEPTH, HEIGHT, HEIGHT + 0.1, ceiling)
    fk.box("BackWall", -HALF, HALF, DEPTH, DEPTH + 0.15, 0, HEIGHT, wall)
    fk.box("BackBand", -HALF, HALF, DEPTH - 0.012, DEPTH, 0, 1.25, dark)
    fk.box("BackStripe", -HALF, HALF, DEPTH - 0.02, DEPTH, 2.9, 2.94, neon)
    for sx in (-1, 1):
        x0, x1 = (sx * HALF, sx * HALF + 0.15) if sx > 0 else (sx * HALF - 0.15, sx * HALF)
        fk.box("SideWall", x0, x1, 0.3, DEPTH, 0, HEIGHT, wall)
        b0, b1 = (sx * HALF - 0.012, sx * HALF) if sx > 0 else (sx * HALF, sx * HALF + 0.012)
        fk.box("SideBand", b0, b1, 0.3, DEPTH, 0, 1.25, dark)
        fk.box("SideStripe", b0, b1, 0.3, DEPTH, 1.25, 1.31, red)
    # Roof steel.
    for y in (2.6, 5.6, 8.6, 11.6):
        fk.box("Beam", -HALF, HALF, y - 0.08, y + 0.08, HEIGHT - 0.32, HEIGHT, steel)
    # Bay markings: the lane the camera drives, and the lift bay to its right.
    for x in (-1.7, 1.7):
        fk.box("BayLine", x - 0.05, x + 0.05, 0.6, 9.2, 0.0, 0.004, line)
    lift(4.6, 8.4, (red, steel))

    # Back wall: workbench run with tools, shelving either side.
    fk.box("Bench", -3.2, 3.2, DEPTH - 0.85, DEPTH - 0.1, 0.84, 0.9, bench_top, 0.006)
    for x in (-3.1, -1.05, 1.05, 3.1):
        fk.box("BenchLeg", x - 0.04, x + 0.04, DEPTH - 0.8, DEPTH - 0.15, 0, 0.84, steel)
    fk.box("Pegboard", -3.2, 3.2, DEPTH - 0.03, DEPTH, 1.45, 2.65, fk.new_mat("Pegboard", (0.03, 0.03, 0.035), rough=0.7))
    fk.place("drill_press_01", -2.6, DEPTH - 0.5, 0.9, 180, names=no_widgets)
    fk.place("bench_vice_01", -1.2, DEPTH - 0.7, 0.97, 180, names=no_widgets)
    fk.place("metal_toolbox", 0.4, DEPTH - 0.5, 0.9, 200, names=no_widgets)
    fk.place("oil_tin", 1.3, DEPTH - 0.45, 0.9, 40)
    fk.place("oil_tin", 1.55, DEPTH - 0.6, 0.9, 150)
    fk.place("metal_jerrycan", 2.5, DEPTH - 0.45, 0.9, 80)
    fk.place("metal_stool_01", -0.3, DEPTH - 1.3, 0.0, 0)
    for x in (-6.2, -5.0):
        fk.place("steel_frame_shelves_01", x, DEPTH - 0.4, 0.0, 0)
    for x in (4.9, 6.1):
        fk.place("steel_frame_shelves_01", x, DEPTH - 0.4, 0.0, 0)
    for x, z in ((-6.2, 0.62), (-5.0, 0.62), (4.9, 0.62), (6.1, 1.15), (-5.0, 1.15)):
        t = fk.place("old_tyre", x, DEPTH - 0.4, z + 0.3, 0)
        t.rotation_euler = (0, 0, math.radians(90))
    # Left side: storage and another customer's car under a cover.
    fk.place("covered_car", -4.4, 5.0, 0.0, 6)
    fk.place("industrial_storage_cart", -6.1, 9.6, 0.0, 90)
    fk.place("Barrel_01", -6.3, 1.4, 0.0, 0)
    fk.place("Barrel_01", -5.65, 1.25, 0.0, 120)
    fk.place("hand_truck", -6.5, 2.4, 0.0, 100)
    # Right side: carts and equipment around the lift.
    fk.place("tool_cart", 6.1, 4.2, 0.0, -80)
    fk.place("tool_cart", 2.2, 9.6, 0.0, 15)
    fk.place("portable_welding_cart", 6.2, 8.9, 0.0, -110)
    fk.place("korean_fire_extinguisher_01", 6.75, 1.2, 0.0, -90)
    fk.place("plastic_crate_01", 6.3, 2.2, 0.0, 10)
    fk.place("plastic_crate_01", 6.32, 2.22, 0.26, 25)
    fk.place("WetFloorSign_01", 5.4, 10.6, 0.0, 30)
    fk.place("power_box_01", HALF - 0.02, 6.0, 1.7, -90, names=no_widgets)
    for i in range(3):
        t = fk.place("old_tyre", 6.2, 11.2, 0.085 + i * 0.17, 0)
        t.rotation_euler = (math.radians(90), 0, math.radians(i * 55))

    # Lighting: rows of fluorescent fittings that come on as the door lifts.
    tube = fk.emission("Tube", COOL, 8)
    order = 0
    for y in (2.6, 5.6, 8.6, 11.6):
        for x in (-4.4, 0.0, 4.4):
            fk.box("Fitting", x - 0.75, x + 0.75, y - 0.09, y + 0.09, HEIGHT - 0.42, HEIGHT - 0.32, steel)
            fk.box("TubeGlow", x - 0.7, x + 0.7, y - 0.06, y + 0.06, HEIGHT - 0.45, HEIGHT - 0.42, tube)
            light = fk.area("ShopLight", (x, y, HEIGHT - 0.5), (1.4, 0.2), 150, COOL)
            fk.switch_on(light, 18 + order * 5, 3)
            order += 1
    # Red wash on the back wall and a warm work lamp over the bench.
    wash = fk.area("RedWash", (0, DEPTH - 0.5, 3.6), (12.0, 0.3), 420, (1.0, 0.08, 0.04), rot=(-20, 0, 0))
    fk.switch_on(wash, 60, 20)
    for x in (-2.0, 2.0):
        fk.place("hanging_industrial_lamp", x, DEPTH - 0.9, HEIGHT - 0.32, 0)
        fk.switch_on(fk.point("BenchLamp", (x, DEPTH - 0.9, HEIGHT - 1.75), 160, (1.0, 0.8, 0.6), 0.1), 70, 6)


def main():
    a = args()
    conf = VARIANTS[a.variant]
    fk.setup(f"Halden_{a.variant}", conf["res"], FRAMES, samples=128, exposure=0.2)
    fk.dusk_sky(0.12, horizon=(0.35, 0.22, 0.25), mid=(0.05, 0.07, 0.16), top=(0.008, 0.012, 0.03))
    build_exterior()
    build_interior()
    fk.camera(conf["lens"], conf["keys"])
    fk.save(os.path.join(HERE, f"halden-{a.variant}.blend"))


main()
