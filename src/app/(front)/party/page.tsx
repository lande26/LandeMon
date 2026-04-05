'use client';

import React, { useState, useEffect } from 'react';
// import { RoomState } from '@/lib/party';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Search, ArrowRight, Play, Film, Trash2 } from 'lucide-react';
import CustomImage from '@/components/custom-image';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Party {
  roomId: string;
  posterPath?: string;
  title?: string;
  hostName?: string;
  isMyParty?: boolean;
  mediaType?: string;
}

export default function PartyLobbyPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/home?auth=true&callbackUrl=/party');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchParties() {
      try {
        const res = await fetch('/api/party/list');
        const data = (await res.json()) as { parties?: Party[] };
        setParties(data.parties ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (status === 'authenticated') {
      void fetchParties();
    }
  }, [status]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().length <= 3) {
      toast.error('Invalid Room Code', {
        description: 'Room codes are usually 6 characters long.',
      });
      return;
    }
    void router.push(`/party/${roomCode.trim()}`);
  };

  const handleEndParty = async (roomId: string) => {
    try {
      setParties((prev) => prev.filter((p) => p.roomId !== roomId));
      await fetch('/api/party/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });
      toast.success('Party closed permanently');
    } catch (e) {
      toast.error('Failed to end party');
    }
  };

  return (
    <div className="relative  mx-auto min-h-[100dvh] max-w-7xl overflow-hidden px-6 py-24 text-white md:px-12">
      {/* Fancy Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative z-10 mb-16 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
          Watch Parties
        </h1>
        <p className="mx-auto max-w-xl text-lg text-neutral-400">
          Join a live lobby to watch movies perfectly synced with other people,
          or enter a private room code below.
        </p>
      </div>

      <div className="relative z-10 mx-auto mb-20 max-w-md">
        <form onSubmit={handleJoinByCode} className="group relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Enter Room Code (e.g. X9P2ML)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-neutral-900/50 py-4 pl-12 pr-32 text-lg font-medium uppercase backdrop-blur-md transition-all placeholder:text-neutral-600 focus:border-primary focus:bg-neutral-900 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-primary px-6 py-2 font-bold text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95">
            Join <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <Film className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Active Public Lobbies</h2>
          <span className="ml-auto rounded-full border border-white/10 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-400">
            {loading ? 'Scanning...' : `${parties.length} Live`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[16/9] animate-pulse rounded-3xl border border-white/5 bg-neutral-900/50"
              />
            ))}
          </div>
        ) : parties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="mb-4 h-12 w-12 text-neutral-600" />
            <h3 className="mb-2 text-xl font-bold text-neutral-300">
              No active parties found
            </h3>
            <div className="mb-6 mt-4 text-center text-neutral-500">
              <p>
                You haven&apos;t watched any shows yet. Be the first to start a
                watch party today!
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-primary/20 bg-primary/20 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/30">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {parties.map((party) => (
              <Link
                href={`/party/${party.roomId}`}
                key={party.roomId}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_40px_hsl(var(--primary)/0.15)]">
                {/* Card Background image */}
                <div className="absolute inset-0 z-0">
                  <CustomImage
                    src={`https://image.tmdb.org/t/p/w500${party.posterPath ?? ''}`}
                    alt={party.title ?? 'Poster'}
                    width={500}
                    height={750}
                    className="h-full w-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                  />
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                  <div className="mb-3 flex w-full items-center justify-between self-start">
                    <div className="rounded-md bg-primary/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground backdrop-blur-md">
                      {party.mediaType}
                    </div>
                    {party.isMyParty && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void handleEndParty(party.roomId);
                        }}
                        className="pointer-events-auto rounded-md bg-red-500/80 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-red-600"
                        title="End this Party">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="mb-1 text-2xl font-black leading-tight transition-colors group-hover:text-primary">
                    {party.title ?? 'Untitled'}
                  </h3>
                  <p className="mb-4 line-clamp-1 text-sm text-neutral-300">
                    Hosted by {party.hostName ?? 'Unknown'}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      LIVE NOW
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Play className="ml-1 h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
