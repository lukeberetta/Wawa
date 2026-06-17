/**
 * Keyboard focus trap for overlay surfaces (cart drawer, mobile menu). While a
 * trap is active Tab cycles only through the surface's own controls, so focus
 * can't wander to the page behind it. Releasing restores focus to whatever held
 * it when the trap was set — usually the button that opened the surface.
 *
 * Reduced motion / pointer users are unaffected; this only governs Tab order.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function visibleFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    // drop anything hidden (display:none, off-screen panels, [hidden])
    (el) => !el.hasAttribute('hidden') && el.getClientRects().length > 0,
  );
}

export function trapFocus(
  container: HTMLElement,
  initial?: HTMLElement | null,
): () => void {
  const restoreTo = document.activeElement as HTMLElement | null;

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const f = visibleFocusables(container);
    if (!f.length) {
      e.preventDefault();
      return;
    }
    const first = f[0];
    const last = f[f.length - 1];
    const active = document.activeElement;
    if (!container.contains(active)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', onKey, true);
  // Defer the initial focus a frame: the surface may still be mid-open
  // (translate/opacity) and a fixed/animating element won't take focus cleanly.
  requestAnimationFrame(() =>
    (initial ?? visibleFocusables(container)[0])?.focus(),
  );

  return () => {
    document.removeEventListener('keydown', onKey, true);
    restoreTo?.focus?.();
  };
}
