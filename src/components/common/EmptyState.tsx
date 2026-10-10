import React from 'react';
import { PixelIcon, type PixelIconName } from '@/components/ui/PixelIcon';
import { Y2KButton } from '@/components/ui/Y2KButton';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: PixelIconName;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  subtitle,
  icon = 'cat',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg max-w-md mx-auto my-6">
      <div className="w-16 h-16 bg-[#8DB7D6] border-2 border-[#292631] rounded-retro flex items-center justify-center shadow-retro mb-4">
        <PixelIcon name={icon} size={32} className="text-[#292631]" />
      </div>
      <h3 className="font-mono text-sm sm:text-base font-black uppercase tracking-wider text-[#292631] mb-2">
        {title}
      </h3>
      <p className="font-mono text-xs text-stone-600 mb-5 max-w-xs">{subtitle}</p>
      {actionLabel && onAction && (
        <Y2KButton variant="pink" size="md" onClick={onAction}>
          {actionLabel}
        </Y2KButton>
      )}
    </div>
  );
}
