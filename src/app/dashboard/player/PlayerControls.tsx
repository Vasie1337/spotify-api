'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle 
} from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  shuffleState: boolean;
  repeatState: 'off' | 'track' | 'context';
}

export default function PlayerControls({
  isPlaying: initialIsPlaying,
  progress: initialProgress,
  duration,
  shuffleState: initialShuffleState,
  repeatState: initialRepeatState,
}: PlayerControlsProps) {
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [progress, setProgress] = useState(initialProgress);
  const [shuffleState, setShuffleState] = useState(initialShuffleState);
  const [repeatState, setRepeatState] = useState(initialRepeatState);

  // Update local state when props change
  useEffect(() => {
    setIsPlaying(initialIsPlaying);
    setProgress(initialProgress);
    setShuffleState(initialShuffleState);
    setRepeatState(initialRepeatState);
  }, [initialIsPlaying, initialProgress, initialShuffleState, initialRepeatState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Add function to refresh playback state
  const refreshPlaybackState = async () => {
    try {
      const response = await fetch('/api/player/state');
      if (response.ok) {
        const data = await response.json();
        setIsPlaying(data.is_playing);
        setProgress(data.progress_ms);
        setShuffleState(data.shuffle_state);
        setRepeatState(data.repeat_state);
      }
    } catch (error) {
      console.error('Error refreshing playback state:', error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleControl = async (action: string) => {
    try {
      let options = {};
      
      // Set specific options for each action
      switch (action) {
        case 'shuffle':
          options = { state: !shuffleState };
          break;
        case 'repeat':
          const states = ['off', 'track', 'context'];
          const nextState = states[(states.indexOf(repeatState) + 1) % states.length];
          options = { state: nextState };
          break;
      }

      const response = await fetch(`/api/player/${action}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        // For actions that change the track, trigger a full refresh
        if (['next', 'previous'].includes(action)) {
          window.location.reload();
        } else {
          // Optimistically update UI for other actions
          switch (action) {
            case 'play':
              setIsPlaying(true);
              break;
            case 'pause':
              setIsPlaying(false);
              break;
            case 'shuffle':
              setShuffleState(!shuffleState);
              break;
            case 'repeat':
              const states: ('off' | 'track' | 'context')[] = ['off', 'track', 'context'];
              const currentIndex = states.indexOf(repeatState);
              setRepeatState(states[(currentIndex + 1) % states.length]);
              break;
          }
        }
      } else {
        console.error('Failed to control playback:', await response.json());
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1 bg-white/10 rounded-full">
          <div 
            className="h-1 bg-white rounded-full transition-all duration-100"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button 
          className={`p-2 rounded-full hover:bg-white/10 ${
            shuffleState ? 'text-green-500' : 'text-white'
          }`}
          onClick={() => handleControl('shuffle')}
        >
          <Shuffle size={20} />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-white/10"
          onClick={() => handleControl('previous')}
        >
          <SkipBack size={24} />
        </button>
        <button 
          className="p-4 rounded-full bg-white text-black hover:scale-105 transition"
          onClick={() => handleControl(isPlaying ? 'pause' : 'play')}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          className="p-2 rounded-full hover:bg-white/10"
          onClick={() => handleControl('next')}
        >
          <SkipForward size={24} />
        </button>
        <button 
          className={`p-2 rounded-full hover:bg-white/10 ${
            repeatState !== 'off' ? 'text-green-500' : 'text-white'
          }`}
          onClick={() => handleControl('repeat')}
        >
          <Repeat size={20} />
        </button>
      </div>
    </div>
  );
} 