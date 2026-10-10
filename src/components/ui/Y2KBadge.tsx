import React from 'react';
import { PixelIcon, type PixelIconName } from './PixelIcon';

interface Y2KBadgeProps {
  children: React.ReactNode;
  variant?: 'pink' | 'purple' | 'blue' | 'coral' | 'cream' | 'green' | 'dark';
  icon?: PixelIconName;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Y2KBadge({
  children,
  variant = 'cream',
  icon,
  className = '',
  onClick,
  selected = false,
}: Y2KBadgeProps) {
  const variantStyles = {
    pink: 'bg-[#F3A6B8] text-[#292631]',
    purple: 'bg-[#9B8ACB] text-white',
    blue: 'bg-[#8DB7D6] text-[#292631]',
    coral: 'bg-[#F08080] text-white',
    cream: 'bg-[#FFF8E8] text-[#292631]',
    green: 'bg-[#A7C98B] text-[#292631]',
    dark: 'bg-[#292631] text-[#FFF8E8]',
  };

  const selectedStyles = selected
    ? 'bg-[#F3A6B8] text-[#292631] ring-2 ring-[#292631] font-bold shadow-none translate-x-[1px] translate-y-[1px]'
    : '';

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono
        border-2 border-[#292631] rounded-full shadow-[2px_2px_0px_#292631]
        transition-all select-none
        ${onClick ? 'cursor-pointer hover:opacity-90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none' : ''}
        ${selected ? selectedStyles : variantStyles[variant]}
        ${className}
      `}
    >
      {icon && <PixelIcon name={icon} size={12} className="shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
