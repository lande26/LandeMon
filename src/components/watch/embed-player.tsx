// 'use client';
// import React from 'react';
// import Loading from '../ui/loading';
// import { useRouter } from 'next/navigation';
// import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
// import MovieService from '@/services/MovieService';
// import { type AxiosResponse } from 'axios';
// import Season from '../season';

// interface EmbedPlayerProps {
//   url: string;
//   movieId?: string;
//   mediaType?: MediaType;
// }

// function EmbedPlayer(props: EmbedPlayerProps) {
//   const router = useRouter();

//   const [seasons, setSeasons] = React.useState<ISeason[] | null>(null);

//   React.useEffect(() => {
//     // if anime type -> handle after fetch season and episode
//     if (props.mediaType === MediaType.ANIME) {
//       return;
//     }
//     if (iframeRef.current) {
//       iframeRef.current.src = props.url;
//     }

//     const { current } = iframeRef;
//     const iframe: HTMLIFrameElement | null = current;
//     iframe?.addEventListener('load', handleIframeLoaded);
//     return () => {
//       iframe?.removeEventListener('load', handleIframeLoaded);
//     };
//   }, []);

//   React.useEffect(() => {
//     if (!props.movieId || props.mediaType !== MediaType.ANIME) {
//       return;
//     }

//     void handleAnime(props.movieId);
//   }, [props.movieId, props.mediaType]);

//   const loadingRef = React.useRef<HTMLDivElement>(null);
//   const iframeRef = React.useRef<HTMLIFrameElement>(null);

//   const handleChangeEpisode = (episode: IEpisode): void => {
//     const { show_id: id, episode_number: eps } = episode;
//     handleSetIframeUrl(`https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub`);
//   };

//   const handleAnime = async (movieId: string) => {
//     const id = Number(movieId.replace('t-', ''));
//     const response: AxiosResponse<Show> = await MovieService.findTvSeries(id);
//     const { data } = response;
//     if (!data?.seasons?.length) {
//       return;
//     }
//     const seasons = data.seasons.filter(
//       (season: ISeason) => season.season_number,
//     );
//     const promises = seasons.map(async (season: ISeason) => {
//       return MovieService.getSeasons(id, season.season_number);
//     });

//     const seasonWithEpisodes = await Promise.all(promises);
//     setSeasons(
//       seasonWithEpisodes.map((res: AxiosResponse<ISeason>) => res.data),
//     );
//     handleSetIframeUrl(
//       `https://vidsrc.cc/v2/embed/anime/tmdb${id}/1/sub?autoPlay=false`,
//     );
//   };

//   const handleSetIframeUrl = (url: string): void => {
//     if (!iframeRef.current) {
//       return;
//     }
//     iframeRef.current.src = url;
//     const { current } = iframeRef;
//     const iframe: HTMLIFrameElement | null = current;
//     iframe.addEventListener('load', handleIframeLoaded);
//     if (loadingRef.current) loadingRef.current.style.display = 'flex';
//   };

//   const handleIframeLoaded = () => {
//     if (!iframeRef.current) {
//       return;
//     }
//     const iframe: HTMLIFrameElement = iframeRef.current;
//     if (iframe) {
//       iframe.style.opacity = '1';
//       iframe.removeEventListener('load', handleIframeLoaded);
//       if (loadingRef.current) loadingRef.current.style.display = 'none';
//     }
//   };

//   return (
//     <div
//       style={{
//         width: '100%',
//         height: '100%',
//         position: 'absolute',
//         backgroundColor: '#000',
//       }}>
//       {seasons && (
//         <Season seasons={seasons ?? []} onChangeEpisode={handleChangeEpisode} />
//       )}
//       <div className="header-top absolute left-0 right-0 top-8 z-[2] flex h-fit w-fit items-center justify-between gap-x-5 px-4 md:h-20 md:gap-x-8 md:px-10 lg:h-24">
//         <div className="flex flex-1 items-center gap-x-5 md:gap-x-8">
//           <svg
//             className="h-10 w-10 flex-shrink-0 cursor-pointer transition hover:scale-125"
//             stroke="#fff"
//             fill="#fff"
//             strokeWidth="0"
//             viewBox="0 0 16 16"
//             height="16px"
//             width="16px"
//             xmlns="http://www.w3.org/2000/svg"
//             onClick={() => router.back()}>
//             <path
//               fillRule="evenodd"
//               d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
//           </svg>
//         </div>
//       </div>
//       <div
//         ref={loadingRef}
//         className="absolute z-[1] flex h-full w-full items-center justify-center">
//         <Loading />
//       </div>
//       <iframe
//         width="100%"
//         height="100%"
//         allowFullScreen
//         ref={iframeRef}
//         style={{ opacity: 0 }}
//         referrerPolicy="no-referrer-when-downgrade"
//       />
//     </div>
//   );
// }

