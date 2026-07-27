'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Loading from '../ui/loading';
import Season from '../season';
import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { Users, Loader2, ExternalLink } from 'lucide-react';
import { trpc } from '@/client/trpc';

export interface EmbedPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}

export interface EmbedPlayerProps {
  tmdbId: string;
  mediaType: MediaType;
  roomId?: string;
  isWatchParty?: boolean;
  isHost?: boolean;
  // use unknown for external state payloads and let consumers narrow it
  onStateUpdate?: (state: unknown) => void;
}

const SERVERS = [
  { id: 'auto', name: 'Auto (Fastest)' },
  { id: 'vidsrc-cc', name: 'VidSrc CC (Default)' },
  { id: 'vidsrc-xyz', name: 'VidSrc XYZ' },
  { id: 'vidsync', name: 'VidSync' },
  { id: 'vidlink', name: 'VidLink' },
  { id: 'vidbinge', name: 'VidBinge' },
  { id: 'vidnest', name: 'VidNest' },
  { id: 'riveembed', name: 'RiveEmbed' },
  { id: 'smashystream', name: 'SmashyStream' },
];

import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/stores/auth-modal';

const EmbedPlayer = React.forwardRef<EmbedPlayerRef, EmbedPlayerProps>(
  (
    {
      tmdbId,
      mediaType,
      roomId,
      isWatchParty = false,
      isHost = false,
      onStateUpdate,
    },
    ref,
  ) => {
    const { data: session } = useSession();
    const authModal = useAuthModal();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [selectedServer, setSelectedServer] = useState('auto');
    const [currentEpisode, setCurrentEpisode] = useState<{
      s: number;
      e: number;
    } | null>(null);

    React.useImperativeHandle(ref, () => ({
      play: () => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ source: 'landemon-party', action: 'play' }),
          '*',
        );
      },
      pause: () => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ source: 'landemon-party', action: 'pause' }),
          '*',
        );
      },
      seek: (time: number) => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ source: 'landemon-party', action: 'seek', time }),
          '*',
        );
      },
      syncSource: (server: string, s?: number, e?: number) => {
        if (
          server !== selectedServer ||
          (s && e && (currentEpisode?.s !== s || currentEpisode?.e !== e))
        ) {
          setSelectedServer(server);
          if (s && e) setCurrentEpisode({ s, e });
          void updateIframe(server, s, e);
        }
      },
    }));

    React.useEffect(() => {
      const handleMessage = (e: MessageEvent) => {
        const data = e.data as { source?: string; state?: unknown } | undefined;
        if (data?.source === 'landemon-proxy' && onStateUpdate) {
          const state = (data.state ?? {}) as Record<string, unknown>;
          onStateUpdate({
            ...state,
            serverData: {
              server: selectedServer,
              s: currentEpisode?.s,
              e: currentEpisode?.e,
            },
          });
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [onStateUpdate, selectedServer, currentEpisode]);

    const loadingRef = useRef<HTMLDivElement>(null);
    const [seasons, setSeasons] = useState<ISeason[] | null>(null);

    const [isCreatingParty, setIsCreatingParty] = useState(false);
    const hasLoaded = useRef(false);
    const router = useRouter();

    const logHistoryMutation = trpc.history.logHistory.useMutation();

    const getEmbedUrl = useCallback(
      (server: string, type: MediaType, id: string, season = 1, eps = 1) => {
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
              ? `https://vidsrc.xyz/embed/movie/${id}`
              : `https://vidsrc.xyz/embed/tv/${id}/${season}/${eps}`;
        }
      },
      [],
    );

    const setIframeUrl = (newUrl: string) => {
      if (!iframeRef.current) return;
      console.log(`Loading Stream Server: ${newUrl}`);
      iframeRef.current.src = newUrl;
      iframeRef.current.style.opacity = '0';
      loadingRef.current?.style.setProperty('display', 'flex');
    };

    const onIframeLoad = () => {
      if (!iframeRef.current) return;
      iframeRef.current.style.opacity = '1';
      loadingRef.current?.style.setProperty('display', 'none');
    };

    const updateIframe = useCallback(
      async (serverKey: string, passedS?: number, passedE?: number) => {
        const finalS = passedS ?? currentEpisode?.s ?? 1;
        const finalE = passedE ?? currentEpisode?.e ?? 1;

        let targetServer = serverKey;
        const numericId = Number(tmdbId.replace('t-', '').replace('m-', ''));

        if (serverKey === 'auto') {
          try {
            const res = await fetch(
              `/api/stream?id=${numericId}&type=${mediaType}&season=${finalS}&episode=${finalE}`,
            );
            if (res.ok) {
              const data = (await res.json()) as {
                provider?: string;
                providers?: string[];
              };

              // If server supplied a single provider, prefer that as the target
              if (data.provider) {
                targetServer = data.provider;
              }

              // If server supplied a providers list (DISABLE_PROVIDER_PING mode), try them from the client
              if (Array.isArray(data.providers) && data.providers.length) {
                const providersToTry: string[] = data.providers;

                // helper that tries loading an iframe and resolves true if load fires within timeout
                const tryLoad = (url: string, timeout = 4000) =>
                  new Promise<boolean>((resolve) => {
                    const iframe = iframeRef.current;
                    if (!iframe) {
                      resolve(false);
                      return;
                    }

                    let cleared = false;
                    const onLoad = () => {
                      if (cleared) return;
                      cleared = true;
                      cleanup();
                      resolve(true);
                    };
                    const onError = () => {
                      if (cleared) return;
                      cleared = true;
                      cleanup();
                      resolve(false);
                    };
                    const timer = setTimeout(() => {
                      if (cleared) return;
                      cleared = true;
                      cleanup();
                      resolve(false);
                    }, timeout);
                    const cleanup = () => {
                      iframe.removeEventListener('load', onLoad);
                      iframe.removeEventListener('error', onError);
                      clearTimeout(timer);
                    };

                    iframe.addEventListener('load', onLoad);
                    iframe.addEventListener('error', onError);
                    // start loading
                    iframe.src = url;
                  });

                for (const p of providersToTry) {
                  const url = getEmbedUrl(p, mediaType, tmdbId, finalS, finalE);
                  // attempt to load; if success, set selected server and return early
                  // note: this will set the iframe to the working provider
                  // and avoid the later setIframeUrl call
                  // eslint-disable-next-line no-await-in-loop
                  const ok = await tryLoad(url);
                  if (ok) {
                    setSelectedServer(p);
                    // ensure loading visuals are correct
                    iframeRef.current?.style.setProperty('opacity', '1');
                    loadingRef.current?.style.setProperty('display', 'none');
                    return;
                  }
                }

                // if none succeeded, fall back to provided data.provider or default below
              }
            } else {
              targetServer = 'vidsrc-cc';
            }
          } catch (e) {
            targetServer = 'vidsrc-cc';
          }
        }

        if (serverKey === 'auto') {
          // Don't override the user's manual dropdown to a static server if they literally clicked 'Auto'
          // But we still load the targetServer iframe secretly.
        } else {
          setSelectedServer(targetServer);
        }

        const rawUrl = getEmbedUrl(
          targetServer,
          mediaType,
          tmdbId,
          finalS,
          finalE,
        );

        // 3. (RECOVERY) Disable proxy by default to restore "earlier working" state.
        // The ad-mitigation proxy was causing buffering and white screens.
        // We will revisit this once the worker is production-hardened.
        setIframeUrl(rawUrl);

        // Log history
        void logHistoryMutation.mutate({
          tmdbId: numericId,
          mediaType:
            mediaType === MediaType.ANIME
              ? 'anime'
              : mediaType === MediaType.MOVIE
                ? 'movie'
                : 'tv',
          progress: 0,
        });
      },
      [mediaType, tmdbId, currentEpisode, getEmbedUrl, logHistoryMutation],
    );

    const handleChangeEpisode = (episode: IEpisode) => {
      const s = episode.season_number;
      const e = episode.episode_number;
      setCurrentEpisode({ s, e });
      void updateIframe(selectedServer, s, e);
    };

    const loadShows = useCallback(
      async (id: string) => {
        // Determine numeric ID correctly if it passed 't-1234'
        const numericId = Number(id.replace('t-', '').replace('m-', ''));

        const res: AxiosResponse<Show> =
          await MovieService.findTvSeries(numericId);

        if (!res.data?.seasons?.length) {
          if (mediaType !== MediaType.MOVIE) {
            void updateIframe(selectedServer, 1, 1);
          }
          return;
        }

        const filteredSeasons = res.data.seasons.filter(
          (season: ISeason) => season.season_number,
        );

        const promises = filteredSeasons.map(async (season: ISeason) => {
          return MovieService.getSeasons(numericId, season.season_number);
        });

        const seasonWithEpisodes = await Promise.all(promises);
        setSeasons(
          seasonWithEpisodes.map(
            (response: AxiosResponse<ISeason>) => response.data,
          ),
        );

        setCurrentEpisode({ s: 1, e: 1 });
        void updateIframe(selectedServer, 1, 1);
      },
      [selectedServer, updateIframe, mediaType],
    );

    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      iframe.addEventListener('load', onIframeLoad);
      return () => iframe.removeEventListener('load', onIframeLoad);
    }, []);

    useEffect(() => {
      if (hasLoaded.current) return; // Prevent double trigger in React StrictMode

      if (mediaType === MediaType.ANIME || mediaType === MediaType.TV) {
        void loadShows(tmdbId);
      } else {
        void updateIframe(selectedServer);
      }
      hasLoaded.current = true;
    }, [mediaType, tmdbId, loadShows, updateIframe, selectedServer]);

    const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newServer = e.target.value;
      setSelectedServer(newServer);
      void updateIframe(newServer);
    };

    const handleCreateParty = () => {
      if (!session) {
        authModal.onOpen();
        return;
      }
      setIsCreatingParty(true);

      interface ShowData {
        name?: string | null;
        title?: string | null;
        poster_path?: string | null;
      }

      interface CreatePartyResponse {
        error?: string;
        roomId?: string;
      }

      const run = async () => {
        const showData: AxiosResponse<ShowData> = seasons?.length
          ? await MovieService.findTvSeries(
              Number(tmdbId.replace('t-', '').replace('m-', '')),
            )
          : await MovieService.findMovie(
              Number(tmdbId.replace('t-', '').replace('m-', '')),
            );
        const sd = showData.data;
        const title = seasons?.length
          ? (sd?.name ?? 'Watch Party')
          : (sd?.title ?? 'Watch Party');
        const posterPath = sd?.poster_path ?? '';

        const res = await fetch('/api/party/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tmdbId,
            mediaType,
            title,
            posterPath,
            season: currentEpisode?.s,
            episode: currentEpisode?.e,
          }),
        });

        const data = (await res.json()) as CreatePartyResponse;
        if (!res.ok) throw new Error(data.error ?? 'Failed to create party');

        if (data.roomId) {
          void router.push(`/party/${data.roomId}`);
        } else {
          throw new Error('No roomId returned from party creation');
        }
      };

      void run()
        .catch((unknownError: unknown) => {
          let msg = 'Failed to create Watch Party';
          if (unknownError instanceof Error) {
            msg = unknownError.message ?? msg;
          } else if (
            typeof unknownError === 'object' &&
            unknownError !== null &&
            'message' in unknownError &&
            typeof (unknownError as { message: unknown }).message === 'string'
          ) {
            msg = (unknownError as { message: string }).message;
          }
          console.error(unknownError);
          alert(msg);
        })
        .finally(() => {
          setIsCreatingParty(false);
        });
    };

    return (
      <div
        className={`relative w-full bg-black ${isWatchParty ? 'h-full' : 'h-[100dvh]'}`}>
        <div className="absolute right-4 top-4 z-50 flex items-center space-x-2">
          {!isWatchParty && (
            <button
              onClick={() => {
                void handleCreateParty();
              }}
              disabled={isCreatingParty}
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
              {isCreatingParty ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span>Watch Party</span>
            </button>
          )}

          {isHost && isWatchParty && roomId && (
            <button
              onClick={() =>
                window.open(
                  `/party/${roomId}/theater`,
                  'TheaterWindow',
                  'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no',
                )
              }
              className="group relative flex items-center space-x-2 overflow-hidden rounded-xl border border-primary/20 bg-primary/20 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary/30"
              title="Pop-out Theater Window for Screen Sharing">
              <div className="pointer-events-none absolute inset-0 animate-ping bg-primary/10 opacity-20 group-hover:hidden" />
              <ExternalLink className="h-4 w-4" />
              <span>Theater</span>
            </button>
          )}

          <div className="flex items-center space-x-2 rounded-xl border border-white/10 bg-black/60 p-2 backdrop-blur-md">
            <span className="hidden text-sm font-medium text-white sm:inline">
              Server:
            </span>
            {!isWatchParty || isHost ? (
              <select
                value={selectedServer}
                onChange={handleServerChange}
                className="cursor-pointer bg-transparent px-1 text-sm font-medium text-white outline-none">
                {SERVERS.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    className="bg-neutral-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="px-1 text-sm font-bold text-white">
                {SERVERS.find((s) => s.id === selectedServer)?.name ??
                  selectedServer}
              </span>
            )}
          </div>
        </div>

        {seasons && (!isWatchParty || isHost) && (
          <Season seasons={seasons} onChangeEpisode={handleChangeEpisode} />
        )}

        <div
          ref={loadingRef}
          className="absolute inset-0 z-[1] flex items-center justify-center bg-black">
          <Loading />
        </div>

        <iframe
          ref={iframeRef}
          className="h-full w-full border-none transition-opacity duration-300"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          style={{ opacity: 0 }}
        />
      </div>
    );
  },
);

export default EmbedPlayer;
// give forwardRef component a display name for react/devtools and lint rules
EmbedPlayer.displayName = 'EmbedPlayer';
