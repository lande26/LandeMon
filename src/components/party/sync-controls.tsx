import React, { useState } from 'react';
import { useDataChannel } from '@livekit/components-react';
import { Pause, Play, RefreshCw } from 'lucide-react';

export default function SyncControls({ roomId }: { roomId: string }) {
  const { send } = useDataChannel('sync');
  const [isPlaying, setIsPlaying] = useState(false);

  // Note: These buttons broadcast JSON over LiveKit's UDP Data Channel
  const broadcastPause = () => {
    const payload = JSON.stringify({ type: 'PAUSED', timestamp: Date.now() });
    send(new TextEncoder().encode(payload), { reliable: true });
    setIsPlaying(false);
  };

  const broadcastPlay = () => {
    const payload = JSON.stringify({ type: 'PLAYING', timestamp: Date.now() });
    send(new TextEncoder().encode(payload), { reliable: true });
    setIsPlaying(true);
  };

  const broadcastSync = () => {
    const payload = JSON.stringify({ type: 'SYNC', timestamp: Date.now() });
    send(new TextEncoder().encode(payload), { reliable: true });
  };

  return (
    <div className="flex items-center bg-black/50 backdrop-blur-md rounded-full border border-indigo-500/30 p-1">
      <div className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-full mr-2 uppercase tracking-wide">
        Host
      </div>
      
      {!isPlaying ? (
        <button
          onClick={broadcastPlay}
          className="p-2 hover:bg-white/10 rounded-full text-green-400 transition-colors flex items-center gap-1.5 px-3"
          title="Tell everyone to Play"
        >
          <Play className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">Play All</span>
        </button>
      ) : (
        <button
          onClick={broadcastPause}
          className="p-2 hover:bg-white/10 rounded-full text-amber-500 transition-colors flex items-center gap-1.5 px-3"
          title="Tell everyone to Pause"
        >
          <Pause className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">Pause All</span>
        </button>
      )}

      <div className="w-px h-6 bg-white/10 mx-1" />

      <button
        onClick={broadcastSync}
        className="p-1.5 hover:bg-white/10 rounded-full text-blue-400 transition-colors flex items-center gap-1.5 px-2"
        title="Start a 3..2..1 countdown"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">Sync</span>
      </button>
    </div>
  );
}
