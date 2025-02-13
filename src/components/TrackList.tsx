import Image from 'next/image';
import type { SpotifyTrack, RecentlyPlayedTrack } from '@/types/spotify';

interface TrackListProps {
  tracks: (SpotifyTrack | RecentlyPlayedTrack)[];
  title: string;
  listType: string;
}

export function TrackList({ tracks, title, listType }: TrackListProps) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.05]">
      <h2 className="text-2xl font-bold mb-6 text-white/90">{title}</h2>
      <div className="space-y-2">
        {tracks.map((item, index) => {
          const track = 'track' in item ? item.track : item;
          const uniqueKey = `${listType}-${track.id}-${index}`;
          
          return (
            <a
              key={uniqueKey}
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <span className="text-gray-400 w-6 text-sm font-medium group-hover:text-[#1DB954] transition-colors">
                {index + 1}
              </span>
              <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden shadow-md">
                <Image
                  src={track.album.images[0].url}
                  alt={track.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate group-hover:text-[#1DB954] transition-colors">
                  {track.name}
                </p>
                <p className="text-sm text-gray-400 truncate mt-1 group-hover:text-gray-300 transition-colors">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
} 