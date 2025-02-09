import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#1DB954]/5 to-black flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Oops! Something went wrong
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] text-white px-8 py-4 font-bold hover:bg-[#1ed760] transition-all hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
          Try Again
        </Link>
      </div>
    </div>
  );
} 