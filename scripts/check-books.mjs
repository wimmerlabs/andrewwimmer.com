// Safety check for src/data/books.json. Runs automatically before every build
// (npm "prebuild"), so a mistake fails the build instead of reaching the site:
// Cloudflare keeps serving the last good version.
//
// Usage: node scripts/check-books.mjs [path/to/books.json]

import { readFile, access } from 'node:fs/promises';

const file = process.argv[2] ?? new URL('../src/data/books.json', import.meta.url);
const publicDir = new URL('../public/', import.meta.url);
const MAX_HOMEPAGE = 4; // the home page Library card shows four covers

// "The Daily Stoic", "Daily Stoic" and "the daily stoic: 366 meditations" all count as the same book.
const key = (title) =>
  title
    .split(':')[0]
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/^(the|a|an) /, '')
    .trim();

const errors = [];
let data;
try {
  data = JSON.parse(await readFile(file, 'utf8'));
} catch (err) {
  console.error(`✘ books.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

const shelves = data.meta?.shelves;
if (!Array.isArray(shelves) || shelves.length === 0) errors.push('meta.shelves must list the Library shelf names');
if (!Array.isArray(data.library)) errors.push('"library" must be a list');
if (!Array.isArray(data.antilibrary)) errors.push('"antilibrary" must be a list');
if (errors.length) fail();

const seen = new Map(); // key -> where it was first seen
const check = async (book, list, i) => {
  const where = `${list} #${i + 1}${book?.title ? ` ("${book.title}")` : ''}`;
  if (!book || typeof book !== 'object') return errors.push(`${where}: not a book entry`);
  if (!book.title?.trim()) errors.push(`${where}: missing title`);
  if (!book.author?.trim()) errors.push(`${where}: missing author`);
  if (list === 'library' && !shelves.includes(book.shelf)) {
    errors.push(`${where}: shelf "${book.shelf ?? ''}" isn't one of: ${shelves.join(', ')}`);
  }
  if (book.title) {
    const k = key(book.title);
    if (seen.has(k)) errors.push(`${where}: duplicate of ${seen.get(k)}`);
    else seen.set(k, where);
  }
  if ('mustRead' in book && typeof book.mustRead !== 'boolean') errors.push(`${where}: mustRead must be true or false`);
  if (list === 'antilibrary' && book.mustRead) errors.push(`${where}: mustRead is only for books on the Library`);
  if (book.cover) {
    try {
      await access(new URL(book.cover.replace(/^\//, ''), publicDir));
    } catch {
      errors.push(`${where}: cover file ${book.cover} doesn't exist (run npm run covers)`);
    }
  }
};

for (const [i, b] of data.library.entries()) await check(b, 'library', i);
for (const [i, b] of data.antilibrary.entries()) await check(b, 'antilibrary', i);

const homepage = data.library.filter((b) => b?.homepage).length;
if (homepage > MAX_HOMEPAGE) errors.push(`${homepage} books are marked homepage: true (max ${MAX_HOMEPAGE})`);

if (errors.length) fail();
console.log(`✓ books.json: ${data.library.length} read, ${data.antilibrary.length} on the antilibrary, no duplicates`);

function fail() {
  console.error(`✘ books.json has ${errors.length} problem${errors.length > 1 ? 's' : ''}:`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nThe build stopped so the live site keeps its last good version.');
  process.exit(1);
}
