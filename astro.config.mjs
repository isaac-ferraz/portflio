// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// O repositório é `isaac-ferraz/portflio`, servido pelo GitHub Pages em
// https://isaac-ferraz.github.io/portflio/ — por isso todo link interno passa
// pelo `base`. `scripts/check-base-links.mjs` confere isso depois do build.
export default defineConfig({
  site: 'https://isaac-ferraz.github.io',
  base: '/portflio',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'pt', locales: { pt: 'pt-BR', en: 'en' } },
      filter: (page) => !page.includes('/og/'),
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
