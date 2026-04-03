'use client';

import React, { useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { RoomState } from '@/lib/party';
import { useRouter } from 'next/navigation';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';
import { toast } from 'sonner';
import { useTracks, ParticipantTile, useDataChannel } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MonitorUp } from 'lucide-react';
import { EmbedPlayerRef } from '@/components/watch/embed-player';
import { useRef } from 'react';

// Sub-components
import ParticipantGrid from './participant-grid';
import ControlBar from './control-bar';
import ChatPanel from './chat-panel';

export default function WatchPartyClient({ room, currentUserId }: { room: RoomState, currentUserId: string }) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const isHost = currentUserId === room.hostId;

  // Iframe Autoplay Hint
  useEffect(() => {
    if (token) {
      toast('Party Connected', {
        description: 'Please click volume to unmute.',
        duration: 2500,
        position: 'top-center',
        className: 'bg-indigo-600 border-indigo-500 text-white rounded-xl'
      });
    }
  }, [token]);

  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch(`/api/livekit?room=${room.roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setToken(data.token);
      } catch (err) {
        console.error("Failed to connect", err);
        router.push('/party');
      }
    }
    getToken();
  }, [room.roomId, router]);

  if (!token) {
    return (
      <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Connecting to {room.title}...</p>
      </div>
    );
  }

  const audioEnabled = typeof window !== 'undefined' ? sessionStorage.getItem('preferredMicState') === 'true' : false;
  const videoEnabled = typeof window !== 'undefined' ? sessionStorage.getItem('preferredCameraState') === 'true' : false;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={audioEnabled}
      video={videoEnabled}
      onDisconnected={() => router.push('/')}
    >
      <PartyLayout room={room} isHost={isHost} chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </LiveKitRoom>
  );
}

function PartyLayout({ room, isHost, chatOpen, setChatOpen }: { room: RoomState, isHost: boolean, chatOpen: boolean, setChatOpen: (v: boolean) => void }) {
  const playerRef = useRef<EmbedPlayerRef>(null);
  const lastStateRef = useRef<any>(null);
  const screenTracks = useTracks([Track.Source.ScreenShare]);
  const hasScreenShare = screenTracks.length > 0;
  
  const { send } = useDataChannel('sync', (msg) => {
    if (!isHost) return;
    try {
      const data = JSON.parse(new TextDecoder().decode(msg.payload));
      if (data.type === 'REQUEST_SYNC' && lastStateRef.current) {
        const payload = JSON.stringify({ 
          type: 'STATE_SYNC', 
          state: lastStateRef.current,
          serverData: lastStateRef.current.serverData,
          timestamp: Date.now() 
        });
        send(new TextEncoder().encode(payload), { reliable: true });
      }
    } catch(e) {}
  });

  const handleStateUpdate = (state: any) => {
    if (!isHost) return;
    lastStateRef.current = state;
    const payload = JSON.stringify({ 
      type: 'STATE_SYNC', 
      state, 
      serverData: state.serverData,
      timestamp: Date.now() 
    });
    send(new TextEncoder().encode(payload), { reliable: false });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black overflow-hidden relative w-full">
      <div className="flex flex-1 overflow-hidden relative">

        {/* Main Video Area (Squishes when chat opens) */}
        <div className="flex-1 relative h-full flex flex-col transition-all duration-300 overflow-hidden bg-black">
          {/* Secretly renders the WebRTC audio context */}
          <RoomAudioRenderer />

          <div className="flex-1 w-full relative group">
            {hasScreenShare ? (
               <div className="absolute inset-0 flex items-center justify-center bg-black p-4 md:p-8">
                 <div className="w-full h-full max-w-7xl mx-auto aspect-video relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950">
                   <ParticipantTile trackRef={screenTracks[0]} className="w-full h-full object-contain" />
                 </div>
               </div>
            ) : (
               isHost ? (
                 <EmbedPlayer ref={playerRef} tmdbId={room.tmdbId} roomId={room.roomId} mediaType={room.mediaType as MediaType} isWatchParty={true} isHost={isHost} onStateUpdate={handleStateUpdate} />
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 text-center px-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <MonitorUp className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Waiting for Host</h2>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      The party has started! Hang tight while <span className="text-primary font-bold">{room.hostName}</span> prepares the stream.
                    </p>
                    <div className="mt-8 flex gap-2 items-center text-xs font-bold text-neutral-600 uppercase tracking-widest">
                       <span className="w-2 h-2 rounded-full bg-neutral-700 animate-bounce" />
                       Ready to Sync
                    </div>
                 </div>
               )
            )}

            {/* Floating Top Right (inside the video area): Webcams */}
            <div className="absolute top-16 right-4 z-40 w-48 sm:w-56 max-h-[70vh] overflow-y-auto pointer-events-none custom-scrollbar drop-shadow-2xl">
              <ParticipantGrid />
            </div>
          </div>
        </div>

        {/* Sliding Chat Pane (Pushes video to the left) */}
        <div
          className={`h-full border-l border-white/10 bg-neutral-950 flex flex-col transition-all duration-300 ease-in-out ${chatOpen ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full absolute right-0'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-bold text-white tracking-wide uppercase text-sm">Party Chat</h3>
            <button onClick={() => setChatOpen(false)} className="text-neutral-400 hover:text-white text-xl leading-none">&times;</button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatPanel roomId={room.roomId} />
          </div>
        </div>
      </div>

        {/* Bottom Bar: Fixed Height */}
      <div className="h-16 shrink-0 relative z-50 bg-neutral-950">
        <ControlBar
          isHost={isHost}
          roomId={room.roomId}
          onToggleChat={() => setChatOpen(!chatOpen)}
          chatOpen={chatOpen}
        />
      </div>
    </div>
  );
}

