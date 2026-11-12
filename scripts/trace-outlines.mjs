/**
 * Trace board outlines for the PDP spec sheets from the studio deck photos
 * (public/img/product/<photo>-front.webp) and write src/data/outlines.ts.
 *
 *   node scripts/trace-outlines.mjs            # trace all, write outlines.ts
 *   node scripts/trace-outlines.mjs --check d  # also write overlay PNGs to d/
 *
 * Per photo: backdrop keyed out (median border colour), largest blob kept and
 * filled, edges measured row by row from a fitted centreline, symmetric boards
 * mirrored, local bumps/dips replaced by a running median. Re-run after
 * replacing a deck photo, then check the plates.
 *
 * Flags per board: 'asym' keeps left and right separate (asymmetric shapes);
 * 'hw<lum>' leaves out dark hardware below that luminance (a strap); 'hw<lum>fit' also fits an egg curve through the middle.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BOARDS = [
  'fish', 'gun-fish', 'mini-simmons', 'bonzer-5', 'speed-egg', 'evo-egg', 'needle-fish:asym', 'mid',
  'big-bonzer-3', 'mote-twin', 'model-p', 'long', 'model-l', 'alaia', 'foil-prone', 'foil-wave',
  'foil-wing', 'kite-tomo', 'handslide-pro:hw45fit', 'bodyboard',
];
const ci = process.argv.indexOf('--check');
const checkDir = ci > 0 ? process.argv[ci + 1] : undefined;
if (checkDir) mkdirSync(checkDir, { recursive: true });
const IMG = (n) => new URL(`../public/img/product/${n}-front.webp`, import.meta.url).pathname;
const SC = 4; // work at 1/4 size: 400 × 500
const traced = [];

for (const spec of BOARDS) {
  const [name, flag] = spec.split(':');
  const { data, info } = await sharp(IMG(name)).resize(1600 / SC, 2000 / SC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => {
    const i = (y * w + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Backdrop colour: median of a border ring.
  const ring = [];
  for (let x = 0; x < w; x += 2) ring.push(px(x, 2), px(x, h - 3));
  for (let y = 0; y < h; y += 2) ring.push(px(2, y), px(w - 3, y));
  const med = [0, 1, 2].map((k) => ring.map((p) => p[k]).sort((a, b) => a - b)[ring.length >> 1]);

  // Distance from the backdrop, with the backdrop's own spread as the noise floor.
  const dist = (p) => Math.hypot(p[0] - med[0], p[1] - med[1], p[2] - med[2]);
  const ringD = ring.map(dist).sort((a, b) => a - b);
  const thr = Math.max(18, ringD[Math.floor(ringD.length * 0.98)] * 1.6);
  const fg = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) fg[y * w + x] = dist(px(x, y)) > thr ? 1 : 0;

  // Largest 4-connected component.
  const lab = new Int32Array(w * h);
  let best = 0, bestN = 0, cur = 0;
  for (let i = 0; i < w * h; i++) {
    if (!fg[i] || lab[i]) continue;
    cur++;
    let n = 0;
    const st = [i];
    lab[i] = cur;
    while (st.length) {
      const j = st.pop();
      n++;
      const x = j % w, y = (j / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const X = x + dx, Y = y + dy;
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        const k = Y * w + X;
        if (fg[k] && !lab[k]) { lab[k] = cur; st.push(k); }
      }
    }
    if (n > bestN) { bestN = n; best = cur; }
  }

  // Backdrop reachable from the border: a gap only counts as a swallow if it
  // is open to this, not a backdrop-coloured stringer or inlay inside the board.
  const outside = new Uint8Array(w * h);
  {
    const st = [];
    for (let x = 0; x < w; x++) st.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) st.push(y * w, y * w + w - 1);
    while (st.length) {
      const j = st.pop();
      if (outside[j] || lab[j] === best) continue;
      outside[j] = 1;
      const x = j % w, y = (j / w) | 0;
      if (x > 0) st.push(j - 1);
      if (x < w - 1) st.push(j + 1);
      if (y > 0) st.push(j - w);
      if (y < h - 1) st.push(j + w);
    }
  }
  // Fill everything that isn't outside: the board as a solid silhouette.
  for (let i = 0; i < w * h; i++) if (!outside[i]) lab[i] = best;

  // ':hw' boards carry dark hardware past the outline (wheels, a strap)
  const hardware = flag?.startsWith('hw');
  const darkLum = hardware ? parseInt(flag.slice(2)) || 60 : 0; // e.g. 'hw45', 'hw45fit'

  // Per row: outer extents, and an inner gap (swallow) if the row splits.
  const rows = [];
  for (let y = 0; y < h; y++) {
    const xs = [];
    // board pixels, minus near-black hardware (skate wheels, a hand strap)
    for (let x = 0; x < w; x++) {
      if (lab[y * w + x] !== best) continue;
      const p = px(x, y);
      if (hardware && 0.3 * p[0] + 0.59 * p[1] + 0.11 * p[2] < darkLum) continue;
      xs.push(x);
    }
    if (xs.length < 2) { rows.push(null); continue; }
    let l = xs[0], r = xs[xs.length - 1];
    if (hardware) {
      // Grow from the run nearest the middle, bridging dark gaps up to 10px
      // (a stripe) but not wider dark bodies (a wheel, a strap): whatever lies
      // past one, like a wheel's anti-aliased rim, isn't deck.
      const runs = [];
      for (const x of xs) {
        const last = runs[runs.length - 1];
        if (last && x === last[1] + 1) last[1] = x;
        else runs.push([x, x]);
      }
      const mid = (l + r) / 2;
      let k = runs.reduce((b, ru, i) => (Math.abs((ru[0] + ru[1]) / 2 - mid) < Math.abs((runs[b][0] + runs[b][1]) / 2 - mid) ? i : b), 0);
      let a = k, b = k;
      // bridge a dark gap if it's narrow (a stripe) or the deck clearly carries on past it (a logo)
      const joins = (gap, next) => gap <= 10 || next[1] - next[0] + 1 >= 12;
      while (a > 0 && joins(runs[a][0] - runs[a - 1][1] - 1, runs[a - 1])) a--;
      while (b < runs.length - 1 && joins(runs[b + 1][0] - runs[b][1] - 1, runs[b + 1])) b++;
      l = runs[a][0];
      r = runs[b][1];
    }
    // largest run of open backdrop between the edges: a swallow
    let gapL = -1, gapR = -1, gl = 0, run = 0;
    for (let x = l + 1; x < r; x++) {
      if (outside[y * w + x]) {
        run++;
        if (run > gl) { gl = run; gapL = x - run; gapR = x + 1; }
      } else run = 0;
    }
    rows.push({ y, l, r, gap: gl >= 3 ? [gapL, gapR] : null });
  }
  const ys = rows.filter(Boolean).map((r) => r.y);
  const y0 = ys[0], y1 = ys[ys.length - 1];
  const len = y1 - y0;

  // Centreline: least-squares line through row mid-points (boards can sit a hair off-plumb).
  const mids = rows.filter(Boolean).map((r) => [r.y, (r.l + r.r) / 2]);
  const mY = mids.reduce((a, m) => a + m[0], 0) / mids.length;
  const mX = mids.reduce((a, m) => a + m[1], 0) / mids.length;
  const sl = mids.reduce((a, m) => a + (m[0] - mY) * (m[1] - mX), 0) / mids.reduce((a, m) => a + (m[0] - mY) ** 2, 0);
  const cx = (y) => mX + sl * (y - mY);

  // Sample N stations along the length (normalised 0..1000), half-widths from the centreline.
  const N = 160;
  const asym = flag === 'asym';
  const st = [];
  for (let i = 0; i <= N; i++) {
    const y = Math.round(y0 + (i / N) * len);
    const r = rows[y] ?? rows[y - 1] ?? rows[y + 1];
    if (!r) continue;
    const c = cx(y);
    let L = c - r.l + 0.5, R = r.r - c + 0.5;
    if (!asym) L = R = (L + R) / 2;
    const gap = r.gap && i > N * 0.6 ? [c - r.gap[0] - 0.5, r.gap[1] - c - 0.5] : null;
    st.push({ f: i / N, L: (L / len) * 1000, R: (R / len) * 1000, gap: gap && (asym ? gap : [(gap[0] + gap[1]) / 2, (gap[0] + gap[1]) / 2]).map((g) => (g / len) * 1000) });
  }

  // Replace local bumps and dips (a strap, skate wheels) with a running
  // median. The window is symmetric and shrinks at the ends, so on a smooth
  // taper the median is the value itself and nose and tail are untouched.
  for (const k of ['L', 'R']) {
    const v = st.map((s) => s[k]);
    for (let i = 0; i < st.length; i++) {
      const hw = Math.min(28, i, st.length - 1 - i);
      const win = v.slice(i - hw, i + hw + 1).sort((a, b) => a - b);
      const m = win[win.length >> 1];
      if (Math.abs(v[i] - m) > m * 0.015) st[i][k] = m;
    }
  }

  // Boards that had hardware cut out get a wider smoothing pass (11-tap,
  // window shrinking at the ends) to settle the rail where it was patched.
  if (hardware) for (const k of ['L', 'R']) {
    const v = st.map((s) => s[k]);
    for (let i = 1; i < st.length - 1; i++) {
      const hw = Math.min(5, i, st.length - 1 - i);
      let sum = 0;
      for (let j = -hw; j <= hw; j++) sum += v[i + j];
      st[i][k] = sum / (2 * hw + 1);
    }
  }

  // ':...fit' — an egg-shaped board with a strap across it: replace the
  // half-widths with a least-squares fit of width² to a quartic in f, which
  // follows an egg outline smoothly through the patched strap rows.
  if (flag?.endsWith('fit')) {
    const D = 4;
    const A = Array.from({ length: D + 1 }, () => new Array(D + 2).fill(0));
    for (const s of st) {
      if (s.f < 0.02 || s.f > 0.98) continue;
      const b = s.R * s.R;
      const ps = Array.from({ length: D + 1 }, (_, i) => s.f ** i);
      for (let i = 0; i <= D; i++) {
        for (let j = 0; j <= D; j++) A[i][j] += ps[i] * ps[j];
        A[i][D + 1] += ps[i] * b;
      }
    }
    for (let c = 0; c <= D; c++) {
      let p = c;
      for (let r = c + 1; r <= D; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]];
      for (let r = 0; r <= D; r++) {
        if (r === c) continue;
        const m = A[r][c] / A[c][c];
        for (let j = c; j <= D + 1; j++) A[r][j] -= m * A[c][j];
      }
    }
    const co = A.map((row, i) => row[D + 1] / row[i]);
    for (const s of st) {
      // measured ends (rounded nose and tail), fitted middle, blended
      // over 0.08–0.2 and 0.8–0.92 so there's no seam
      const edge = Math.min(s.f, 1 - s.f);
      const t = Math.min(1, Math.max(0, (edge - 0.08) / 0.12));
      const w = t * t * (3 - 2 * t);
      const fit = Math.sqrt(Math.max(0, co.reduce((acc, c, i) => acc + c * s.f ** i, 0)));
      s.L = s.R = s.R * (1 - w) + fit * w;
    }
  }

  // Smooth half-widths (3-tap) away from the tips.
  for (const k of ['L', 'R']) {
    const v = st.map((s) => s[k]);
    for (let i = 1; i < st.length - 1; i++) st[i][k] = (v[i - 1] + v[i] * 2 + v[i + 1]) / 4;
  }

  const out = { name, aspect: (Math.max(...st.map((s) => s.L + s.R)) / 1000), stations: st.map((s) => ({ f: +s.f.toFixed(4), L: +s.L.toFixed(2), R: +s.R.toFixed(2), ...(s.gap ? { gap: s.gap.map((g) => +g.toFixed(2)) } : {}) })) };
  traced.push(out);
  if (!checkDir) { console.log(name); continue; }

  // Overlay check: traced outline drawn on the photo.
  const scale = len / 1000 * SC;
  const P = (x, f) => `${((cx(y0 + f * len) * SC) + x * scale).toFixed(1)},${((y0 + f * len) * SC).toFixed(1)}`;
  const right = st.map((s) => P(s.R, s.f));
  const left = st.map((s) => P(-s.L, s.f)).reverse();
  const gapPts = st.filter((s) => s.gap);
  const swallow = gapPts.length ? `<polyline points="${gapPts.map((s) => P(s.gap[1], s.f)).join(' ')}" stroke="#00f" stroke-width="5" fill="none"/><polyline points="${gapPts.map((s) => P(-s.gap[0], s.f)).join(' ')}" stroke="#00f" stroke-width="5" fill="none"/>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000"><polygon points="${[...right, ...left].join(' ')}" fill="none" stroke="#f0f" stroke-width="5"/>${swallow}</svg>`;
  const full = await sharp(IMG(name)).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
  await sharp(full).resize(400, 500).png().toFile(`${checkDir}/${name}-check.png`);
  console.log(name, 'thr', thr.toFixed(1), 'len', len, 'aspect', out.aspect.toFixed(3), 'swallowRows', gapPts.length);
}

// ── Write src/data/outlines.ts ── every other station (81), swallow reads
// under 2 stations dropped as noise.
const r1 = (n) => Math.round(n * 10) / 10;
const entries = traced.sort((a, b) => a.name.localeCompare(b.name)).map((d) => {
  const st = d.stations.filter((_, i) => i % 2 === 0);
  const gaps = st.filter((s) => s.gap).length;
  const rows = st.map((s) => (s.gap && gaps >= 2 ? [r1(s.f * 1000), r1(s.L), r1(s.R), r1(s.gap[0]), r1(s.gap[1])] : [r1(s.f * 1000), r1(s.L), r1(s.R)]));
  return `  '${d.name}': ${JSON.stringify(rows)},`;
});
writeFileSync(
  new URL('../src/data/outlines.ts', import.meta.url),
  `/**
 * Board outlines traced from the studio deck photos by
 * scripts/trace-outlines.mjs. Don't edit by hand: re-run the script.
 *
 * Each board is 81 stations nose → tail: [y, left, right] or, through a
 * swallow, [y, left, right, innerLeft, innerRight]. Units: length = 1000,
 * x measured out from the centreline.
 */
export type Station = [number, number, number] | [number, number, number, number, number];

export const OUTLINES: Record<string, Station[]> = {
${entries.join('\n')}
};
`,
);
console.log(`${entries.length} outlines → src/data/outlines.ts`);
