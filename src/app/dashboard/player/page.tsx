import { cookies } from 'next/headers';
import { getCurrentPlayback } from '@/utils/spotify';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { SpotifyPlaybackState } from '@/types/spotify';
import AutoRefreshPlayer from './AutoRefreshPlayer';

// Add revalidation to ensure fresh data
export const revalidate = 0;

async function getPlaybackState() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token?.value) {
    redirect('/');
  }

  try {
    const playbackState = await getCurrentPlayback(access_token.value);
    return playbackState;
  } catch (error) {
    console.error('Error fetching playback state:', error);
    return null;
  }
}

export default async function PlayerPage() {
  const playbackState = await getPlaybackState() as SpotifyPlaybackState | null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutoRefreshPlayer initialPlaybackState={playbackState} />
    </Suspense>
  );
} 