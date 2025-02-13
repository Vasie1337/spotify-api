import Image from 'next/image';
import type { SpotifyTrack, RecentlyPlayedTrack } from '@/types/spotify';

interface TrackListProps {
  tracks: (SpotifyTrack | RecentlyPlayedTrack)[];
  title: string;
  listType: string;
}

export function TrackList({ tracks, title, listType }: TrackListProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
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
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all hover:translate-x-1"
            >
              <span className="text-gray-400 w-6 text-sm font-medium">{index + 1}</span>
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={track.album.images[0].url}
                  alt={track.name}
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{track.name}</p>
                <p className="text-sm text-gray-400 truncate">
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