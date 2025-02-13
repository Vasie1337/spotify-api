import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTopTracks, getTopTracksAllTime } from '@/utils/spotify';
import { TracksContent } from './TracksContent';

async function getData() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token?.value) {
    redirect('/');
  }

  const [shortTerm, longTerm] = await Promise.all([
    getTopTracks(access_token.value),
    getTopTracksAllTime(access_token.value),
  ]);

  return { shortTerm, longTerm };
}

export default async function TracksPage() {
  const { shortTerm, longTerm } = await getData();

  return (
    <TracksContent 
      initialShortTerm={shortTerm} 
      initialLongTerm={longTerm} 
    />
  );
} 