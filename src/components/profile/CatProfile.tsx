'use client';

import React from 'react';
import Link from 'next/link';
import type { Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { RetroWindowHeader, RetroSticker } from '@/components/ui/PixelDecoration';
import { CatPhotoGallery } from './CatPhotoGallery';
import { InterestTag } from './InterestTag';

interface CatProfileProps {
  cat: Cat;
  isOwner?: boolean;
  hypeCount?: number;
  katnipCount?: number;
}

export function CatProfile({
  cat,
  isOwner = false,
  hypeCount = 0,
  katnipCount = 0,
}: CatProfileProps) {
  return (
    <div className="w-full max-w-2xl mx-auto font-mono">
      {/* Retro Window Container */}
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader
          title={`${cat.name.toUpperCase()}’S HOMEPAGE`}
          variant="pink"
          iconName="cat"
        />

        <div className="p-4 sm:p-6 flex flex-col gap-6">
          {/* Top Section: Photo & Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <CatPhotoGallery
              catId={cat.id}
              photos={cat.photos || []}
              isEditable={isOwner}
            />

            <div className="flex flex-col gap-3">
              {/* Name & Age */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black uppercase text-[#292631]">
                    {cat.name}
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-[#8DB7D6] text-[#292631] border-2 border-[#292631] rounded-full shadow-[1.5px_1.5px_0px_#292631]">
                    {cat.age} YRS
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 font-bold">
                  {cat.breed && <span>{cat.breed}</span>}
                  {cat.breed && cat.location && <span>•</span>}
                  {cat.location && <span>{cat.location}</span>}
                  {cat.gender && <span>•</span>}
                  {cat.gender && <span>{cat.gender}</span>}
                </div>
              </div>

              {/* Hype & Katnip Counters */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F3A6B8] border-2 border-[#292631] rounded-retro text-xs font-bold shadow-[2px_2px_0px_#292631]">
                  <PixelIcon name="hype" size={14} />
                  <span>{hypeCount} HYPES</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#9B8ACB] text-white border-2 border-[#292631] rounded-retro text-xs font-bold shadow-[2px_2px_0px_#292631]">
                  <PixelIcon name="katnip" size={14} />
                  <span>{katnipCount} KATNIPS</span>
                </div>
              </div>

              {/* Personality Tag */}
              {cat.personality && (
                <div className="mt-1">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">
                    VIBE / PERSONALITY:
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-[#A7C98B] border-2 border-[#292631] rounded-retro shadow-[2px_2px_0px_#292631]">
                    {cat.personality}
                  </span>
                </div>
              )}

              {/* Edit button if owner */}
              {isOwner && (
                <div className="mt-2">
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFF8E8] hover:bg-[#F6EEDC] text-xs font-bold uppercase border-2 border-[#292631] rounded-retro shadow-retro y2k-pressable"
                  >
                    <PixelIcon name="settings" size={14} />
                    <span>EDIT PROFILE</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-[#F6EEDC] border-2 border-[#292631] rounded-retro p-4 shadow-retro">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-stone-600 mb-2">
              <PixelIcon name="sparkle" size={12} className="text-[#F08080]" />
              <span>ABOUT ME</span>
            </div>
            <p className="text-xs sm:text-sm text-[#292631] font-sans leading-relaxed whitespace-pre-line">
              {cat.bio}
            </p>
          </div>

          {/* Interests */}
          {cat.interests && cat.interests.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#292631] mb-2.5">
                <PixelIcon name="paw" size={14} className="text-[#9B8ACB]" />
                <span>INTERESTS & PASSIONS</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.interests.map((interest) => (
                  <InterestTag key={interest.id} name={interest.name} />
                ))}
              </div>
            </div>
          )}

          {/* Favorites Grid (Optional Fields) */}
          {(cat.favorite_food || cat.favorite_toy || cat.favorite_activity) && (
            <div className="bg-[#FFF8E8] border-2 border-[#292631] rounded-retro p-4 shadow-retro-sm">
              <div className="text-xs font-bold uppercase text-[#9B8ACB] mb-3 flex items-center gap-1">
                <PixelIcon name="heart" size={12} />
                <span>FAVORITE THINGS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {cat.favorite_food && (
                  <div className="p-2 bg-[#F6EEDC] border border-[#292631] rounded">
                    <span className="block text-[10px] text-stone-500 font-bold uppercase">FOOD</span>
                    <span className="font-bold text-[#292631]">{cat.favorite_food}</span>
                  </div>
                )}
                {cat.favorite_toy && (
                  <div className="p-2 bg-[#F6EEDC] border border-[#292631] rounded">
                    <span className="block text-[10px] text-stone-500 font-bold uppercase">TOY</span>
                    <span className="font-bold text-[#292631]">{cat.favorite_toy}</span>
                  </div>
                )}
                {cat.favorite_activity && (
                  <div className="p-2 bg-[#F6EEDC] border border-[#292631] rounded">
                    <span className="block text-[10px] text-stone-500 font-bold uppercase">ACTIVITY</span>
                    <span className="font-bold text-[#292631]">{cat.favorite_activity}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
