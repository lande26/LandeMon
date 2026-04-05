'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type RoomState } from '@/lib/party';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Link as LinkIcon,
  Play,
  Users,
} from 'lucide-react';
import CustomImage from '../custom-image';

interface PartyJoinScreenProps {
  room: RoomState;
  userId: string;
}

export default function PartyJoinScreen({
  room,
  userId,
}: PartyJoinScreenProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Handle local camera preview
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function setupCamera() {
      if (cameraEnabled) {
        try {
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = activeStream;
          }
          setStream(activeStream);
        } catch (err) {
          console.error('Camera access denied or unavailable', err);
          setCameraEnabled(false);
        }
      } else {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }

    setupCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled]);

  const handleJoin = () => {
    // You can pass the preferred camera/mic state via query params or sessionStorage
    // so the WatchParty interface knows whether to auto-enable them inside LiveKit.
    sessionStorage.setItem(
      'preferredCameraState',
      cameraEnabled ? 'true' : 'false',
    );
    sessionStorage.setItem('preferredMicState', micEnabled ? 'true' : 'false');

    router.push(`/party/${room.roomId}/watch`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/party/${room.roomId}`,
    );
    alert('Copied invite link to clipboard');
  };

  const isHost = room.hostId === userId;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4 text-white">
      {/* Background Blur of Poster */}
      {room.posterPath && (
        <div
          className="absolute inset-0 opacity-10 blur-3xl"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${room.posterPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-neutral-900/80 p-6 shadow-2xl backdrop-blur-xl md:flex-row">
        {/* LEFT COLUMN: Media Info */}
        <div className="flex flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
          <div className="relative mb-6 aspect-[2/3] w-48 max-w-full overflow-hidden rounded-2xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] md:w-64">
            <CustomImage
              src={`https://image.tmdb.org/t/p/w500${room.posterPath}`}
              alt={room.title}
              width={500}
              height={750}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                <Play className="h-3 w-3" /> {room.mediaType}
              </span>
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-black text-white md:text-5xl">
            {room.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {room.hostName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-neutral-400">Started by</p>
              <p className="font-semibold leading-tight text-white">
                {room.hostName} {isHost && '(You)'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Camera & Mic Setup */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Users className="h-5 w-5 text-primary" />
              Join Watch Party
            </h2>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm transition-colors hover:bg-white/20">
              <LinkIcon className="h-4 w-4" /> Copy Link
            </button>
          </div>

          <div className="relative mb-6 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover transition-opacity duration-300 ${cameraEnabled ? 'opacity-100' : 'opacity-0'}`}
            />

            {!cameraEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800">
                  <span className="text-3xl font-bold text-neutral-400">
                    {userId.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p>Camera is off</p>
              </div>
            )}

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`rounded-full p-4 shadow-lg transition-all ${micEnabled ? 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {micEnabled ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`rounded-full p-4 shadow-lg transition-all ${cameraEnabled ? 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {cameraEnabled ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleJoin}
            className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-95">
            Enter Room
          </button>

          <p className="mt-4 text-center text-xs text-neutral-500">
            Your camera and microphone are off by default. You can turn them on
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
