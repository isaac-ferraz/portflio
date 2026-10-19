import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ui } from '~/i18n/ui';
import type { Lang } from '~/i18n/utils';

/** Imagens Open Graph (1200×630) geradas no build: uma por idioma e por projeto. */

export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  return (['pt', 'en'] as const).flatMap((lang) => [
    { params: { lang, slug: 'index' }, props: { lang, project: null } },
    ...projects.map((p) => ({ params: { lang, slug: p.id }, props: { lang, project: p } })),
  ]);
}) satisfies GetStaticPaths;

const font = (pkg: string, file: string) => readFile(resolve('node_modules', pkg, 'files', file));

// Satori não lê woff2 nem fontes variáveis: usa os .woff estáticos.
const fontsP = Promise.all([
  font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff'),
  font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff'),
  font('@fontsource/bangers', 'bangers-latin-400-normal.woff'),
]);
// O build roda na raiz do projeto; `import.meta.url` muda depois do bundle.
const bustP = readFile(resolve('src/assets/hero/mascote.png')).then(
  (b) => `data:image/png;base64,${b.toString('base64')}`,
);

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

export const GET: APIRoute = async ({ props }) => {
  const { lang, project } = props as { lang: Lang; project: Awaited<ReturnType<typeof getCollection<'projects'>>>[number] | null };
  const [serifItalic, serif, bangers] = await fontsP;
  const bust = await bustP;
  const t = ui[lang];

  const accent = project?.data.accent ?? '#ffd23f';
  const kicker = project ? project.data.kicker[lang] : t['hero.eyebrow'];
  const title = project ? project.data.title : 'Isaac Ferraz';
  const sub = project ? project.data.tagline[lang] : t['hero.lead'].replace(/\*/g, '');

  const tree = h(
    'div',
    { width: 1200, height: 630, background: '#0c0c0f', color: '#f3efe6', padding: 64, position: 'relative', fontFamily: 'Serif' },
    h('div', {
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(rgba(243,239,230,0.12) 2px, transparent 2.5px)', backgroundSize: '22px 22px',
    }),
    h('div', { position: 'absolute', left: 0, top: 0, bottom: 0, width: 18, background: accent }),
    h(
      'div',
      { flexDirection: 'column', justifyContent: 'space-between', width: 800, height: '100%' },
      h('div', { fontFamily: 'Bangers', fontSize: 34, letterSpacing: 2, color: accent, textTransform: 'uppercase' }, kicker),
      h(
        'div',
        { flexDirection: 'column' },
        h('div', { fontFamily: 'SerifItalic', fontStyle: 'italic', fontSize: title.length > 16 ? 96 : 124, lineHeight: 0.95 }, title),
        h('div', { fontSize: 36, lineHeight: 1.25, marginTop: 24, color: '#cfcad4' }, sub),
      ),
      h('div', { fontFamily: 'Bangers', fontSize: 28, letterSpacing: 2, color: '#a9a5b0' }, 'ISAAC FERRAZ · PORTFÓLIO'),
    ),
    h(
      'div',
      {
        position: 'absolute', right: 56, bottom: 56, width: 300, height: 300, borderRadius: 150,
        background: accent, border: '6px solid #f3efe6', overflow: 'hidden', alignItems: 'flex-end', justifyContent: 'center',
      },
      { type: 'img', props: { src: bust, width: 300, height: 300, style: { objectFit: 'cover' } } },
    ),
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Serif', data: serif, weight: 400, style: 'normal' },
      { name: 'SerifItalic', data: serifItalic, weight: 400, style: 'italic' },
      { name: 'Bangers', data: bangers, weight: 400, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
