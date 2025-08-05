import { env } from '@/env.mjs';
import { buildMovieUrl } from '@/lib/utils';
import { getTrendingAll } from '@/services/MovieService/tmdbService';

export async function GET(request: Request, ctx: { params: { id: string } }) {
  if (!ctx.params.id) return new Response('Not found', { status: 404 });
  const id = parseInt(ctx.params.id.replace('.xml', ''));
  let urls: string[] = [];
  if (id === 0) {
    urls = [
      `${env.NEXT_PUBLIC_APP_URL}`,
      `${env.NEXT_PUBLIC_APP_URL}/home`,
      `${env.NEXT_PUBLIC_APP_URL}/tv-shows`,
      `${env.NEXT_PUBLIC_APP_URL}/movies`,
      `${env.NEXT_PUBLIC_APP_URL}/new-and-popular`,
    ];
  } else {
    const data = await getTrendingAll(id);
    data.results.forEach((show) => urls.push(buildMovieUrl(show)));
  }
  const sitemap = `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${urls
        .map((url) => {
          return `
                <url>
                    <loc>${url}</loc>
                </url>
              `;
        })
        .join('')}
    </urlset>
  `;

  return new Response(sitemap, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}
