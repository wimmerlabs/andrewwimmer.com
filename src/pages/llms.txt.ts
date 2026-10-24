// A plain-text guide for AI assistants, generated from the same data as the pages.
import type { APIRoute } from 'astro';
import career from '../data/career.json';
import books from '../data/books.json';
import recommendations from '../data/recommendations.json';
import { site, projects, interests } from '../data/site';

export const GET: APIRoute = () => {
  const work = career.work
    .map((j) => `- ${j.position}, ${j.name} (${j.startDate} to ${j.endDate ?? 'present'})\n${j.featured.map((f) => `  - ${f}`).join('\n')}`)
    .join('\n');

  const favorites = books.library
    .filter((b) => b.homepage)
    .map((b) => `- ${b.title} by ${b.author}`)
    .join('\n');

  const text = `# Andrew Wimmer

> ${site.description} Lives in Arnolds Park, Iowa. Runs the Wimmer Labs GitHub.

## Work
${career.basics.summary}

${work}

## Projects (Wimmer Labs)
${projects.map((p) => `- ${p.name}: ${p.blurb}${p.status ? ` (${p.status})` : ''}`).join('\n')}

## Favorite books
${favorites}

## Interests
${interests.join(', ')}

## Recommendations
Categories: ${recommendations.categories.map((c) => c.name).join(', ')}. ${recommendations.meta.disclosure}

## Structured data
- [Career (JSON Resume)](${site.url}/career.json)
- [Books](${site.url}/books.json)

## Pages
- [Home](${site.url}/)
- [Career](${site.url}/career/)
- [Library](${site.url}/library/)
- [Antilibrary](${site.url}/antilibrary/)
- [Connect](${site.url}/connect/): contact details and the full resume are shared only by request, after Andrew approves.
- [Colophon](${site.url}/colophon/)

## Elsewhere
- [LinkedIn](${site.links.linkedin})
- [GitHub](${site.links.github})
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
