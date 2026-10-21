import { defaultLang, languages, ui, type Lang, type UIKey } from './ui';

export type { Lang };

export type L = { pt: string; en: string };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Junta o `base` do site a um caminho interno, sempre com barra final. */
export function url(path = '/'): string {
  const clean = path.replace(/^\/+/, '');
  if (!clean) return `${BASE}/`;
  if (/[#?]/.test(clean) || /\.[a-z0-9]+$/i.test(clean)) return `${BASE}/${clean}`;
  return `${BASE}/${clean.replace(/\/?$/, '/')}`;
}

export function getLangFromUrl(u: URL): Lang {
  const rest = u.pathname.slice(BASE.length).split('/')[1];
  return rest && rest in languages ? (rest as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Escolhe o idioma de um texto bilíngue do conteúdo. */
export const pick = (text: L, lang: Lang) => text[lang];

/** Igual a `pick`, mas aceita um texto que é o mesmo nos dois idiomas. */
export const pickText = (text: string | L, lang: Lang) => (typeof text === 'string' ? text : text[lang]);

export const homePath = (lang: Lang) => url(lang === defaultLang ? '/' : `/${lang}/`);

export const projectPath = (slug: string, lang: Lang) =>
  url(lang === defaultLang ? `/projetos/${slug}/` : `/${lang}/projects/${slug}/`);

/** Mesma página no outro idioma (para o botão PT/EN e o hreflang). */
export function alternatePath(u: URL, to: Lang): string {
  const rest = u.pathname.slice(BASE.length);
  const proj = rest.match(/^\/(?:en\/projects|projetos)\/([^/]+)\/?$/);
  if (proj?.[1]) return projectPath(proj[1], to);
  return homePath(to);
}

export const otherLang = (lang: Lang): Lang => (lang === 'pt' ? 'en' : 'pt');

export const htmlLang = (lang: Lang) => (lang === 'pt' ? 'pt-BR' : 'en');
