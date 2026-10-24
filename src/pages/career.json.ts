import type { APIRoute } from 'astro';
import career from '../data/career.json';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(career, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
