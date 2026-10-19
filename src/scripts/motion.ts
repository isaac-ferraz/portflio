/**
 * Coreografia de scroll da página inicial. Carregado por `site.ts` com
 * `import()` só quando há movimento permitido, então quem pede movimento
 * reduzido nunca baixa GSAP nem Lenis.
 *
 * Três modos (gsap.matchMedia): desktop (≥ 64rem, com pins), celular/tablet
 * (sem pins) e — implícito — movimento reduzido, em que nada disto roda e todo
 * o conteúdo já está visível desde a primeira pintura.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const DESKTOP = '(min-width: 64rem) and (prefers-reduced-motion: no-preference)';
const MOBILE = '(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)';

const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

let lenis: Lenis | null = null;

export function init() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.classList.add('motion-on');

  setupLenis();
  setupAnchors();

  const mm = gsap.matchMedia();
  mm.add({ desktop: DESKTOP, mobile: MOBILE }, (ctx) => {
    const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
    // Tweens e ScrollTriggers são desfeitos pelo matchMedia; listeners e
    // tickers, não — cada função devolve a própria limpeza.
    const cleanups = [
      hero(desktop),
      manifesto(desktop),
      journey(desktop),
      marquees(desktop),
      pro(desktop),
      reveals(),
      stamps(),
      desktop ? tilt() : undefined,
    ];
    return () => cleanups.forEach((fn) => fn?.());
  });

  // Medidas só ficam certas depois das fontes e da imagem do hero.
  const heroImg = $<HTMLImageElement>('[data-hero-art] img');
  Promise.all([document.fonts.ready, heroImg?.decode().catch(() => {})]).then(() => ScrollTrigger.refresh());
  addEventListener('pageshow', (e) => { if (e.persisted) ScrollTrigger.refresh(); });
}

/* ---------------------------------------------------------------- Lenis */
function setupLenis() {
  // Só com mouse/trackpad: no toque, o scroll nativo é melhor e mais barato.
  if (!matchMedia('(pointer: fine)').matches) return;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function headerOffset() {
  return -(($('[data-header]')?.offsetHeight ?? 64) + 12);
}

function scrollToEl(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: headerOffset(), duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

function setupAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
    const target = a.hash.length > 1 ? document.getElementById(decodeURIComponent(a.hash.slice(1))) : null;
    if (!target || !lenis) return;
    e.preventDefault();
    scrollToEl(target);
    history.pushState(null, '', a.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  addEventListener('site:scrollto', (e) => scrollToEl((e as CustomEvent<HTMLElement>).detail));
}

/* ---------------------------------------------------------------- Hero */
type Cleanup = (() => void) | undefined;

function hero(desktop: boolean): Cleanup {
  const section = $('#inicio');
  if (!section) return;
  const st = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };

  if (desktop) {
    $$('[data-speed]', section).forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.speed) * -60, ease: 'none', scrollTrigger: st });
    });
    gsap.to('[data-hero-art]', { y: -60, scale: 0.94, ease: 'none', scrollTrigger: st });
    // Os balões se afastam do personagem conforme o scroll.
    const drift = [
      { x: -90, y: -70, rotate: -16 },
      { x: 110, y: -30, rotate: 14 },
      { x: -120, y: 60, rotate: -10 },
    ];
    $$('[data-bubble]', section).forEach((b, i) => gsap.to(b, { ...drift[i], ease: 'none', scrollTrigger: st }));

    // Retícula segue o mouse (variáveis CSS, um frame por vez).
    if (matchMedia('(pointer: fine)').matches) {
      const dots = $('.hero-dots', section);
      let raf = 0;
      const move = (e: PointerEvent) => {
        if (raf || !dots) return;
        raf = requestAnimationFrame(() => {
          const r = section.getBoundingClientRect();
          dots.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
          dots.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
          raf = 0;
        });
      };
      section.addEventListener('pointermove', move);
      return () => section.removeEventListener('pointermove', move);
    }
  } else {
    gsap.to('[data-hero-art]', { y: -30, ease: 'none', scrollTrigger: st });
  }
  return undefined;
}

/* ---------------------------------------------------------------- Sobre */
function manifesto(desktop: boolean): Cleanup {
  const box = $('[data-manifesto]');
  if (!box) return;
  const words = $$('.w', box);
  const plain = words.filter((w) => w.tagName !== 'EM');
  const ems = words.filter((w) => w.tagName === 'EM');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: desktop
      ? { trigger: box, start: 'center center', end: '+=110%', pin: true, scrub: 0.6, anticipatePin: 1 }
      : { trigger: box, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
  });
  tl.fromTo(plain, { '--o': 0.62 }, { '--o': 1, stagger: 0.05, duration: 0.3 }, 0);
  ems.forEach((em) => tl.fromTo(em, { '--hl': '0%' }, { '--hl': '100%', duration: 0.4 }, plain.length * 0.05 * (words.indexOf(em) / words.length)));
  return undefined;
}

