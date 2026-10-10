import React from 'react';
import { PixelIcon } from '@/components/ui/PixelIcon';

export function MeowIndicator({ catName }: { catName: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 my-1 bg-[#FFF8E8] border border-[#292631] rounded-retro text-xs font-mono font-bold text-stone-700 w-fit shadow-retro-sm animate-pulse">
      <PixelIcon name="cat" size={14} className="text-[#9B8ACB]" />
      <span>{catName} is meowing...</span>
      <div className="flex items-center gap-0.5 ml-1">
        <span className="w-1.5 h-1.5 bg-[#F08080] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-[#F08080] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-[#F08080] rounded-full animate-bounce" />
      </div>
    </div>
  );
}
