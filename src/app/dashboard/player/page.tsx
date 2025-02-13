import { cookies } from 'next/headers';
import { getCurrentPlayback } from '@/utils/spotify';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import type { SpotifyPlaybackState } from '@/types/spotify';
import PlayerControls from './PlayerControls';

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

  if (!playbackState || !playbackState.item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">No Active Playback</h1>
        <p className="text-gray-400">
          Start playing something on Spotify to see it here
        </p>
      </div>
    );
  }

  const { item: track, is_playing, progress_ms } = playbackState;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
        <div className="aspect-square relative mb-6 max-w-md mx-auto">
          <Image
            src={track.album.images[0].url}
            alt={track.name}
            fill
            className="rounded-lg object-cover"
            priority
          />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{track.name}</h1>
          <p className="text-gray-400">
            {track.artists.map(artist => artist.name).join(', ')}
          </p>
          <p className="text-sm text-gray-500 mt-1">{track.album.name}</p>
        </div>

        <PlayerControls 
          isPlaying={is_playing}
          progress={progress_ms}
          duration={track.duration_ms}
          shuffleState={playbackState.shuffle_state}
          repeatState={playbackState.repeat_state}
        />
      </div>
    </div>
  );
} 