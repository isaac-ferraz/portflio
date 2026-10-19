/**
 * Comportamentos de todas as páginas, sem dependências. O movimento com GSAP
 * fica em `motion.ts` e só é baixado quando o usuário não pediu movimento
 * reduzido.
 */
const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

/* ---------- tema ---------- */
const themeBtn = $<HTMLButtonElement>('[data-theme-toggle]');
const isDark = () =>
  root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
const syncThemeLabel = () => {
  if (!themeBtn) return;
  themeBtn.setAttribute('aria-label', (isDark() ? themeBtn.dataset.labelLight : themeBtn.dataset.labelDark) ?? '');
};
syncThemeLabel();
themeBtn?.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  syncThemeLabel();
});

/* ---------- menu (popover) fecha ao escolher um link ---------- */
const menu = $('#mobile-menu');
$$('[data-close-menu]').forEach((a) => a.addEventListener('click', () => menu?.hidePopover?.()));

/* ---------- header some ao descer e volta ao subir ---------- */
const header = $('[data-header]');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  if (header) header.toggleAttribute('data-hidden', y > lastY && y > 400 && !menu?.matches(':popover-open'));
  lastY = y;
}, { passive: true });

/* ---------- copiar e-mail ---------- */
$$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const label = $('[data-copy-label]', btn);
  const status = $('[data-copy-status]');
  const original = label?.textContent ?? '';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? '');
    } catch {
      location.href = `mailto:${btn.dataset.copy}`;
      return;
    }
    if (label) label.textContent = btn.dataset.copied ?? '';
    if (status) status.textContent = btn.dataset.copied ?? '';
    setTimeout(() => { if (label) label.textContent = original; }, 2200);
  });
});

/* ---------- lightbox da galeria ---------- */
const box = $<HTMLDialogElement>('[data-lightbox]');
if (box) {
  const img = $<HTMLImageElement>('[data-lightbox-img]', box)!;
  const cap = $('[data-lightbox-cap]', box)!;
  $$<HTMLButtonElement>('[data-enlarge]').forEach((btn) =>
    btn.addEventListener('click', () => {
      img.src = btn.dataset.full ?? '';
      img.alt = btn.dataset.alt ?? '';
      cap.textContent = btn.dataset.caption ?? '';
      cap.hidden = !btn.dataset.caption;
      box.showModal();
    }),
  );
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
}

/* ---------- mascote ---------- */
const mascot = $('[data-mascot]');
if (mascot) {
  const lines: Record<string, string> = JSON.parse(mascot.dataset.lines ?? '{}');
  const line = $('[data-mascot-line]', mascot)!;
  const btn = $<HTMLButtonElement>('[data-mascot-btn]', mascot)!;
  const secs = $$('[data-section]');
  const small = matchMedia('(max-width: 47.99rem)');
  let current = 0;
  mascot.hidden = false;
  mascot.setAttribute('data-away', '');

  const say = (i: number) => {
    if (i === current) return;
    current = i;
    const id = secs[i]?.dataset.section ?? '';
    line.textContent = lines[id] ?? '';
    mascot.removeAttribute('data-talk');
    void mascot.offsetWidth; // reinicia a animação de "fala"
    mascot.setAttribute('data-talk', '');
    const last = i >= secs.length - 1;
    btn.setAttribute('aria-label', (small.matches || last ? btn.dataset.labelTop : btn.dataset.labelNext) ?? '');
  };

  // A seção "atual" é a última cujo topo já passou da linha a 40% da tela. Há
  // seções aninhadas (capítulos dentro de Projetos), então não basta olhar a
  // entrada que mudou: recalcula a partir de todas.
  const update = () => {
    const lineY = innerHeight * 0.4;
    let i = 0;
    secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= lineY) i = k; });
    mascot.toggleAttribute('data-away', i === 0);
    say(i);
  };
  const io = new IntersectionObserver(update, { rootMargin: '-40% 0px -60% 0px' });
  secs.forEach((s) => io.observe(s));

  btn.addEventListener('click', () => {
    const last = current >= secs.length - 1;
    const target = small.matches || last ? secs[0] : secs[current + 1];
    if (!target) return;
    window.dispatchEvent(new CustomEvent('site:scrollto', { detail: target }));
    if (!root.classList.contains('lenis')) target.scrollIntoView({ behavior: 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

/* ---------- barra de progresso do carrossel (quando não está fixado) ---------- */
const proViewport = $('[data-pro-viewport]');
const proBar = $('[data-pro-progress]');
if (proViewport && proBar) {
  proViewport.addEventListener('scroll', () => {
    if (proViewport.closest('.is-pinned')) return;
    const max = proViewport.scrollWidth - proViewport.clientWidth;
    proBar.style.setProperty('--p', String(max > 0 ? proViewport.scrollLeft / max : 0));
  }, { passive: true });
}

/* ---------- letreiros só animam quando estão na tela ---------- */
const marq = $('[data-marquees]');
if (marq) {
  new IntersectionObserver(([e]) => marq.toggleAttribute('data-play', !!e?.isIntersecting)).observe(marq);
}

/* ---------- movimento (GSAP + Lenis), só se permitido e se a página pedir ---------- */
// Toda a coreografia depende de scroll ou ponteiro, então o módulo só é baixado
// na primeira interação: a carga inicial fica sem nenhum JS pesado.
if (root.classList.contains('motion') && document.querySelector('[data-motion]')) {
  const events = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'pointermove', 'keydown'] as const;
  const load = () => {
    events.forEach((e) => removeEventListener(e, load));
    import('./motion').then((m) => m.init());
  };
  events.forEach((e) => addEventListener(e, load, { passive: true, once: true }));
  // Voltou do histórico já rolado: carrega direto.
  if (scrollY > 0) load();
}
