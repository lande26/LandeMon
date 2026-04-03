import { redis } from './cache';

export interface RoomState {
  roomId: string;
  hostId: string;
  hostName: string;
  tmdbId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  season?: number;
  episode?: number;
  status: 'PLAYING' | 'PAUSED' | 'SYNCING';
  timestamp: number;
}

export async function createPartyRoom(
  hostId: string,
  hostName: string,
  tmdbId: string,
  mediaType: string,
  title: string,
  posterPath: string,
  season?: number,
  episode?: number,
): Promise<string> {
  if (!redis) throw new Error('Redis is not configured.');
  
  // Generate a random 6-character party ID
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const initialState: RoomState = {
    roomId,
    hostId,
    hostName,
    tmdbId,
    mediaType,
    title,
    posterPath,
    season,
    episode,
    status: 'PAUSED',
    timestamp: 0,
  };

  // Cache lives for exactly 4 hours to prevent ghost rooms piling up
  await redis.set(`party:${roomId}`, initialState, { ex: 60 * 60 * 4 });
  return roomId;
}

export async function getPartyRoom(roomId: string): Promise<RoomState | null> {
  if (!redis) return null;
  return await redis.get<RoomState>(`party:${roomId}`);
}

export async function updatePartyRoom(roomId: string, updates: Partial<RoomState>): Promise<RoomState | null> {
  if (!redis) return null;
  const current = await getPartyRoom(roomId);
  if (!current) return null;
  
  const nextState = { ...current, ...updates };
  await redis.set(`party:${roomId}`, nextState, { ex: 60 * 60 * 4 });
  return nextState;
}

export async function deletePartyRoom(roomId: string): Promise<void> {
  if (!redis) return;
  await redis.del(`party:${roomId}`);
}

export async function getActiveParties(): Promise<RoomState[]> {
  if (!redis) return [];
  const keys = await redis.keys('party:*');
  if (!keys || keys.length === 0) return [];
  
  const parties = await redis.mget<RoomState[]>(...keys);
  // Filter out any nulls that might have expired between keys and mget
  return parties.filter((p): p is RoomState => Boolean(p));
}

