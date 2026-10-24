// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://andrewwimmer.com',
  integrations: [sitemap()],
  build: {
    // Ship CSS as files, never inline <style> tags, so the
    // Content-Security-Policy in public/_headers can stay strict.
    inlineStylesheets: 'never',
  },
  devToolbar: { enabled: false },
});
