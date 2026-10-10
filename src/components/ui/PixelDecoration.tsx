import React from 'react';
import { PixelIcon } from './PixelIcon';

interface WindowHeaderProps {
  title: string;
  onClose?: () => void;
  onMinimize?: () => void;
  iconName?: 'cat' | 'paw' | 'heart' | 'star' | 'chat';
  className?: string;
  variant?: 'pink' | 'purple' | 'blue' | 'coral' | 'cream' | 'green';
}

export function RetroWindowHeader({
  title,
  onClose,
  onMinimize,
  iconName = 'cat',
  className = '',
  variant = 'pink',
}: WindowHeaderProps) {
  const bgColors = {
    pink: 'bg-[#F3A6B8]',
    purple: 'bg-[#9B8ACB]',
    blue: 'bg-[#8DB7D6]',
    coral: 'bg-[#F08080]',
    cream: 'bg-[#FFF8E8]',
    green: 'bg-[#A7C98B]',
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-1.5 border-b-2 border-[#292631] font-mono text-xs font-bold uppercase tracking-wider text-[#292631] ${bgColors[variant]} ${className}`}
    >
      <div className="flex items-center gap-2">
        <PixelIcon name={iconName} size={14} className="text-[#292631]" />
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {onMinimize && (
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize window"
            className="w-4 h-4 bg-[#FFF8E8] border border-[#292631] flex items-center justify-center hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
          >
            <PixelIcon name="minimize" size={8} />
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close window"
            className="w-4 h-4 bg-[#F08080] text-white border border-[#292631] flex items-center justify-center hover:opacity-90 active:translate-x-[1px] active:translate-y-[1px]"
          >
            <PixelIcon name="close" size={8} />
          </button>
        )}
      </div>
    </div>
  );
}

export function RetroSticker({
  text,
  rotate = 'rotate-[-3deg]',
  color = 'bg-[#F3A6B8]',
}: {
  text: string;
  rotate?: string;
  color?: string;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase border-2 border-[#292631] shadow-[2px_2px_0px_#292631] ${color} text-[#292631] ${rotate}`}
    >
      {text}
    </span>
  );
}
