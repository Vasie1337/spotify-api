import { cookies } from 'next/headers';
import { getCurrentPlayback } from '@/utils/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const playbackState = await getCurrentPlayback(access_token.value);
    
    if (!playbackState) {
      return NextResponse.json({ error: 'No active playback' }, { status: 404 });
    }

    return NextResponse.json(playbackState);
  } catch (error) {
    console.error('Error fetching playback state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playback state' }, 
      { status: 500 }
    );
  }
} 