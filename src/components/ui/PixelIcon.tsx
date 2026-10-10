import React from 'react';

export type PixelIconName =
  | 'paw'
  | 'heart'
  | 'star'
  | 'cat'
  | 'katnip'
  | 'sparkle'
  | 'fish'
  | 'chat'
  | 'hype'
  | 'pass'
  | 'close'
  | 'minimize'
  | 'check'
  | 'bell'
  | 'user'
  | 'settings'
  | 'arrow-left';

interface PixelIconProps {
  name: PixelIconName;
  className?: string;
  size?: number;
}

export function PixelIcon({ name, className = '', size = 20 }: PixelIconProps) {
  // All pixel art icons are designed on a 16x16 or 24x24 crisp pixel grid using SVG rects/paths
  switch (name) {
    case 'paw':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          {/* Top toes */}
          <rect x="2" y="3" width="2" height="3" />
          <rect x="5" y="1" width="2" height="3" />
          <rect x="9" y="1" width="2" height="3" />
          <rect x="12" y="3" width="2" height="3" />
          {/* Main pad */}
          <rect x="4" y="7" width="8" height="5" />
          <rect x="5" y="6" width="6" height="1" />
          <rect x="5" y="12" width="6" height="2" />
          <rect x="3" y="8" width="1" height="4" />
          <rect x="12" y="8" width="1" height="4" />
        </svg>
      );

    case 'heart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="2" y="3" width="4" height="2" />
          <rect x="10" y="3" width="4" height="2" />
          <rect x="1" y="5" width="6" height="4" />
          <rect x="9" y="5" width="6" height="4" />
          <rect x="2" y="9" width="12" height="2" />
          <rect x="4" y="11" width="8" height="2" />
          <rect x="6" y="13" width="4" height="2" />
          <rect x="7" y="15" width="2" height="1" />
        </svg>
      );

    case 'katnip':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          {/* Katnip leaf icon */}
          <rect x="7" y="1" width="2" height="2" />
          <rect x="5" y="3" width="6" height="2" />
          <rect x="3" y="5" width="10" height="2" />
          <rect x="2" y="7" width="12" height="3" />
          <rect x="4" y="10" width="8" height="2" />
          <rect x="6" y="12" width="4" height="2" />
          <rect x="7" y="14" width="2" height="2" />
          <rect x="4" y="14" width="2" height="1" fill="#FFF8E8" />
        </svg>
      );

    case 'star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="7" y="1" width="2" height="3" />
          <rect x="6" y="4" width="4" height="2" />
          <rect x="1" y="6" width="14" height="2" />
          <rect x="3" y="8" width="10" height="2" />
          <rect x="5" y="10" width="6" height="2" />
          <rect x="4" y="12" width="3" height="3" />
          <rect x="9" y="12" width="3" height="3" />
        </svg>
      );

    case 'cat':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          {/* Ears */}
          <rect x="2" y="1" width="3" height="4" />
          <rect x="11" y="1" width="3" height="4" />
          {/* Head */}
          <rect x="2" y="5" width="12" height="8" />
          {/* Eyes (negative space) */}
          <rect x="4" y="7" width="2" height="2" fill="#FFF8E8" />
          <rect x="10" y="7" width="2" height="2" fill="#FFF8E8" />
          {/* Nose */}
          <rect x="7" y="10" width="2" height="1" fill="#F08080" />
          {/* Chin */}
          <rect x="4" y="13" width="8" height="2" />
        </svg>
      );

    case 'fish':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          {/* Fish body */}
          <rect x="4" y="5" width="8" height="6" />
          <rect x="2" y="6" width="2" height="4" />
          <rect x="1" y="7" width="1" height="2" />
          <rect x="12" y="6" width="2" height="4" />
          {/* Tail */}
          <rect x="14" y="4" width="2" height="8" />
          {/* Eye */}
          <rect x="3" y="7" width="1" height="1" fill="#FFF8E8" />
        </svg>
      );

    case 'hype':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          {/* Upward burst flame / spark */}
          <rect x="7" y="1" width="2" height="3" />
          <rect x="5" y="4" width="6" height="3" />
          <rect x="4" y="7" width="8" height="4" />
          <rect x="3" y="11" width="10" height="3" />
          <rect x="6" y="8" width="4" height="4" fill="#FFF8E8" />
        </svg>
      );

    case 'pass':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          {/* Retro X */}
          <rect x="2" y="2" width="3" height="3" />
          <rect x="11" y="2" width="3" height="3" />
          <rect x="5" y="5" width="6" height="6" />
          <rect x="2" y="11" width="3" height="3" />
          <rect x="11" y="11" width="3" height="3" />
        </svg>
      );

    case 'chat':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="2" y="2" width="12" height="8" />
          <rect x="2" y="10" width="6" height="2" />
          <rect x="2" y="12" width="3" height="2" />
          <rect x="4" y="5" width="2" height="2" fill="#FFF8E8" />
          <rect x="7" y="5" width="2" height="2" fill="#FFF8E8" />
          <rect x="10" y="5" width="2" height="2" fill="#FFF8E8" />
        </svg>
      );

    case 'sparkle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="7" y="2" width="2" height="12" />
          <rect x="2" y="7" width="12" height="2" />
          <rect x="6" y="6" width="4" height="4" />
        </svg>
      );

    case 'bell':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="7" y="1" width="2" height="2" />
          <rect x="5" y="3" width="6" height="4" />
          <rect x="3" y="7" width="10" height="5" />
          <rect x="1" y="12" width="14" height="2" />
          <rect x="6" y="14" width="4" height="2" />
        </svg>
      );

    case 'user':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="5" y="2" width="6" height="5" />
          <rect x="2" y="8" width="12" height="6" />
        </svg>
      );

    case 'settings':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="6" y="1" width="4" height="14" />
          <rect x="1" y="6" width="14" height="4" />
          <rect x="3" y="3" width="10" height="10" />
          <rect x="5" y="5" width="6" height="6" fill="#FFF8E8" />
        </svg>
      );

    case 'arrow-left':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="7" y="3" width="2" height="2" />
          <rect x="5" y="5" width="2" height="2" />
          <rect x="3" y="7" width="10" height="2" />
          <rect x="5" y="9" width="2" height="2" />
          <rect x="7" y="11" width="2" height="2" />
        </svg>
      );

    case 'check':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="11" y="3" width="2" height="3" />
          <rect x="9" y="6" width="2" height="3" />
          <rect x="7" y="9" width="2" height="3" />
          <rect x="5" y="8" width="2" height="2" />
          <rect x="3" y="7" width="2" height="2" />
        </svg>
      );

    case 'close':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="1" y="1" width="2" height="2" />
          <rect x="9" y="1" width="2" height="2" />
          <rect x="3" y="3" width="2" height="2" />
          <rect x="7" y="3" width="2" height="2" />
          <rect x="5" y="5" width="2" height="2" />
          <rect x="3" y="7" width="2" height="2" />
          <rect x="7" y="7" width="2" height="2" />
          <rect x="1" y="9" width="2" height="2" />
          <rect x="9" y="9" width="2" height="2" />
        </svg>
      );

    case 'minimize':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill="currentColor"
          className={`inline-block shrink-0 ${className}`}
          shapeRendering="crispEdges"
        >
          <rect x="2" y="8" width="8" height="2" />
        </svg>
      );

    default:
      return null;
  }
}
