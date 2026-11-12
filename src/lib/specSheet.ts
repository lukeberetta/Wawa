/**
 * Spec sheet plate for the PDP carousel, built at compile time as a single
 * SVG image (1600 × 2000, the slides' 4:5). Being an <img>, it sits in the
 * carousel and opens in the photo viewer (Zoom.astro) exactly like a photo,
 * and stays sharp at any zoom. The font is embedded: an SVG loaded as an image
 * can't reach the page's stylesheets.
 *
 * A technical plate after the workshop order sheet: the board drawn as deck,
 * hull (with its fins or boxes) and side profile, optional length / width /
 * thickness dimension lines, and a short build row underneath.
 *
 * Outlines: the Classic Fish from the shaper's reference drawing; every other
 * board traced from its studio deck photo (src/data/outlines.ts). The side
 * profile is the reference fish profile, scaled to the board.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BoardSheet, FinSetup, Product } from './types';
import { OUTLINES, type Station } from '../data/outlines';

const W = 1600;
const H = 2000;
const PAD = 120;

// tokens.css, mixed as the slide frame mixes them
const INK = '#1a1410';
const MUTED = '#7d7168';
const RULE = '#b8b0a6';
const BG = '#eee7dd'; // --warm 8% into --cream (.slide-media)
const BOARD = '#f8f4ee';

let fontData: string | undefined;
const font = () =>
  (fontData ??= readFileSync(join(process.cwd(), 'public/fonts/PolySans-Neutral.woff2')).toString('base64'));

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── Shapes ── all in plate-independent units: length 1000, nose at y 0,
// x measured out from the centreline.

interface Shape {
  /** closed outline path, nose up */
  path: string;
  /** half-widths [left, right] at y (0–1000) */
  half: (y: number) => [number, number];
  /** y of the widest point */
  widest: number;
  /** widest left and right reach */
  maxL: number;
  maxR: number;
}

const f1 = (n: number) => n.toFixed(1);

function shapeFromStations(st: Station[]): Shape {
  const outer = st.map(([y, l, r]) => ({ y, l, r }));
  const swallow = st.filter((s): s is [number, number, number, number, number] => s.length === 5);
  const right = outer.map((s) => `${f1(s.r)} ${f1(s.y)}`);
  const left = outer.map((s) => `${f1(-s.l)} ${f1(s.y)}`).reverse();
  let tail = '';
  if (swallow.length) {
    // up the right lobe's inner edge to the notch, down the left lobe's
    const notchY = swallow[0][0] - 2;
    const inR = swallow.map((s) => `${f1(s[4])} ${f1(s[0])}`).reverse();
    const inL = swallow.map((s) => `${f1(-s[3])} ${f1(s[0])}`);
    tail = ` L${inR.join(' L')} L0 ${f1(notchY)} L${inL.join(' L')}`;
  }
  const path = `M${right.join(' L')}${tail} L${left.join(' L')} Z`;
  const half = (y: number): [number, number] => {
    const i = Math.max(0, outer.findIndex((s) => s.y >= y) - 1);
    const a = outer[i];
    const b = outer[Math.min(outer.length - 1, i + 1)];
    const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
    return [a.l + (b.l - a.l) * t, a.r + (b.r - a.r) * t];
  };
  const widestS = outer.reduce((m, s) => (s.l + s.r > m.l + m.r ? s : m), outer[0]);
  return {
    path,
    half,
    widest: widestS.y,
    maxL: Math.max(...outer.map((s) => s.l)),
    maxR: Math.max(...outer.map((s) => s.r)),
  };
}

// Classic Fish: the shaper's reference drawing (2000 × 2500 artboard), nose at
// y 294.5, tail tips at 2205.2, centreline x 1012, widest at y 1260.
const REF = { top: 294.5, bottom: 2205.19, centre: 1012 };
const REF_LEN = REF.bottom - REF.top;
const toUnits = (x: number, y: number) => [((x - REF.centre) / REF_LEN) * 1000, ((y - REF.top) / REF_LEN) * 1000];
const FISH_PATH =
  'M1016.53 294.501C1016.53 294.501 797.301 338.501 738.526 978.001C679.751 1617.5 859.519 2205.19 859.519 2205.19C859.519 2205.19 898.934 2183 953.493 2116C1008.05 2049 1011.5 1993.5 1011.5 1993.5C1011.5 1993.5 1015.97 2049 1070.53 2116C1125.09 2183 1164.51 2205.19 1164.51 2205.19C1164.51 2205.19 1344.27 1617.5 1285.5 978.001C1226.72 338.501 1016.53 294.501 1016.53 294.501Z';

