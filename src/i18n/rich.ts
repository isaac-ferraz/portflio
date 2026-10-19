const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `*palavra*` vira `<em>` (itálico serifado de destaque). O resto é escapado. */
export const rich = (text: string) => escape(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');

/** Tira os asteriscos (para `<title>`, `alt`, meta tags). */
export const plain = (text: string) => text.replace(/\*/g, '');
