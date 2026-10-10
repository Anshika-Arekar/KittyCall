'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SwipeType, Cat, CatPhoto, Interest } from '@/lib/types/database';

export async function submitSwipe(
  targetCatId: string,
  type: SwipeType
): Promise<{
  success: boolean;
  matched: boolean;
  matchId?: string;
  targetCat?: Cat;
  error?: string;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, matched: false, error: 'Not authenticated' };
  }

  // 1. Get user's cat
  const { data: userCat } = await supabase
    .from('cats')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!userCat) {
    return { success: false, matched: false, error: 'No user cat profile found' };
  }

  // 2. Fetch target cat info for return value
  const { data: targetCatRaw } = await supabase
    .from('cats')
    .select(`
      *,
      photos:cat_photos(*),
      cat_interests(
        interest:interests(*)
      )
    `)
    .eq('id', targetCatId)
    .single();

  if (!targetCatRaw) {
    return { success: false, matched: false, error: 'Target cat not found' };
  }

  const targetCat: Cat = {
    ...targetCatRaw,
    interests: (targetCatRaw.cat_interests || []).map((ci: { interest: Interest }) => ci.interest),
    photos: (targetCatRaw.photos || []).sort((a: CatPhoto, b: CatPhoto) => a.position - b.position),
  };

  // 3. Try Postgres RPC 'process_swipe' first for atomic execution
  const { data: rpcResult, error: rpcError } = await supabase.rpc('process_swipe', {
    p_from_cat_id: userCat.id,
    p_to_cat_id: targetCatId,
    p_type: type,
  });

  if (!rpcError && rpcResult) {
    revalidatePath('/discover');
    revalidatePath('/matches');
    return {
      success: true,
      matched: Boolean(rpcResult.matched),
      matchId: rpcResult.match_id || undefined,
      targetCat,
    };
  }

  // Fallback direct execution if RPC function is not yet installed in Supabase DB
  // 3b. Insert or update swipe
  const { error: swipeError } = await supabase
    .from('swipes')
    .upsert({
      from_cat_id: userCat.id,
      to_cat_id: targetCatId,
      type,
    }, { onConflict: 'from_cat_id, to_cat_id' });

  if (swipeError) {
    return { success: false, matched: false, error: swipeError.message };
  }

  let isMatch = false;
  let matchId: string | undefined;

  // 4. If positive interaction (HYPE or KATNIP), check for reciprocal interaction
  if (type === 'HYPE' || type === 'KATNIP') {
    // If target cat is demo cat, automatically create reciprocal HYPE
    if (targetCat.is_demo) {
      await supabase
        .from('swipes')
        .upsert({
          from_cat_id: targetCatId,
          to_cat_id: userCat.id,
          type: 'HYPE',
        }, { onConflict: 'from_cat_id, to_cat_id' });
    }

    // Check if target cat has swiped positively
    const { data: reciprocalSwipe } = await supabase
      .from('swipes')
      .select('type')
      .eq('from_cat_id', targetCatId)
      .eq('to_cat_id', userCat.id)
      .in('type', ['HYPE', 'KATNIP'])
      .maybeSingle();

    if (reciprocalSwipe || targetCat.is_demo) {
      // Order cat pair canonically (smaller UUID first)
      const catA = userCat.id < targetCatId ? userCat.id : targetCatId;
      const catB = userCat.id < targetCatId ? targetCatId : userCat.id;

      const { data: newMatch } = await supabase
        .from('matches')
        .upsert({
          cat_a_id: catA,
          cat_b_id: catB,
        }, { onConflict: 'cat_a_id, cat_b_id' })
        .select('id')
        .single();

      if (newMatch) {
        isMatch = true;
        matchId = newMatch.id;

        // Create match notifications
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'MATCH',
          reference_id: newMatch.id,
        });

        if (!targetCat.is_demo && targetCat.owner_id) {
          await supabase.from('notifications').insert({
            user_id: targetCat.owner_id,
            type: 'MATCH',
            reference_id: newMatch.id,
          });
        }
      }
    } else {
      // Send HYPE or KATNIP notification to target cat's owner
      if (!targetCat.is_demo && targetCat.owner_id) {
        await supabase.from('notifications').insert({
          user_id: targetCat.owner_id,
          type,
          reference_id: userCat.id,
        });
      }
    }
  }

  revalidatePath('/discover');
  revalidatePath('/matches');

  return {
    success: true,
    matched: isMatch,
    matchId,
    targetCat,
  };
}
