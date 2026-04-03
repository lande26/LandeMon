import { Redis } from '@upstash/redis';
import { env } from '@/env.mjs';

// Lazily instantiate Redis. This prevents Client Components from crashing 
// if they accidentally import this module, as T3 Env strictly blocks browser access.
export let redis: Redis | null = null;

if (typeof window === 'undefined') {
  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/**
 * A generalized Read-Through Cache utility.
 * 
 * @param key - The unique identifier for this cache entry
 * @param ttlSeconds - Time-To-Live in seconds (how long the cache lives)
 * @param fetchFn - The async function that actually fetches the data if it's not cached
 * @returns The cached or freshly fetched data
 */
export async function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const versionedKey = `v3:${key}`;
  
  // If we are executing inside the browser, completely bypass the Edge Server cache string
  // and fetch directly from TMDB using the client!
  if (!redis) {
    return fetchFn();
  }

  try {
    // 1. Check if the data exists in Redis
    const cachedData = await redis.get<T>(versionedKey);
    
    if (cachedData) {
      console.log(`[Cache HIT] ${versionedKey}`);
      return cachedData;
    }

    // 2. Cache Miss: Execute the actual TMDB API fetch
    console.log(`[Cache MISS] ${versionedKey} - Fetching fresh data...`);
    const freshData = await fetchFn();

    // 3. Save the fresh data back to Redis asynchronously with the specified TTL
    if (freshData) {
      // Background execution: Promise.resolve wraps this so we don't block the UI returning the freshData.
      Promise.resolve(
        redis.set(versionedKey, freshData, { ex: ttlSeconds })
      ).catch(err => console.error(`Failed to execute cache set for ${versionedKey}`, err));
    }

    // 4. Return the fresh data to the caller immediately
    return freshData;
  } catch (error) {
    // Graceful degradation: If Redis fails (e.g. network partition), fallback to hitting TMDB directly
    console.error(`[Redis Error] Failed while processing ${versionedKey}`, error);
    return fetchFn();
  }
}
