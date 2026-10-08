// Downloads the CC0 Poly Haven assets used by the film scenes into media/assets/ (git-ignored).
//   node media/fetch_assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(here, 'assets');
const UA = { headers: { 'User-Agent': 'fluxline-film-production/1.0' } };
const api = async (p) => (await fetch('https://api.polyhaven.com' + p, UA)).json();

const HDRIS = ['kloppenheim_02', 'blue_hour_at_pier', 'evening_road_01', 'rooftop_night', 'dikhololo_night'];
const TEXTURES = { floor: ['herringbone_parquet', 'wood_floor_deck', 'laminate_floor_02'], plaster: ['beige_wall_001', 'painted_plaster_wall', 'plastered_wall_04'], brick: ['red_brick_03', 'brick_wall_006', 'red_brick_plaster_patch_02'], pavement: ['concrete_pavement', 'concrete_floor_02', 'cobblestone_floor_08'],
  // Saltbox Home Co. (house exterior)
  siding: ['white_planks_clean', 'weathered_plank_siding'], roof: ['grey_roof_tiles_02', 'roof_slates_02', 'grey_roof_tiles'], lawn: ['leafy_grass', 'grass_ground', 'sparse_grass'], path: ['concrete_pavers_02', 'rectangular_paving', 'stone_pavers'], asphalt: ['asphalt_02', 'clean_asphalt', 'asphalt_01'],
  // Halden Motor Works (workshop)
  shopfloor: ['garage_floor', 'smooth_concrete_floor', 'concrete_floor'], shopwall: ['painted_concrete', 'painted_brick', 'concrete_wall_004'], shutter: ['painted_metal_shutter', 'box_profile_metal_sheet', 'corrugated_iron'] };
const MODELS = ['dining_chair_02', 'round_wooden_table_01', 'WoodenTable_02', 'WoodenChair_01', 'Chandelier_03', 'industrial_wall_sconce', 'potted_plant_02', 'planter_box_01', 'hanging_picture_frame_01', 'hanging_picture_frame_02', 'fancy_picture_frame_01', 'Shelf_01', 'wine_bottles_01', 'ornate_mirror_01', 'brass_candleholders', 'street_lamp_01', 'bar_chair_round_01', 'modern_ceiling_lamp_01',
  // Saltbox Home Co.
  'shrub_01', 'shrub_02', 'shrub_03', 'shrub_04', 'tree_small_02', 'jacaranda_tree', 'fir_tree_01', 'potted_plant_01', 'planter_pot_clay', 'painted_wooden_bench', 'Lantern_01', 'street_lamp_02', 'garden_hose_wall_mounted_01', 'grass_medium_01',
  // Halden Motor Works
  'metal_tool_chest', 'tool_cart', 'steel_frame_shelves_01', 'steel_frame_shelves_02', 'steel_frame_shelves_03', 'old_tyre', 'rusted_wheel_rim_01', 'metal_jerrycan', 'oil_tin', 'mounted_fluorescent_lights', 'hanging_industrial_lamp', 'portable_welding_cart', 'hand_truck', 'metal_stool_01', 'Barrel_01', 'korean_fire_extinguisher_01', 'bench_vice_01', 'metal_office_desk', 'plastic_crate_01', 'industrial_storage_cart', 'security_light', 'power_box_01', 'drill_press_01', 'metal_toolbox', 'WetFloorSign_01', 'overhead_crane', 'covered_car'];

async function save(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const r = await fetch(url, UA);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}
const manifest = [];
const note = (id, type, use) => manifest.push({ id, type, use, license: 'CC0 1.0', source: `https://polyhaven.com/a/${id}` });

const allH = await api('/assets?t=hdris');
const hdri = HDRIS.find((i) => allH[i]);
{
  const f = await api(`/files/${hdri}`);
  await save(f.hdri['2k'].hdr.url, path.join(dest, 'hdri', `${hdri}_2k.hdr`));
  note(hdri, 'hdri', 'sky');
}
const allT = await api('/assets?t=textures');
for (const [slot, ids] of Object.entries(TEXTURES)) {
  const id = ids.find((i) => allT[i]);
  if (!id) { console.log('no texture for', slot); continue; }
  const f = await api(`/files/${id}`);
  for (const [map, key] of [['Diffuse', 'diff'], ['nor_gl', 'nor'], ['Rough', 'rough']]) {
    const e = f[map]?.['2k']?.jpg ?? f[map]?.['2k']?.png;
    if (e) await save(e.url, path.join(dest, 'tex', slot, `${key}${path.extname(new URL(e.url).pathname)}`));
  }
  note(id, 'texture', slot);
}
const allM = await api('/assets?t=models');
for (const id of MODELS) {
  if (!allM[id]) { console.log('skip (missing):', id); continue; }
  const f = await api(`/files/${id}`);
  const b = f.blend?.['1k']?.blend ?? f.blend?.['2k']?.blend;
  if (!b) { console.log('skip (no blend):', id); continue; }
  const dir = path.join(dest, 'models', id);
  await save(b.url, path.join(dir, `${id}.blend`));
  for (const [rel, inc] of Object.entries(b.include ?? {})) await save(inc.url, path.join(dir, rel));
  note(id, 'model', '');
}
fs.writeFileSync(path.join(dest, 'polyhaven-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(manifest.map((m) => `${m.type}:${m.id}`).join(' '));
