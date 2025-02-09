import { cookies } from 'next/headers';
import Image from 'next/image';
import { getUserProfile, getTopTracks, getTopArtists } from '@/utils/spotify';
import { redirect } from 'next/navigation';

async function getData() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token) {
    redirect('/');
  }

  const [profile, topTracks, topArtists] = await Promise.all([
    getUserProfile(access_token.value),
    getTopTracks(access_token.value),
    getTopArtists(access_token.value),
  ]);

  return { profile, topTracks, topArtists };
}

export default async function Dashboard() {
  const { profile, topTracks, topArtists } = await getData();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="mb-12 text-center">
          {profile.images?.[0] && (
            <Image
              src={profile.images[0].url}
              alt={profile.display_name}
              width={128}
              height={128}
              className="rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold">{profile.display_name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {profile.followers.total} followers
          </p>
        </div>

        {/* Top Tracks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Top Tracks</h2>
          <div className="grid gap-4">
            {topTracks.items.map((track: any, index: number) => (
              <a
                key={track.id}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-500 w-6">{index + 1}</span>
                <Image
                  src={track.album.images[0].url}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="rounded"
                />
                <div>
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {track.artists.map((artist: any) => artist.name).join(', ')}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Top Artists Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Top Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topArtists.items.map((artist: any) => (
              <a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="aspect-square relative mb-2">
                  <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    fill
                    className="rounded-lg object-cover group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <p className="font-semibold text-sm text-center">{artist.name}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 