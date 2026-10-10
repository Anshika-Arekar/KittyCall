'use server';

import { createClient } from '@/lib/supabase/server';
import type { Cat, CatPhoto, Interest } from '@/lib/types/database';

export async function getDiscoverDeck(): Promise<{
  deck: Cat[];
  userCat: Cat | null;
  error?: string;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { deck: [], userCat: null, error: 'NOT_AUTHENTICATED' };
  }

  // 1. Get user's cat
  const { data: userCatRaw, error: userCatError } = await supabase
    .from('cats')
    .select(`
      *,
      photos:cat_photos(*),
      cat_interests(
        interest:interests(*)
      )
    `)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (userCatError) {
    return { deck: [], userCat: null, error: userCatError.message };
  }

  if (!userCatRaw) {
    return { deck: [], userCat: null, error: 'NO_CAT' };
  }

  const userCatInterests: string[] = (userCatRaw.cat_interests || [])
    .map((ci: { interest: Interest }) => ci.interest?.name)
    .filter(Boolean);

  const userCat: Cat = {
    ...userCatRaw,
    interests: (userCatRaw.cat_interests || []).map((ci: { interest: Interest }) => ci.interest),
    photos: (userCatRaw.photos || []).sort((a: CatPhoto, b: CatPhoto) => a.position - b.position),
  };

  // 2. Get IDs of cats user has already swiped on (PASS, HYPE, KATNIP)
  const { data: existingSwipes } = await supabase
    .from('swipes')
    .select('to_cat_id')
    .eq('from_cat_id', userCat.id);

  const excludedCatIds = new Set<string>();
  excludedCatIds.add(userCat.id); // Never show own cat
  (existingSwipes || []).forEach((s) => excludedCatIds.add(s.to_cat_id));

  // 3. Query potential discover cats
  const { data: candidates, error: candidateError } = await supabase
    .from('cats')
    .select(`
      *,
      photos:cat_photos(*),
      cat_interests(
        interest:interests(*)
      )
    `)
    .neq('owner_id', user.id);

  if (candidateError) {
    return { deck: [], userCat, error: candidateError.message };
  }

  let formattedCats: Cat[] = (candidates || [])
    .filter((c) => !excludedCatIds.has(c.id))
    .map((c) => {
      const interests: Interest[] = (c.cat_interests || [])
        .map((ci: { interest: Interest }) => ci.interest)
        .filter(Boolean);

      const photos: CatPhoto[] = (c.photos || []).sort(
        (a: CatPhoto, b: CatPhoto) => a.position - b.position
      );

      return {
        ...c,
        interests,
        photos,
      };
    });

  // 4. Discovery scoring: location match + interest overlap + slight randomization
  formattedCats.sort((a, b) => {
    let scoreA = Math.random() * 2;
    let scoreB = Math.random() * 2;

    // Location priority
    if (userCat.location && a.location && a.location.toLowerCase() === userCat.location.toLowerCase()) {
      scoreA += 5;
    }
    if (userCat.location && b.location && b.location.toLowerCase() === userCat.location.toLowerCase()) {
      scoreB += 5;
    }

    // Interests overlap priority
    const overlapA = a.interests?.filter((i) => userCatInterests.includes(i.name)).length || 0;
    const overlapB = b.interests?.filter((i) => userCatInterests.includes(i.name)).length || 0;
    scoreA += overlapA * 2;
    scoreB += overlapB * 2;

    return scoreB - scoreA;
  });

  return { deck: formattedCats, userCat };
}
