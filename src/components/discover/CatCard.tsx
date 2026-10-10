'use client';

import React, { useState } from 'react';
import type { Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { RetroWindowHeader, RetroSticker } from '@/components/ui/PixelDecoration';
import { InterestTag } from '@/components/profile/InterestTag';

interface CatCardProps {
  cat: Cat;
  dragX?: number; // Visual feedback during dragging
}

export function CatCard({ cat, dragX = 0 }: CatCardProps) {
  const primaryPhoto =
    cat.photos?.find((p) => p.is_primary)?.url ||
    cat.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800';

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const photos = cat.photos && cat.photos.length > 0 ? cat.photos : [{ id: '1', url: primaryPhoto, position: 0, is_primary: true, cat_id: cat.id, created_at: '' }];
  const currentPhotoUrl = photos[activePhotoIdx]?.url || primaryPhoto;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden select-none font-mono">
      <RetroWindowHeader
        title={`${cat.name.toUpperCase()} (ID: ${cat.id.substring(0, 6)})`}
        variant="pink"
        iconName="cat"
      />

      {/* Swipe Feedback Stamp Overlays */}
      {dragX > 40 && (
        <div
          className="absolute top-14 right-6 z-30 pointer-events-none transform rotate-12 transition-opacity"
          style={{ opacity: Math.min(1, (dragX - 40) / 70) }}
        >
          <span className="px-4 py-1.5 bg-[#F3A6B8] border-[3px] border-[#292631] text-sm font-black uppercase text-[#292631] shadow-retro">
            HYPE
          </span>
        </div>
      )}

      {dragX < -40 && (
        <div
          className="absolute top-14 left-6 z-30 pointer-events-none transform -rotate-12 transition-opacity"
          style={{ opacity: Math.min(1, Math.abs(dragX + 40) / 70) }}
        >
          <span className="px-4 py-1.5 bg-[#F08080] border-[3px] border-[#292631] text-sm font-black uppercase text-white shadow-retro">
            PASS
          </span>
        </div>
      )}

      {/* Cat Photo Container */}
      <div className="relative aspect-[4/3] w-full bg-[#F6EEDC] border-b-2 border-[#292631] overflow-hidden">
        <img
          src={currentPhotoUrl}
          alt={cat.name}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Photo Gallery dots if multiple */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(i);
                }}
                className={`w-3 h-3 border border-[#292631] rounded-full transition-all ${
                  activePhotoIdx === i ? 'bg-[#F3A6B8] scale-125' : 'bg-white/80'
                }`}
                aria-label={`View photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Cat Badge / Name Over Photo */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2">
          {cat.is_demo && (
            <span className="px-2 py-0.5 text-[9px] bg-[#9B8ACB] text-white font-bold border border-[#292631] rounded shadow-retro-sm">
              NETWORK STAR
            </span>
          )}
          {cat.location && (
            <span className="px-2 py-0.5 text-[10px] bg-[#FFF8E8] text-[#292631] font-bold border border-[#292631] rounded shadow-retro-sm">
              {cat.location}
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Name, Age, Breed */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#292631]">
                {cat.name}
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold bg-[#8DB7D6] text-[#292631] border-2 border-[#292631] rounded-full shadow-[1.5px_1.5px_0px_#292631]">
                {cat.age} YRS
              </span>
            </div>

            {cat.personality && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#A7C98B] border-2 border-[#292631] rounded-retro shadow-retro-sm">
                {cat.personality}
              </span>
            )}
          </div>

          {cat.breed && (
            <p className="text-xs text-stone-600 font-bold mt-0.5">
              {cat.breed}
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="bg-[#F6EEDC] border-2 border-[#292631] rounded-retro p-3 shadow-retro-sm">
          <p className="text-xs text-stone-800 font-sans leading-relaxed line-clamp-3">
            "{cat.bio}"
          </p>
        </div>

        {/* Interests */}
        {cat.interests && cat.interests.length > 0 && (
          <div className="pt-1">
            <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1.5">
              INTERESTS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.interests.map((interest) => (
                <span
                  key={interest.id}
                  className="px-2.5 py-0.5 text-[11px] bg-[#FFF8E8] border-2 border-[#292631] rounded-full font-bold shadow-[1.5px_1.5px_0px_#292631]"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
