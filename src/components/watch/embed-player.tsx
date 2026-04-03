'use client';
// // import React from 'react';
// // import Loading from '../ui/loading';
// // import { useRouter } from 'next/navigation';
// // import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
// // import MovieService from '@/services/MovieService';
// // import { type AxiosResponse } from 'axios';
// // import Season from '../season';

// // interface EmbedPlayerProps {
// //   url: string;
// //   movieId?: string;
// //   mediaType?: MediaType;
// // }

// // function EmbedPlayer(props: EmbedPlayerProps) {
// //   const router = useRouter();

// //   const [seasons, setSeasons] = React.useState<ISeason[] | null>(null);

// //   React.useEffect(() => {
// //     // if anime type -> handle after fetch season and episode
// //     if (props.mediaType === MediaType.ANIME) {
// //       return;
// //     }
// //     if (iframeRef.current) {
// //       iframeRef.current.src = props.url;
// //     }

// //     const { current } = iframeRef;
// //     const iframe: HTMLIFrameElement | null = current;
// //     iframe?.addEventListener('load', handleIframeLoaded);
// //     return () => {
// //       iframe?.removeEventListener('load', handleIframeLoaded);
// //     };
// //   }, []);

// //   React.useEffect(() => {
// //     if (!props.movieId || props.mediaType !== MediaType.ANIME) {
// //       return;
// //     }

// //     void handleAnime(props.movieId);
// //   }, [props.movieId, props.mediaType]);

// //   const loadingRef = React.useRef<HTMLDivElement>(null);
// //   const iframeRef = React.useRef<HTMLIFrameElement>(null);

// //   const handleChangeEpisode = (episode: IEpisode): void => {
// //     const { show_id: id, episode_number: eps } = episode;
// //     handleSetIframeUrl(`https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub`);
// //   };

// //   const handleAnime = async (movieId: string) => {
// //     const id = Number(movieId.replace('t-', ''));
// //     const response: AxiosResponse<Show> = await MovieService.findTvSeries(id);
// //     const { data } = response;
// //     if (!data?.seasons?.length) {
// //       return;
// //     }
// //     const seasons = data.seasons.filter(
// //       (season: ISeason) => season.season_number,
// //     );
// //     const promises = seasons.map(async (season: ISeason) => {
// //       return MovieService.getSeasons(id, season.season_number);
// //     });

// //     const seasonWithEpisodes = await Promise.all(promises);
// //     setSeasons(
// //       seasonWithEpisodes.map((res: AxiosResponse<ISeason>) => res.data),
// //     );
// //     handleSetIframeUrl(
// //       `https://vidsrc.cc/v2/embed/anime/tmdb${id}/1/sub?autoPlay=false`,
// //     );
// //   };

// //   const handleSetIframeUrl = (url: string): void => {
// //     if (!iframeRef.current) {
// //       return;
// //     }
// //     iframeRef.current.src = url;
// //     const { current } = iframeRef;
// //     const iframe: HTMLIFrameElement | null = current;
// //     iframe.addEventListener('load', handleIframeLoaded);
// //     if (loadingRef.current) loadingRef.current.style.display = 'flex';
// //   };

// //   const handleIframeLoaded = () => {
// //     if (!iframeRef.current) {
// //       return;
// //     }
// //     const iframe: HTMLIFrameElement = iframeRef.current;
// //     if (iframe) {
// //       iframe.style.opacity = '1';
// //       iframe.removeEventListener('load', handleIframeLoaded);
// //       if (loadingRef.current) loadingRef.current.style.display = 'none';
// //     }
// //   };

// //   return (
// //     <div
// //       style={{
// //         width: '100%',
// //         height: '100%',
// //         position: 'absolute',
// //         backgroundColor: '#000',
// //       }}>
// //       {seasons && (
// //         <Season seasons={seasons ?? []} onChangeEpisode={handleChangeEpisode} />
// //       )}
// //       <div className="header-top absolute left-0 right-0 top-8 z-[2] flex h-fit w-fit items-center justify-between gap-x-5 px-4 md:h-20 md:gap-x-8 md:px-10 lg:h-24">
// //         <div className="flex flex-1 items-center gap-x-5 md:gap-x-8">
// //           <svg
// //             className="h-10 w-10 flex-shrink-0 cursor-pointer transition hover:scale-125"
// //             stroke="#fff"
// //             fill="#fff"
// //             strokeWidth="0"
// //             viewBox="0 0 16 16"
// //             height="16px"
// //             width="16px"
// //             xmlns="http://www.w3.org/2000/svg"
// //             onClick={() => router.back()}>
// //             <path
// //               fillRule="evenodd"
// //               d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
// //           </svg>
// //         </div>
// //       </div>
// //       <div
// //         ref={loadingRef}
// //         className="absolute z-[1] flex h-full w-full items-center justify-center">
// //         <Loading />
// //       </div>
// //       <iframe
// //         width="100%"
// //         height="100%"
// //         allowFullScreen
// //         ref={iframeRef}
// //         style={{ opacity: 0 }}
// //         referrerPolicy="no-referrer-when-downgrade"
// //       />
// //     </div>
// //   );
// // }

