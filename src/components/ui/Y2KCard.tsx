import React from 'react';
import { RetroWindowHeader } from './PixelDecoration';

interface Y2KCardProps {
  children: React.ReactNode;
  title?: string;
  headerVariant?: 'pink' | 'purple' | 'blue' | 'coral' | 'cream' | 'green';
  iconName?: 'cat' | 'paw' | 'heart' | 'star' | 'chat';
  onClose?: () => void;
  className?: string;
  bodyClassName?: string;
}

export function Y2KCard({
  children,
  title,
  headerVariant = 'pink',
  iconName = 'cat',
  onClose,
  className = '',
  bodyClassName = 'p-4',
}: Y2KCardProps) {
  return (
    <div
      className={`
        bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro
        shadow-retro-lg overflow-hidden
        ${className}
      `}
    >
      {title && (
        <RetroWindowHeader
          title={title}
          variant={headerVariant}
          iconName={iconName}
          onClose={onClose}
        />
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
