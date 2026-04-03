import { useLocalParticipant } from '@livekit/components-react';
import { Mic, MicOff, Video, VideoOff, MessageSquare, LogOut, MonitorUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SyncControls from './sync-controls';
import { toast } from 'sonner';

interface ControlBarProps {
  isHost: boolean;
  roomId: string;
  onToggleChat: () => void;
  chatOpen: boolean;
}

export default function ControlBar({ isHost, roomId, onToggleChat, chatOpen }: ControlBarProps) {
  const router = useRouter();
  const { isMicrophoneEnabled, isCameraEnabled, localParticipant } = useLocalParticipant();

  const toggleMic = () => {
    localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const toggleCamera = () => {
    localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  const handleLeave = async () => {
    if (isHost) {
      toast('End Watch Party?', {
        description: 'This will close the room for everyone.',
        action: {
          label: 'End Party',
          onClick: async () => {
            await fetch('/api/party/end', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId })
            });
            toast.success('Party ended');
            router.push('/');
          }
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {}
        },
        className: 'bg-neutral-900 border-white/10 text-white rounded-xl'
      });
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full h-full bg-neutral-950 border-t border-white/10 flex items-center px-4 md:px-6">
      
      {/* LEFT: Room ID */}
      <div className="flex-1 flex items-center">
        <span className="text-sm font-semibold text-neutral-400 bg-white/5 px-3 py-1.5 rounded-md hidden md:block">
          Room: <span className="text-white">{roomId}</span>
        </span>
      </div>

      {/* CENTER: Mic, Camera, Sync, Leave */}
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap max-w-full">
        
        {isHost && (
          <button
            onClick={async () => {
              try {
                if (!localParticipant.isScreenShareEnabled) {
                  toast('Ready to Stream? 🎬', { 
                    description: (
                      <div className="flex flex-col gap-2 mt-1">
                        <p className="text-xs text-neutral-300">Follow these 2 steps for the best experience:</p>
                        <div className="flex flex-col gap-1.5 ml-2">
                          <p className="text-[11px] font-bold text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px]">1</span> 
                            Click "Theater" to pop out the movie.
                          </p>
                          <p className="text-[11px] font-bold text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px]">2</span> 
                            Select that Window & check "Share Audio"!
                          </p>
                        </div>
                      </div>
                    ),
                    duration: 6000,
                    className: 'bg-neutral-900 border-white/10 text-white rounded-2xl p-4 min-w-[280px]'
                  });
                }
                await localParticipant.setScreenShareEnabled(!localParticipant.isScreenShareEnabled, { audio: true });
              } catch (e) {
                toast.error('Stream failed to start');
              }
            }}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2.5 font-black uppercase text-[10px] tracking-widest ${
              localParticipant.isScreenShareEnabled 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95'
            }`}
          >
            <MonitorUp className="w-4 h-4" />
            <span>{localParticipant.isScreenShareEnabled ? 'Stop Stream' : 'Stream Movie'}</span>
          </button>
        )}

        <div className="flex items-center gap-2 border-l border-white/10 pl-2 md:pl-4">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition-colors ${
              isMicrophoneEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/20 hover:bg-red-500/30 text-red-500'
            }`}
          >
            {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isCameraEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/20 hover:bg-red-500/30 text-red-500'
            }`}
          >
            {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={handleLeave}
          className="px-3 md:px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors md:ml-4 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">{isHost ? 'End Party' : 'Leave'}</span>
        </button>
      </div>

      {/* RIGHT: Chat Toggle */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={onToggleChat}
          className={`p-3 rounded-full transition-colors flex items-center gap-2 ${chatOpen ? 'bg-primary text-primary-foreground' : 'bg-white/5 hover:bg-white/10 text-neutral-300'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">Chat</span>
        </button>
      </div>

    </div>
  );
}
