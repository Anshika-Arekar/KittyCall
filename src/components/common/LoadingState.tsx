import React from 'react';
import { PixelIcon } from '@/components/ui/PixelIcon';

export function LoadingState({
  text = 'LOOKING THROUGH THE CAT INTERNET...',
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg max-w-sm mx-auto my-8">
      <div className="relative mb-4">
        <div className="w-14 h-14 bg-[#F3A6B8] border-2 border-[#292631] rounded-retro flex items-center justify-center shadow-retro animate-bounce">
          <PixelIcon name="cat" size={28} className="text-[#292631]" />
        </div>
        <div className="absolute -top-1 -right-1">
          <PixelIcon name="sparkle" size={16} className="text-[#9B8ACB] animate-spin" />
        </div>
      </div>
      <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#292631] mb-2">
        {text}
      </p>
      <div className="w-48 bg-[#F6EEDC] border border-[#292631] h-3 rounded-full overflow-hidden p-0.5">
        <div className="bg-[#9B8ACB] h-full rounded-full w-2/3 animate-pulse" />
      </div>
    </div>
  );
}
