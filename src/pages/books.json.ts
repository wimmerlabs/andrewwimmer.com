import type { APIRoute } from 'astro';
import books from '../data/books.json';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(books, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
