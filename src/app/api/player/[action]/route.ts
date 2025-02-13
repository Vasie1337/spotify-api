import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { controlPlayback } from '@/utils/spotify';

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token?.value) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const status = await controlPlayback(access_token.value, params.action);
    return new NextResponse(null, { status });
  } catch (error) {
    console.error('Error controlling playback:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 