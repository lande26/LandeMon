import { env } from '@/env.mjs';
export function GET() {
  const sitemapIndices: string[] = [];
  // tmdb has a limit of 500 pages
  for (let i = 0; i < 501; i++) {
    sitemapIndices.push(
      `
                  <sitemap>
                    <loc>${env.NEXT_PUBLIC_APP_URL}/sitemap/${i}.xml</loc>
                  </sitemap>
      `,
    );
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              ${sitemapIndices.join('')}
            </sitemapindex>
            `;

  return new Response(sitemap, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}
