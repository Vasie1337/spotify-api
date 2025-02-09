import { cookies } from 'next/headers';
import Image from 'next/image';
import { 
  getUserProfile, 
  getTopTracks, 
  getTopArtists,
  getRecentlyPlayed,
  getTopTracksAllTime,
  getTopArtistsAllTime,
  getUserPlaylists
} from '@/utils/spotify';
import { redirect } from 'next/navigation';

async function getData() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token) {
    redirect('/');
  }

  const [
    profile, 
    topTracks, 
    topArtists,
    recentlyPlayed,
    topTracksAllTime,
    topArtistsAllTime,
    playlists
  ] = await Promise.all([
    getUserProfile(access_token.value),
    getTopTracks(access_token.value),
    getTopArtists(access_token.value),
    getRecentlyPlayed(access_token.value),
    getTopTracksAllTime(access_token.value),
    getTopArtistsAllTime(access_token.value),
    getUserPlaylists(access_token.value)
  ]);

  return { 
    profile, 
    topTracks, 
    topArtists,
    recentlyPlayed,
    topTracksAllTime,
    topArtistsAllTime,
    playlists
  };
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center">
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function TrackList({ tracks, title }: { tracks: any[]; title: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {tracks.map((track: any, index: number) => (
          <a
            key={track.id || track.played_at}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-gray-400 w-6 text-sm">{index + 1}</span>
            <Image
              src={track.album.images[0].url}
              alt={track.name}
              width={40}
              height={40}
              className="rounded"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{track.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {track.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function ArtistGrid({ artists, title }: { artists: any[]; title: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {artists.map((artist: any) => (
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
            <p className="font-medium text-sm text-center truncate">
              {artist.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const { 
    profile, 
    topTracks, 
    topArtists,
    recentlyPlayed,
    topTracksAllTime,
    topArtistsAllTime,
    playlists
  } = await getData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1DB954]/10 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
          {profile.images?.[0] && (
            <Image
              src={profile.images[0].url}
              alt={profile.display_name}
              width={128}
              height={128}
              className="rounded-full"
            />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold mb-2">{profile.display_name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <StatCard title="Followers" value={profile.followers.total} />
              <StatCard title="Playlists" value={playlists.total} />
              <StatCard 
                title="Top Genre" 
                value={topArtistsAllTime.items[0]?.genres[0] || 'N/A'} 
              />
              <StatCard 
                title="Top Artist" 
                value={topArtistsAllTime.items[0]?.name || 'N/A'} 
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrackList 
            tracks={topTracks.items} 
            title="Top Tracks (Last 4 Weeks)" 
          />
          <TrackList 
            tracks={topTracksAllTime.items} 
            title="Top Tracks (All Time)" 
          />
          <TrackList 
            tracks={recentlyPlayed.items.map((item: any) => item.track)} 
            title="Recently Played" 
          />
          <div className="space-y-6">
            <ArtistGrid 
              artists={topArtists.items} 
              title="Top Artists (Last 4 Weeks)" 
            />
            <ArtistGrid 
              artists={topArtistsAllTime.items} 
              title="Top Artists (All Time)" 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 