import { auth } from '@/auth';
import { prisma } from '@/auth';
import { redirect } from 'next/navigation';
import MovieService from '@/services/MovieService';
import { type Show } from '@/types';
import ShowsGrid from '@/components/shows-grid';
// import { siteConfig } from '@/configs/site';

export const metadata = {
  title: 'Watch History',
  description: 'Continue watching your favorite shows.',
};

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/home?auth=true&callbackUrl=/history');
  }

  const historyLogs = await prisma.watchHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { watchedAt: 'desc' },
  });

  const hydratedShows = await Promise.all(
    historyLogs.map(async (hl) => {
      try {
        if (hl.mediaType === 'movie') {
          const res = await MovieService.findMovie(hl.tmdbId);
          return res.data;
        } else {
          const res = await MovieService.findTvSeries(hl.tmdbId);
          return res.data;
        }
      } catch (err) {
        console.error(`Failed to fetch TMDB data for history ${hl.tmdbId}`);
        return null;
      }
    }),
  );

  const shows: Show[] = hydratedShows.filter((s): s is Show => s !== null);

  return (
    <div className="flex flex-col gap-6 px-4 pb-12 pt-24 md:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          Watch History
        </h1>
        <p className="text-slate-400">
          Jump back into your recently watched shows.
        </p>
      </div>

      {shows.length > 0 ? (
        <ShowsGrid shows={shows} />
      ) : (
        <div className="mt-12 text-center text-slate-400">
          <p>You haven&apos;t watched any shows yet.</p>
        </div>
      )}
    </div>
  );
}