/* ---------------------------------------------------------------- Jornada */
function journey(desktop: boolean): Cleanup {
  const track = $('[data-journey]');
  if (!track) return;
  const st = { trigger: track, start: 'top 70%', end: 'bottom 70%', scrub: 0.5 };
  if (desktop) gsap.fromTo('[data-journey-path]', { '--draw': '0%' }, { '--draw': '100%', ease: 'none', scrollTrigger: st });
  else gsap.fromTo('[data-journey-rail]', { '--fill': 0 }, { '--fill': 1, ease: 'none', scrollTrigger: st });
  return undefined;
}

/* ---------------------------------------------------------------- Marquees */
function marquees(desktop: boolean): Cleanup {
  const wrap = $('[data-marquees]');
  if (!wrap) return;
  const anims = $$('[data-marquee]', wrap).flatMap((m) => m.getAnimations());
  const skew = gsap.quickTo(wrap, 'skewY', { duration: 0.5, ease: 'power3' });
  let rate = 1;
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity();
      rate = 1 + Math.min(Math.abs(v) / 500, desktop ? 5 : 2);
      anims.forEach((a) => (a.playbackRate = rate * (v < 0 ? -1 : 1)));
      if (desktop) skew(gsap.utils.clamp(-4, 4, v / -400));
    },
  });
  // Volta ao ritmo normal quando o scroll para.
  const settle = () => {
    if (Math.abs(rate - 1) < 0.01) return;
    rate += (1 - rate) * 0.06;
    anims.forEach((a) => (a.playbackRate = Math.sign(a.playbackRate || 1) * rate));
    if (desktop && Math.abs(rate - 1) < 0.02) skew(0);
  };
  gsap.ticker.add(settle);
  return () => {
    gsap.ticker.remove(settle);
    anims.forEach((a) => { a.playbackRate = 1; });
  };
}

/* ---------------------------------------------------------------- Profissionais */
function pro(desktop: boolean): Cleanup {
  const section = $('[data-pro]');
  const viewport = $('[data-pro-viewport]');
  const track = $('[data-pro-track]');
  const bar = $('[data-pro-progress]');
  if (!section || !viewport || !track) return undefined;
  if (!desktop) return undefined; // celular/tablet: carrossel nativo com scroll-snap (ver site.ts)

  const panels = $$('[data-pro-panel]', track);
  const distance = () => track.scrollWidth - document.documentElement.clientWidth;
  section.classList.add('is-pinned');
  viewport.scrollLeft = 0;

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: { snapTo: 1 / (panels.length - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut' },
      onUpdate: (self) => bar?.style.setProperty('--p', String(self.progress)),
    },
  });

  // Dentro do trilho: a imagem de cada painel "assenta" ao entrar.
  panels.forEach((p) => {
    const img = $('img', p);
    if (img) gsap.from(img, {
      scale: 1.18, ease: 'none',
      scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true },
    });
  });

  // Teclado: dar foco a um painel rola a página até ele.
  const onFocus = (e: FocusEvent) => {
    const i = panels.findIndex((p) => p.contains(e.target as Node));
    const st = tween.scrollTrigger;
    if (i < 0 || !st) return;
    const y = st.start + (st.end - st.start) * (i / (panels.length - 1));
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo({ top: y });
  };
  track.addEventListener('focusin', onFocus);

  return () => {
    section.classList.remove('is-pinned');
    track.removeEventListener('focusin', onFocus);
  };
}

/* ---------------------------------------------------------------- Reveals */
function reveals(): Cleanup {
  const items = $$('[data-reveal]');
  gsap.set(items, { autoAlpha: 0, y: 36 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true }),
  });
  return undefined;
}

function stamps(): Cleanup {
  const items = $$('[data-stamp]');
  if (!items.length) return undefined;
  gsap.from(items, {
    scale: 2.4, autoAlpha: 0, duration: 0.45, stagger: 0.18, ease: 'back.out(2.2)',
    scrollTrigger: { trigger: items[0]!.parentElement, start: 'top 75%', once: true },
  });
  gsap.from('.meter span', {
    scaleX: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.meter', start: 'top 85%', once: true },
  });
  return undefined;
}

/* ---------------------------------------------------------------- Tilt */
function tilt(): Cleanup {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
  const off: (() => void)[] = [];
  $$('[data-tilt]').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
      rx(((e.clientY - r.top) / r.height - 0.5) * -7);
    };
    const leave = () => { rx(0); ry(0); };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    off.push(() => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
    });
  });
  return () => off.forEach((fn) => fn());
}
