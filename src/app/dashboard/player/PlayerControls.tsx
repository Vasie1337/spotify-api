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

  useEffect(() => {
    setIsPlaying(initialIsPlaying);
    setProgress(initialProgress);
    setShuffleState(initialShuffleState);
    setRepeatState(initialRepeatState);
  }, [initialIsPlaying, initialProgress, initialShuffleState, initialRepeatState]);

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

  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newPosition = Math.floor(duration * percentage);

    try {
      await handleControl('seek', { position_ms: newPosition });
      setProgress(newPosition);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleControl = async (action: string, options: any = {}) => {
    try {
      const response = await fetch(`/api/player/${action}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (response.ok) {
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
          case 'seek':
            setProgress(options.position_ms);
            break;
        }

        setTimeout(refreshPlaybackState, 500);
      } else {
        const errorData = await response.json();
        if (response.status === 403) {
          alert('Please make sure Spotify is active and playing on a device');
        } else {
          console.error('Failed to control playback:', errorData);
        }
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
      alert('Failed to control playback. Please check if Spotify is active.');
    }
  };

  return (
    <div className="w-full">
      {/* Progress bar - updated with onClick handler and cursor style */}
      <div className="mb-6">
        <div 
          className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-[#1DB954] rounded-full transition-all duration-100"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          className={`p-2.5 rounded-full hover:bg-white/[0.07] transition-all duration-300 ${
            shuffleState ? 'text-[#1DB954]' : 'text-white/80'
          }`}
          onClick={() => handleControl('shuffle')}
        >
          <Shuffle size={20} />
        </button>
        <button 
          className="p-2.5 rounded-full hover:bg-white/[0.07] transition-all duration-300 text-white/80"
          onClick={() => handleControl('previous')}
        >
          <SkipBack size={24} />
        </button>
        <button 
          className="p-5 rounded-full bg-[#1DB954] text-black hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-lg"
          onClick={() => handleControl(isPlaying ? 'pause' : 'play')}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          className="p-2.5 rounded-full hover:bg-white/[0.07] transition-all duration-300 text-white/80"
          onClick={() => handleControl('next')}
        >
          <SkipForward size={24} />
        </button>
        <button 
          className={`p-2.5 rounded-full hover:bg-white/[0.07] transition-all duration-300 ${
            repeatState !== 'off' ? 'text-[#1DB954]' : 'text-white/80'
          }`}
          onClick={() => handleControl('repeat')}
        >
          <Repeat size={20} />
        </button>
      </div>
    </div>
  );
} 