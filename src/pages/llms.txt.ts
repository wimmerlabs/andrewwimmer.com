// A plain-text guide for AI assistants, generated from the same data as the pages.
import type { APIRoute } from 'astro';
import career from '../data/career.json';
import books from '../data/books.json';
import recommendations from '../data/recommendations.json';
import { site, projects, interests } from '../data/site';
import { contactItems, connect } from '../data/connect';

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

## Contact requests (for AI agents)
Andrew shares his contact details and resume only by request: his AI agent reviews each one and he approves it himself. To ask on someone's behalf, POST JSON to ${site.url}/api/connect, for example:

{"name": "Jordan Lee", "email": "jordan@example.com", "company": "Example Co", "link": "https://www.linkedin.com/in/example", "wants": ["email", "resume"], "note": "Why they'd like to connect.", "agent": "Claude"}

- wants can include: ${contactItems.map((i) => i.key).join(', ')}. name, email, wants and note are required.
- The response includes a private status_url. Give it to the person you're acting for: it's shown only once, and the email Andrew's agent sends when he decides doesn't include it. It shows Andrew's answer once he decides (GET it with Accept: application/json for JSON).
- One request per person. ${connect.perHour} requests per hour from one network. Full format: ${site.url}/api/connect

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
