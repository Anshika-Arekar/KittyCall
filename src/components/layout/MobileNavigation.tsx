'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PixelIcon, type PixelIconName } from '@/components/ui/PixelIcon';

interface MobileNavItem {
  href: string;
  label: string;
  icon: PixelIconName;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { href: '/discover', label: 'Discover', icon: 'paw' },
  { href: '/matches', label: 'Matches', icon: 'heart' },
  { href: '/matches', label: 'Meows', icon: 'chat' },
  { href: '/profile', label: 'My Cat', icon: 'cat' },
  { href: '/settings', label: 'More', icon: 'settings' },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8E8] border-t-[2.5px] border-[#292631] shadow-[0px_-2px_0px_#292631] px-2 py-1.5 flex items-center justify-around">
      {MOBILE_NAV_ITEMS.map((item, idx) => {
        // Special case: if Meows and Matches share /matches, distinguish if needed or active
        const isActive =
          idx === 2
            ? pathname.startsWith('/meow-room')
            : idx === 1
            ? pathname === '/matches'
            : pathname === item.href || (item.href !== '/discover' && pathname.startsWith(item.href));

        return (
          <Link
            key={`${item.href}-${idx}`}
            href={idx === 2 ? '/matches' : item.href}
            className={`
              flex flex-col items-center justify-center p-1.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all
              ${
                isActive
                  ? 'text-[#F08080] scale-105'
                  : 'text-[#292631] hover:text-[#9B8ACB]'
              }
            `}
          >
            <div
              className={`
                w-8 h-8 rounded-retro border-2 border-[#292631] flex items-center justify-center mb-0.5
                ${isActive ? 'bg-[#F3A6B8] shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-[#FFF8E8] shadow-[1.5px_1.5px_0px_#292631]'}
              `}
            >
              <PixelIcon name={item.icon} size={15} className="text-[#292631]" />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
