import { cookies } from 'next/headers';
import { controlPlayback } from '@/utils/spotify';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> | { action: string } }
) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');
  const { action } = await context.params;

  if (!access_token?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get options from request body
    const options = await request.json().catch(() => ({}));
    
    const status = await controlPlayback(access_token.value, action, options);
    
    if (status === 204) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to control playback' }, 
        { status }
      );
    }
  } catch (error) {
    console.error('Playback control error:', error);
    return NextResponse.json(
      { error: 'Failed to control playback' }, 
      { status: 500 }
    );
  }
} 