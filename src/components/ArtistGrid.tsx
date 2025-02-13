import Image from 'next/image';
import type { SpotifyArtist } from '@/types/spotify';

interface ArtistGridProps {
  artists: SpotifyArtist[];
  title: string;
}

export function ArtistGrid({ artists, title }: ArtistGridProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {artists.map((artist) => (
          <a
            key={artist.id}
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="aspect-square relative mb-3 rounded-full overflow-hidden">
              <Image
                src={artist.images[0].url}
                alt={artist.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-medium truncate group-hover:text-[#1DB954] transition-colors">
                {artist.name}
              </p>
              {artist.genres[0] && (
                <p className="text-sm text-gray-400 truncate mt-1">
                  {artist.genres[0]}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 