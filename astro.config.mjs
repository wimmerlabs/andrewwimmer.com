// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://andrewwimmer.com',
  // The status template is only served (filled in) by the Worker, so keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/connect/status/') })],
  build: {
    // Ship CSS as files, never inline <style> tags, so the
    // Content-Security-Policy in public/_headers can stay strict.
    inlineStylesheets: 'never',
  },
  devToolbar: { enabled: false },
});
