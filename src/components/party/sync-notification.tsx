import React, { useState, useEffect } from 'react';
import { useDataChannel } from '@livekit/components-react';
import { toast } from 'sonner';

interface SyncNotificationProps {
  playerRef?: React.RefObject<any>;
  isHost: boolean;
}

export default function SyncNotification({ playerRef, isHost }: SyncNotificationProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  const { send } = useDataChannel('sync', (msg) => {
    if (isHost) return; // Host broadcasts, doesn't listen to its own state unless needed

    try {
      const payloadString = new TextDecoder().decode(msg.payload);
      const data = JSON.parse(payloadString);

      if (data.type === 'STATE_SYNC' && data.state) {
        if (data.serverData?.server) {
          playerRef?.current?.syncSource(data.serverData.server, data.serverData.s, data.serverData.e);
        }
        
        if (data.state.paused) {
          playerRef?.current?.pause();
        } else {
          playerRef?.current?.play();
        }
        playerRef?.current?.seek(data.state.currentTime);
      } else if (data.type === 'PAUSED') {
         playerRef?.current?.pause();
         toast('Host Paused', { description: 'Syncing...', duration: 2000, className: 'bg-amber-500/20 border-amber-500 border text-amber-200' });
      } else if (data.type === 'PLAYING') {
         playerRef?.current?.play();
         toast('Host Resumed', { description: 'Syncing...', duration: 2000, className: 'bg-green-500/20 border-green-500 border text-green-200' });
      } else if (data.type === 'SYNC') {
        startCountdown();
      }
    } catch (e) {
      console.error("Failed to parse sync message", e);
    }
  });

  useEffect(() => {
    if (!isHost) {
      // Send a sync request after a small delay to ensure channel is ready
      const timer = setTimeout(() => {
        send(new TextEncoder().encode(JSON.stringify({ type: 'REQUEST_SYNC' })), { reliable: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHost, send]);



  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown(0); // 0 means "PLAY!"
      } else {
        clearInterval(interval);
        setCountdown(null);
      }
    }, 1000);
  };

  return (
    <>
      {/* Sync Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-neutral-900/80 p-12 rounded-3xl border border-white/20 shadow-[0_0_100px_rgba(79,70,229,0.5)] transform animate-in zoom-in-50 duration-200">
            <h2 className="text-2xl text-neutral-400 font-bold mb-4 text-center uppercase tracking-[0.2em]">Syncing Stream</h2>
            <div className="text-9xl font-black text-white text-center tabular-nums">
              {countdown > 0 ? (
                <span className="text-indigo-400">{countdown}</span>
              ) : (
                <span className="text-green-500 animate-pulse">PLAY!</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
