// src/app/watch/anime/[slug]/page.tsx
import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = slug.split('-').pop();
  const movieId: string | undefined = slug.split('/').pop();
  
  return (
    <EmbedPlayer
      movieId={movieId}
      mediaType={movieId?.includes('t') ? MediaType.ANIME : undefined}
      url={`https://vidsrc.cc/v2/embed/anime/tmdb${id}?autoPlay=false`}
    />
  );
}