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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1000, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    try {
      const action = isPlaying ? 'pause' : 'play';
      const response = await fetch(`/api/player/${action}`, { method: 'POST' });
      if (response.ok) {
        setIsPlaying(!isPlaying);
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
          onClick={() => setShuffleState(!shuffleState)}
        >
          <Shuffle size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10">
          <SkipBack size={24} />
        </button>
        <button 
          className="p-4 rounded-full bg-white text-black hover:scale-105 transition"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="p-2 rounded-full hover:bg-white/10">
          <SkipForward size={24} />
        </button>
        <button 
          className={`p-2 rounded-full hover:bg-white/10 ${
            repeatState !== 'off' ? 'text-green-500' : 'text-white'
          }`}
          onClick={() => {
            const states: ('off' | 'track' | 'context')[] = ['off', 'track', 'context'];
            const currentIndex = states.indexOf(repeatState);
            setRepeatState(states[(currentIndex + 1) % states.length]);
          }}
        >
          <Repeat size={20} />
        </button>
      </div>
    </div>
  );
} 