const shapes = new Map<string, Shape>();
function shape(key: string): Shape | undefined {
  if (shapes.has(key)) return shapes.get(key);
  const st = OUTLINES[key];
  if (!st) return undefined;
  const traced = shapeFromStations(st);
  let s = traced;
  if (key === 'fish') {
    // drawn outline, traced half-widths (for fins and the width line)
    const path = FISH_PATH.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) =>
      toUnits(Number(x), Number(y)).map(f1).join(' '),
    );
    const half = ((290 / REF_LEN) * 1000);
    s = { ...traced, path, widest: ((1260 - REF.top) / REF_LEN) * 1000, maxL: half, maxR: half };
  }
  shapes.set(key, s);
  return s;
}

// Side profile, from the same reference artboard (deck on the left, bottom on
// the right). Two cubics per edge, kept as numbers so the fin and the
// thickness line can read x at any height.
type Cubic = [number, number][];
const REF_BOTTOM: Cubic[] = [
  [[1343.8, 295.036], [1352.31, 298.592], [1472, 514.528], [1472, 1119.15]],
  [[1472, 1119.15], [1472, 1723.77], [1445.35, 2212.04], [1422.92, 2205.94]],
];
const REF_DECK: Cubic[] = [
  [[1343.8, 295.036], [1335.28, 291.479], [1397.88, 553.143], [1397.88, 1119.15]],
  [[1397.88, 1119.15], [1397.88, 1685.16], [1400.49, 2199.85], [1422.92, 2205.94]],
];
const PROF_LEFT = 1335;
const PROF_RIGHT = 1472;
const PROF_W = ((PROF_RIGHT - PROF_LEFT) / REF_LEN) * 1000; // in units
const cubicAt = (p: Cubic, t: number) => {
  const m = 1 - t;
  return [0, 1].map((k) => m * m * m * p[0][k] + 3 * m * m * t * p[1][k] + 3 * m * t * t * p[2][k] + t * t * t * p[3][k]);
};
// x of a profile edge at artboard height y (each segment runs downward in y)
const edgeX = (segs: Cubic[], y: number) => {
  const seg = segs.find((p) => y <= Math.max(p[0][1], p[3][1])) ?? segs[segs.length - 1];
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (cubicAt(seg, mid)[1] < y) lo = mid;
    else hi = mid;
  }
  return cubicAt(seg, lo)[0];
};

// ── Fins ── hull marks per setup, placed against the local rail: each mark is
// [x as a share of the half-width there (0 = stringer), y from, y to] in
// shares of the length. Keels are long slots; boxes and tracks the same.
type Mark = [number, number, number];
const MARKS: Record<FinSetup, Mark[]> = {
  'Twin keel': [[-0.6, 0.76, 0.85], [0.6, 0.76, 0.85]],
  Twin: [[-0.74, 0.79, 0.86], [0.74, 0.79, 0.86]],
  Single: [[0, 0.82, 0.93]],
  Quad: [[-0.76, 0.78, 0.84], [0.76, 0.78, 0.84], [-0.5, 0.86, 0.91], [0.5, 0.86, 0.91]],
  Thruster: [[-0.74, 0.78, 0.84], [0.74, 0.78, 0.84], [0, 0.87, 0.93]],
  '2+1': [[-0.74, 0.8, 0.84], [0.74, 0.8, 0.84], [0, 0.8, 0.93]],
  'Bonzer 3': [[-0.78, 0.74, 0.88], [0.78, 0.74, 0.88], [0, 0.84, 0.93]],
  'Bonzer 5': [[-0.8, 0.74, 0.81], [0.8, 0.74, 0.81], [-0.7, 0.83, 0.89], [0.7, 0.83, 0.89], [0, 0.86, 0.93]],
  'Five box': [[-0.82, 0.76, 0.82], [0.82, 0.76, 0.82], [-0.62, 0.86, 0.92], [0, 0.86, 0.92], [0.62, 0.86, 0.92]],
  Foil: [[-0.16, 0.62, 0.82], [0.16, 0.62, 0.82]],
  Finless: [],
};
const FIN_LABEL: Record<FinSetup, string> = {
  'Twin keel': 'Twin keels',
  Twin: 'Twin',
  Single: 'Single fin',
  Quad: 'Quad',
  Thruster: 'Thruster',
  '2+1': '2+1',
  'Bonzer 3': 'Bonzer 3',
  'Bonzer 5': 'Bonzer 5',
  'Five box': 'Five fin boxes',
  Foil: 'Foil tracks',
  Finless: 'Finless',
};
// Setups that show a fin in the side view, and how big (base length, inches).
const SIDE_FIN: Partial<Record<FinSetup, number>> = {
  'Twin keel': 4.6,
  Twin: 4.6,
  Single: 7,
  Quad: 4.2,
  Thruster: 4.4,
  '2+1': 7,
  'Bonzer 3': 5.5,
  'Bonzer 5': 5.5,
  'Five box': 4.4,
};
// Board length used for the fin scale when no length is on record.
const NOMINAL: Record<string, number> = { Short: 66, Mid: 84, Long: 110 };

