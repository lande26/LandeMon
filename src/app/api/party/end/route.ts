import { type NextRequest, NextResponse } from 'next/server';
import { getPartyRoom, deletePartyRoom } from '@/lib/party';
import { auth } from '@/auth';
import { RoomServiceClient } from 'livekit-server-sdk';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { roomId?: string };
    const { roomId } = body;

    if (!roomId) {
      return NextResponse.json({ error: 'Missing roomId' }, { status: 400 });
    }

    const roomState = await getPartyRoom(roomId);
    if (!roomState) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (roomState.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the host can end the party' },
        { status: 403 },
      );
    }

    // Delete from Redis
    await deletePartyRoom(roomId);

    // Kicks everyone out of the LiveKit room
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (livekitUrl && apiKey && apiSecret) {
      const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
      try {
        await roomService.deleteRoom(roomId);
      } catch (lkError) {
        console.error('Failed to delete LiveKit room:', lkError);
        // Continue even if LiveKit deletion fails
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('End Party Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
