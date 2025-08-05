import { type MediaType, type Show } from '@/types';
import { type Genre } from './genre';

export enum RequestType {
  TRENDING = 'trending',
  TOP_RATED = 'top_rated',
  NETFLIX = 'netflix',
  POPULAR = 'popular',
  GENRE = 'genre',
  ANIME_GENRE = 'anime_genre',
  KOREAN = 'korean',
  DEFAULT = 'default',
  ANIME_LATEST = 'anime_latest',
  ANIME_TRENDING = 'anime_trending',
  ANIME_TOP_RATED = 'anime_top_rated',
  ANIME_NETFLIX = 'anime_netflix',
}

export type TmdbPagingResponse = {
  results: Show[];
  page: number;
  totalPages: number;
  totalResults: number;
};

export type TmdbRequest = {
  requestType: RequestType;
  mediaType: MediaType;
  genre?: Genre;
  page?: number;
};

export type ShowRequest = {
  title: string;
  req: TmdbRequest;
  visible: boolean;
};
