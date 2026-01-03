// // 'use client';
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
// import MovieService from '@/services/MovieService';
// import { type AxiosResponse } from 'axios';
// import Season from '../season';

// interface EmbedPlayerProps {
//   url: string;
//   movieId?: string;
//   mediaType?: MediaType;
// }

// export default function EmbedPlayer({
//   url,
//   movieId,
//   mediaType,
// }: EmbedPlayerProps) {
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const loadingRef = useRef<HTMLDivElement>(null);

//   const [seasons, setSeasons] = useState<ISeason[] | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const setIframeUrl = (newUrl: string) => {
//     if (!iframeRef.current) return;
//     iframeRef.current.src = newUrl;
//     iframeRef.current.style.opacity = '0';
//     loadingRef.current?.style.setProperty('display', 'flex');
//   };

//   const onIframeLoad = () => {
//     if (!iframeRef.current) return;
//     iframeRef.current.style.opacity = '1';
//     loadingRef.current?.style.setProperty('display', 'none');
//   };

//   const loadAnime = useCallback(async (id: string) => {
//     const numericId = Number(id.replace('t-', ''));

//     const res: AxiosResponse<Show> =
//       await MovieService.findTvSeries(numericId);

//     if (!res.data?.seasons?.length) return;

//     const validSeasons = res.data.seasons.filter(
//       (s) => s.season_number,
//     );

//     const seasonResponses = await Promise.all(
//       validSeasons.map((s) =>
//         MovieService.getSeasons(numericId, s.season_number),
//       ),
//     );

//     setSeasons(seasonResponses.map((r) => r.data));

//     setIframeUrl(
//       `https://vidsrc.cc/v2/embed/anime/tmdb${numericId}/1/sub?autoPlay=false`,
//     );
//   }, []);

//   const handleAnimeEpisodeChange = (episode: IEpisode) => {
//     setIframeUrl(
//       `https://vidsrc.cc/v2/embed/anime/tmdb${episode.show_id}/${episode.episode_number}/sub`,
//     );
//   };

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     iframe.addEventListener('load', onIframeLoad);
//     return () => iframe.removeEventListener('load', onIframeLoad);
//   }, []);

//   useEffect(() => {
//     if (mediaType === MediaType.ANIME && movieId) {
//       void loadAnime(movieId);
//       return;
//     }

//     if (iframeRef.current) {
//       iframeRef.current.src = url;
//       loadingRef.current?.style.setProperty('display', 'flex');
//     }
//   }, [mediaType, movieId, url, loadAnime]);

//   return (
//     <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black lg:flex-row">
//       <div className="relative flex min-h-0 w-full flex-1 bg-black">
//         <div
//           ref={loadingRef}
//           className="absolute inset-0 z-10 flex items-center justify-center bg-black">
//           <Loading />
//         </div>

//         <iframe
//           ref={iframeRef}
//           className="h-full w-full border-none transition-opacity duration-300"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           style={{ opacity: 0 }}
//           {...(mediaType === MediaType.TV
//             ? { sandbox: 'allow-scripts allow-same-origin' }
//             : {})}
//         />
//       </div>

//       {mediaType === MediaType.ANIME && seasons && (
//         <div
//           className={`border-t border-white/10 bg-neutral-900 transition-all duration-300 lg:border-l lg:border-t-0 ${
//             isSidebarOpen
//               ? 'h-[40vh] w-full lg:h-full lg:w-80'
//               : 'h-0 w-0 overflow-hidden'
//           }`}>
//           <div className="flex items-center justify-between border-b border-white/10 p-4 text-white">
//             <span>Episodes</span>
//             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//               Toggle
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-2">
//             <Season
//               seasons={seasons}
//               onChangeEpisode={handleAnimeEpisodeChange}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Loading from '../ui/loading';
import Season from '../season';
import { MediaType, IEpisode, type ISeason, type Show } from '@/types';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';

interface EmbedPlayerProps {
  url: string;
  movieId?: string;
  mediaType?: MediaType;
}

export default function EmbedPlayer({
  url,
  movieId,
  mediaType,
}: EmbedPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [seasons, setSeasons] = useState<ISeason[] | null>(null);

  const setIframeUrl = (newUrl: string) => {
    if (!iframeRef.current) return;
    iframeRef.current.src = newUrl;
    iframeRef.current.style.opacity = '0';
    loadingRef.current?.style.setProperty('display', 'flex');
  };

  const onIframeLoad = () => {
    if (!iframeRef.current) return;
    iframeRef.current.style.opacity = '1';
    loadingRef.current?.style.setProperty('display', 'none');
  };

  const handleChangeEpisode = (episode: IEpisode) => {
    const { show_id: id, episode_number: eps } = episode;
    setIframeUrl(`https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub`);
  };

  const loadAnime = useCallback(async (id: string) => {
    const numericId = Number(id.replace('t-', ''));

    const res: AxiosResponse<Show> = await MovieService.findTvSeries(numericId);

    if (!res.data?.seasons?.length) return;

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

    setIframeUrl(
      `https://vidsrc.cc/v2/embed/anime/tmdb${numericId}/1/sub?autoPlay=false`,
    );
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.addEventListener('load', onIframeLoad);
    return () => iframe.removeEventListener('load', onIframeLoad);
  }, []);

  useEffect(() => {
    if (mediaType === MediaType.ANIME && movieId) {
      void loadAnime(movieId);
      return;
    }

    // For non-anime, use original behavior
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [mediaType, movieId, url, loadAnime]);

  return (
    <div className="relative h-[100dvh] w-full bg-black">
      {seasons && (
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
}