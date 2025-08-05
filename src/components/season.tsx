'use client';
import React from 'react';
import { type IEpisode, type ISeason } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface SeasonProps {
  seasons: ISeason[];
  onChangeEpisode: (episode: IEpisode) => void;
}

export default function Season(props: SeasonProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  const [activeSeason, setActiveSeason] = React.useState<ISeason>(
    props.seasons[0],
  );

  const handleShowPanel = () => {
    panelRef.current?.classList.toggle('active');
  };
  const handleHidePanel = () => {
    panelRef.current?.classList.remove('active');
  };

  return (
    <React.Fragment>
      <div className="header-top absolute left-0 right-0 top-0 z-[3] flex h-12 items-center justify-between gap-x-5 px-4 md:gap-x-8 md:px-10">
        <div
          onClick={handleShowPanel}
          className="flex flex-1 cursor-pointer items-center gap-x-5 md:gap-x-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-square-menu">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 8h10" />
            <path d="M7 12h10" />
            <path d="M7 16h10" />
          </svg>
        </div>
      </div>
      <aside ref={panelRef} id="ep-panel" className="panel from-left z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="seasons dropdown">
              <a className="btn dropdown-toggle season-current !block max-w-[180px] cursor-pointer truncate">
                {`SS ${activeSeason.season_number}: ${activeSeason.name}`}
              </a>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[220px] max-w-[240px] overflow-auto">
            {props.seasons.map((season: ISeason) => (
              <DropdownMenuItem
                key={season.id}
                onClick={() => setActiveSeason(season)}
                className="block w-full cursor-pointer truncate">
                {`SS ${season.season_number}: ${season.name}`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div id="close-ep-btn" className="close" onClick={handleHidePanel}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
        {activeSeason.episodes?.length ? (
          <ul className="episodes">
            {activeSeason.episodes.map((episode: IEpisode) => {
              return (
                <li
                  key={episode.id}
                  className="cursor-pointer"
                  onClick={() => {
                    handleHidePanel();
                    props.onChangeEpisode(episode);
                  }}>
                  <a>{`EP ${episode.episode_number}: ${episode.name}`}</a>
                </li>
              );
            })}
          </ul>
        ) : null}
      </aside>
    </React.Fragment>
  );
}
