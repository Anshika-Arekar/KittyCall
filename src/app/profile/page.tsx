import React from 'react';
import Link from 'next/link';
import { getMyCat } from '@/actions/profile';
import { createClient } from '@/lib/supabase/server';
import { CatProfile } from '@/components/profile/CatProfile';
import { EmptyState } from '@/components/common/EmptyState';
import { Y2KButton } from '@/components/ui/Y2KButton';

export default async function ProfilePage() {
  const { cat } = await getMyCat();

  if (!cat) {
    return (
      <div className="py-12">
        <EmptyState
          icon="cat"
          title="NO CAT PROFILE CREATED YET"
          subtitle="Set up your cat's profile to start discovering and matching."
        />
        <div className="text-center mt-4">
          <Link href="/onboarding">
            <Y2KButton variant="pink" size="lg">
              START CAT SETUP WIZARD
            </Y2KButton>
          </Link>
        </div>
      </div>
    );
  }

  // Count incoming Hypes and Katnips
  const supabase = createClient();
  const { count: hypeCount } = await supabase
    .from('swipes')
    .select('*', { count: 'exact', head: true })
    .eq('to_cat_id', cat.id)
    .eq('type', 'HYPE');

  const { count: katnipCount } = await supabase
    .from('swipes')
    .select('*', { count: 'exact', head: true })
    .eq('to_cat_id', cat.id)
    .eq('type', 'KATNIP');

  return (
    <div className="py-6">
      <CatProfile
        cat={cat}
        isOwner={true}
        hypeCount={hypeCount || 0}
        katnipCount={katnipCount || 0}
      />
    </div>
  );
}
