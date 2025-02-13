const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function getAccessToken(code: string) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: params,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Token exchange error:', error);
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

export async function getUserProfile(access_token: string) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Profile fetch error:', error);
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}

export async function getTopTracks(access_token: string) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/tracks?limit=10&time_range=short_term`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  
  return response.json();
}

export async function getTopArtists(access_token: string) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/artists?limit=10&time_range=short_term`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  
  return response.json();
}

export async function getRecentlyPlayed(access_token: string) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/player/recently-played?limit=10`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.json();
}

export async function getTopTracksAllTime(access_token: string) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/tracks?limit=10&time_range=long_term`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.json();
}

export async function getTopArtistsAllTime(access_token: string) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/artists?limit=10&time_range=long_term`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.json();
}

export async function getUserPlaylists(access_token: string) {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/playlists?limit=10`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.json();
} 