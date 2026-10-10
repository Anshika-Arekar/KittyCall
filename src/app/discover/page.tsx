'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDiscoverDeck } from '@/actions/discover';
import { submitSwipe } from '@/actions/swipe';
import type { Cat, SwipeType } from '@/lib/types/database';
import { SwipeDeck } from '@/components/discover/SwipeDeck';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Y2KButton } from '@/components/ui/Y2KButton';
import { MatchModal } from '@/components/match/MatchModal';

export default function DiscoverPage() {
  const router = useRouter();
  const [deck, setDeck] = useState<Cat[]>([]);
  const [userCat, setUserCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Match modal state
  const [matchedCat, setMatchedCat] = useState<Cat | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  async function loadDeck() {
    setLoading(true);
    setError(null);
    const res = await getDiscoverDeck();

    if (res.error === 'NO_CAT') {
      router.push('/onboarding');
      return;
    }

    if (res.error) {
      setError(res.error);
    } else {
      setDeck(res.deck);
      setUserCat(res.userCat);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDeck();
  }, []);

  async function handleSwipe(targetCatId: string, type: SwipeType) {
    const res = await submitSwipe(targetCatId, type);

    if (res.matched && res.targetCat && res.matchId) {
      setMatchedCat(res.targetCat);
      setMatchId(res.matchId);
    }
  }

  if (loading) {
    return <LoadingState text="FINDING CATS ON THE NETWORK..." />;
  }

  if (error) {
    return (
      <div className="py-8 font-mono">
        <EmptyState
          icon="pass"
          title="CONNECTION INTERRUPTION"
          subtitle={error}
          actionLabel="TRY AGAIN"
          onAction={loadDeck}
        />
      </div>
    );
  }

  if (!userCat) {
    return (
      <div className="py-8 font-mono">
        <EmptyState
          icon="cat"
          title="CREATE YOUR CAT PROFILE"
          subtitle="You need a cat profile before discovering other cats."
          actionLabel="GO TO ONBOARDING"
          onAction={() => router.push('/onboarding')}
        />
      </div>
    );
  }

  return (
    <div className="py-4 font-mono">
      {deck.length > 0 ? (
        <div>
          <div className="text-center mb-3">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
              DISCOVERING AS: <span className="text-[#292631] font-black">{userCat.name}</span>
            </span>
          </div>

          <SwipeDeck cats={deck} onSwipe={handleSwipe} />
        </div>
      ) : (
        <div className="py-6">
          <EmptyState
            icon="cat"
            title="YOU'VE REACHED THE END OF THE INTERNET."
            subtitle="No more cats in your current orbit. Check your matches or come back later for new feline arrivals!"
            actionLabel="VIEW MATCHES"
            onAction={() => router.push('/matches')}
          />
        </div>
      )}

      {/* Phase 4 Match Modal */}
      {matchedCat && matchId && userCat && (
        <MatchModal
          userCat={userCat}
          matchedCat={matchedCat}
          matchId={matchId}
          onClose={() => {
            setMatchedCat(null);
            setMatchId(null);
          }}
        />
      )}
    </div>
  );
}
