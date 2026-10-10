'use client';

import React from 'react';
import Link from 'next/link';
import type { Match, Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';

interface MatchCardProps {
  match: Match;
  userCatId: string;
}

export function MatchCard({ match, userCatId }: MatchCardProps) {
  const isCatA = match.cat_a_id === userCatId;
  const partnerCat = (isCatA ? match.cat_b : match.cat_a) as Cat | undefined;

  if (!partnerCat) return null;

  const photoUrl =
    partnerCat.photos?.find((p) => p.is_primary)?.url ||
    partnerCat.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800';

  const formattedTime = match.latest_message
    ? new Date(match.latest_message.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date(match.created_at).toLocaleDateString();

  return (
    <Link
      href={`/meow-room/${match.id}`}
      className="block group select-none font-mono"
    >
      <div className="bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro p-3.5 shadow-retro transition-all group-hover:bg-[#FFFDF6] group-hover:shadow-retro-lg y2k-pressable flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with retro border */}
          <div className="relative w-14 h-14 shrink-0 rounded-retro border-2 border-[#292631] overflow-hidden shadow-retro-sm bg-[#F6EEDC]">
            <img
              src={photoUrl}
              alt={partnerCat.name}
              className="w-full h-full object-cover"
            />
            {match.has_katnip && (
              <div
                title="Katnip connection"
                className="absolute bottom-0 right-0 bg-[#9B8ACB] p-0.5 border-t border-l border-[#292631]"
              >
                <PixelIcon name="katnip" size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm uppercase text-[#292631] truncate">
                {partnerCat.name}
              </h3>
              {partnerCat.is_demo && (
                <span className="px-1.5 py-0.2 text-[8px] font-bold bg-[#8DB7D6] text-[#292631] border border-[#292631] rounded">
                  DEMO
                </span>
              )}
            </div>

            {/* Latest Meow Preview */}
            <p className="text-xs text-stone-700 truncate mt-0.5 font-sans">
              {match.latest_message ? (
                <span className="font-semibold italic">
                  "{match.latest_message.message}"
                </span>
              ) : (
                <span className="text-stone-400 italic">No meows yet...</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Info: Timestamp & Unread Indicator */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] text-stone-500 font-bold uppercase">
            {formattedTime}
          </span>

          {match.unread_count && match.unread_count > 0 ? (
            <span className="px-2 py-0.5 bg-[#F08080] text-white text-[10px] font-black border border-[#292631] rounded-full shadow-[1px_1px_0px_#292631]">
              {match.unread_count} NEW
            </span>
          ) : (
            <PixelIcon name="chat" size={12} className="text-[#9B8ACB]" />
          )}
        </div>
      </div>
    </Link>
  );
}
