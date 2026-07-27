'use client';

import { useModalStore } from '@/stores/modal';
import { MediaType, type Show } from '@/types';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn, getNameFromShow, getSlug } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Tv, Film, Star } from 'lucide-react';
import CustomImage from './custom-image';

interface ShowsCarouselProps {
  title: string;
  shows: Show[];
  rowIndex?: number;
}

const ShowsCarousel = ({ title, shows, rowIndex = 0 }: ShowsCarouselProps) => {
  const pathname = usePathname();
  const showsRef = React.useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Silky smooth auto-sliding drift effect
  React.useEffect(() => {
    const el = showsRef.current;
    if (!el || isHovered) return;

    let animId: number;
    const direction = rowIndex % 2 === 0 ? 1 : -1;
    const speed = 0.3; // Very slow, silky speed (pixels per frame)

    const step = () => {
      if (!showsRef.current) return;
      const { scrollLeft, scrollWidth, offsetWidth } = showsRef.current;
      const maxScroll = scrollWidth - offsetWidth;

      if (maxScroll <= 0) return;

      let nextScroll = scrollLeft + direction * speed;

      // Loop seamlessly at edges
      if (nextScroll >= maxScroll - 1 && direction > 0) {
        nextScroll = 0;
      } else if (nextScroll <= 1 && direction < 0) {
        nextScroll = maxScroll - 1;
      }

      showsRef.current.scrollLeft = nextScroll;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, rowIndex, shows.length]);

  // handle scroll to left and right
  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!showsRef.current) return;

    setIsScrollable(true);
    const { scrollLeft, offsetWidth } = showsRef.current;
    const handleSize = offsetWidth > 1400 ? 60 : 0.04 * offsetWidth;
    const offset =
      direction === 'left'
        ? scrollLeft - (offsetWidth - 2 * handleSize)
        : scrollLeft + (offsetWidth - 2 * handleSize);
    showsRef.current.scrollTo({ left: offset, behavior: 'smooth' });

    if (scrollLeft === 0 && direction === 'left') {
      showsRef.current.scrollTo({
        left: showsRef.current.scrollWidth,
        behavior: 'smooth',
      });
    } else if (
      scrollLeft + offsetWidth === showsRef.current.scrollWidth &&
      direction === 'right'
    ) {
      showsRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section aria-label="Carousel of shows" className="relative my-[3vw] p-0">
      {shows.length !== 0 && (
        <div className="space-y-1 sm:space-y-2.5">
          <h2 className="m-0 px-[4%] text-lg font-semibold text-foreground/80 transition-colors hover:text-foreground sm:text-xl 2xl:px-[60px]">
            {title ?? '-'}
          </h2>
          <div
            className="relative w-full items-center justify-center overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Button
              aria-label="Scroll to left"
              variant="ghost"
              className={cn(
                'absolute left-0 top-0 z-10 mr-2 hidden h-full w-[4%] items-center justify-center rounded-l-none bg-transparent py-0 text-transparent hover:bg-secondary/90 hover:text-foreground md:block 2xl:w-[60px]',
                isScrollable ? 'md:block' : 'md:hidden',
              )}
              onClick={() => scrollToDirection('left')}>
              <Icons.chevronLeft className="h-8 w-8" aria-hidden="true" />
            </Button>
            <div
              ref={showsRef}
              className="no-scrollbar m-0 grid auto-cols-[calc(100%/3)] grid-flow-col overflow-x-auto overflow-y-hidden px-[4%] py-0 duration-500 ease-in-out sm:auto-cols-[25%] md:touch-pan-y lg:auto-cols-[20%] xl:auto-cols-[calc(100%/6)] 2xl:px-[60px]">
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} pathname={pathname} />
              ))}
            </div>
            <Button
              aria-label="Scroll to right"
              variant="ghost"
              className="absolute right-0 top-0 z-10 m-0 ml-2 hidden h-full w-[4%] items-center justify-center rounded-r-none bg-transparent py-0 text-transparent hover:bg-secondary/70 hover:text-foreground md:block 2xl:w-[60px]"
              onClick={() => scrollToDirection('right')}>
              <Icons.chevronRight className="h-8 w-8" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShowsCarousel;

export const ShowCard = ({ show }: { show: Show; pathname: string }) => {
  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = '/images/grey-thumbnail.jpg';
  };

  const name = getNameFromShow(show);
  const isTv = show.media_type === MediaType.TV || show.first_air_date !== undefined;
  const rating = show.vote_average ? Math.round(show.vote_average * 10) : null;

  return (
    <div className="group relative aspect-[2/3] px-1">
      <div
        onClick={() => {
          const path: string = isTv ? 'tv-shows' : 'movies';
          window.history.pushState(
            null,
            '',
            `${path}/${getSlug(show.id, name)}`,
          );
          useModalStore.setState({
            show: show,
            open: true,
            play: true,
          });
        }}
        className="relative h-full w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/50">
        <CustomImage
          src={
            show.poster_path ?? show.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${
                  show.poster_path ?? show.backdrop_path
                }`
              : '/images/grey-thumbnail.jpg'
          }
          alt={name}
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 33vw"
          onError={imageOnErrorHandler}
        />

        {/* Media type pill & rating overlay badges */}
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md border border-white/10">
            {isTv ? (
              <>
                <Tv className="h-2.5 w-2.5 text-sky-400" /> TV
              </>
            ) : (
              <>
                <Film className="h-2.5 w-2.5 text-amber-400" /> Movie
              </>
            )}
          </span>
          {rating ? (
            <span className="flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md border border-white/10">
              <Star className="h-2.5 w-2.5 fill-amber-300" /> {rating}%
            </span>
          ) : null}
        </div>

        {/* Subtle title & details overlay on hover */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-2 text-xs font-bold text-white drop-shadow-md">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
};
