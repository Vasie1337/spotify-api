import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const scope = 'user-read-private user-read-email user-top-read';

export async function GET() {
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID!,
    response_type: 'code',
    redirect_uri: REDIRECT_URI!,
    scope,
  });

  return NextResponse.redirect(`${SPOTIFY_AUTH_URL}?${queryParams.toString()}`);
} 