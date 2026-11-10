/**
 * Recolour the flat studio backdrop of product shots, per surf category.
 *
 *   node scripts/recolor-plates.mjs
 *
 * The board shots in /img/product are cut-outs on a flat plate (originally the
 * sand #EEE2D8). This shifts that plate to the category colour below. The
 * plate is found by flood-filling inward from the image edge, so a board's
 * own timber is never touched even when it is close to the backdrop colour.
 * Soft cast shadows (darker shades of the plate) count as plate too. Pixels
 * are scaled by target ÷ current backdrop rather than painted flat, so shadows
 * and the anti-aliased board edge carry over in the new colour.
 *
 * Idempotent: the current backdrop is sampled from the image corners, so
 * re-running after changing a colour recolours from whatever is there now.
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const DIR = new URL('../public/img/product/', import.meta.url);

// Plate colour per group: muted coastal naturals (clay, kelp, water, stone),
// never pastels, so the timber stays the hero. The colour follows how the
// craft rides: Surf splits by its sub-categories, every other board
// discipline gets one colour.
// Accessories (and anything not listed) keep the sand plate.
const SAND = '#EEE2D8';
const COLOURS = {
  // Surf
  Short: '#DBB08F', // rust: fast, loose, punchy
  Mid: '#CBCCB0', // kelp: flow and smooth carving lines
  Long: '#C4C7C4', // storm: glide, trim, noseride
  Finless: '#D8C6A2', // driftwood: primal, raw timber
  // Other disciplines
  Foil: '#D1C8BA', // beach stone: flight, lift, open air
  Kite: '#CEC3CA', // dusk: wind and power
  Skate: '#D6B8A3', // red clay: street, flat days
  'Body & Belly': '#BCCACC', // deep water: closest to the water, in the tube
};

// studioSet() name → group. Both <name>-front and <name>-back are recoloured;
// a missing side is skipped. Wall/lifestyle shots (paipo, handslide,
// …) aren't plates, so they're not listed.
const SETS = {
  fish: 'Short',
  'gun-fish': 'Short',
  'mini-simmons': 'Short',
  'speed-egg': 'Mid',
  mid: 'Mid', // Long Fish
  'big-bonzer-3': 'Mid',
  long: 'Long', // Model T
  'model-p': 'Long',
  'model-l': 'Long',
  alaia: 'Finless',
  'foil-prone': 'Foil',
  'foil-wave': 'Foil',
  'foil-wing': 'Foil',
  cruiser: 'Skate',
  surfskate: 'Skate',
  'surfskate-swallow': 'Skate',
  bodyboard: 'Body & Belly',
  'handslide-pro': 'Body & Belly',
  'kite-tomo': 'Kite',
};

const FLOOD = 28; // max colour distance (sum of channel deltas) to count as plate
const FEATHER = 3; // px of soft edge around the plate
const SHADOW_MIN = 0.55; // darkest shade of the plate still treated as shadow
const SHADOW_TOL = 22; // how far a shadow may drift from a pure shade of the plate

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

async function recolour(file, target) {
  const input = await readFile(file).catch(() => null);
  if (!input) return console.log(`skip  ${file.pathname.split('/').pop()} (missing)`);
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const px = (p) => [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]];

  // current backdrop = median of a few edge samples
  const samples = [
    [4, 4], [W - 5, 4], [4, H - 5], [W - 5, H - 5], [W >> 1, 4], [4, H >> 1], [W - 5, H >> 1],
  ].map(([x, y]) => px(y * W + x));
  const bg = [0, 1, 2].map((c) => samples.map((s) => s[c]).sort((a, b) => a - b)[samples.length >> 1]);
  const delta = target.map((t, c) => t - bg[c]);
  const ratio = target.map((t, c) => t / bg[c]);
  if (delta.every((d) => Math.abs(d) <= 3)) return console.log(`ok    ${file.pathname.split('/').pop()} (already)`);
  const dist = (p) => {
    const [r, g, b] = px(p);
    return Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]);
  };
  // shadow test: a cast shadow is the backdrop scaled darker (same hue), so
  // compare the pixel to bg × its own brightness ratio. Timber is far more
  // saturated than any shade of the plate, so it never passes.
  const bgSum = bg[0] + bg[1] + bg[2];
  const shadowDist = (p) => {
    const [r, g, b] = px(p);
    const k = (r + g + b) / bgSum;
    if (k < SHADOW_MIN || k > 1.05) return Infinity;
    return Math.abs(r - bg[0] * k) + Math.abs(g - bg[1] * k) + Math.abs(b - bg[2] * k);
  };
  const isPlate = (p) => dist(p) <= FLOOD || shadowDist(p) <= SHADOW_TOL;

  // flood-fill the plate from the border
  const plate = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (plate[p] || !isPlate(p)) continue;
    plate[p] = 1;
    const x = p % W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W);
    if (p < (H - 1) * W) stack.push(p + W);
  }

  // weight: 1 on the plate; near it, fade with colour distance so the
  // anti-aliased fringe blends into the new colour instead of keeping a halo
  const weight = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) if (plate[p]) weight[p] = 1;
  for (let pass = 0; pass < FEATHER; pass++) {
    const next = weight.slice();
    for (let p = 0; p < W * H; p++) {
      if (weight[p]) continue;
      const x = p % W;
      const near =
        (x > 0 && weight[p - 1] > 0) ||
        (x < W - 1 && weight[p + 1] > 0) ||
        (p >= W && weight[p - W] > 0) ||
        (p < (H - 1) * W && weight[p + W] > 0);
      if (near) next[p] = Math.max(0, Math.min(1, 1 - (Math.min(dist(p), shadowDist(p)) - FLOOD) / 80)) * (1 - pass / FEATHER);
    }
    weight.set(next);
  }

  const out = Buffer.alloc(W * H * 3);
  for (let p = 0; p < W * H; p++) {
    for (let c = 0; c < 3; c++) {
      // scale rather than shift, so a shadow stays a proportionally darker
      // shade of the new colour instead of a grey patch of the old one
      const v = data[p * 3 + c];
      out[p * 3 + c] = Math.max(0, Math.min(255, Math.round(v + weight[p] * (v * ratio[c] - v))));
    }
  }
  const webp = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 82 }).toBuffer();
  await writeFile(file, webp);
  console.log(`done  ${file.pathname.split('/').pop()} ${bg.join(',')} → ${target.join(',')}`);
}

for (const [name, category] of Object.entries(SETS)) {
  for (const side of ['front', 'back']) {
    await recolour(new URL(`${name}-${side}.webp`, DIR), hex(COLOURS[category]));
  }
}
