'use client';

import React from 'react';
import { MEOW_BUTTONS } from '@/lib/constants/meow-vocabulary';
import { PixelIcon } from '@/components/ui/PixelIcon';

interface MeowComposerProps {
  onSend: (meowText: string) => void;
  disabled?: boolean;
}

export function MeowComposer({ onSend, disabled = false }: MeowComposerProps) {
  return (
    <div className="w-full bg-[#FFF8E8] border-t-2 border-[#292631] p-3 font-mono">
      <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase mb-2">
        <div className="flex items-center gap-1.5">
          <PixelIcon name="cat" size={12} className="text-[#F3A6B8]" />
          <span>MEOW SOUNDBOARD COMPOSER</span>
        </div>
        <span className="text-[10px] text-stone-500">BUTTON VOCALIZATIONS ONLY</span>
      </div>

      {/* Main Big MEOW button */}
      <div className="mb-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSend('meow')}
          className={`
            w-full py-2.5 px-4 bg-[#F3A6B8] hover:bg-[#efa0b2] text-[#292631]
            border-2 border-[#292631] rounded-retro font-black uppercase tracking-wider text-base
            shadow-retro transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'y2k-pressable cursor-pointer'}
            flex items-center justify-center gap-2
          `}
        >
          <PixelIcon name="paw" size={16} />
          <span>PRIMARY MEOW</span>
        </button>
      </div>

      {/* Soundboard grid of other vocalizations */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
        {MEOW_BUTTONS.filter((b) => b.sound !== 'meow').map((btn) => (
          <button
            key={btn.label}
            type="button"
            disabled={disabled}
            onClick={() => onSend(btn.sound)}
            className={`
              py-1.5 px-2 bg-[#FFF8E8] hover:bg-[#F6EEDC] text-[#292631]
              border border-[#292631] rounded text-[11px] font-bold uppercase truncate
              shadow-[1.5px_1.5px_0px_#292631] transition-all
              ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'y2k-pressable cursor-pointer active:translate-x-[1px] active:translate-y-[1px]'}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
