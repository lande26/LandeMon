import { getPartyRoom, RoomState } from '@/lib/party';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import WatchPartyClient from '@/components/party/watch-party-client';

export default async function WatchPartyPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const roomState: RoomState | null = await getPartyRoom(roomId);
  if (!roomState) {
    redirect('/');
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/?callbackUrl=/party/${roomId}`);
  }

  return <WatchPartyClient room={roomState} currentUserId={session.user.id} />;
}
