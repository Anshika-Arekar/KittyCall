'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import type { Cat, SwipeType } from '@/lib/types/database';
import { CatCard } from './CatCard';
import { SwipeButtons } from './SwipeButtons';
import { PixelIcon } from '@/components/ui/PixelIcon';

interface SwipeDeckProps {
  cats: Cat[];
  onSwipe: (catId: string, type: SwipeType) => Promise<void>;
}

export function SwipeDeck({ cats, onSwipe }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragCurrentX, setDragCurrentX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);

  const currentCat = cats[currentIndex];

  async function handleSwipeAction(type: SwipeType) {
    if (!currentCat || isProcessing) return;
    setIsProcessing(true);

    if (type === 'PASS') {
      setSwipeDirection('left');
    } else if (type === 'HYPE') {
      setSwipeDirection('right');
    } else if (type === 'KATNIP') {
      setSwipeDirection('up');
    }

    try {
      await onSwipe(currentCat.id, type);
    } finally {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setIsProcessing(false);
        x.set(0);
        setDragCurrentX(0);
      }, 300);
    }
  }

  function handleDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) {
    if (isProcessing) return;

    if (info.offset.x > 100) {
      handleSwipeAction('HYPE');
    } else if (info.offset.x < -100) {
      handleSwipeAction('PASS');
    } else {
      x.set(0);
      setDragCurrentX(0);
    }
  }

  if (!currentCat || currentIndex >= cats.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative px-2">
      {/* Background card preview for 3D depth */}
      {currentIndex + 1 < cats.length && (
        <div className="absolute top-2 w-[95%] max-w-sm sm:max-w-md opacity-40 scale-95 pointer-events-none select-none z-0">
          <CatCard cat={cats[currentIndex + 1]} />
        </div>
      )}

      {/* Active Card Container with Motion */}
      <AnimatePresence>
        <motion.div
          key={currentCat.id}
          className="w-full relative z-10 cursor-grab active:cursor-grabbing"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDrag={(e, info) => setDragCurrentX(info.offset.x)}
          onDragEnd={handleDragEnd}
          animate={
            swipeDirection === 'left'
              ? { x: -600, opacity: 0, rotate: -25, transition: { duration: 0.3 } }
              : swipeDirection === 'right'
              ? { x: 600, opacity: 0, rotate: 25, transition: { duration: 0.3 } }
              : swipeDirection === 'up'
              ? { y: -600, scale: 1.15, opacity: 0, transition: { duration: 0.35 } }
              : { x: 0, opacity: 1, scale: 1 }
          }
        >
          {/* Katnip visual animation burst overlay */}
          {swipeDirection === 'up' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.3 }}
              className="absolute inset-0 z-40 bg-[#9B8ACB]/90 rounded-retro-lg flex flex-col items-center justify-center text-white border-[3px] border-[#292631]"
            >
              <div className="animate-spin mb-2">
                <PixelIcon name="sparkle" size={48} className="text-[#FFF8E8]" />
              </div>
              <span className="font-mono text-2xl font-black uppercase tracking-wider text-white">
                KATNIP SENT!
              </span>
            </motion.div>
          )}

          <CatCard cat={currentCat} dragX={dragCurrentX} />
        </motion.div>
      </AnimatePresence>

      {/* Tactile Accessible Swipe Buttons */}
      <SwipeButtons
        onPass={() => handleSwipeAction('PASS')}
        onHype={() => handleSwipeAction('HYPE')}
        onKatnip={() => handleSwipeAction('KATNIP')}
        disabled={isProcessing}
      />
    </div>
  );
}
