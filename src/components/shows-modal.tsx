'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { getMobileDetect, getYear } from '@/lib/utils';
import MovieService from '@/services/MovieService';
import { useModalStore } from '@/stores/modal';
import { trpc } from '@/client/trpc';
import {
  type KeyWord,
  MediaType,
  type Genre,
  type ShowWithGenreAndVideo,
  type VideoResult,
} from '@/types';
import Link from 'next/link';
import * as React from 'react';
import Youtube from 'react-youtube';
import CustomImage from './custom-image';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/stores/auth-modal';

type YouTubePlayer = {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  seekTo: (value: number) => void;
  container: HTMLDivElement;
  internalPlayer: YouTubePlayer;
};

type YouTubeEvent = {
  target: YouTubePlayer;
};

const userAgent =
  typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
const { isMobile } = getMobileDetect(userAgent);
const defaultOptions: Record<string, object> = {
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    rel: 0,
    mute: isMobile() ? 1 : 0,
    loop: 1,
    autoplay: 1,
    controls: 0,
    showinfo: 0,
    disablekb: 1,
    enablejsapi: 1,
    playsinline: 1,
    cc_load_policy: 0,
    modestbranding: 3,
  },
};

const ShowModal = () => {
  // stores
  const modalStore = useModalStore();
  const IS_MOBILE: boolean = isMobile();

  const [trailer, setTrailer] = React.useState('');
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [isAnime, setIsAnime] = React.useState<boolean>(false);
  const [isMuted, setIsMuted] = React.useState<boolean>(
    modalStore.firstLoad || IS_MOBILE,
  );
  const [options, setOptions] =
    React.useState<Record<string, object>>(defaultOptions);

  // refs
  const imageRef = React.useRef<HTMLImageElement>(null);
  const youtubeRef = React.useRef<YouTubePlayer>(null);

  // Stable key for DB lookups — never depends on async isAnime state.
  // Using show.media_type directly ('movie' | 'tv') ensures the same key
  // is used whether the modal opened before or after keywords were fetched.
  const bookmarkMediaType =
    modalStore.show?.media_type === MediaType.MOVIE ? 'movie' : 'tv';

  const utils = trpc.useUtils();

  const isBookmarkedQuery = trpc.bookmark.isBookmarked.useQuery(
    { tmdbId: modalStore.show?.id ?? 0, mediaType: bookmarkMediaType },
    { enabled: !!modalStore.show?.id, retry: false },
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

  const { data: session } = useSession();
  const authModal = useAuthModal();

  const handleBookmarkToggle = () => {
    if (!session) {
      authModal.onOpen();
      return;
    }
    if (!modalStore.show?.id || isBookmarkPending) return;
    const payload = {
      tmdbId: modalStore.show.id,
      mediaType: bookmarkMediaType,
    };
    if (isBookmarked) {
      removeBookmarkMutation.mutate(payload);
    } else {
      addBookmarkMutation.mutate(payload);
    }
  };

  React.useEffect(() => {
    if (modalStore.firstLoad || IS_MOBILE) {
      setOptions((state: Record<string, object>) => ({
        ...state,
        playerVars: { ...state.playerVars, mute: 1 },
      }));
    }
    void handleGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setIsAnime(false);
  }, [modalStore.open, modalStore.show?.id]);

  const handleGetData = async () => {
    const id: number | undefined = modalStore.show?.id;
    const type: string =
      modalStore.show?.media_type === MediaType.TV ? 'tv' : 'movie';
    if (!id || !type) {
      return;
    }

    try {
      const data: ShowWithGenreAndVideo =
        await MovieService.findMovieByIdAndType(id, type);

      const keywords: KeyWord[] =
        data?.keywords?.results || data?.keywords?.keywords;

      if (keywords?.length) {
        setIsAnime(
          !!keywords.find((keyword: KeyWord) => keyword.name === 'anime'),
        );
      }

      if (data?.genres) {
        setGenres(data.genres);
      }
      if (data.videos?.results?.length) {
        const videoData: VideoResult[] = data.videos?.results;
        const result: VideoResult | undefined = videoData.find(
          (item: VideoResult) => item.type === 'Trailer',
        );
        if (result?.key) setTrailer(result.key);
      }
    } catch (error) {
      console.error('Failed to get show data:', error);
    }
  };

  const handleCloseModal = () => {
    modalStore.reset();
    if (!modalStore.show || modalStore.firstLoad) {
      window.history.pushState(null, '', '/home');
    } else {
      window.history.back();
    }
  };

  const onEnd = (event: YouTubeEvent) => {
    event.target.seekTo(0);
  };

  const onPlay = () => {
    if (imageRef.current) {
      imageRef.current.style.opacity = '0';
    }
    if (youtubeRef.current) {
      const iframeRef: HTMLElement | null =
        document.getElementById('video-trailer');
      if (iframeRef) iframeRef.classList.remove('opacity-0');
    }
  };

  const onReady = (event: YouTubeEvent) => {
    event.target.playVideo();
  };

  const handleChangeMute = () => {
    setIsMuted((state: boolean) => !state);
    if (!youtubeRef.current) return;
    const videoRef: YouTubePlayer = youtubeRef.current as YouTubePlayer;
    if (isMuted && youtubeRef.current) {
      videoRef.internalPlayer.unMute();
    } else if (youtubeRef.current) {
      videoRef.internalPlayer.mute();
    }
  };

  const handleHref = (): string => {
    const type = isAnime
      ? 'anime'
      : modalStore.show?.media_type === MediaType.MOVIE
        ? 'movie'
        : 'tv';
    let id = `${modalStore.show?.id}`;
    if (isAnime) {
      const prefix: string =
        modalStore.show?.media_type === MediaType.MOVIE ? 'm' : 't';
      id = `${prefix}-${id}`;
    }
    return `/watch/${type}/${id}`;
  };

  return (
    <Dialog
      open={modalStore.open}
      onOpenChange={handleCloseModal}
      aria-label="Modal containing show's details">
      <DialogContent className="w-full overflow-hidden rounded-md bg-zinc-900 p-0 text-left align-middle shadow-xl dark:bg-zinc-900 sm:max-w-3xl lg:max-w-4xl">
        <div className="video-wrapper relative aspect-video">
          <CustomImage
            fill
            priority
            ref={imageRef}
            alt={modalStore?.show?.title ?? 'poster'}
            className="-z-40 z-[1] h-auto w-full object-cover"
            src={`https://image.tmdb.org/t/p/original${
              modalStore.show?.backdrop_path ?? modalStore.show?.poster_path
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 33vw"
          />
          {trailer && (
            <Youtube
              opts={options}
              onEnd={onEnd}
              onPlay={onPlay}
              ref={youtubeRef}
              onReady={onReady}
              videoId={trailer}
              id="video-trailer"
              title={
                modalStore.show?.title ??
                modalStore.show?.name ??
                'video-trailer'
              }
              className="relative aspect-video w-full"
              style={{ width: '100%', height: '100%' }}
              iframeClassName={`relative pointer-events-none w-[100%] h-[100%] z-[-10] opacity-0`}
            />
          )}
          <div className="absolute bottom-6 z-20 flex w-full items-center justify-between gap-2 px-10">
            <div className="flex items-center gap-2.5">
              <Link href={handleHref()}>
                <Button
                  aria-label="Play show"
                  className="group h-auto rounded py-1.5">
                  <>
                    <Icons.play
                      className="mr-1.5 h-6 w-6 fill-current"
                      aria-hidden="true"
                    />
                    Play
                  </>
                </Button>
              </Link>
              <Button
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                variant="outline"
                disabled={isBookmarkPending}
                className="group h-auto rounded border-slate-400 bg-neutral-800 py-1.5 opacity-80 hover:bg-neutral-800 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                onClick={handleBookmarkToggle}>
                <Icons.bookmark
                  className={`h-6 w-6 transition-all duration-200 ${
                    isBookmarked
                      ? 'fill-current text-white'
                      : 'fill-transparent text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              </Button>
            </div>
            <Button
              aria-label={`${isMuted ? 'Unmute' : 'Mute'} video`}
              variant="ghost"
              className="h-auto rounded-full bg-neutral-800 p-1.5 opacity-50 ring-1 ring-slate-400 hover:bg-neutral-800 hover:opacity-100 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              onClick={handleChangeMute}>
              {isMuted ? (
                <Icons.volumeMute className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Icons.volume className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-2.5 px-10 pb-10">
          <DialogTitle className="text-lg font-medium leading-6 text-slate-50 sm:text-xl">
            {modalStore.show?.title ?? modalStore.show?.name}
          </DialogTitle>
          <div className="flex items-center space-x-2 text-sm sm:text-base">
            <p className="font-semibold text-green-400">
              {Math.round((Number(modalStore.show?.vote_average) / 10) * 100) ??
                '-'}
              % Match
            </p>
            {modalStore.show?.release_date ? (
              <p>{getYear(modalStore.show?.release_date)}</p>
            ) : modalStore.show?.first_air_date ? (
              <p>{getYear(modalStore.show?.first_air_date)}</p>
            ) : null}
            {modalStore.show?.original_language && (
              <span className="grid h-4 w-7 place-items-center text-xs font-bold text-neutral-400 ring-1 ring-neutral-400">
                {modalStore.show.original_language.toUpperCase()}
              </span>
            )}
          </div>
          <DialogDescription className="line-clamp-3 text-xs text-slate-50 dark:text-slate-50 sm:text-sm">
            {modalStore.show?.overview ?? '-'}
          </DialogDescription>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-400">Genres:</span>
            {genres.map((genre) => genre.name).join(', ')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowModal;
