import { type NextRequest, NextResponse } from 'next/server';
import { MediaType } from '@/types';
import { getCached } from '@/lib/cache';

// Priority-ordered list of providers for Auto mode.
// Streaming CDNs actively block server-side pings (Vercel IPs are flagged),
// so we cannot reliably test providers at request time. Instead, we return
// the most consistently available provider as the default, and let the client
// fall back via server switching if it doesn't load.
// const AUTO_PROVIDER = 'vidsrc-cc';

function getEmbedUrl(
  server: string,
  type: MediaType,
  id: string,
  season = 1,
  eps = 1,
) {
  const isMovie = type === MediaType.MOVIE;
  switch (server) {
    case 'vidsrc-xyz':
      if (type === MediaType.ANIME)
        return `https://vidsrc.xyz/embed/anime/tmdb${id}/${eps}/sub?autoPlay=false`;
      return isMovie
        ? `https://vidsrc.xyz/embed/movie/${id}`
        : `https://vidsrc.xyz/embed/tv/${id}/${season}/${eps}`;
    case 'vidsrc-cc':
      if (type === MediaType.ANIME)
        return `https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub?autoPlay=false`;
      return isMovie
        ? `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false`
        : `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
    case 'vidsync':
      return isMovie
        ? `https://vidsync.xyz/embed/movie/${id}?autoPlay=false`
        : `https://vidsync.xyz/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
    case 'vidlink':
      return isMovie
        ? `https://vidlink.pro/movie/${id}?autoplay=false`
        : `https://vidlink.pro/tv/${id}/${season}/${eps}?autoplay=false`;
    case 'vidbinge':
      return isMovie
        ? `https://vidbinge.dev/embed/movie/${id}`
        : `https://vidbinge.dev/embed/tv/${id}/${season}/${eps}`;
    case 'vidnest':
      return isMovie
        ? `https://vidnest.fun/movie/${id}`
        : `https://vidnest.fun/tv/${id}/${season}/${eps}`;
    case 'riveembed':
      return isMovie
        ? `https://rivestream.org/embed?type=movie&id=${id}`
        : `https://rivestream.org/embed?type=tv&id=${id}&season=${season}&episode=${eps}`;
    case 'smashystream':
      return isMovie
        ? `https://embed.smashystream.com/playere.php?tmdb=${id}`
        : `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${eps}`;
    default:
      return isMovie
        ? `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false`
        : `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
  }
}

const PROVIDERS = [
  'vidsrc-cc',
  'vidsrc-xyz',
  'vidlink',
  'smashystream',
  'vidbinge',
  'vidnest',
  'riveembed',
];

// function getEmbedUrl(server: string, type: MediaType, id: string, season: number = 1, eps: number = 1) {
//     const isMovie = type === MediaType.MOVIE;
//     switch(server) {
//       case 'vidsrc-xyz':
//         if (type === MediaType.ANIME) return `https://vidsrc.xyz/embed/anime/tmdb${id}/${eps}/sub?autoPlay=false`;
//         return isMovie ? `https://vidsrc.xyz/embed/movie/${id}` : `https://vidsrc.xyz/embed/tv/${id}/${season}/${eps}`;
//       case 'vidsrc-cc':
//         if (type === MediaType.ANIME) return `https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub?autoPlay=false`;
//         return isMovie ? `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false` : `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
//       case 'vidsync':
//         return isMovie ? `https://vidsync.xyz/embed/movie/${id}?autoPlay=false` : `https://vidsync.xyz/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
//       case 'vidlink':
//         return isMovie ? `https://vidlink.pro/movie/${id}?autoplay=false` : `https://vidlink.pro/tv/${id}/${season}/${eps}?autoplay=false`;
//       case 'vidbinge':
//         return isMovie ? `https://vidbinge.dev/embed/movie/${id}` : `https://vidbinge.dev/embed/tv/${id}/${season}/${eps}`;
//       case 'vidnest':
//         return isMovie ? `https://vidnest.fun/movie/${id}` : `https://vidnest.fun/tv/${id}/${season}/${eps}`;
//       case 'riveembed':
//         return isMovie ? `https://rivestream.org/embed?type=movie&id=${id}` : `https://rivestream.org/embed?type=tv&id=${id}&season=${season}&episode=${eps}`;
//       case 'smashystream':
//         return isMovie ? `https://embed.smashystream.com/playere.php?tmdb=${id}` : `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${eps}`;
//       default:
//         return isMovie ? `https://vidsrc.xyz/embed/movie/${id}` : `https://vidsrc.xyz/embed/tv/${id}/${season}/${eps}`;
//     }
// }

async function pingProvider(url: string, timeoutMs = 3000): Promise<boolean> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // We strictly use a GET request instead of HEAD because many scrape-blockers explicitly drop HEAD requests.
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });

    clearTimeout(id);

    // As long as we get a 200 series, we assume the server is fundamentally online to serve the iframe.
    return response.ok;
  } catch (error) {
    clearTimeout(id);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmdbId = searchParams.get('id');
  const type = searchParams.get('type') as MediaType;
  const season = Number(searchParams.get('season') ?? '1');
  const episode = Number(searchParams.get('episode') ?? '1');

  if (!tmdbId || !type) {
    return NextResponse.json(
      { error: 'Missing required parameters: id and type' },
      { status: 400 },
    );
  }

  // Define unique cache key for this specific media item
  const cacheKey = `stream:${type}:${tmdbId}:${season}:${episode}`;

  // 1 hour TTL for verified working provider per stream. We don't want 24 hours because pirate sites break hourly.
  const CACHE_TTL = 3600;

  // If provider pinging is disabled (e.g. in production on Railway/Vercel),
  // return a fast default provider and the full provider list so the
  // client can attempt fallbacks in-browser.
  if (process.env.DISABLE_PROVIDER_PING === '1') {
    const defaultProvider = PROVIDERS[0];
    return NextResponse.json({
      provider: defaultProvider,
      url: getEmbedUrl(defaultProvider, type, tmdbId, season, episode),
      providers: PROVIDERS,
    });
  }

  const fastestProvider = await getCached<string | null>(
    cacheKey,
    CACHE_TTL,
    async () => {
      // Execute the Fallback Chain exactly as specified in the Implementation Plan
      for (const provider of PROVIDERS) {
        const testUrl = getEmbedUrl(provider, type, tmdbId, season, episode);

        console.log(
          `[Stream Fallback] Testing provider: ${provider} at ${testUrl}`,
        );
        const isUp = await pingProvider(testUrl, 3000); // 3-second strict timeout

        if (isUp) {
          console.log(
            `[Stream Fallback] SUCCESS: Provider ${provider} is fully responsive.`,
          );
          return provider;
        }
      }
      return null;
    },
  );

  if (!fastestProvider) {
    return NextResponse.json(
      { error: 'Content currently unavailable from all providers.' },
      { status: 503 },
    );
  }

  // Return both the ID and the raw URL so the frontend can display the selected Dropdown accurately
  return NextResponse.json({
    provider: fastestProvider,
    url: getEmbedUrl(fastestProvider, type, tmdbId, season, episode),
  });
}
