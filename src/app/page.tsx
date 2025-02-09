import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Spotify Stats Viewer</h1>
      <Link
        href="/api/auth/login"
        className="rounded-full bg-[#1DB954] text-white px-8 py-4 font-bold hover:bg-[#1ed760] transition-colors"
      >
        Login with Spotify
      </Link>
    </div>
  );
}
