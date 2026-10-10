'use client';

import React from 'react';
import Link from 'next/link';
import { PixelIcon } from '@/components/ui/PixelIcon';

interface HeaderProps {
  catName?: string;
  hasUnreadNotifications?: boolean;
}

export function Header({ catName, hasUnreadNotifications }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFF8E8] border-b-[2.5px] border-[#292631] shadow-[0px_2px_0px_#292631] px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/discover" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-[#F3A6B8] border-2 border-[#292631] rounded-retro flex items-center justify-center shadow-[2px_2px_0px_#292631] group-hover:bg-[#F08080] transition-colors">
            <PixelIcon name="cat" size={20} className="text-[#292631]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-black text-xl tracking-wider text-[#292631]">
              KITTYCALL
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#9B8ACB] uppercase -mt-1">
              Cat Dial-up Network
            </span>
          </div>
        </Link>

        {/* Right Info */}
        <div className="flex items-center gap-3">
          {catName ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#8DB7D6] border-2 border-[#292631] rounded-retro shadow-[2px_2px_0px_#292631] text-xs font-mono font-bold text-[#292631]">
              <PixelIcon name="paw" size={14} />
              <span>{catName}</span>
            </div>
          ) : null}

          {/* Settings / Notifications link */}
          <Link
            href="/settings"
            aria-label="Settings and Notifications"
            className="relative w-9 h-9 bg-[#FFF8E8] hover:bg-[#F3A6B8] border-2 border-[#292631] rounded-retro flex items-center justify-center shadow-[2px_2px_0px_#292631] y2k-pressable"
          >
            <PixelIcon name="bell" size={16} className="text-[#292631]" />
            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F08080] border-2 border-[#292631] rounded-full" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
