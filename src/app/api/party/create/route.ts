import { type NextRequest, NextResponse } from 'next/server';
import { createPartyRoom } from '@/lib/party';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as {
      tmdbId?: number | string;
      mediaType?: string;
      title?: string;
      posterPath?: string;
      season?: number;
      episode?: number;
    };

    const {
      tmdbId,
      mediaType,
      title = '',
      posterPath = '',
      season,
      episode,
    } = body;

    if (!tmdbId || !mediaType) {
      return NextResponse.json(
        { error: 'Missing tmdbId or mediaType' },
        { status: 400 },
      );
    }

    const roomId = await createPartyRoom(
      session.user.id,
      session.user.name ?? 'Host',
      tmdbId.toString(),
      mediaType,
      title,
      posterPath,
      season ? Number(season) : undefined,
      episode ? Number(episode) : undefined,
    );

    return NextResponse.json({ roomId });
  } catch (error) {
    console.error('Party Create Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
