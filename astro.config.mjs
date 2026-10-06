// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical production origin. Update here if the domain ever changes.
const SITE = 'https://oneunitedpropertyservices.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  image: {
    // Responsive widths generated for <Picture>/<Image> srcsets.
    breakpoints: [480, 768, 1080, 1440, 1920],
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
