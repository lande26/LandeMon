import { NextResponse } from 'next/server';
import { getActiveParties } from '@/lib/party';
import { auth } from '@/auth';

// Opt out of caching entirely for live lobbies
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;
    
    const parties = await getActiveParties();
    
    const enrichedParties = parties.map(p => ({
       ...p,
       isMyParty: Boolean(currentUserId && p.hostId === currentUserId)
    }));
    
    return NextResponse.json({ parties: enrichedParties });
  } catch (err) {
    console.error("Failed to list active parties", err);
    return NextResponse.json({ parties: [] }, { status: 500 });
  }
}