// "5'6\"" → 66, "21\"" → 21, "2½\"" → 2.5. Undefined if it doesn't parse.
function inches(v?: string): number | undefined {
  if (!v) return undefined;
  const frac: Record<string, number> = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
  const m = v.replace(/[′’]/g, "'").replace(/[″”]/g, '"').match(/^\s*(?:(\d+)')?\s*(?:(\d+(?:\.\d+)?)\s*([¼½¾⅛⅜⅝⅞])?)?\s*"?\s*$/);
  if (!m || (!m[1] && !m[2] && !m[3])) return undefined;
  return Number(m[1] ?? 0) * 12 + Number(m[2] ?? 0) + (m[3] ? frac[m[3]] : 0);
}

export function specSheet(product: Product): { src: string; alt: string } | undefined {
  const sheet: BoardSheet | undefined = product.sheet;
  if (!sheet) return undefined;
  const sh = shape(sheet.outline);
  if (!sh) return undefined;
  const spec = (label: string) => product.specs?.flat().find((s) => s.label === label)?.value ?? '';
  const setup = sheet.finSetup;

  const size = [sheet.length, sheet.width, sheet.thickness].filter(Boolean).join(' × ');
  const rows = [
    ['Fins', sheet.fins ?? (setup ? FIN_LABEL[setup] : '')],
    ['Build', spec('Material')],
    ['Finish', spec('Finish')],
  ].filter((r): r is [string, string] => !!r[1]);

  // Views by kind of board: surf, foil and kite get deck, hull and side;
  // body & belly get the deck only (a surfboard side profile would
  // misrepresent them, and their hull is the same outline, unmarked).
  const flat = product.productType === 'Body & Belly';
  const showHull = !flat;
  const showSide = !flat;

  // ── Layout ── length line | deck | hull | side, centred, scaled to fit
  // the band between the header and the grid (and the plate's width).
  const BAND_TOP = 250;
  const BAND_H = 1260;
  const gap = 110;
  const lenGap = sheet.length ? 80 : 0;
  const lengthIn = inches(sheet.length) ?? NOMINAL[product.tags[0]] ?? 66;
  const finIn = setup ? SIDE_FIN[setup] : undefined;
  const boardW = sh.maxL + sh.maxR; // units
  // side view reaches past the bottom by the fin's depth (≈ its base length)
  const sideW = PROF_W + (finIn ? (finIn / lengthIn) * 1000 * 1.05 : 0);
  const unitsW = boardW * (showHull ? 2 : 1) + (showSide ? sideW : 0);
  const gaps = gap * ((showHull ? 1 : 0) + (showSide ? 1 : 0)) + lenGap;
  const k = Math.min(BAND_H / 1000, (W - PAD * 2 - gaps) / unitsW); // px per unit
  const bh = 1000 * k;
  const top = BAND_TOP + (BAND_H - bh) / 2;
  const lenX = (W - (unitsW * k + gaps)) / 2;
  const deckX = lenX + lenGap; // left edge of the deck view
  const deckC = deckX + sh.maxL * k; // its centreline
  const hullX = deckX + boardW * k + gap;
  const hullC = hullX + sh.maxL * k;
  const profX = (showHull ? hullX + boardW * k : deckX + boardW * k) + gap;

  const outline = (c: number, extra = '') => `
    <g transform="translate(${f1(c)} ${f1(top)}) scale(${k.toFixed(4)})">
      <path d="${sh.path}" fill="${BOARD}" stroke="${INK}" stroke-width="${(2.8 / k).toFixed(2)}" stroke-linejoin="round"/>
      ${extra}
    </g>`;

  // hull marks: slim rounded slots, toed in a touch, in units
  const slot = ([xs, f0, fEnd]: Mark) => {
    const y0 = f0 * 1000;
    const y1 = fEnd * 1000;
    const [hl, hr] = sh.half((y0 + y1) / 2);
    const x = xs < 0 ? xs * hl : xs * hr;
    const toe = xs === 0 ? 0 : -Math.sign(xs) * 3;
    const r = 6;
    return `<path d="M${f1(x + toe - r)} ${f1(y0 + r)} A${r} ${r} 0 0 1 ${f1(x + toe + r)} ${f1(y0 + r)} L${f1(x + r)} ${f1(y1 - r)} A${r} ${r} 0 0 1 ${f1(x - r)} ${f1(y1 - r)} Z" fill="${INK}"/>`;
  };
  const hullMarks = setup ? MARKS[setup].map(slot).join('') : '';

  // ── Side profile ── reference profile at the same scale as the outline.
  const toPlateX = (x: number) => profX + ((x - PROF_LEFT) / REF_LEN) * 1000 * k;
  const toPlateY = (y: number) => top + ((y - REF.top) / REF_LEN) * 1000 * k;
  const toRefY = (y: number) => REF.top + ((y - top) / (1000 * k)) * REF_LEN;
  const bottomAt = (y: number) => toPlateX(edgeX(REF_BOTTOM, toRefY(y)));
  const deckAt = (y: number) => toPlateX(edgeX(REF_DECK, toRefY(y)));
  const mapPt = ([x, y]: [number, number]) => `${f1(toPlateX(x))} ${f1(toPlateY(y))}`;
  const segPath = (segs: Cubic[]) => segs.map((p) => `C${p.slice(1).map(mapPt).join(' ')}`).join(' ');
  const reversed = (segs: Cubic[]) => segs.slice().reverse().map((p) => p.slice().reverse() as Cubic);
  const profile = `M${mapPt(REF_BOTTOM[0][0])} ${segPath(REF_BOTTOM)} ${segPath(reversed(REF_DECK))} Z`;

  // Fin seen side-on, built in the bottom's own frame (v along the board from
  // the fin's front, u out from the bottom) so the base sits flush on the
  // rockered curve. Shape traced from a reference fin, in base lengths.
  let sideFin = '';
  if (showSide && finIn && setup) {
    const FB = (finIn / lengthIn) * bh;
    const back = Math.max(...MARKS[setup].map((m) => m[2]));
    const fv0 = back * bh - FB * 1.15; // trailing tip ends near the rearmost box
    const bez = (p: number[][], t: number) => {
      const m = 1 - t;
      const w = [m * m * m, 3 * m * m * t, 3 * m * t * t, t * t * t];
      return [0, 1].map((j) => p.reduce((acc, q, i) => acc + q[j] * w[i], 0));
    };
    const toPlate = ([v, u]: number[]) => {
      const y = top + fv0 + v * FB;
      return `${f1(bottomAt(y) + u * FB)} ${f1(y)}`;
    };
    const FIN_SIDE = [
      [[0, 0], [0.3, 0.5], [0.7, 0.95], [1.39, 1.02]], // leading edge
      [[1.39, 1.02], [1.6, 1.03], [1.56, 0.88], [1.48, 0.86]], // tip
      [[1.48, 0.86], [1.22, 0.78], [1.0, 0.45], [1.0, 0]], // trailing edge
    ];
    const pts: string[] = [];
    FIN_SIDE.forEach((seg, j) => {
      for (let i = j ? 1 : 0; i <= 24; i++) pts.push(toPlate(bez(seg, i / 24)));
    });
    for (let i = 1; i < 12; i++) pts.push(toPlate([1 - i / 12, 0]));
    sideFin = `<path d="M${pts.join(' L')} Z" fill="${INK}"/>`;
  }

  // ── Dimensions ── one rule for all three: a hairline with short end ticks
  // and the value centred in a break in the line; thickness is too short to
  // break, so its value sits just past the line's end. All three values share
  // one line: the width's, at the widest point.
  const TICK = 12;
  const GAP = 22;
  const CAP = 17; // centres the .v cap height on a line
  const labelW = (v: string) => v.length * 27;
  const vDim = (x: number, y0: number, y1: number, v: string, mid: number) => {
    const half = labelW(v) / 2 + GAP;
    return {
      d: `M${x} ${y0} L${x} ${mid - half} M${x} ${mid + half} L${x} ${y1} M${x - TICK} ${y0} L${x + TICK} ${y0} M${x - TICK} ${y1} L${x + TICK} ${y1}`,
      t: `<text x="${x + CAP}" y="${mid}" transform="rotate(-90 ${x + CAP} ${mid})" class="v c">${esc(v)}</text>`,
    };
  };
  const hDim = (y: number, x0: number, x1: number, v: string) => {
    const mid = (x0 + x1) / 2;
    const half = labelW(v) / 2 + GAP;
    return {
      d: `M${x0} ${y} L${mid - half} ${y} M${mid + half} ${y} L${x1} ${y} M${x0} ${y - TICK} L${x0} ${y + TICK} M${x1} ${y - TICK} L${x1} ${y + TICK}`,
      t: `<text x="${mid}" y="${y + CAP}" class="v c">${esc(v)}</text>`,
    };
  };
  const shortDim = (y: number, x0: number, x1: number, v: string) => ({
    d: `M${x0} ${y} L${x1} ${y} M${x0} ${y - TICK} L${x0} ${y + TICK} M${x1} ${y - TICK} L${x1} ${y + TICK}`,
    t: `<text x="${x1 + GAP}" y="${y + CAP}" class="v">${esc(v)}</text>`,
  });
  const wideY = top + sh.widest * k;
  const [wl, wr] = sh.half(sh.widest);
  const marks = [
    sheet.length && vDim(lenX, top, top + bh, sheet.length, wideY),
    sheet.width && hDim(wideY, deckC - wl * k, deckC + wr * k, sheet.width),
    sheet.thickness && showSide && shortDim(wideY, deckAt(wideY), bottomAt(wideY), sheet.thickness),
  ].filter((m): m is { d: string; t: string } => !!m);
  const dims = marks.map((m) => m.d).join(' ');
  const dimText = marks.map((m) => m.t).join('');

  // Two type styles only: .k, a small tracked muted label (header, captions,
  // grid keys), and .v, the ink value (grid values and dimensions).
  const capY = top + bh + 66;
  const ruleY = 1720;
  // columns share the width between however many rows there are (min two)
  const colW = (W - PAD * 2) / Math.max(2, rows.length);
  // A value too long for its column wraps onto further lines, so it never
  // runs into the next column. Widths are
  // estimated per letter shape at the 50px value size.
  const charW = (c: string) =>
    ' ilj.,\''.includes(c) ? 13 : 'ftr'.includes(c) ? 17 : 'mwMW'.includes(c) ? 40 : /[A-Z&]/.test(c) ? 33 : 27;
  const textW = (t: string) => [...t].reduce((a, c) => a + charW(c), 0);
  const maxW = colW - 36;
  const wrap = (v: string): string[] => {
    const lines: string[] = [];
    let line = '';
    for (const word of v.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && textW(next) > maxW) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    return [...lines, line];
  };
  const grid = rows
    .map(([key, v], i) => {
      const x = PAD + colW * i;
      const lines = wrap(v)
        .map((l, j) => `<tspan x="${x}" dy="${j ? 60 : 0}">${esc(l)}</tspan>`)
        .join('');
      return `<text x="${x}" y="${ruleY + 70}" class="k">${esc(key.toUpperCase())}</text>
        <text x="${x}" y="${ruleY + 136}" class="v">${lines}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>
@font-face{font-family:P;src:url(data:font/woff2;base64,${font()}) format('woff2');font-weight:300 400}
text{font-family:P,system-ui,sans-serif;font-weight:300}
.k{font-size:36px;letter-spacing:6px;fill:${MUTED}}
.v{font-size:50px;fill:${INK}}
.c{text-anchor:middle}
</style>
<rect width="${W}" height="${H}" fill="${BG}"/>
<text x="${PAD}" y="${PAD + 32}" class="k">SPEC SHEET</text>
${outline(deckC)}
${showHull ? outline(hullC, hullMarks) : ''}
${showSide ? `<path d="${profile}" fill="${BOARD}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>${sideFin}` : ''}
<path d="${dims}" stroke="${MUTED}" stroke-width="2.2" stroke-linecap="square" fill="none"/>
${dimText}
<text x="${f1(deckC)}" y="${capY}" class="k c">DECK</text>
${showHull ? `<text x="${f1(hullC)}" y="${capY}" class="k c">HULL</text>` : ''}
${showSide ? `<text x="${f1((deckAt(top + bh / 2) + bottomAt(top + bh / 2)) / 2)}" y="${capY}" class="k c">SIDE</text>` : ''}
${rows.length ? `<path d="M${PAD} ${ruleY} L${W - PAD} ${ruleY}" stroke="${RULE}" stroke-width="2.5"/>` : ''}
${grid}
</svg>`;

  const alt = [
    `${product.title} spec sheet: ${['deck', showHull && 'hull', showSide && 'side profile'].filter(Boolean).join(', ')}`,
    size,
    ...rows.map(([key, v]) => `${key.toLowerCase()} ${v}`),
  ]
    .filter(Boolean)
    .join(', ');

  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, alt };
}
