import Image from 'next/image';
import type { SpotifyArtist } from '@/types/spotify';

interface ArtistGridProps {
  artists: SpotifyArtist[];
  title: string;
}

export function ArtistGrid({ artists, title }: ArtistGridProps) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.05]">
      <h2 className="text-2xl font-bold mb-6 text-white/90">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {artists.map((artist) => (
          <a
            key={artist.id}
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="aspect-square relative mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Image
                src={artist.images[0].url}
                alt={artist.name}
                fill
                className="object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="text-center">
              <p className="font-semibold truncate group-hover:text-[#1DB954] transition-all duration-300">
                {artist.name}
              </p>
              {artist.genres[0] && (
                <p className="text-sm text-gray-400 truncate mt-1.5 group-hover:text-gray-300 transition-colors">
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