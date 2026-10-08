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
const TEXTURES = { floor: ['herringbone_parquet', 'wood_floor_deck', 'laminate_floor_02'], plaster: ['beige_wall_001', 'painted_plaster_wall', 'plastered_wall_04'], brick: ['red_brick_03', 'brick_wall_006', 'red_brick_plaster_patch_02'], pavement: ['concrete_pavement', 'concrete_floor_02', 'cobblestone_floor_08'] };
const MODELS = ['dining_chair_02', 'round_wooden_table_01', 'WoodenTable_02', 'WoodenChair_01', 'Chandelier_03', 'industrial_wall_sconce', 'potted_plant_02', 'planter_box_01', 'hanging_picture_frame_01', 'hanging_picture_frame_02', 'fancy_picture_frame_01', 'Shelf_01', 'wine_bottles_01', 'ornate_mirror_01', 'brass_candleholders', 'street_lamp_01', 'bar_chair_round_01', 'modern_ceiling_lamp_01'];

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
