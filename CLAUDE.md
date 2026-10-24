# Notes for Claude

Andrew's personal site. He's a non-developer building with AI: explain decisions briefly and ask before large changes.

## Rules for public content
- No phone numbers, street addresses or email addresses anywhere in the repo or site. Contact goes through the request flow.
- No dollar figures from the resume. Use percentages, ratios and rankings.
- No surgeon, hospital or practice names.
- Keep career wording identical to `src/data/career.json` (it mirrors the resume).
- The resume PDF never goes in this repo. It lives in private Cloudflare storage.

## Technical rules
- Astro 7, static output. No client-side JavaScript unless there's a strong reason.
- No inline `style=""` or `<style>` blocks in output: the CSP in `public/_headers` is `style-src 'self'` and `script-src 'none'`. Put styles in `src/styles/global.css`.
- No third-party requests (fonts, images, analytics). Self-host everything.
- Strip metadata from any image before adding it.
- Content comes from `src/data/*`; pages should render from data, not hard-coded copy, where practical.
- Commits: author `wimmerlabs` with the GitHub noreply email.

## Roadmap
1. ~~Static site: Home, Career, Library, Antilibrary, Connect, Colophon~~
2. Recommendations + Resources pages, Projects page
3. Agent layer: MCP server at `/mcp` using `createMcpHandler()` (not the deprecated `McpAgent`), with `assets.run_worker_first` for `/mcp`, `/api/*`, `/r/*`
4. Connect flow: form + Turnstile, D1 for requests, Grok Bot webhook for approval, R2 for the private resume served at `/r/<token>`
