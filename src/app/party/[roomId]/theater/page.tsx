import { getPartyRoom } from '@/lib/party';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import EmbedPlayer from '@/components/watch/embed-player';
import { type MediaType } from '@/types';

export default async function TheaterPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const roomState = await getPartyRoom(roomId);
  if (!roomState) {
    redirect('/');
    return null;
  }

  const session = await auth();
  if (!session?.user?.id || session.user.id !== roomState.hostId) {
    redirect(`/party/${roomId}`);
    return null;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black">
      <EmbedPlayer
        tmdbId={roomState.tmdbId}
        mediaType={roomState.mediaType as MediaType}
        roomId={roomState.roomId}
        isWatchParty={true}
        isHost={true}
      />
    </div>
  );
}