// // export default EmbedPlayer;

// 'use client';

// import React, { useRef, useState, useEffect, useCallback } from 'react';
// import Loading from '../ui/loading';
// import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import Loading from '../ui/loading';
import Season from '../season';
import { MediaType, IEpisode, type ISeason, type Show } from '@/types';
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
  onStateUpdate?: (state: any) => void;
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

const EmbedPlayer = React.forwardRef<EmbedPlayerRef, EmbedPlayerProps>(({
  tmdbId,
  mediaType,
  roomId,
  isWatchParty = false,
  isHost = false,
  onStateUpdate,
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [selectedServer, setSelectedServer] = useState('auto');
  const [currentEpisode, setCurrentEpisode] = useState<{s: number; e: number} | null>(null);

  React.useImperativeHandle(ref, () => ({
    play: () => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ source: 'landemon-party', action: 'play' }), '*');
    },
    pause: () => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ source: 'landemon-party', action: 'pause' }), '*');
    },
    seek: (time: number) => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ source: 'landemon-party', action: 'seek', time }), '*');
    },
    syncSource: (server: string, s?: number, e?: number) => {
      if (server !== selectedServer || (s && e && (currentEpisode?.s !== s || currentEpisode?.e !== e))) {
        setSelectedServer(server);
        if (s && e) setCurrentEpisode({ s, e });
        updateIframe(server, s, e);
      }
    }
  }));

  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const data = e.data;
      if (data?.source === 'landemon-proxy' && onStateUpdate) {
        onStateUpdate({
           ...data.state,
           serverData: { server: selectedServer, s: currentEpisode?.s, e: currentEpisode?.e }
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onStateUpdate]);

  const loadingRef = useRef<HTMLDivElement>(null);
  const [seasons, setSeasons] = useState<ISeason[] | null>(null);
  
  const [isCreatingParty, setIsCreatingParty] = useState(false);
  const hasLoaded = useRef(false);
  const router = useRouter();

  const logHistoryMutation = trpc.history.logHistory.useMutation();

  const getEmbedUrl = useCallback((server: string, type: MediaType, id: string, season: number = 1, eps: number = 1) => {
    const isMovie = type === MediaType.MOVIE;
    switch(server) {
      case 'vidsrc-xyz':
        if (type === MediaType.ANIME) return `https://vidsrc.xyz/embed/anime/tmdb${id}/${eps}/sub?autoPlay=false`;
        return isMovie ? `https://vidsrc.xyz/embed/movie/${id}` : `https://vidsrc.xyz/embed/tv/${id}/${season}/${eps}`;
      case 'vidsrc-cc':
        if (type === MediaType.ANIME) return `https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub?autoPlay=false`;
        return isMovie ? `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false` : `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
      case 'vidsync':
        return isMovie ? `https://vidsync.xyz/embed/movie/${id}?autoPlay=false` : `https://vidsync.xyz/embed/tv/${id}/${season}/${eps}?autoPlay=false`;
      case 'vidlink':
        return isMovie ? `https://vidlink.pro/movie/${id}?autoplay=false` : `https://vidlink.pro/tv/${id}/${season}/${eps}?autoplay=false`;
      case 'vidbinge':
        return isMovie ? `https://vidbinge.dev/embed/movie/${id}` : `https://vidbinge.dev/embed/tv/${id}/${season}/${eps}`;
      case 'vidnest':
        return isMovie ? `https://vidnest.fun/movie/${id}` : `https://vidnest.fun/tv/${id}/${season}/${eps}`;
      case 'riveembed':
        return isMovie ? `https://rivestream.org/embed?type=movie&id=${id}` : `https://rivestream.org/embed?type=tv&id=${id}&season=${season}&episode=${eps}`;
      case 'smashystream':
        return isMovie ? `https://embed.smashystream.com/playere.php?tmdb=${id}` : `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${eps}`;
      default:
        return isMovie ? `https://vidsrc.xyz/embed/movie/${id}` : `https://vidsrc.xyz/embed/tv/${id}/${season}/${eps}`;
    }
  }, []);

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

  const updateIframe = useCallback(async (serverKey: string, passedS?: number, passedE?: number) => {
    const finalS = passedS ?? currentEpisode?.s ?? 1;
    const finalE = passedE ?? currentEpisode?.e ?? 1;
    
    let targetServer = serverKey;
    const numericId = Number(tmdbId.replace('t-', '').replace('m-', ''));
    
    if (serverKey === 'auto') {
      try {
        const res = await fetch(`/api/stream?id=${numericId}&type=${mediaType}&season=${finalS}&episode=${finalE}`);
        if (res.ok) {
          const data = await res.json();
          targetServer = data.provider;
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

    const rawUrl = getEmbedUrl(targetServer, mediaType, tmdbId, finalS, finalE);
    
    // As per user request: only use the Cloudflare ad-mitigation proxy for vidsrc-cc
    // Other servers have aggressive domain-locks that break API fetch (CORS) when proxied.
    if (targetServer === 'vidsrc-cc') {
      const PROXY_URL = process.env.NODE_ENV === "development" 
        ? "http://127.0.0.1:8787" 
        : (process.env.NEXT_PUBLIC_AD_PROXY_URL || "https://lande-mon-ad-proxy.your-cloudflare-username.workers.dev");
        
      const newUrl = `${PROXY_URL}/?url=${encodeURIComponent(rawUrl)}`;
      setIframeUrl(newUrl);
    } else {
      setIframeUrl(rawUrl);
    }
    
    logHistoryMutation.mutate({
      tmdbId: numericId,
      mediaType: mediaType === MediaType.ANIME ? 'anime' : mediaType === MediaType.MOVIE ? 'movie' : 'tv',
      progress: 0,
    });
  }, [mediaType, tmdbId, currentEpisode, getEmbedUrl]);

  const handleChangeEpisode = (episode: IEpisode) => {
    const s = episode.season_number;
    const e = episode.episode_number;
    setCurrentEpisode({ s, e });
    updateIframe(selectedServer, s, e);
  };

  const loadShows = useCallback(async (id: string) => {
    // Determine numeric ID correctly if it passed 't-1234'
    const numericId = Number(id.replace('t-', '').replace('m-', ''));

    const res: AxiosResponse<Show> = await MovieService.findTvSeries(numericId);

    if (!res.data?.seasons?.length) {
      if (mediaType !== MediaType.MOVIE) {
        updateIframe(selectedServer, 1, 1);
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
      seasonWithEpisodes.map((response: AxiosResponse<ISeason>) => response.data),
    );

    setCurrentEpisode({ s: 1, e: 1 });
    updateIframe(selectedServer, 1, 1);
  }, [selectedServer, updateIframe, mediaType]);

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
      updateIframe(selectedServer);
    }
    hasLoaded.current = true;
  }, [mediaType, tmdbId, loadShows, updateIframe, selectedServer]);

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newServer = e.target.value;
    setSelectedServer(newServer);
    updateIframe(newServer);
  };

  const handleCreateParty = async () => {
    setIsCreatingParty(true);
    try {
      const showData = seasons?.length ? await MovieService.findTvSeries(Number(tmdbId.replace('t-', '').replace('m-', ''))) : await MovieService.findMovie(Number(tmdbId.replace('t-', '').replace('m-', '')));
      const title = seasons?.length ? (showData.data as any).name : (showData.data as any).title;
      const posterPath = (showData.data as any).poster_path || '';
      
      const res = await fetch('/api/party/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tmdbId,
          mediaType,
          title: title || 'Watch Party',
          posterPath,
          season: currentEpisode?.s,
          episode: currentEpisode?.e,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create party');

      router.push(`/party/${data.roomId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to create Watch Party');
    } finally {
      setIsCreatingParty(false);
    }
  };

  return (
    <div className={`relative w-full bg-black ${isWatchParty ? 'h-full' : 'h-[100dvh]'}`}>
      
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        {!isWatchParty && (
          <button
            onClick={handleCreateParty}
            disabled={isCreatingParty}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {isCreatingParty ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            <span>Watch Party</span>
          </button>
        )}

        {isHost && isWatchParty && roomId && (
          <button 
             onClick={() => window.open(`/party/${roomId}/theater`, 'TheaterWindow', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no')}
             className="flex items-center space-x-2 bg-primary/20 hover:bg-primary/30 text-white border border-primary/20 px-4 py-2 text-sm font-bold rounded-xl transition-all relative group overflow-hidden"
             title="Pop-out Theater Window for Screen Sharing"
          >
             <div className="absolute inset-0 bg-primary/10 animate-ping opacity-20 pointer-events-none group-hover:hidden" />
             <ExternalLink className="w-4 h-4" />
             <span>Theater</span>
          </button>
        )}

        <div className="flex items-center space-x-2 bg-black/60 p-2 rounded-xl backdrop-blur-md border border-white/10">
          <span className="text-white text-sm font-medium hidden sm:inline">Server:</span>
          {(!isWatchParty || isHost) ? (
            <select
              value={selectedServer}
              onChange={handleServerChange}
              className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer px-1"
            >
              {SERVERS.map(s => (
                <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-white text-sm font-bold px-1">{SERVERS.find(s => s.id === selectedServer)?.name || selectedServer}</span>
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
});

export default EmbedPlayer;