import { auth } from '@/auth';
import { prisma } from '@/auth';
import { redirect } from 'next/navigation';
import MovieService from '@/services/MovieService';
import { type Show, MediaType } from '@/types';
import ShowsGrid from '@/components/shows-grid';
import { siteConfig } from '@/configs/site';

export const metadata = {
  title: 'My Bookmarks',
  description: 'Your saved movies and TV shows.',
};

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/home');
  }

  // 1. Fetch Bookmark stubs from Database
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: 'desc' },
  });

  // 2. Hydrate stubs with actual TMDB Data using MovieService
  const hydratedShows = await Promise.all(
    bookmarks.map(async (bm) => {
      try {
        if (bm.mediaType === 'movie') {
          const res = await MovieService.findMovie(bm.tmdbId);
          return res.data;
        } else {
          // Both anime and tv are technically TV endpoints in TMDB
          const res = await MovieService.findTvSeries(bm.tmdbId);
          return res.data;
        }
      } catch (err) {
        console.error(`Failed to fetch TMDB data for bookmark ${bm.tmdbId}`);
        return null;
      }
    })
  );

  // Filter out any that failed to fetch
  const shows: Show[] = hydratedShows.filter((s): s is Show => s !== null);

  return (
    <div className="flex flex-col gap-6 px-4 pt-24 pb-12 md:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">My List</h1>
        <p className="text-slate-400">Shows and movies you've favorited.</p>
      </div>
      
      {shows.length > 0 ? (
        <ShowsGrid shows={shows} />
      ) : (
        <div className="mt-12 text-center text-slate-400">
          <p>You haven't bookmarked any shows yet.</p>
        </div>
      )}
    </div>
  );
}
