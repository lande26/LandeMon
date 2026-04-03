import React from 'react';
import { useTracks, GridLayout, ParticipantTile } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function ParticipantGrid() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  if (tracks.length === 0) {
    return <div className="h-full flex items-center justify-center text-neutral-500">Waiting for others...</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-2 pointer-events-auto w-full custom-scrollbar">
      {tracks.length > 0 && tracks.map((trackRef) => (
        <div key={trackRef.participant.identity} className="w-full aspect-video shrink-0 rounded-xl overflow-hidden shadow-xl border-2 border-white/10 bg-neutral-900 relative">
          <ParticipantTile trackRef={trackRef} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );

}
