/**
 * Ambient background video (hero + footer panels).
 *
 * These are decorative, muted, looping fills sitting behind text — never worth
 * blocking a page for. The markup therefore ships *no* `<source>` children: a
 * browser begins fetching as soon as it sees one, whatever `preload` says. The
 * poster stands in until this module attaches a source, which happens only once
 * the element is near the viewport and the page has finished its critical work.
 *
 * Two opt-outs never download a byte: Data Saver / 2G, and reduced-motion.
 * Small screens get a 640px cut (~0.8MB against ~2.6MB for the full file).
 */

type Options = {
  /** Basename in /public, e.g. 'hero' → /hero.mp4 + /hero-mobile.mp4 */
  name: string;
  /** Start loading this far before the element scrolls into view. */
  rootMargin?: string;
};

/** Data Saver, a 2G-class connection, or reduced-motion: keep the poster. */
function frugal(): boolean {
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return (
    conn?.saveData === true ||
    /(^|-)2g$/.test(conn?.effectiveType ?? '') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function ambientVideo(v: HTMLVideoElement, { name, rootMargin = '200px' }: Options): void {
  // iOS honours muted inline autoplay only when these are unambiguous — pin them
  // as properties *and* attributes before the first play() attempt.
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');

  let playing = false;

  /**
   * Seconds of contiguous buffer ahead of the playhead. Starting on the first
   * decodable frame is what makes an ambient loop stutter: it plays, runs dry,
   * and rebuffers in full view. `preload="auto"` used to mask this by fetching
   * the whole file up front — which is the cost we just removed — so the buffer
   * now has to be checked explicitly.
   */
  const buffered = () => {
    for (let i = 0; i < v.buffered.length; i++) {
      if (v.buffered.start(i) <= v.currentTime && v.currentTime < v.buffered.end(i)) {
        return v.buffered.end(i) - v.currentTime;
      }
    }
    return 0;
  };

  const START_BUFFER = 4; // seconds — enough to ride out a slow patch mid-loop

  const play = (force = false) => {
    if (playing || !v.querySelector('source')) return;
    // readyState 4 is HAVE_ENOUGH_DATA: the browser predicts uninterrupted play.
    if (!force && v.readyState < 4 && buffered() < START_BUFFER) return;
    const p = v.play();
    if (p && typeof p.then === 'function') p.then(() => { playing = true; }).catch(() => {});
  };

  const attach = () => {
    if (frugal()) return;
    if (v.querySelector('source')) return play();

    const suffix = window.matchMedia('(max-width: 820px)').matches ? '-mobile' : '';
    // H.264 first, and it will win everywhere — that is the point. The browser
    // takes the first *supported* source, and VP9 has no hardware decoder on
    // most Apple silicon, so leading with webm buys a slightly smaller file and
    // pays for it with a software decode that visibly judders on a full-bleed
    // video carrying a CSS filter. webm stays as a fallback that nothing reaches.
    for (const [ext, type] of [['mp4', 'video/mp4'], ['webm', 'video/webm']] as const) {
      const s = document.createElement('source');
      s.src = `/${name}${suffix}.${ext}`;
      s.type = type;
      v.appendChild(s);
    }
    v.preload = 'auto';
    v.load();

    // Re-check the buffer on every event that means fresh data.
    ['loadeddata', 'canplay', 'canplaythrough', 'progress'].forEach((e) =>
      v.addEventListener(e, () => play()),
    );
    // iOS often never reaches readyState 4 for an offscreen muted video, so the
    // gate needs a deadline — but forcing playback on a thin buffer just
    // reintroduces the judder. Relax the requirement over time instead: from 6s
    // accept a couple of seconds of buffer, and only give up and play regardless
    // at 20s, by which point a still poster is the worse of the two failures.
    let relax = 0;
    setTimeout(() => {
      relax = window.setInterval(() => {
        if (playing) return clearInterval(relax);
        if (buffered() >= 2) { clearInterval(relax); play(true); }
      }, 1000);
    }, 6000);
    setTimeout(() => { clearInterval(relax); play(true); }, 20000);

    // A stall mid-loop: pause, let the buffer rebuild, resume on the next
    // progress event rather than grinding through it frame by frame.
    v.addEventListener('waiting', () => { playing = false; });
  };

  // Wait for the element to approach the viewport, then for the page to finish
  // its critical work. Without IntersectionObserver, just wait for load.
  const whenIdle = () => {
    if (document.readyState === 'complete') attach();
    else window.addEventListener('load', attach, { once: true });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          whenIdle();
        }
      },
      { rootMargin },
    );
    io.observe(v);
  } else {
    whenIdle();
  }

  // Resume after the tab returns to the foreground, or after scrolling back to
  // a panel that paused itself.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) play();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((ents) =>
      ents.forEach((en) => {
        if (en.isIntersecting && v.paused) { playing = false; play(); }
      }),
    ).observe(v);
  }

  // Last resort where autoplay is gated (iOS Low Power Mode): the first real
  // gesture both attaches and unlocks.
  ['touchstart', 'pointerdown', 'scroll', 'click'].forEach((e) =>
    window.addEventListener(e, attach, { once: true, passive: true }),
  );
}
