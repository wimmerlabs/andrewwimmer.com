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
