import React from 'react';
import { PixelIcon, type PixelIconName } from './PixelIcon';

export interface Y2KButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'coral' | 'purple' | 'blue' | 'green' | 'cream' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  icon?: PixelIconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Y2KButton({
  children,
  variant = 'pink',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: Y2KButtonProps) {
  const variantStyles = {
    pink: 'bg-[#F3A6B8] text-[#292631] hover:bg-[#efa0b2]',
    coral: 'bg-[#F08080] text-white hover:bg-[#e87171]',
    purple: 'bg-[#9B8ACB] text-white hover:bg-[#8f7ec0]',
    blue: 'bg-[#8DB7D6] text-[#292631] hover:bg-[#7faac9]',
    green: 'bg-[#A7C98B] text-[#292631] hover:bg-[#9bbe7f]',
    cream: 'bg-[#FFF8E8] text-[#292631] hover:bg-[#fbf2de]',
    dark: 'bg-[#292631] text-[#FFF8E8] hover:bg-[#393544]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs font-bold gap-1.5',
    md: 'px-4 py-2 text-sm font-bold gap-2',
    lg: 'px-6 py-3 text-base font-bold gap-2.5',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-mono uppercase tracking-wider
        border-2 border-[#292631] rounded-retro
        shadow-retro transition-all select-none
        ${disabled ? 'opacity-50 cursor-not-allowed shadow-[1px_1px_0px_#292631]' : 'y2k-pressable cursor-pointer'}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        focus:outline-none focus:ring-2 focus:ring-[#292631] focus:ring-offset-2
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <PixelIcon name={icon} size={iconSizes[size]} className="shrink-0" />
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <PixelIcon name={icon} size={iconSizes[size]} className="shrink-0" />
      )}
    </button>
  );
}
