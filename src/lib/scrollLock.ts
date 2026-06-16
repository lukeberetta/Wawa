/**
 * One scroll lock shared by every drawer (Nav menu, Cart). Only one drawer is
 * ever open at a time, so a single module-level lock is the source of truth and
 * two drawers can't corrupt each other's saved scroll position.
 *
 * Locking pins <body> with position:fixed — iOS ignores `overflow: hidden` on
 * <body>, so this is the reliable way to freeze the page. Two things have to be
 * tamed alongside the pin:
 *   1. Lenis — its rAF loop keeps writing scroll, so we stop() it on lock and,
 *      on release, restore the position *through* Lenis; otherwise its next
 *      frame snaps the page back to the top.
 *   2. The nav — pinning collapses document scroll to 0, which fires a `scroll`
 *      event; without a signal the nav's onScroll drops its `.scrolled` class
 *      and flips transparent mid-open. The `is-locked` class on <html> is that
 *      signal (Nav.astro bails out of onScroll while it's set).
 */
import type Lenis from 'lenis';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

let lockedY = 0;
let locked = false;

export function lockScroll(lock: boolean) {
  if (lock === locked) return;
  locked = lock;
  const b = document.body;
  const root = document.documentElement;

  if (lock) {
    lockedY = window.scrollY;
    window.lenis?.stop();
    root.classList.add('is-locked');
    b.style.position = 'fixed';
    b.style.top = `-${lockedY}px`;
    b.style.left = '0';
    b.style.right = '0';
  } else {
    b.style.position = '';
    b.style.top = '';
    b.style.left = '';
    b.style.right = '';
    root.classList.remove('is-locked');
    if (window.lenis) {
      window.lenis.start();
      // The pin collapsed the document, so Lenis cached limit=0; its
      // ResizeObserver only catches up next frame. Recalc now or scrollTo
      // clamps the target to 0 and dumps us at the top.
      window.lenis.resize();
      window.lenis.scrollTo(lockedY, { immediate: true, force: true });
    } else {
      window.scrollTo(0, lockedY);
    }
  }
}
