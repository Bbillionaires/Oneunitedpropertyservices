/**
 * Sticky header: transparent over the hero → solid on scroll, hides on scroll
 * down and returns on scroll up. Also drives the mobile menu and the
 * persistent mobile "Request a Quote" bar.
 */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  const toggle = header.querySelector<HTMLButtonElement>('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const mobileCta = document.querySelector<HTMLElement>('.mobile-cta');
  let lastY = window.scrollY;
  let menuOpen = false;
  let ctaBlocked = false;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!menuOpen && y > 480 && goingDown) header.classList.add('is-hidden');
    else if (goingUp || y <= 480) header.classList.remove('is-hidden');
    if (goingDown || goingUp) lastY = y;

    if (mobileCta) {
      const show = y > window.innerHeight * 0.55 && !ctaBlocked && !menuOpen;
      mobileCta.classList.toggle('is-visible', show);
      mobileCta.toggleAttribute('inert', !show);
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  // Hide the floating CTA where it would be redundant (forms, footer, CTAs).
  if (mobileCta) {
    const blockers = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? blockers.add(e.target) : blockers.delete(e.target)));
      ctaBlocked = blockers.size > 0;
      update();
    });
    document.querySelectorAll('[data-hide-mobile-cta]').forEach((el) => io.observe(el));
  }

  if (!toggle || !menu) return;

  const focusables = () =>
    // The menu panel follows the toggle in the DOM, so the toggle is first.
    [toggle as HTMLElement].concat(Array.from(menu.querySelectorAll<HTMLElement>('a, button')));

  const setOpen = (open: boolean) => {
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('no-scroll', open);
    menu.toggleAttribute('inert', !open);
    if (open) {
      window.__scroller?.stop();
      header.classList.remove('is-hidden');
      menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    } else {
      window.__scroller?.start();
    }
    update();
  };

  toggle.addEventListener('click', () => setOpen(!menuOpen));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (!menuOpen) return;
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    } else if (e.key === 'Tab') {
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  window.matchMedia('(min-width: 1180px)').addEventListener('change', (e) => {
    if (e.matches && menuOpen) setOpen(false);
  });
}
