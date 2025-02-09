const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function getAccessToken(code: string) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI!,
    }),
  });

  return response.json();
}

export async function getUserProfile(access_token: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  
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