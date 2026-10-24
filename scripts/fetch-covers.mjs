// Fetch book covers from Open Library ONCE and save them into the repo.
//
// Why: the site never loads anything from third parties. Covers are downloaded
// here, resized, converted to WebP (which also drops any embedded metadata),
// and served from andrewwimmer.com like every other file.
//
// Usage:  npm run covers            (only fetches books that don't have a cover yet)
//         npm run covers -- --force (re-fetches everything)
//
// Each book in src/data/books.json can carry:
//   "cover":       "/images/covers/<slug>.webp"  (written by this script)
//   "openLibrary": "https://openlibrary.org/works/..."  (link to the book's page)
//   "coverId":     12345  (optional manual override: an Open Library cover ID)
//   "noCover":     true   (optional: keep the generated cover)

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const BOOKS = new URL('../src/data/books.json', import.meta.url);
const OUT_DIR = new URL('../public/images/covers/', import.meta.url);
const UA = 'andrewwimmer.com cover fetch (https://github.com/wimmerlabs/andrewwimmer.com)';
const force = process.argv.includes('--force');

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

async function findBook(book) {
  const title = book.title.split(':')[0];
  const author = book.author.split(/,| & /)[0].replace(/\(.*\)/, '').trim();
  const params = new URLSearchParams({
    title,
    limit: '10',
    fields: 'key,title,author_name,cover_i,edition_count',
  });
  if (!/arthrex/i.test(author)) params.set('author', author);
  const { docs = [] } = await getJson(`https://openlibrary.org/search.json?${params}`);
  const want = normalize(title);
  // Prefer an exact title match with a cover and the most editions (the canonical work).
  const candidates = docs
    .filter((d) => d.cover_i)
    .filter((d) => normalize(d.title).startsWith(want) || want.startsWith(normalize(d.title)))
    .sort((a, b) => (b.edition_count ?? 0) - (a.edition_count ?? 0));
  return candidates[0] ?? null;
}

async function saveCover(coverId, slug) {
  const res = await fetch(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`, {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`cover ${coverId}: ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const file = new URL(`${slug}.webp`, OUT_DIR);
  // 400px wide covers the largest on-page size (about 200px) on high-res screens.
  // Sharp drops EXIF/XMP metadata by default.
  const info = await sharp(input).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file.pathname);
  return { path: `/images/covers/${slug}.webp`, ...info };
}

const data = JSON.parse(await readFile(BOOKS, 'utf8'));
await mkdir(OUT_DIR, { recursive: true });

for (const book of [...data.library, ...data.antilibrary]) {
  const slug = slugify(book.title.split(':')[0]);
  if (book.noCover) {
    console.log(`skip     ${book.title} (noCover)`);
    continue;
  }
  if (book.cover && !force) {
    console.log(`have     ${book.title}`);
    continue;
  }
  try {
    let coverId = book.coverId;
    if (!coverId) {
      const match = await findBook(book);
      await sleep(400); // be polite to Open Library
      if (!match) {
        console.log(`MISSING  ${book.title}`);
        continue;
      }
      coverId = match.cover_i;
      book.openLibrary = `https://openlibrary.org${match.key}`;
      console.log(`found    ${book.title}  →  "${match.title}" by ${match.author_name?.[0]} (cover ${coverId})`);
    }
    const saved = await saveCover(coverId, slug);
    book.cover = saved.path;
    book.coverId = coverId;
    await sleep(400);
  } catch (err) {
    console.log(`ERROR    ${book.title}: ${err.message}`);
  }
}

await writeFile(BOOKS, JSON.stringify(data, null, 2) + '\n');
console.log('\nUpdated src/data/books.json');
