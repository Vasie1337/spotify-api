import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTopArtists, getTopArtistsAllTime } from '@/utils/spotify';
import { ArtistsContent } from './ArtistsContent';

async function getData() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('spotify_access_token');

  if (!access_token?.value) {
    redirect('/');
  }

  const [shortTerm, longTerm] = await Promise.all([
    getTopArtists(access_token.value),
    getTopArtistsAllTime(access_token.value),
  ]);

  return { shortTerm, longTerm };
}

export default async function ArtistsPage() {
  const { shortTerm, longTerm } = await getData();

  return (
    <ArtistsContent 
      initialShortTerm={shortTerm} 
      initialLongTerm={longTerm} 
    />
  );
} 