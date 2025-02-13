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
    <nav className="flex gap-1 p-2 mb-8 bg-white/5 backdrop-blur-lg rounded-lg">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 