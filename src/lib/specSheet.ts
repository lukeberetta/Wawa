/**
 * Spec sheet plate for the PDP carousel, built at compile time as a single
 * SVG image (1600 × 2000, the slides' 4:5). Being an <img>, it sits in the
 * carousel and opens in the photo viewer (Zoom.astro) exactly like a photo,
 * and stays sharp at any zoom. The font is embedded: an SVG loaded as an image
 * can't reach the page's stylesheets.
 *
 * Takes the workshop order sheet's one useful idea, deck and hull drawn side
 * by side with the fins on, and sets it as a technical plate: overall size up
 * top, the outline with length and width drawn on, build details underneath.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from './types';

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

// Swallow-tail fish outline, from the shaper's reference drawing (2000 × 2500
// artboard): nose at y 294.5, tail tips at y 2205, centreline x 1012, widest
// (±290) about halfway down. Mapped into a BL-long box, nose up, centred on C.
const REF_PATH =
  'M1016.53 294.501C1016.53 294.501 797.301 338.501 738.526 978.001C679.751 1617.5 859.519 2205.19 859.519 2205.19C859.519 2205.19 898.934 2183 953.493 2116C1008.05 2049 1011.5 1993.5 1011.5 1993.5C1011.5 1993.5 1015.97 2049 1070.53 2116C1125.09 2183 1164.51 2205.19 1164.51 2205.19C1164.51 2205.19 1344.27 1617.5 1285.5 978.001C1226.72 338.501 1016.53 294.501 1016.53 294.501Z';
const REF = { top: 294.5, bottom: 2205.19, centre: 1012, half: 290 };
const BL = 400;
const K = BL / (REF.bottom - REF.top);
const MAXW = REF.half * K; // max half-width
const BW = Math.ceil(MAXW * 2);
const C = BW / 2;
const WIDEST = (1260 - REF.top) / (REF.bottom - REF.top); // where the width line sits
// Every command in the reference is absolute with x,y pairs: map each pair.
const OUTLINE = REF_PATH.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) =>
  `${(C + (Number(x) - REF.centre) * K).toFixed(2)} ${((Number(y) - REF.top) * K).toFixed(2)}`,
);

// Side profile from the same reference artboard (nose up; deck on the left,
// bottom on the right). Each edge is two cubics, kept as numbers so the fin
// and the thickness line can read x at any height.
type Cubic = [number, number][];
const REF_BOTTOM: Cubic[] = [
  [[1343.8, 295.036], [1352.31, 298.592], [1472, 514.528], [1472, 1119.15]],
  [[1472, 1119.15], [1472, 1723.77], [1445.35, 2212.04], [1422.92, 2205.94]],
];
const REF_DECK: Cubic[] = [
  [[1343.8, 295.036], [1335.28, 291.479], [1397.88, 553.143], [1397.88, 1119.15]],
  [[1397.88, 1119.15], [1397.88, 1685.16], [1400.49, 2199.85], [1422.92, 2205.94]],
];
const PROF_LEFT = 1335; // leftmost reach of the profile on the artboard
const PROF_RIGHT = 1472;
const cubicAt = (p: Cubic, t: number) => {
  const m = 1 - t;
  return [0, 1].map((k) => m * m * m * p[0][k] + 3 * m * m * t * p[1][k] + 3 * m * t * t * p[2][k] + t * t * t * p[3][k]);
};
// x of an edge at artboard height y (each segment runs downward in y)
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

// Keels: long low bases set close to the rail, drawn as slim slots (as they
// read from above), toed in slightly towards the nose.
const keel = (side: 1 | -1) => {
  const x = C + side * 0.6 * MAXW;
  const y0 = 0.76 * BL;
  const y1 = 0.85 * BL;
  const toe = -side * 1.2; // front end leans towards the stringer
  const r = 2.4;
  return `M${x + toe - r} ${y0 + r} A${r} ${r} 0 0 1 ${x + toe + r} ${y0 + r} L${x + r} ${y1 - r} A${r} ${r} 0 0 1 ${x - r} ${y1 - r} Z`;
};
const fin = (x: number, y: number, h = 24) =>
  `M${x - 1.4} ${y} L${x + 1.4} ${y} L${x + 1.4} ${y + h} L${x - 1.4} ${y + h} Z`;
const FINS: Record<string, string[]> = {
  Twin: [keel(-1), keel(1)],
  Single: [fin(C, 0.8 * BL, 40)],
  Quad: [fin(C - 40, 0.74 * BL), fin(C + 40, 0.74 * BL), fin(C - 28, 0.82 * BL), fin(C + 28, 0.82 * BL)],
  Thruster: [fin(C - 40, 0.74 * BL), fin(C + 40, 0.74 * BL), fin(C, 0.84 * BL)],
};

// "5'6\"" → 66, "21\"" → 21, "2½\"" → 2.5. Undefined if it doesn't parse.
function inches(v?: string): number | undefined {
  if (!v) return undefined;
  const frac: Record<string, number> = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
  const m = v.replace(/[′’]/g, "'").replace(/[″”]/g, '"').match(/^\s*(?:(\d+)')?\s*(?:(\d+(?:\.\d+)?)\s*([¼½¾⅛⅜⅝⅞])?)?\s*"?\s*$/);
  if (!m || (!m[1] && !m[2] && !m[3])) return undefined;
  return Number(m[1] ?? 0) * 12 + Number(m[2] ?? 0) + (m[3] ? frac[m[3]] : 0);
}

export function specSheet(product: Product): { src: string; alt: string } | undefined {
  const sheet = product.sheet;
  if (!sheet) return undefined;
  const spec = (label: string) => product.specs?.flat().find((s) => s.label === label)?.value ?? '';

  const size = [sheet.length, sheet.width, sheet.thickness].filter(Boolean).join(' × ');
  // Size is drawn on the boards; the grid keeps the build, one row.
  const rows = [
    ['Fins', sheet.fins ?? sheet.finSetup],
    ['Build', spec('Material')],
    ['Finish', spec('Finish')],
  ].filter((r): r is [string, string] => !!r[1]);

  // ── Layout ── length line | deck | hull | side profile, centred.
  const S = 3.15;
  const bw = BW * S;
  const bh = BL * S;
  const top = 250;
  const gap = 110;
  const lenGap = sheet.length ? 80 : 0; // room for the length line, when there is one

  // Fin sizes in inches, on the same scale as the length.
  const inch = bh / (inches(sheet.length) ?? 66);
  const KEEL_DEPTH = 4.8 * inch; // fin depth, for the layout width
  const profW = (PROF_RIGHT - PROF_LEFT) * K * S + KEEL_DEPTH;

  const total = lenGap + bw + gap + bw + gap + profW;
  const lenX = (W - total) / 2;
  const deckX = lenX + lenGap;
  const hullX = deckX + bw + gap;
  const profX = hullX + bw + gap;
  const stroke = 0.9; // in outline units → ~2.8 on the plate

  const board = (x: number, extra = '') => `
    <g transform="translate(${x} ${top}) scale(${S})">
      <path d="${OUTLINE}" fill="${BOARD}" stroke="${INK}" stroke-width="${stroke}" stroke-linejoin="round"/>
      ${extra}
    </g>`;
  const fins = (FINS[sheet.finSetup] ?? []).map((d) => `<path d="${d}" fill="${INK}"/>`).join('');

  // Profile: the reference drawing, mapped to the plate at the same scale as
  // the deck and hull so its length and thickness line up with them.
  const toPlateX = (x: number) => profX + (x - PROF_LEFT) * K * S;
  const toRefY = (y: number) => REF.top + (y - top) / (K * S);
  const bottomAt = (y: number) => toPlateX(edgeX(REF_BOTTOM, toRefY(y)));
  const deckAt = (y: number) => toPlateX(edgeX(REF_DECK, toRefY(y)));
  const mapPt = ([x, y]: [number, number]) => `${toPlateX(x).toFixed(1)} ${(top + (y - REF.top) * K * S).toFixed(1)}`;
  const segPath = (segs: Cubic[]) => segs.map((p) => `C${p.slice(1).map(mapPt).join(' ')}`).join(' ');
  const reversed = (segs: Cubic[]) => segs.slice().reverse().map((p) => p.slice().reverse() as Cubic);
  const profile = `M${mapPt(REF_BOTTOM[0][0])} ${segPath(REF_BOTTOM)} ${segPath(reversed(REF_DECK))} Z`;
  // Fin seen side-on, built in the bottom's own frame (v along the board from
  // the fin's front, u out from the bottom) so the base sits flush on the
  // rockered curve. Shape traced from a reference fin, in base lengths: full
  // leading edge sweeping up and back to a rounded tip that overhangs the base
  // by half its length, concave trailing edge back down to the base.
  const FB = 4.6 * inch; // base length
  const fv0 = 0.76 * bh; // base front, from the nose
  const bez = (p: number[][], t: number) => {
    const m = 1 - t;
    const w = p.length === 4 ? [m * m * m, 3 * m * m * t, 3 * m * t * t, t * t * t] : [m * m, 2 * m * t, t * t];
    return [0, 1].map((k) => p.reduce((acc, q, i) => acc + q[k] * w[i], 0));
  };
  const toPlate = ([v, u]: number[]) => {
    const y = top + fv0 + v * FB;
    return `${(bottomAt(y) + u * FB).toFixed(1)} ${y.toFixed(1)}`;
  };
  const FIN_SIDE = [
    [[0, 0], [0.3, 0.5], [0.7, 0.95], [1.39, 1.02]], // leading edge
    [[1.39, 1.02], [1.6, 1.03], [1.56, 0.88], [1.48, 0.86]], // tip
    [[1.48, 0.86], [1.22, 0.78], [1.0, 0.45], [1.0, 0]], // trailing edge
  ];
  const pts: string[] = [];
  FIN_SIDE.forEach((seg, k) => {
    for (let i = k ? 1 : 0; i <= 24; i++) pts.push(toPlate(bez(seg, i / 24)));
  });
  for (let i = 1; i < 12; i++) pts.push(toPlate([1 - i / 12, 0])); // back along the base
  const keelSide = `M${pts.join(' L')} Z`;

  // Dimensions, one rule for all three: a hairline with short end ticks and
  // the value centred in a break in the line. Thickness is too short to break,
  // so its value sits just past the line's end, on the same centreline.
  const TICK = 12; // half-length of an end tick
  const GAP = 22; // clear space either side of a value
  const CAP = 17; // nudge that centres the .v cap height on a line
  const labelW = (v: string) => v.length * 27; // close enough for PolySans digits
  const vDim = (x: number, y0: number, y1: number, v: string, mid = (y0 + y1) / 2) => {
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
  const wideY = top + WIDEST * bh;
  const marks = [
    // all three values share one line: the width's, at the widest point
    sheet.length && vDim(lenX, top, top + bh, sheet.length, wideY),
    sheet.width && hDim(wideY, deckX + (C - MAXW) * S, deckX + (C + MAXW) * S, sheet.width),
    sheet.thickness && shortDim(wideY, deckAt(wideY), bottomAt(wideY), sheet.thickness),
  ].filter((m): m is { d: string; t: string } => !!m);
  const dims = marks.map((m) => m.d).join(' ');
  const dimText = marks.map((m) => m.t).join('');

  // Two type styles only: .k, a small tracked muted label (header, captions,
  // grid keys), and .v, the ink value (grid values and dimensions).
  const capY = top + bh + 66;
  const ruleY = 1720;
  const colW = (W - PAD * 2) / 3;
  const grid = rows
    .map(([k, v], i) => {
      const x = PAD + colW * i;
      return `<text x="${x}" y="${ruleY + 70}" class="k">${esc(k.toUpperCase())}</text>
        <text x="${x}" y="${ruleY + 136}" class="v">${esc(v)}</text>`;
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
${board(deckX)}
${board(hullX, fins)}
<path d="${profile}" fill="${BOARD}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
<path d="${keelSide}" fill="${INK}"/>
<path d="${dims}" stroke="${MUTED}" stroke-width="2.2" stroke-linecap="square" fill="none"/>
${dimText}
<text x="${deckX + bw / 2}" y="${capY}" class="k c">DECK</text>
<text x="${hullX + bw / 2}" y="${capY}" class="k c">HULL</text>
<text x="${(deckAt(top + bh / 2) + bottomAt(top + bh / 2)) / 2}" y="${capY}" class="k c">SIDE</text>
<path d="M${PAD} ${ruleY} L${W - PAD} ${ruleY}" stroke="${RULE}" stroke-width="2.5"/>
${grid}
</svg>`;

  const alt = [
    `${product.title} spec sheet: deck and hull outline`,
    size && `${size}`,
    ...rows.map(([k, v]) => `${k.toLowerCase()} ${v}`),
  ]
    .filter(Boolean)
    .join(', ');

  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, alt };
}
