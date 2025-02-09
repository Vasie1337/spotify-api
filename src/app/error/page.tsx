import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        There was an error during authentication with Spotify.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#1DB954] text-white px-8 py-4 font-bold hover:bg-[#1ed760] transition-colors"
      >
        Try Again
      </Link>
    </div>
  );
} 