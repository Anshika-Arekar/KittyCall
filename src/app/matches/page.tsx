import React from 'react';
import Link from 'next/link';
import { getMatches } from '@/actions/matches';
import { MatchCard } from '@/components/match/MatchCard';
import { EmptyState } from '@/components/common/EmptyState';
import { RetroWindowHeader } from '@/components/ui/PixelDecoration';
import { Y2KButton } from '@/components/ui/Y2KButton';

export default async function MatchesPage() {
  const { matches, userCat, error } = await getMatches();

  if (error === 'NO_CAT' || !userCat) {
    return (
      <div className="py-8 font-mono">
        <EmptyState
          icon="cat"
          title="SETUP YOUR CAT PROFILE FIRST"
          subtitle="You need a cat profile before viewing matches."
        />
        <div className="text-center mt-4">
          <Link href="/onboarding">
            <Y2KButton variant="pink" size="md">
              CREATE CAT PROFILE
            </Y2KButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-4 font-mono">
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader
          title={`MEOW MATCHES (${matches.length})`}
          variant="coral"
          iconName="heart"
        />

        <div className="p-4 sm:p-5">
          {matches.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} userCatId={userCat.id} />
              ))}
            </div>
          ) : (
            <div className="py-6">
              <EmptyState
                icon="heart"
                title="NO MEOW SOULMATES YET."
                subtitle="Keep exploring."
              />
              <div className="text-center mt-4">
                <Link href="/discover">
                  <Y2KButton variant="pink" size="md">
                    START DISCOVERING
                  </Y2KButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
