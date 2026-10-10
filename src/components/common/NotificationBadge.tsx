import React from 'react';

export function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-mono font-black bg-[#F08080] text-white border border-[#292631] rounded-full shadow-[1px_1px_0px_#292631] animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
}
