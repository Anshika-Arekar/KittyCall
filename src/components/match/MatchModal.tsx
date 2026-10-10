'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { RetroWindowHeader } from '@/components/ui/PixelDecoration';

interface MatchModalProps {
  userCat: Cat;
  matchedCat: Cat;
  matchId: string;
  onClose: () => void;
}

export function MatchModal({
  userCat,
  matchedCat,
  matchId,
  onClose,
}: MatchModalProps) {
  const router = useRouter();

  const userPhoto =
    userCat.photos?.find((p) => p.is_primary)?.url ||
    userCat.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800';

  const matchedPhoto =
    matchedCat.photos?.find((p) => p.is_primary)?.url ||
    matchedCat.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800';

  function handleOpenMeowRoom() {
    onClose();
    router.push(`/meow-room/${matchId}`);
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full max-w-md bg-[#FFF8E8] border-[3.5px] border-[#292631] rounded-retro-lg shadow-[6px_6px_0px_#292631] overflow-hidden"
        >
          <RetroWindowHeader
            title="MUTUAL ATTRACTION DETECTED.EXE"
            variant="pink"
            iconName="heart"
            onClose={onClose}
          />

          <div className="p-6 text-center flex flex-col items-center">
            {/* Playful sparkling badge */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block px-3 py-1 bg-[#F3A6B8] border-2 border-[#292631] rounded-retro text-xs font-black uppercase text-[#292631] shadow-retro-sm mb-3"
            >
              CONNECTION ESTABLISHED
            </motion.div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#292631] mb-1">
              IT'S A MATCH
            </h2>

            {/* Cat A x Cat B subtitle */}
            <p className="text-sm font-bold text-[#F08080] uppercase tracking-wide mb-6">
              [{userCat.name}] x [{matchedCat.name}]
            </p>

            {/* Cat avatars colliding with heart */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 relative">
              {/* Cat A Photo */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-retro-lg border-[3px] border-[#292631] overflow-hidden shadow-retro bg-[#F6EEDC]"
              >
                <img
                  src={userPhoto}
                  alt={userCat.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Heart Burst in Center */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-10 h-10 bg-[#F08080] border-2 border-[#292631] rounded-full flex items-center justify-center shadow-retro text-white z-10 -mx-3"
              >
                <PixelIcon name="heart" size={20} className="text-white" />
              </motion.div>

              {/* Cat B Photo */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-retro-lg border-[3px] border-[#292631] overflow-hidden shadow-retro bg-[#F6EEDC]"
              >
                <img
                  src={matchedPhoto}
                  alt={matchedCat.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <p className="text-xs text-stone-700 font-bold uppercase mb-6 tracking-wide">
              The meowing can begin.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={handleOpenMeowRoom}
                className="flex-1 py-3 px-4 bg-[#A7C98B] hover:bg-[#9bbe7f] text-[#292631] border-[2.5px] border-[#292631] rounded-retro font-black uppercase tracking-wider text-sm shadow-retro y2k-pressable flex items-center justify-center gap-2"
              >
                <PixelIcon name="chat" size={16} />
                <span>MEOW</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-[#FFF8E8] hover:bg-[#F6EEDC] text-[#292631] border-[2.5px] border-[#292631] rounded-retro font-bold uppercase tracking-wider text-xs shadow-retro y2k-pressable"
              >
                KEEP SWIPING
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
