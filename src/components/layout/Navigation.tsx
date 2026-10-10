'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavigation } from './MobileNavigation';

export function NavigationShell({
  children,
  catName,
}: {
  children: React.ReactNode;
  catName?: string;
}) {
  const pathname = usePathname();
  const isAuthOrLanding = pathname === '/' || pathname.startsWith('/auth');

  if (isAuthOrLanding) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEDC] text-[#292631]">
      <Header catName={catName} />
      <div className="flex-1 flex max-w-6xl w-full mx-auto pb-20 md:pb-8">
        <DesktopSidebar />
        <main className="flex-1 p-4 max-w-full overflow-x-hidden">{children}</main>
      </div>
      <MobileNavigation />
    </div>
  );
}