// export default EmbedPlayer;

'use client';
import React from 'react';
import Loading from '../ui/loading';
import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';
import Season from '../season';
import { ChevronRight, ChevronLeft, List } from 'lucide-react'; // Optional: Use icons if you have lucide-react, or I will use SVG below

interface EmbedPlayerProps {
  url: string;
  movieId?: string;
  mediaType?: MediaType;
}

function EmbedPlayer(props: EmbedPlayerProps) {
  const [seasons, setSeasons] = React.useState<ISeason[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true); // Control sidebar visibility
  const loadingRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (props.mediaType === MediaType.ANIME) {
      return;
    }
    if (iframeRef.current) {
      iframeRef.current.src = props.url;
    }

    const { current } = iframeRef;
    const iframe: HTMLIFrameElement | null = current;
    iframe?.addEventListener('load', handleIframeLoaded);
    return () => {
      iframe?.removeEventListener('load', handleIframeLoaded);
    };
  }, []);

  React.useEffect(() => {
    if (!props.movieId || props.mediaType !== MediaType.ANIME) {
      return;
    }
    void handleAnime(props.movieId);
  }, [props.movieId, props.mediaType]);

  const handleChangeEpisode = (episode: IEpisode): void => {
    const { show_id: id, episode_number: eps } = episode;
    handleSetIframeUrl(`https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub`);
  };

  const handleAnime = async (movieId: string) => {
    const id = Number(movieId.replace('t-', ''));
    const response: AxiosResponse<Show> = await MovieService.findTvSeries(id);
    const { data } = response;
    if (!data?.seasons?.length) {
      return;
    }
    const seasonsData = data.seasons.filter(
      (season: ISeason) => season.season_number,
    );
    const promises = seasonsData.map(async (season: ISeason) => {
      return MovieService.getSeasons(id, season.season_number);
    });

    const seasonWithEpisodes = await Promise.all(promises);
    setSeasons(
      seasonWithEpisodes.map((res: AxiosResponse<ISeason>) => res.data),
    );
    handleSetIframeUrl(
      `https://vidsrc.cc/v2/embed/anime/tmdb${id}/1/sub?autoPlay=false`,
    );
  };

  const handleSetIframeUrl = (url: string): void => {
    if (!iframeRef.current) return;
    iframeRef.current.src = url;
    const { current } = iframeRef;
    if (current) {
      current.addEventListener('load', handleIframeLoaded);
      if (loadingRef.current) loadingRef.current.style.display = 'flex';
    }
  };

  const handleIframeLoaded = () => {
    if (!iframeRef.current) return;
    const iframe: HTMLIFrameElement = iframeRef.current;
    iframe.style.opacity = '1';
    iframe.removeEventListener('load', handleIframeLoaded);
    if (loadingRef.current) loadingRef.current.style.display = 'none';
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    // FIX 1: Use h-[100dvh] for mobile browsers (handles address bar better)
    // FIX 2: overflow-hidden is crucial to prevent scrolling when sidebar is open
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black lg:flex-row">
      {/* Video Area */}
      {/* FIX 3: Removed 'h-full'. We use 'flex-1' to let it fill ONLY available space. 
          min-h-0 is a CSS trick that prevents flex children from overflowing. */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col justify-center bg-black">
        {/* Loading Overlay */}
        <div
          ref={loadingRef}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <Loading />
        </div>

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          className="h-full w-full border-none transition-opacity duration-500"
          style={{ opacity: 0 }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Toggle Sidebar Button */}
        {seasons && (
          <button
            onClick={toggleSidebar}
            className="absolute right-4 top-4 z-20 rounded-md border border-white/10 bg-black/70 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Sidebar Area */}
      {seasons && (
        <div
          className={`
            flex flex-col border-t border-white/10 bg-neutral-900 transition-all duration-300 ease-in-out lg:border-l lg:border-t-0
            ${
              isSidebarOpen
                ? 'visible h-[40vh] w-full opacity-100 lg:h-full lg:w-80'
                : 'invisible h-0 w-0 overflow-hidden opacity-0'
            }
          `}>
          <div className="flex items-center justify-between border-b border-white/10 p-4 font-semibold text-white">
            <span>Episodes</span>
          </div>

          <div className="scrollbar-thin scrollbar-thumb-white/20 flex-1 overflow-y-auto p-2">
            <Season
              seasons={seasons ?? []}
              onChangeEpisode={handleChangeEpisode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmbedPlayer;
