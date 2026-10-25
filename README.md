# andrewwimmer.com

Personal site of Andrew Wimmer. A Wimmer Labs build, written alongside [Claude Code](https://claude.com/claude-code).

- **Astro 7**, fully static: no client JavaScript, no trackers, no cookies
- **Cloudflare Workers** (static assets), deployed automatically on every push to `main`
- Readable by AI agents: [`/llms.txt`](https://andrewwimmer.com/llms.txt), [`/career.json`](https://andrewwimmer.com/career.json), [`/books.json`](https://andrewwimmer.com/books.json), MCP server coming soon

## Updating content

Everything on the site is generated from the files in `src/data/`:

| File | Feeds |
|---|---|
| `career.json` | Career page, home Work card, `/career.json`, `/llms.txt` ([JSON Resume](https://jsonresume.org) format) |
| `books.json` | Library + Antilibrary pages, home Library card, `/books.json` |
| `recommendations.json` | Home Recommendations card (full page coming) |
| `site.ts` | Links, projects, interests, contact options |

Edit a file, push, and the site rebuilds.

**Safety check:** `scripts/check-books.mjs` runs before every build and stops it if `books.json` has a duplicate (including a book on both the Library and Antilibrary), a missing title/author, a shelf that isn't in `meta.shelves`, a missing cover file, or more than four home-page favorites. A failed build leaves the live site on its last good version. Run it yourself with `node scripts/check-books.mjs`.

**Finishing a book:** move its entry from `antilibrary` to `library` and give it a `shelf`.

**Adding a book:** add it to `books.json`, then run `npm run covers`. The script finds the cover on [Open Library](https://openlibrary.org), saves a small WebP copy to `public/images/covers/`, and records the cover and Open Library link in `books.json`. Check the cover is the right edition; if not, set `coverId` by hand (or `noCover: true` to keep the generated cover) and run it again.

## Link preview image

`public/og.jpg` is the card shown when the site is shared (LinkedIn, iMessage, Slack). It's rendered from HTML by `scripts/make-og.mjs` using the site's fonts and headshot. Re-run it after changing the name, title or photo (needs Playwright, which isn't a project dependency).

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npx wrangler dev # serve dist/ the way Cloudflare does, headers included
```

Requires Node 22.12+.

## Privacy and security

- Strict Content Security Policy and security headers in `public/_headers`
- Fonts are self-hosted; book covers are generated, never fetched from third parties
- Images are stripped of metadata before they're added
- No secrets or private documents in this repo, ever (see `.gitignore`)
