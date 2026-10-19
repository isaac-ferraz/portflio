// Todo link interno precisa passar pelo `base` (/portflio/): o site é servido
// num subcaminho do GitHub Pages e um "/algo" absoluto quebraria lá.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = '/portflio/';
const ATTR = /\s(?:href|src|srcset|content|action|poster)="([^"]*)"/g;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}

const bad = [];
let pages = 0;
for await (const file of walk('dist')) {
  pages++;
  const html = await readFile(file, 'utf8');
  for (const [, value] of html.matchAll(ATTR)) {
    for (const part of value.split(',')) {
      const u = part.trim().split(/\s+/)[0] ?? '';
      if (u.startsWith('/') && !u.startsWith('//') && !u.startsWith(BASE)) bad.push(`${file}: ${u}`);
    }
  }
}

if (bad.length) {
  console.error(`✗ check-base-links: ${bad.length} link(s) fora de ${BASE}\n  ${[...new Set(bad)].join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ check-base-links: ${pages} páginas, todos os links internos em ${BASE}`);
