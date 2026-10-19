// Falha o build se o site publicado (`dist/`) vazar algo da empresa:
//   - IP privado (10.x, 172.16–31.x, 192.168.x) ou a porta do Postgres (:5432);
//   - metadados EXIF em alguma imagem;
//   - qualquer termo do `.confidential-denylist` (um por linha; o arquivo é
//     gitignored justamente para não publicar a própria lista).
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join } from 'node:path';

const DIST = 'dist';
const TEXT = new Set(['.html', '.xml', '.txt', '.js', '.css', '.json', '.svg', '.webmanifest']);
const IMG = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const PRIVATE_IP = /\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/;
const PG_PORT = /:5432\b/;

const deny = existsSync('.confidential-denylist')
  ? (await readFile('.confidential-denylist', 'utf8'))
      .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  : [];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const problems = [];
let files = 0;
for await (const file of walk(DIST)) {
  const ext = extname(file).toLowerCase();
  if (TEXT.has(ext)) {
    files++;
    const text = await readFile(file, 'utf8');
    const ip = text.match(PRIVATE_IP);
    if (ip) problems.push(`${file}: IP privado ${ip[0]}`);
    if (PG_PORT.test(text)) problems.push(`${file}: porta :5432`);
    const lower = text.toLowerCase();
    for (const term of deny) if (lower.includes(term.toLowerCase())) problems.push(`${file}: termo proibido (#${deny.indexOf(term) + 1})`);
  } else if (IMG.has(ext)) {
    files++;
    const buf = await readFile(file);
    // JPEG: segmento APP1 "Exif\0\0"; PNG: chunk eXIf; WebP: chunk EXIF; AVIF: item Exif.
    if (buf.includes('Exif\0\0') || buf.includes('eXIf') || buf.includes('EXIF') || (ext === '.avif' && buf.includes('Exif')))
      problems.push(`${file}: imagem com EXIF`);
  }
}

if (problems.length) {
  console.error(`✗ guard-confidential: ${problems.length} problema(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ guard-confidential: ${files} arquivos conferidos, ${deny.length} termos na lista`);
