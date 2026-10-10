'use client';

import React from 'react';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { Y2KButton } from '@/components/ui/Y2KButton';

export function ErrorState({
  title = 'THE CAT KNOCKED THE SERVER OVER.',
  subtitle = 'Something went wrong. Try again.',
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg max-w-md mx-auto my-6">
      <div className="w-16 h-16 bg-[#F08080] border-2 border-[#292631] rounded-retro flex items-center justify-center shadow-retro mb-4">
        <PixelIcon name="pass" size={28} className="text-white" />
      </div>
      <h3 className="font-mono text-sm sm:text-base font-black uppercase tracking-wider text-[#292631] mb-2">
        {title}
      </h3>
      <p className="font-mono text-xs text-stone-600 mb-5">{subtitle}</p>
      {onRetry && (
        <Y2KButton variant="purple" size="md" onClick={onRetry}>
          TRY AGAIN
        </Y2KButton>
      )}
    </div>
  );
}
