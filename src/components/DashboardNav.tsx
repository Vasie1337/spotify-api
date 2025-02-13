'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Mic2, 
  Music2, 
  ListMusic,
  Play
} from 'lucide-react';

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/tracks', label: 'Top Tracks', icon: Music2 },
    { href: '/dashboard/artists', label: 'Top Artists', icon: Mic2 },
    { href: '/dashboard/playlists', label: 'Playlists', icon: ListMusic },
    { href: '/dashboard/player', label: 'Player', icon: Play },
  ];

  return (
    <div className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl py-4">
      <nav className="mx-auto max-w-screen-2xl px-4">
        <div className="flex gap-2 p-2 bg-white/[0.03] rounded-2xl border border-white/[0.05] shadow-lg">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 text-[#1DB954] shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 