/**
 * Site-wide motion: scroll reveals, parallax, counters, smooth scrolling.
 * Everything is native (IntersectionObserver + rAF) except Lenis, which is
 * only loaded for fine-pointer devices with motion enabled.
 */

const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export const motionAllowed = () => !reduceQuery.matches;

/* ---------- Scroll reveals ---------- */
function initReveals() {
  const root = document.documentElement;
  if (!motionAllowed()) {
    root.classList.remove('motion-ok');
    return;
  }

  // Stagger children of [data-reveal-group] automatically.
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const step = Number(group.dataset.revealGroup) || 90;
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal]').forEach((el, i) => {
      if (!el.style.getPropertyValue('--reveal-delay')) el.style.setProperty('--reveal-delay', String(i * step));
    });
  });

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split], [data-reveal-trigger]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        entry.target.dispatchEvent(new CustomEvent('reveal'));
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  targets.forEach((el) => io.observe(el));
}

/* ---------- Parallax ---------- */
function initParallax() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!els.length) return;
  const desktop = window.matchMedia('(min-width: 768px)');
  const visible = new Set<HTMLElement>();
  let ticking = false;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      if (e.isIntersecting) visible.add(el);
      else visible.delete(el);
    }
    schedule();
  });
  els.forEach((el) => io.observe(el));

  function update() {
    ticking = false;
    if (!motionAllowed()) {
      els.forEach((el) => (el.style.transform = ''));
      return;
    }
    const vh = window.innerHeight;
    // Phones get a gentler effect to stay smooth.
    const factor = desktop.matches ? 1 : 0.4;
    visible.forEach((el) => {
      const speed = Number(el.dataset.parallax) || 0.15;
      const host = (el.parentElement ?? el).getBoundingClientRect();
      const offset = host.top + host.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-offset * speed * factor).toFixed(1)}px, 0)`;
    });
  }
  function schedule() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
}

/* ---------- Counters ---------- */
function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    const end = Number(el.dataset.countTo);
    const run = () => {
      if (!motionAllowed()) {
        el.textContent = String(end);
        return;
      }
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = String(Math.round(end * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const trigger = el.closest('[data-reveal], [data-reveal-trigger]') ?? el;
    if (!motionAllowed()) return run();
    el.textContent = '0';
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(trigger);
  });
}

/* ---------- Smooth scrolling ---------- */
export type ScrollerLike = {
  stop(): void;
  start(): void;
  scrollTo(target: HTMLElement | number, opts?: { offset?: number; immediate?: boolean }): void;
};
declare global {
  interface Window {
    __scroller?: ScrollerLike;
  }
}

async function initSmoothScroll() {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!motionAllowed() || !finePointer) return;
  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
  window.__scroller = lenis as unknown as ScrollerLike;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

/** Same-page anchor links scroll smoothly and move focus for keyboard/screen-reader users. */
function initAnchors() {
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    const headerH = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
    if (window.__scroller) window.__scroller.scrollTo(target, { offset: -headerH - 8 });
    else target.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto' });
    history.pushState(null, '', url.hash);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

export function initMotion() {
  initReveals();
  initParallax();
  initCounters();
  initAnchors();
  void initSmoothScroll();
}
