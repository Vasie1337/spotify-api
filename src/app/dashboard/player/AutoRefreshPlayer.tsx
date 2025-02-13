'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { SpotifyPlaybackState } from '@/types/spotify';
import PlayerControls from './PlayerControls';

export default function AutoRefreshPlayer({ initialPlaybackState }: { initialPlaybackState: SpotifyPlaybackState | null }) {
  const [playbackState, setPlaybackState] = useState(initialPlaybackState);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/player/state');
        if (response.ok) {
          const newState = await response.json();
          setPlaybackState(prev => {
            if (!prev || 
                !newState || 
                prev.item?.id !== newState.item?.id || 
                prev.is_playing !== newState.is_playing) {
              return newState;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error polling playback state:', error);
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, []);

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