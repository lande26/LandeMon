'use client';

import React, { useState, useEffect } from 'react';
import { RoomState } from '@/lib/party';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Search, ArrowRight, Play, Film, Trash2 } from 'lucide-react';
import CustomImage from '@/components/custom-image';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function PartyLobbyPage() {
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/home?auth=true&callbackUrl=/party');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  useEffect(() => {
    async function fetchParties() {
      try {
        const res = await fetch('/api/party/list');
        const data = await res.json();
        setParties(data.parties || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchParties();
  }, []);

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().length <= 3) {
      toast.error('Invalid Room Code', { description: 'Room codes are usually 6 characters long.' });
      return;
    }
    router.push(`/party/${roomCode.trim()}`);
  };

  const handleEndParty = async (roomId: string) => {
    try {
      setParties(prev => prev.filter(p => p.roomId !== roomId));
      await fetch('/api/party/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      });
      toast.success('Party closed permanently');
    } catch (e) {
      toast.error('Failed to end party');
    }
  };

  return (
    <div className="min-h-[100dvh]  text-white py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden relative">

      {/* Fancy Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Watch Parties</h1>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto">
          Join a live lobby to watch movies perfectly synced with other people, or enter a private room code below.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-20 relative z-10">
        <form onSubmit={handleJoinByCode} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Enter Room Code (e.g. X9P2ML)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-lg focus:outline-none focus:border-primary focus:bg-neutral-900 transition-all font-medium backdrop-blur-md placeholder:text-neutral-600 uppercase"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            Join <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <Film className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Active Public Lobbies</h2>
          <span className="ml-auto bg-neutral-900 border border-white/10 text-neutral-400 px-3 py-1 rounded-full text-xs font-semibold">
            {loading ? 'Scanning...' : `${parties.length} Live`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-neutral-900/50 rounded-3xl aspect-[16/9] border border-white/5" />
            ))}
          </div>
        ) : parties.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <Users className="w-12 h-12 text-neutral-600 mb-4" />
            <h3 className="text-xl font-bold text-neutral-300 mb-2">No active parties found</h3>
            <p className="text-neutral-500 mb-6">Be the first to start a watch party today!</p>
            <Link
              href="/"
              className="bg-primary/20 hover:bg-primary/30 text-primary-foreground px-6 py-3 rounded-full font-semibold transition-colors border border-primary/20"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parties.map((party) => (
              <Link href={`/party/${party.roomId}`} key={party.roomId} className="group overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_hsl(var(--primary)/0.15)] block relative aspect-[4/5]">

                {/* Card Background image */}
                <div className="absolute inset-0 z-0">
                  <CustomImage src={`https://image.tmdb.org/t/p/w500${party.posterPath}`} alt={party.title} width={500} height={750} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between w-full mb-3 self-start">
                    <div className="bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md">
                      {party.mediaType}
                    </div>
                    {party.isMyParty && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEndParty(party.roomId);
                        }}
                        className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-md transition-colors backdrop-blur-md pointer-events-auto"
                        title="End this Party"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-1 leading-tight group-hover:text-primary transition-colors">{party.title}</h3>
                  <p className="text-sm text-neutral-300 mb-4 line-clamp-1">Hosted by {party.hostName}</p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      LIVE NOW
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors backdrop-blur-md">
                      <Play className="w-4 h-4 fill-current ml-1" />
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
