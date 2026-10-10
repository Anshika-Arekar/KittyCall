'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { isValidMeow, MEOW_VOCABULARY, type MeowSound } from '@/lib/constants/meow-vocabulary';
import type { Message, Cat, CatPhoto } from '@/lib/types/database';

export async function getMeowRoomData(matchId: string): Promise<{
  authorized: boolean;
  userCat: Cat | null;
  partnerCat: Cat | null;
  messages: Message[];
  error?: string;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, userCat: null, partnerCat: null, messages: [], error: 'NOT_AUTHENTICATED' };
  }

  // 1. Get user's cat
  const { data: userCatRaw } = await supabase
    .from('cats')
    .select('id, name')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!userCatRaw) {
    return { authorized: false, userCat: null, partnerCat: null, messages: [], error: 'NO_CAT' };
  }

  const userCatId = userCatRaw.id;

  // 2. Fetch match and enforce authorization
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select(`
      id,
      cat_a_id,
      cat_b_id,
      cat_a:cats!matches_cat_a_id_fkey(
        id, name, age, breed, is_demo,
        photos:cat_photos(*)
      ),
      cat_b:cats!matches_cat_b_id_fkey(
        id, name, age, breed, is_demo,
        photos:cat_photos(*)
      )
    `)
    .eq('id', matchId)
    .single();

  if (matchError || !match) {
    return { authorized: false, userCat: null, partnerCat: null, messages: [], error: 'MATCH_NOT_FOUND' };
  }

  // Strict check: user's cat must be cat_a or cat_b
  const isCatA = match.cat_a_id === userCatId;
  const isCatB = match.cat_b_id === userCatId;

  if (!isCatA && !isCatB) {
    return { authorized: false, userCat: null, partnerCat: null, messages: [], error: 'UNAUTHORIZED_ACCESS' };
  }

  const partnerCatRaw = (isCatA ? match.cat_b : match.cat_a) as any;
  const partnerCat: Cat = {
    ...partnerCatRaw,
    photos: (partnerCatRaw?.photos || []).sort(
      (a: CatPhoto, b: CatPhoto) => a.position - b.position
    ),
  };

  // 3. Mark unread messages as read
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .is('read_at', null)
    .neq('sender_cat_id', userCatId);

  // 4. Fetch message history
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    return { authorized: true, userCat: userCatRaw as Cat, partnerCat, messages: [], error: messagesError.message };
  }

  return {
    authorized: true,
    userCat: userCatRaw as Cat,
    partnerCat,
    messages: (messages as Message[]) || [],
  };
}

export async function sendMeow(matchId: string, meowText: string): Promise<{
  success: boolean;
  message?: Message;
  error?: string;
}> {
  // STRICT SERVER-SIDE VALIDATION: Meow sound must be within predefined vocabulary
  if (!isValidMeow(meowText)) {
    return { success: false, error: 'INVALID_SOUND: Only cat meows are permitted in KittyCall.' };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  // 1. Get user cat
  const { data: userCat } = await supabase
    .from('cats')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!userCat) {
    return { success: false, error: 'NO_CAT' };
  }

  // 2. Validate match participation
  const { data: match } = await supabase
    .from('matches')
    .select(`
      id, cat_a_id, cat_b_id,
      cat_a:cats!matches_cat_a_id_fkey(id, is_demo),
      cat_b:cats!matches_cat_b_id_fkey(id, is_demo)
    `)
    .eq('id', matchId)
    .single();

  if (!match || (match.cat_a_id !== userCat.id && match.cat_b_id !== userCat.id)) {
    return { success: false, error: 'UNAUTHORIZED_CHAT' };
  }

  // 3. Insert Meow into database
  const { data: newMsg, error: insertError } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_cat_id: userCat.id,
      message: meowText as MeowSound,
    })
    .select('*')
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // 4. Partner Cat: Check if partner is a demo cat
  const isCatA = match.cat_a_id === userCat.id;
  const partnerCat = (isCatA ? match.cat_b : match.cat_a) as any;

  if (partnerCat?.is_demo) {
    // Schedule demo cat reply on server
    triggerDemoCatReply(matchId, partnerCat.id);
  }

  revalidatePath(`/meow-room/${matchId}`);
  revalidatePath('/matches');

  return { success: true, message: newMsg as Message };
}

/**
 * Isolated server-side Demo Cat response generator.
 * Automatically replies with a valid random Meow sound after a short natural delay.
 */
async function triggerDemoCatReply(matchId: string, demoCatId: string) {
  // Fire asynchronously with natural random delay between 1.5s - 2.5s
  setTimeout(async () => {
    try {
      const supabase = createClient();
      const randomMeow = MEOW_VOCABULARY[Math.floor(Math.random() * MEOW_VOCABULARY.length)];

      await supabase.from('messages').insert({
        match_id: matchId,
        sender_cat_id: demoCatId,
        message: randomMeow,
      });

      revalidatePath(`/meow-room/${matchId}`);
      revalidatePath('/matches');
    } catch {
      // Demo reply failure ignored gracefully
    }
  }, 2000);
}
