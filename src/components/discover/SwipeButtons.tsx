'use client';

import React, { useEffect } from 'react';
import { PixelIcon } from '@/components/ui/PixelIcon';

interface SwipeButtonsProps {
  onPass: () => void;
  onHype: () => void;
  onKatnip: () => void;
  disabled?: boolean;
}

export function SwipeButtons({
  onPass,
  onHype,
  onKatnip,
  disabled = false,
}: SwipeButtonsProps) {
  // Keyboard accessibility: Left Arrow -> PASS, Right Arrow -> HYPE, Up Arrow/K -> KATNIP
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onHype();
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onKatnip();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onPass, onHype, onKatnip]);

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 font-mono select-none">
      {/* PASS Button */}
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass on this cat (Swipe Left or Left Arrow)"
        className={`
          flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20
          bg-[#F08080] text-white border-[3px] border-[#292631] rounded-retro
          shadow-retro transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'y2k-pressable cursor-pointer hover:bg-[#e87171]'}
        `}
      >
        <PixelIcon name="pass" size={24} className="text-white" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1">
          PASS
        </span>
      </button>

      {/* KATNIP Button (Stronger, centered, prominent) */}
      <button
        type="button"
        onClick={onKatnip}
        disabled={disabled}
        aria-label="Give Katnip to this cat (Up Arrow or K)"
        className={`
          relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24
          bg-[#9B8ACB] text-white border-[3px] border-[#292631] rounded-retro-lg
          shadow-retro-lg transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'y2k-pressable cursor-pointer hover:bg-[#8f7ec0]'}
        `}
      >
        <div className="absolute -top-2 -right-2">
          <PixelIcon name="sparkle" size={16} className="text-[#FFF8E8]" />
        </div>
        <PixelIcon name="katnip" size={28} className="text-white" />
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider mt-1">
          KATNIP
        </span>
      </button>

      {/* HYPE Button */}
      <button
        type="button"
        onClick={onHype}
        disabled={disabled}
        aria-label="Hype this cat (Swipe Right or Right Arrow)"
        className={`
          flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20
          bg-[#F3A6B8] text-[#292631] border-[3px] border-[#292631] rounded-retro
          shadow-retro transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'y2k-pressable cursor-pointer hover:bg-[#efa0b2]'}
        `}
      >
        <PixelIcon name="hype" size={24} className="text-[#292631]" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1">
          HYPE
        </span>
      </button>
    </div>
  );
}
