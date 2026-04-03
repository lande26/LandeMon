import { getPartyRoom, RoomState } from '@/lib/party';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import PartyJoinScreen from '@/components/party/party-join-screen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Watch Party | LandeMon',
};

export default async function PartyRoomPage({
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

  return <PartyJoinScreen room={roomState} userId={session.user.id} />;
}
