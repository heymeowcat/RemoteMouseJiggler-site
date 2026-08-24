// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://heymeowcat.is-a.dev',
  base: '/RemoteMouseJiggler',
  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  integrations: [sitemap()]
});
