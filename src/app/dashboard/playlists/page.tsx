import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getUserPlaylists } from '@/utils/spotify';
import type { SpotifyPlaylist } from '@/types/spotify';

async function getData() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token?.value) {
    redirect('/');
  }

  const playlists = await getUserPlaylists(access_token.value);
  return { playlists };
}

function PlaylistGrid({ playlists }: { playlists: SpotifyPlaylist[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {playlists.map((playlist) => (
        <a
          key={playlist.id}
          href={`https://open.spotify.com/playlist/${playlist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white/5 rounded-lg p-4 transition-all hover:bg-white/10"
        >
          <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
            <Image
              src={playlist.images[0]?.url || '/playlist-placeholder.png'}
              alt={playlist.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h3 className="font-medium truncate mb-1">{playlist.name}</h3>
            <p className="text-sm text-gray-400">{playlist.tracks.total} tracks</p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default async function PlaylistsPage() {
  const { playlists } = await getData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Your Playlists</h1>
      <PlaylistGrid playlists={playlists.items} />
    </div>
  );
} 