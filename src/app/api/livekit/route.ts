import { type NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { getPartyRoom } from '@/lib/party';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const room = searchParams.get('room');

    if (!room) {
      return NextResponse.json(
        { error: 'Missing room parameter' },
        { status: 400 },
      );
    }

    const roomState = await getPartyRoom(room);
    if (!roomState) {
      return NextResponse.json(
        { error: 'Room not found or expired' },
        { status: 404 },
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'LiveKit credentials missing' },
        { status: 500 },
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: session.user.id,
      name: session.user.name,
    });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({ token: await at.toJwt(), room: roomState });
  } catch (error) {
    console.error('LiveKit Token Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
