'use client';

import React, { useEffect, useState, useRef } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { type RoomState } from '@/lib/party';
import { useRouter } from 'next/navigation';
import EmbedPlayer from '@/components/watch/embed-player';
import { type MediaType } from '@/types';
import { toast } from 'sonner';
import {
  useTracks,
  ParticipantTile,
  useDataChannel,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MonitorUp } from 'lucide-react';
import { type EmbedPlayerRef } from '@/components/watch/embed-player';

// Sub-components
import ParticipantGrid from './participant-grid';
import ControlBar from './control-bar';
import ChatPanel from './chat-panel';

export default function WatchPartyClient({
  room,
  currentUserId,
}: {
  room: RoomState;
  currentUserId: string;
}) {
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
        className: 'bg-indigo-600 border-indigo-500 text-white rounded-xl',
      });
    }
  }, [token]);

  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch(`/api/livekit?room=${room.roomId}`);
        const data = (await res.json()) as { token?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? 'Failed to get token');
        if (data.token) setToken(data.token);
      } catch (err) {
        console.error('Failed to connect', err);
        void router.push('/party');
      }
    }
    void getToken();
  }, [room.roomId, router]);

  if (!token) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-black text-white">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p>Connecting to {room.title}...</p>
      </div>
    );
  }

  const audioEnabled =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('preferredMicState') === 'true'
      : false;
  const videoEnabled =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('preferredCameraState') === 'true'
      : false;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={audioEnabled}
      video={videoEnabled}
      onDisconnected={() => router.push('/')}>
      <PartyLayout
        room={room}
        isHost={isHost}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
      />
    </LiveKitRoom>
  );
}

function PartyLayout({
  room,
  isHost,
  chatOpen,
  setChatOpen,
}: {
  room: RoomState;
  isHost: boolean;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
}) {
  const playerRef = useRef<EmbedPlayerRef>(null);
  const lastStateRef = useRef<any>(null);
  const screenTracks = useTracks([Track.Source.ScreenShare]);
  const hasScreenShare = screenTracks.length > 0;

  const { send } = useDataChannel(
    'sync',
    (msg: { payload: Uint8Array | ArrayBuffer }) => {
      if (!isHost) return;
      try {
        const bytes =
          msg.payload instanceof ArrayBuffer
            ? new Uint8Array(msg.payload)
            : msg.payload;
        const decoded = new TextDecoder().decode(bytes);
        const data = JSON.parse(decoded) as { type?: string } | undefined;
        if (data?.type === 'REQUEST_SYNC' && lastStateRef.current && send) {
          const payload = JSON.stringify({
            type: 'STATE_SYNC',
            state: lastStateRef.current,
            // serverData may be nested in lastStateRef; we keep it as-is
            serverData: lastStateRef.current?.serverData,
            timestamp: Date.now(),
          });
          void send(new TextEncoder().encode(payload), { reliable: true });
        }
      } catch (e) {
        // ignore parse errors
      }
    },
  );

  const handleStateUpdate = (state: unknown) => {
    if (!isHost) return;
    lastStateRef.current = state;
    try {
      const payload = JSON.stringify({
        type: 'STATE_SYNC',
        state,
        serverData: (state as any)?.serverData,
        timestamp: Date.now(),
      });
      if (send)
        void send(new TextEncoder().encode(payload), { reliable: false });
    } catch (e) {
      // ignore serialization errors
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black">
      <div className="relative flex flex-1 overflow-hidden">
        {/* Main Video Area (Squishes when chat opens) */}
        <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-black transition-all duration-300">
          {/* Secretly renders the WebRTC audio context */}
          <RoomAudioRenderer />

          <div className="group relative w-full flex-1">
            {hasScreenShare ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black p-4 md:p-8">
                <div className="relative mx-auto aspect-video h-full w-full max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
                  <ParticipantTile
                    trackRef={screenTracks[0]}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ) : isHost ? (
              <EmbedPlayer
                ref={playerRef}
                tmdbId={room.tmdbId}
                roomId={room.roomId}
                mediaType={room.mediaType as MediaType}
                isWatchParty={true}
                isHost={isHost}
                onStateUpdate={handleStateUpdate}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 px-6 text-center">
                <div className="mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-primary/10">
                  <MonitorUp className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-3xl font-black tracking-tight">
                  Waiting for Host
                </h2>
                <p className="mx-auto max-w-md text-neutral-500">
                  The party has started! Hang tight while{' '}
                  <span className="font-bold text-primary">
                    {room.hostName}
                  </span>{' '}
                  prepares the stream.
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-600">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-700" />
                  Ready to Sync
                </div>
              </div>
            )}

            {/* Floating Top Right (inside the video area): Webcams */}
            <div className="custom-scrollbar pointer-events-none absolute right-4 top-16 z-40 max-h-[70vh] w-48 overflow-y-auto drop-shadow-2xl sm:w-56">
              <ParticipantGrid />
            </div>
          </div>
        </div>

        {/* Sliding Chat Pane (Pushes video to the left) */}
        <div
          className={`flex h-full flex-col border-l border-white/10 bg-neutral-950 transition-all duration-300 ease-in-out ${
            chatOpen
              ? 'w-80 translate-x-0 opacity-100'
              : 'absolute right-0 w-0 translate-x-full opacity-0'
          }`}>
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Party Chat
            </h3>
            <button
              onClick={() => setChatOpen(false)}
              className="text-xl leading-none text-neutral-400 hover:text-white">
              &times;
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <ChatPanel roomId={room.roomId} />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Fixed Height */}
      <div className="relative z-50 h-16 shrink-0 bg-neutral-950">
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
