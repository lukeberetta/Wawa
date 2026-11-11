/**
 * The 12 monoprints, cropped out of their poster scans, for the scattered
 * prints on the home page event band.
 *
 *   node scripts/event-collage.mjs && npm run images
 *
 * Fixed inset crop: clear of the white plate, the lettering and the signature
 * on all twelve posters. Writes public/img/event/print-01.webp … print-12.webp.
 */
import sharp from 'sharp';

const CROP = { left: 330, top: 300, width: 940, height: 880 };
const WIDTH = 640;

for (let n = 1; n <= 12; n++) {
  const id = String(n).padStart(2, '0');
  await sharp(`public/img/product/monoprint-${id}.webp`)
    .extract(CROP)
    .resize(WIDTH)
    .webp({ quality: 80 })
    .toFile(`public/img/event/print-${id}.webp`);
}
console.log('12 prints written');
