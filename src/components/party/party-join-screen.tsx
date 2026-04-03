'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoomState } from '@/lib/party';
import { Video, VideoOff, Mic, MicOff, Link as LinkIcon, Play, Users } from 'lucide-react';
import CustomImage from '../custom-image';

interface PartyJoinScreenProps {
  room: RoomState;
  userId: string;
}

export default function PartyJoinScreen({ room, userId }: PartyJoinScreenProps) {
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
          activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = activeStream;
          }
          setStream(activeStream);
        } catch (err) {
          console.error("Camera access denied or unavailable", err);
          setCameraEnabled(false);
        }
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
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
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled]);

  const handleJoin = () => {
    // You can pass the preferred camera/mic state via query params or sessionStorage 
    // so the WatchParty interface knows whether to auto-enable them inside LiveKit.
    sessionStorage.setItem('preferredCameraState', cameraEnabled ? 'true' : 'false');
    sessionStorage.setItem('preferredMicState', micEnabled ? 'true' : 'false');
    
    router.push(`/party/${room.roomId}/watch`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/party/${room.roomId}`);
    alert('Copied invite link to clipboard');
  };

  const isHost = room.hostId === userId;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black text-white p-4 overflow-hidden">
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
      
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-neutral-900/80 p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: Media Info */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="mb-6 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5 relative aspect-[2/3] w-48 md:w-64 max-w-full">
             <CustomImage
               src={`https://image.tmdb.org/t/p/w500${room.posterPath}`}
               alt={room.title}
               width={500}
               height={750}
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  <Play className="w-3 h-3" /> {room.mediaType}
                </span>
             </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">
            {room.title}
          </h1>
          
          <div className="flex items-center gap-3 mt-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {room.hostName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-neutral-400">Started by</p>
              <p className="font-semibold text-white leading-tight">{room.hostName} {isHost && "(You)"}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Camera & Mic Setup */}
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Join Watch Party
            </h2>
            <button 
              onClick={copyLink}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LinkIcon className="w-4 h-4" /> Copy Link
            </button>
          </div>

          <div className="relative aspect-video bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center mb-6">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-300 ${cameraEnabled ? 'opacity-100' : 'opacity-0'}`} 
            />
            
            {!cameraEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
                  <span className="text-3xl font-bold text-neutral-400">{userId.charAt(0).toUpperCase()}</span>
                </div>
                <p>Camera is off</p>
              </div>
            )}

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-4 rounded-full shadow-lg transition-all ${micEnabled ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md' : 'bg-red-500 hover:bg-red-600 text-white'}`}
              >
                {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
              
              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`p-4 rounded-full shadow-lg transition-all ${cameraEnabled ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md' : 'bg-red-500 hover:bg-red-600 text-white'}`}
              >
                {cameraEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleJoin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl text-lg shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all hover:scale-[1.02] active:scale-95"
          >
            Enter Room
          </button>
          
          <p className="text-center text-neutral-500 text-xs mt-4">
            Your camera and microphone are off by default. You can turn them on anytime.
          </p>
        </div>

      </div>
    </div>
  );
}
