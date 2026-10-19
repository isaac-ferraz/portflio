import { getCollection } from 'astro:content';

export async function projectPaths() {
  const all = await getCollection('projects');
  return all.map((p) => ({ params: { slug: p.id } }));
}
