'use client';

import { useState } from 'react';
import { TrackList } from '@/components/TrackList';
import { TimeRangeSwitch } from '@/components/TimeRangeSwitch';
import type { SpotifyTrack, SpotifyResponse } from '@/types/spotify';

interface TracksContentProps {
  initialShortTerm: SpotifyResponse<SpotifyTrack>;
  initialLongTerm: SpotifyResponse<SpotifyTrack>;
}

export function TracksContent({ initialShortTerm, initialLongTerm }: TracksContentProps) {
  const [timeRange, setTimeRange] = useState<'short_term' | 'long_term'>('short_term');
  const tracks = timeRange === 'short_term' ? initialShortTerm : initialLongTerm;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Top Tracks</h1>
        <TimeRangeSwitch timeRange={timeRange} onChange={setTimeRange} />
      </div>
      
      <TrackList 
        tracks={tracks.items} 
        title={timeRange === 'short_term' ? 'Last 4 Weeks' : 'All Time'}
        listType={timeRange}
      />
    </div>
  );
} 