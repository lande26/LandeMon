// src/app/watch/anime/[slug]/page.tsx
import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = slug.split('-').pop() ?? '';
  // Add base url later, we don't care now since we generate it in EmbedPlayer
  
  return (
    <EmbedPlayer
      tmdbId={id}
      mediaType={MediaType.ANIME}
    />
  );
}