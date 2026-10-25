// Renders the link-preview image (public/og.jpg, 1200x630) shown when the site
// is shared on LinkedIn, iMessage, Slack, etc. Run after changing the name,
// title or headshot:
//
//   npx -y playwright@1 install chromium   (first time only, if needed)
//   node scripts/make-og.mjs
//
// It's a one-off tool, so Playwright isn't a project dependency.

import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const b64 = async (path) => (await readFile(new URL(path, root))).toString('base64');

const [geist, geistMono, photo] = await Promise.all([
  b64('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'),
  b64('node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'),
  b64('public/images/andrew-wimmer.webp'),
]);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Geist; src: url(data:font/woff2;base64,${geist}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: GeistMono; src: url(data:font/woff2;base64,${geistMono}) format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; background: #0c0d0f; color: #edeef0; font-family: Geist, sans-serif;
  display: flex; align-items: center; gap: 72px; padding: 0 96px; position: relative; overflow: hidden; }
.glow { position: absolute; right: -180px; top: -220px; width: 620px; height: 620px; border-radius: 50%;
  background: radial-gradient(circle, rgba(94,234,212,0.16), rgba(94,234,212,0) 65%); }
img { width: 300px; height: 300px; border-radius: 50%; object-fit: cover; flex: none;
  box-shadow: 0 0 0 10px #0c0d0f, 0 0 0 12px #5eead4; }
h1 { font-size: 88px; font-weight: 600; letter-spacing: -0.045em; line-height: 0.95; color: #fff; }
.role { margin-top: 28px; font-size: 32px; color: #d6d8dc; letter-spacing: -0.01em; }
.side { margin-top: 10px; font-size: 32px; color: #9da1a8; letter-spacing: -0.01em; }
.url { margin-top: 44px; display: inline-flex; align-items: center; gap: 14px; font-family: GeistMono, monospace;
  font-size: 26px; color: #5eead4; }
.mark { width: 40px; height: 40px; border-radius: 10px; background: #5eead4; color: #0c0d0f; display: inline-flex;
  align-items: center; justify-content: center; font-size: 17px; font-weight: 600; }
</style></head><body>
<div class="glow"></div>
<img src="data:image/webp;base64,${photo}" alt="">
<div>
  <h1>Andrew Wimmer</h1>
  <p class="role">Technology Consultant – Team Lead, Arthrex</p>
  <p class="side">Building with AI at Wimmer Labs</p>
  <p class="url"><span class="mark">AW</span>andrewwimmer.com</p>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: 'png' });
await browser.close();

// JPG for the widest compatibility (LinkedIn doesn't reliably show WebP previews).
const info = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(new URL('public/og.jpg', root).pathname);
console.log(`public/og.jpg ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
