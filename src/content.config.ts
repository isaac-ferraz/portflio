import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Texto nos dois idiomas do site. */
const L = z.object({ pt: z.string(), en: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      category: z.enum(['profissional', 'academico', 'pessoal']),
      order: z.number(),
      year: z.string(),
      org: z.string().optional(),
      title: z.string(),
      kicker: L,
      tagline: L,
      summary: L,
      role: L,
      stack: z.array(z.string()).min(1),
      highlights: z.array(L).min(2).max(5),
      metrics: z.array(z.object({ value: z.string(), label: L })).max(4).optional(),
      status: z.enum(['producao', 'homologacao', 'entregue', 'andamento', 'evento']),
      links: z
        .object({
          live: z.url().optional(),
          repo: z.url().optional(),
          video: z.url().optional(),
          extra: z.object({ href: z.url(), label: L }).optional(),
        })
        .default({}),
      /** Cor de destaque do projeto (cartão, página de detalhe). */
      accent: z.string().regex(/^#[0-9a-f]{6}$/i),
      cover: image(),
      coverAlt: L,
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: L,
            caption: L.optional(),
            kind: z.enum(['shot', 'phone', 'strip', 'art']).default('shot'),
          }),
        )
        .default([]),
      /** Projeto da empresa: mostra o aviso de dados de exemplo e nunca o repositório. */
      confidential: z.boolean().default(false),
      team: z.object({ size: z.number(), myPart: L }).optional(),
      credits: z.array(L).optional(),
      sections: z
        .array(
          z.object({
            title: L,
            body: L.optional(),
            items: z.array(L).optional(),
          }),
        )
        .default([]),
    }),
});

export const collections = { projects };
