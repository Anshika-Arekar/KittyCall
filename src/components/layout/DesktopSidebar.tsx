'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PixelIcon, type PixelIconName } from '@/components/ui/PixelIcon';

interface NavItem {
  href: string;
  label: string;
  icon: PixelIconName;
  variant: 'pink' | 'purple' | 'blue' | 'green' | 'coral';
}

const NAV_ITEMS: NavItem[] = [
  { href: '/discover', label: 'Discover', icon: 'paw', variant: 'pink' },
  { href: '/matches', label: 'Matches', icon: 'heart', variant: 'coral' },
  { href: '/profile', label: 'Cat Profile', icon: 'cat', variant: 'blue' },
  { href: '/settings', label: 'Settings', icon: 'settings', variant: 'purple' },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 p-4 gap-4">
      <div className="bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg p-3">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#9B8ACB] border-b-2 border-[#292631] pb-2 mb-3 flex items-center justify-between">
          <span>NAVIGATION</span>
          <span className="w-2 h-2 bg-[#A7C98B] border border-[#292631] rounded-full inline-block animate-pulse" />
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/discover' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider
                  border-2 border-[#292631] rounded-retro transition-all
                  ${
                    isActive
                      ? 'bg-[#F3A6B8] shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-[#FFF8E8] hover:bg-[#F6EEDC] shadow-retro y2k-pressable'
                  }
                  text-[#292631]
                `}
              >
                <div className="w-6 h-6 rounded border border-[#292631] bg-white flex items-center justify-center shrink-0">
                  <PixelIcon name={item.icon} size={14} className="text-[#292631]" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Retro dial-up status widget */}
      <div className="bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro p-3 font-mono text-[11px] text-[#292631]">
        <div className="flex items-center gap-1.5 font-bold mb-1 text-[#292631]">
          <PixelIcon name="sparkle" size={12} className="text-[#9B8ACB]" />
          <span>DIAL-UP STATUS</span>
        </div>
        <p className="text-[10px] text-stone-600 mb-2">56.6 kbps CatNet Online</p>
        <div className="w-full bg-[#F6EEDC] border border-[#292631] h-3 rounded-full overflow-hidden p-0.5">
          <div className="bg-[#A7C98B] h-full rounded-full w-full" />
        </div>
      </div>
    </aside>
  );
}
