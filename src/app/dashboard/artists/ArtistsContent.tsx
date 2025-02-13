'use client';

import { useState } from 'react';
import { ArtistGrid } from '@/components/ArtistGrid';
import { TimeRangeSwitch } from '@/components/TimeRangeSwitch';
import { PageWrapper } from '@/components/PageWrapper';
import type { SpotifyArtist, SpotifyResponse } from '@/types/spotify';

interface ArtistsContentProps {
  initialShortTerm: SpotifyResponse<SpotifyArtist>;
  initialLongTerm: SpotifyResponse<SpotifyArtist>;
}

export function ArtistsContent({ initialShortTerm, initialLongTerm }: ArtistsContentProps) {
  const [timeRange, setTimeRange] = useState<'short_term' | 'long_term'>('short_term');
  const artists = timeRange === 'short_term' ? initialShortTerm : initialLongTerm;

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Top Artists</h1>
          <TimeRangeSwitch timeRange={timeRange} onChange={setTimeRange} />
        </div>
        
        <ArtistGrid 
          artists={artists.items} 
          title={timeRange === 'short_term' ? 'Last 4 Weeks' : 'All Time'} 
        />
      </div>
    </PageWrapper>
  );
} 