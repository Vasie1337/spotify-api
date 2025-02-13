import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const origin = request.nextUrl.origin;

  if (!code) {
    console.error('No code provided in callback');
    return NextResponse.redirect(`${origin}/error`);
  }

  try {
    const tokens = await getAccessToken(code);
    
    if (!tokens.access_token) {
      console.error('No access token received:', tokens);
      return NextResponse.redirect(`${origin}/error`);
    }

    const response = NextResponse.redirect(`${origin}/dashboard`);
    
    response.cookies.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(`${origin}/error`);
  }
} 