'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Loading from '../ui/loading';
import Season from '../season';
import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { Users, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
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
  { id: 'viduki', name: 'Viduki' },
  { id: 'vidhive', name: 'VidHive' },
  { id: 'vidlink', name: 'VidLink' },
  { id: '2embed', name: '2Embed' },
  { id: 'vidnest', name: 'VidNest' },
  { id: 'vidsrc-sbs', name: 'VidSrc SBS' },
  { id: 'autoembed', name: 'AutoEmbed' },
  { id: 'moviesapi', name: 'MoviesAPI Club' },
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
    const currentActiveServerRef = useRef('viduki');
    const [currentEpisode, setCurrentEpisode] = useState<{
      s: number;
      e: number;
    } | null>(null);

    const logHistoryMutation = trpc.history.logHistory.useMutation();

    const lastProgressLogRef = useRef<{ time: number; progress: number }>({
      time: 0,
      progress: -1,
    });

    const logProgressSafe = useCallback(
      (progressPct: number) => {
        const now = Date.now();
        const numericId = Number(tmdbId.replace('t-', '').replace('m-', ''));
        if (
          now - lastProgressLogRef.current.time > 10000 ||
          Math.abs(progressPct - lastProgressLogRef.current.progress) >= 5
        ) {
          lastProgressLogRef.current = { time: now, progress: progressPct };
          void logHistoryMutation.mutate({
            tmdbId: numericId,
            mediaType:
              mediaType === MediaType.ANIME
                ? 'anime'
                : mediaType === MediaType.MOVIE
                  ? 'movie'
                  : 'tv',
            progress: progressPct,
          });
        }
      },
      [logHistoryMutation, mediaType, tmdbId],
    );

    const getEmbedUrl = useCallback(
      (server: string, type: MediaType, id: string, season = 1, eps = 1) => {
        const isMovie = type === MediaType.MOVIE;
        const cleanId = id.replace(/^[tm]-/, '');
        switch (server) {
          case 'viduki':
          case 'viduki-1':
            return isMovie
              ? `https://www.viduki.net/1/movie/${cleanId}?color=6366f1`
              : `https://www.viduki.net/1/tv/${cleanId}/${season}/${eps}?color=6366f1`;
          case 'viduki-2':
            return isMovie
              ? `https://www.viduki.net/2/movie/${cleanId}?color=6366f1`
              : `https://www.viduki.net/2/tv/${cleanId}/${season}/${eps}?color=6366f1`;
          case 'viduki-3':
            return isMovie
              ? `https://www.viduki.net/3/movie/${cleanId}?color=6366f1`
              : `https://www.viduki.net/3/tv/${cleanId}/${season}/${eps}?color=6366f1`;
          case 'viduki-4':
            return isMovie
              ? `https://www.viduki.net/4/movie/${cleanId}?color=6366f1`
              : `https://www.viduki.net/4/tv/${cleanId}/${season}/${eps}?color=6366f1`;
          case 'vidhive':
            return isMovie
              ? `https://vidhive.lol/embed/movie/${cleanId}?autoPlay=false&theme=6366f1`
              : `https://vidhive.lol/embed/tv/${cleanId}/${season}/${eps}?autoPlay=false&nextButton=true&autoNext=true&theme=6366f1`;
          case 'vidlink':
            return isMovie
              ? `https://vidlink.pro/movie/${cleanId}?autoplay=false`
              : `https://vidlink.pro/tv/${cleanId}/${season}/${eps}?autoplay=false`;
          case '2embed':
            return isMovie
              ? `https://www.2embed.cc/embed/${cleanId}`
              : `https://www.2embed.cc/embedtv/${cleanId}&s=${season}&e=${eps}`;
          case 'vidnest':
            return isMovie
              ? `https://vidnest.fun/movie/${cleanId}`
              : `https://vidnest.fun/tv/${cleanId}/${season}/${eps}`;
          case 'vidsrc-sbs':
            return isMovie
              ? `https://vidsrc.sbs/embed/movie/${cleanId}`
              : `https://vidsrc.sbs/embed/tv/${cleanId}/${season}/${eps}`;
          case 'autoembed':
            return isMovie
              ? `https://player.autoembed.cc/embed/movie/${cleanId}`
              : `https://player.autoembed.cc/embed/tv/${cleanId}/${season}/${eps}`;
          case 'moviesapi':
            return isMovie
              ? `https://moviesapi.club/movie/${cleanId}`
              : `https://moviesapi.club/tv/${cleanId}-${season}-${eps}`;
          default:
            return isMovie
              ? `https://www.viduki.net/1/movie/${cleanId}?color=6366f1`
              : `https://www.viduki.net/1/tv/${cleanId}/${season}/${eps}?color=6366f1`;
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

    const handleVidukiFallback = useCallback(() => {
      const fallbackChain = [
        'viduki',
        'viduki-2',
        'viduki-3',
        'viduki-4',
        'vidhive',
        'vidlink',
        '2embed',
        'vidnest',
        'vidsrc-sbs',
        'autoembed',
        'moviesapi',
      ];
      const current = currentActiveServerRef.current;
      const currentIndex = fallbackChain.indexOf(current);
      const nextServer = fallbackChain[currentIndex + 1] ?? 'vidhive';
      console.warn(
        `[Viduki Fallback] Auto-switching from ${current} to fallback server: ${nextServer}`,
      );
      currentActiveServerRef.current = nextServer;
      if (selectedServer !== 'auto') {
        setSelectedServer(
          nextServer.startsWith('viduki') ? 'viduki' : nextServer,
        );
      }
      const s = currentEpisode?.s ?? 1;
      const e = currentEpisode?.e ?? 1;
      const rawUrl = getEmbedUrl(nextServer, mediaType, tmdbId, s, e);
      setIframeUrl(rawUrl);
    }, [currentEpisode, getEmbedUrl, mediaType, selectedServer, tmdbId]);

    React.useImperativeHandle(ref, () => ({
      play: () => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ source: 'landemon-party', action: 'play' }),
          '*',
        );
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'VIDHIVE_PLAYER_COMMAND', action: 'play' },
          '*',
        );
      },
      pause: () => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ source: 'landemon-party', action: 'pause' }),
          '*',
        );
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'VIDHIVE_PLAYER_COMMAND', action: 'pause' },
          '*',
        );
      },
      seek: (time: number) => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ source: 'landemon-party', action: 'seek', time }),
          '*',
        );
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'VIDHIVE_PLAYER_COMMAND', action: 'seek', time },
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
        const data = e.data as
          | {
              type?: string;
              source?: string;
              state?: unknown;
              data?: any;
            }
          | undefined;

        if (!data) return;

        // 1. Viduki: Server Fallback Events
        const isVidukiOrigin =
          typeof e.origin === 'string' && e.origin.includes('viduki.net');
        if (
          isVidukiOrigin &&
          (data.type === 'viduki:all-servers-failed' ||
            data.type === 'all-servers-failed')
        ) {
          console.warn(
            '[Viduki] All backend servers failed on current API, swapping to fallback...',
            data,
          );
          handleVidukiFallback();
          return;
        }

        // 2. Viduki: Watch Progress (MEDIA_DATA)
        if (isVidukiOrigin && data.type === 'MEDIA_DATA' && data.data) {
          try {
            localStorage.setItem(
              'vidukinet-Progress',
              JSON.stringify(data.data),
            );
          } catch (err) {
            console.warn(
              'Failed to save vidukinet-Progress to localStorage:',
              err,
            );
          }
          const cleanId = tmdbId.replace(/^[tm]-/, '');
          const entry = data.data[cleanId] ?? Object.values(data.data)[0];
          if (
            entry?.progress?.duration &&
            entry.progress.watched !== undefined
          ) {
            const pct = Math.min(
              100,
              Math.round(
                (entry.progress.watched / entry.progress.duration) * 100,
              ),
            );
            logProgressSafe(pct);
          }
          return;
        }

        // 3. VidHive: Player Events
        if (data.type === 'VIDHIVE_PLAYER_EVENT' && data.data) {
          const p = data.data;
          if (onStateUpdate) {
            onStateUpdate({
              event: p.event,
              currentTime: p.currentTime,
              duration: p.duration,
              serverData: {
                server: selectedServer,
                s: currentEpisode?.s,
                e: currentEpisode?.e,
              },
            });
          }
          if (p.duration && p.currentTime !== undefined) {
            const pct = Math.min(
              100,
              Math.round((p.currentTime / p.duration) * 100),
            );
            logProgressSafe(pct);
          }
          return;
        }

        // 4. VidHive: Media Data Snapshot
        if (data.type === 'VIDHIVE_MEDIA_DATA' && data.data?.entry) {
          const entry = data.data.entry;
          try {
            localStorage.setItem('vidhive-Progress', JSON.stringify(entry));
          } catch (err) {
            console.warn(
              'Failed to save vidhive-Progress to localStorage:',
              err,
            );
          }
          if (
            entry.progress?.duration &&
            entry.progress.watched !== undefined
          ) {
            const pct = Math.min(
              100,
              Math.round(
                (entry.progress.watched / entry.progress.duration) * 100,
              ),
            );
            logProgressSafe(pct);
          }
          return;
        }

        // 5. LandeMon Proxy state update (for backwards compatibility / custom proxies)
        if (data.source === 'landemon-proxy' && onStateUpdate) {
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
    }, [
      onStateUpdate,
      selectedServer,
      currentEpisode,
      handleVidukiFallback,
      logProgressSafe,
      tmdbId,
    ]);

    const loadingRef = useRef<HTMLDivElement>(null);
    const [seasons, setSeasons] = useState<ISeason[] | null>(null);

    const [isCreatingParty, setIsCreatingParty] = useState(false);
    const hasLoaded = useRef(false);
    const router = useRouter();

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
                  // eslint-disable-next-line no-await-in-loop
                  const ok = await tryLoad(url);
                  if (ok) {
                    setSelectedServer(p);
                    currentActiveServerRef.current = p;
                    // ensure loading visuals are correct
                    iframeRef.current?.style.setProperty('opacity', '1');
                    loadingRef.current?.style.setProperty('display', 'none');
                    return;
                  }
                }

                // if none succeeded, fall back to provided data.provider or default below
              }
            } else {
              targetServer = 'viduki';
            }
          } catch (e) {
            targetServer = 'viduki';
          }
        }

        if (serverKey === 'auto') {
          // Don't override the user's manual dropdown to a static server if they literally clicked 'Auto'
          // But we still load the targetServer iframe secretly.
        } else {
          setSelectedServer(targetServer);
        }

        currentActiveServerRef.current = targetServer;

        const rawUrl = getEmbedUrl(
          targetServer,
          mediaType,
          tmdbId,
          finalS,
          finalE,
        );

        setIframeUrl(rawUrl);

        // Log initial view
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

    const handleNextServer = () => {
      const activeServers = SERVERS.filter((s) => s.id !== 'auto');
      const currentIndex = activeServers.findIndex(
        (s) => s.id === selectedServer,
      );
      const nextServer =
        activeServers[(currentIndex + 1) % activeServers.length] ??
        activeServers[0];
      if (nextServer) {
        setSelectedServer(nextServer.id);
        void updateIframe(nextServer.id);
      }
    };

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
            {(!isWatchParty || isHost) && (
              <button
                onClick={handleNextServer}
                title="Try Next Server"
                className="flex items-center justify-center rounded-lg p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
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
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
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
