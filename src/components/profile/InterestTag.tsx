import React from 'react';
import { PixelIcon } from '@/components/ui/PixelIcon';

export function InterestTag({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold
        border-2 border-[#292631] rounded-full shadow-[2px_2px_0px_#292631]
        transition-all select-none
        ${onClick ? 'cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none' : ''}
        ${
          selected
            ? 'bg-[#F3A6B8] text-[#292631]'
            : 'bg-[#FFF8E8] text-[#292631] hover:bg-[#F6EEDC]'
        }
      `}
    >
      <PixelIcon name="star" size={10} className="text-[#9B8ACB]" />
      <span>{name}</span>
    </span>
  );
}
