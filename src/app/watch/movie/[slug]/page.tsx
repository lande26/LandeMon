// src/app/watch/movie/[slug]/page.tsx
import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = slug.split('-').pop() ?? '';
  return <EmbedPlayer tmdbId={id} mediaType={MediaType.MOVIE} />;
}
