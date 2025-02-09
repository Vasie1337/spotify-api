import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const origin = request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/error`);
  }

  try {
    const tokens = await getAccessToken(code);
    
    // In a real app, you'd want to store these tokens securely
    // For this example, we'll use cookies
    const response = NextResponse.redirect(`${origin}/dashboard`);
    response.cookies.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(`${origin}/error`);
  }
} 