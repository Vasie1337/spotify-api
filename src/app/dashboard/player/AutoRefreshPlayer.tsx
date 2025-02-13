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
        <h1 className="text-2xl font-bold mb-4 text-white/90">No Active Playback</h1>
        <p className="text-gray-400">
          Start playing something on Spotify to see it here
        </p>
      </div>
    );
  }

  const { item: track, is_playing, progress_ms } = playbackState;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.05] shadow-lg">
        <div className="aspect-square relative mb-8 max-w-md mx-auto group">
          <Image
            src={track.album.images[0].url}
            alt={track.name}
            fill
            className="rounded-2xl object-cover shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-2xl" />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 text-white/90">{track.name}</h1>
          <p className="text-lg text-[#1DB954] font-medium">
            {track.artists.map(artist => artist.name).join(', ')}
          </p>
          <p className="text-sm text-gray-400 mt-2">{track.album.name}</p>
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