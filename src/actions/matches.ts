'use server';

import { createClient } from '@/lib/supabase/server';
import type { Match, Cat, CatPhoto, Message, Interest } from '@/lib/types/database';

export async function getMatches(): Promise<{
  matches: Match[];
  userCat: Cat | null;
  error?: string;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { matches: [], userCat: null, error: 'NOT_AUTHENTICATED' };
  }

  // 1. Get user's cat
  const { data: userCatRaw } = await supabase
    .from('cats')
    .select('id, name')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!userCatRaw) {
    return { matches: [], userCat: null, error: 'NO_CAT' };
  }

  const userCatId = userCatRaw.id;

  // 2. Query matches involving user's cat
  const { data: matchesRaw, error: matchesError } = await supabase
    .from('matches')
    .select(`
      id,
      cat_a_id,
      cat_b_id,
      created_at,
      cat_a:cats!matches_cat_a_id_fkey(
        id, name, age, breed, location, is_demo,
        photos:cat_photos(*)
      ),
      cat_b:cats!matches_cat_b_id_fkey(
        id, name, age, breed, location, is_demo,
        photos:cat_photos(*)
      )
    `)
    .or(`cat_a_id.eq.${userCatId},cat_b_id.eq.${userCatId}`)
    .order('created_at', { ascending: false });

  if (matchesError) {
    return { matches: [], userCat: userCatRaw as Cat, error: matchesError.message };
  }

  const formattedMatches: Match[] = [];

  for (const m of (matchesRaw || [])) {
    const isCatA = m.cat_a_id === userCatId;
    const partnerCatRaw = (isCatA ? m.cat_b : m.cat_a) as any;
    const partnerCatId = isCatA ? m.cat_b_id : m.cat_a_id;

    if (!partnerCatRaw) continue;

    // Fetch latest message
    const { data: latestMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', m.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const latestMessage = latestMessages && latestMessages.length > 0 ? (latestMessages[0] as Message) : null;

    // Count unread messages
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('match_id', m.id)
      .is('read_at', null)
      .neq('sender_cat_id', userCatId);

    // Check if Katnip was used in swipes
    const { data: katnipSwipes } = await supabase
      .from('swipes')
      .select('id')
      .or(`and(from_cat_id.eq.${userCatId},to_cat_id.eq.${partnerCatId}),and(from_cat_id.eq.${partnerCatId},to_cat_id.eq.${userCatId})`)
      .eq('type', 'KATNIP')
      .limit(1);

    const hasKatnip = Boolean(katnipSwipes && katnipSwipes.length > 0);

    const partnerCat: Cat = {
      ...partnerCatRaw,
      photos: (partnerCatRaw.photos || []).sort(
        (a: CatPhoto, b: CatPhoto) => a.position - b.position
      ),
    };

    formattedMatches.push({
      id: m.id,
      cat_a_id: m.cat_a_id,
      cat_b_id: m.cat_b_id,
      created_at: m.created_at,
      cat_a: isCatA ? (userCatRaw as Cat) : partnerCat,
      cat_b: isCatA ? partnerCat : (userCatRaw as Cat),
      latest_message: latestMessage,
      unread_count: unreadCount || 0,
      has_katnip: hasKatnip,
    });
  }

  return {
    matches: formattedMatches,
    userCat: userCatRaw as Cat,
  };
}
