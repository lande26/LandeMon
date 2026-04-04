'use client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { getIdFromSlug, getNameFromShow, getSlug } from '@/lib/utils';
import MovieService from '@/services/MovieService';
import { useModalStore } from '@/stores/modal';
import { useSearchStore } from '@/stores/search';
import { MediaType, type Show } from '@/types';
import { type AxiosResponse } from 'axios';
import Link from 'next/link';
import React from 'react';
import CustomImage from './custom-image';
import { usePathname, useRouter } from 'next/navigation';
import { trpc } from '@/client/trpc';
import { Popcorn } from 'lucide-react';

interface HeroProps {
  randomShow: Show | null;
}

const Hero = ({ randomShow }: HeroProps) => {
  const path = usePathname();
  const router = useRouter();
  const [partyLoading, setPartyLoading] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, []);

  const handlePopstateEvent = () => {
    const pathname = window.location.pathname;
    if (!/\d/.test(pathname)) {
      modalStore.reset();
    } else if (/\d/.test(pathname)) {
      const movieId: number = getIdFromSlug(pathname);
      if (!movieId) return;
      const findMovie: Promise<AxiosResponse<Show>> = pathname.includes(
        '/tv-shows',
      )
        ? MovieService.findTvSeries(movieId)
        : MovieService.findMovie(movieId);
      findMovie
        .then((response: AxiosResponse<Show>) => {
          const { data } = response;
          useModalStore.setState({ show: data, open: true, play: true });
        })
        .catch((error) => {
          console.error(`findMovie: `, error);
        });
    }
  };

  const modalStore = useModalStore();
  const searchStore = useSearchStore();

  // Stable media type for DB key — never depends on async state
  const bookmarkMediaType =
    randomShow?.media_type === MediaType.MOVIE ? 'movie' : 'tv';

  const utils = trpc.useUtils();

  const isBookmarkedQuery = trpc.bookmark.isBookmarked.useQuery(
    { tmdbId: randomShow?.id ?? 0, mediaType: bookmarkMediaType },
    { enabled: !!randomShow?.id, retry: false },
  );

  const addBookmarkMutation = trpc.bookmark.addBookmark.useMutation({
    onMutate: async (variables) => {
      await utils.bookmark.isBookmarked.cancel(variables);
      const prev = utils.bookmark.isBookmarked.getData(variables);
      utils.bookmark.isBookmarked.setData(variables, true);
      return { prev };
    },
    onError: (_err, variables, context) => {
      utils.bookmark.isBookmarked.setData(variables, context?.prev ?? false);
    },
    onSettled: (_data, _err, variables) => {
      void utils.bookmark.isBookmarked.invalidate(variables);
    },
  });

  const removeBookmarkMutation = trpc.bookmark.removeBookmark.useMutation({
    onMutate: async (variables) => {
      await utils.bookmark.isBookmarked.cancel(variables);
      const prev = utils.bookmark.isBookmarked.getData(variables);
      utils.bookmark.isBookmarked.setData(variables, false);
      return { prev };
    },
    onError: (_err, variables, context) => {
      utils.bookmark.isBookmarked.setData(variables, context?.prev ?? true);
    },
    onSettled: (_data, _err, variables) => {
      void utils.bookmark.isBookmarked.invalidate(variables);
    },
  });

  const isBookmarked = isBookmarkedQuery.data ?? false;
  const isBookmarkPending =
    addBookmarkMutation.isLoading || removeBookmarkMutation.isLoading;

  const handleBookmarkToggle = () => {
    if (!randomShow?.id || isBookmarkPending) return;
    const payload = { tmdbId: randomShow.id, mediaType: bookmarkMediaType };
    if (isBookmarked) {
      removeBookmarkMutation.mutate(payload);
    } else {
      addBookmarkMutation.mutate(payload);
    }
  };

  const handleStartParty = async () => {
    if (!randomShow?.id || partyLoading) return;
    setPartyLoading(true);
    try {
      const res = await fetch('/api/party/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: randomShow.id,
          mediaType: bookmarkMediaType,
          title: randomShow.title ?? randomShow.name ?? '',
          posterPath: randomShow.poster_path ?? '',
        }),
      });
      if (!res.ok) return;
      const { roomId } = (await res.json()) as { roomId: string };
      router.push(`/party/${roomId}`);
    } catch {
      // silent fail — user will see nothing happened
    } finally {
      setPartyLoading(false);
    }
  };

  if (searchStore.query.length > 0) {
    return null;
  }

  const handleHref = (): string => {
    if (!randomShow) return '#';
    if (!path.includes('/anime')) {
      const type = randomShow.media_type === MediaType.MOVIE ? 'movie' : 'tv';
      return `/watch/${type}/${randomShow.id}`;
    }
    const prefix: string =
      randomShow?.media_type === MediaType.MOVIE ? 'm' : 't';
    const id = `${prefix}-${randomShow.id}`;
    return `/watch/anime/${id}`;
  };

  return (
    <section aria-label="Hero" className="w-full">
      {randomShow && (
        <>
          <div className="absolute inset-0 z-0 h-[143.75vw] w-full sm:h-[56.25vw]">
            <CustomImage
              src={`https://image.tmdb.org/t/p/original${
                randomShow?.backdrop_path ?? randomShow?.poster_path ?? ''
              }`}
              alt={randomShow?.title ?? 'poster'}
              className="-z-40 h-auto w-full object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 33vw"
              fill
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 top-0">
              <div className="absolute bottom-[10%] left-[4%] top-0 z-10 flex w-full flex-col justify-end space-y-3 md:bottom-[35%] md:w-[36%]">
                <h1 className="text-2xl font-bold md:text-[3vw]">
                  {randomShow?.title ?? randomShow?.name}
                </h1>
                <div className="flex space-x-2 text-sm font-semibold md:text-[1.2vw]">
                  <p className="text-green-600">
                    {Math.round(randomShow?.vote_average * 10) ?? '-'}% Match
                  </p>
                  <p>{randomShow?.release_date ?? '-'}</p>
                </div>
                <p className="hidden text-[1.2vw] sm:line-clamp-3">
                  {randomShow?.overview ?? '-'}
                </p>
                <div className="mt-[1.5vw] flex flex-wrap items-center gap-2">
                  {/* Play */}
                  <Link prefetch={false} href={handleHref()}>
                    <Button
                      aria-label="Play video"
                      className="h-auto flex-shrink-0 gap-2 rounded-xl px-3 md:px-4">
                      <Icons.play className="fill-current" aria-hidden="true" />
                      <span className="hidden md:inline">Play</span>
                    </Button>
                  </Link>

                  {/* More Info */}
                  <Button
                    aria-label="Open show's details modal"
                    variant="outline"
                    className="h-auto flex-shrink-0 gap-2 rounded-xl px-3 md:px-4"
                    onClick={() => {
                      const name = getNameFromShow(randomShow);
                      const p: string =
                        randomShow.media_type === MediaType.TV
                          ? 'tv-shows'
                          : 'movies';
                      window.history.pushState(
                        null,
                        '',
                        `${p}/${getSlug(randomShow.id, name)}`,
                      );
                      useModalStore.setState({
                        show: randomShow,
                        open: true,
                        play: true,
                      });
                    }}>
                    <Icons.info aria-hidden="true" />
                    <span className="hidden md:inline">More Info</span>
                  </Button>

                  {/* Bookmark */}
                  <Button
                    aria-label={
                      isBookmarked ? 'Remove bookmark' : 'Add bookmark'
                    }
                    variant="outline"
                    disabled={isBookmarkPending}
                    className="h-auto flex-shrink-0 gap-2 rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleBookmarkToggle}>
                    <Icons.bookmark
                      className={`h-5 w-5 transition-all duration-200 ${
                        isBookmarked
                          ? 'fill-current text-white'
                          : 'fill-transparent text-slate-400'
                      }`}
                    />
                  </Button>

                  {/* Watch Party */}
                  <Button
                    aria-label="Start Watch Party"
                    variant="outline"
                    disabled={partyLoading}
                    className="h-auto flex-shrink-0 gap-2 rounded-xl px-3 disabled:cursor-not-allowed disabled:opacity-50 md:px-4"
                    onClick={() => void handleStartParty()}>
                    <Popcorn className="h-5 w-5" />
                    <span className="hidden md:inline">
                      {partyLoading ? 'Starting…' : 'Watch Party'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="opacity-71 absolute inset-0 right-[26.09%] z-[8] bg-gradient-to-r from-secondary to-85%"></div>
            <div className="absolute bottom-[-1px] left-0 right-0 z-[8] h-[14.7vw] bg-gradient-to-b from-background/0 from-30% via-background/30 via-50% to-background to-80%"></div>
          </div>
          <div className="relative inset-0 -z-50 mb-0 pb-[135%] sm:pb-[40%]"></div>
        </>
      )}
    </section>
  );
};

export default Hero;
