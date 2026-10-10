'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Notification } from '@/lib/types/database';

export interface EnrichedNotification extends Notification {
  messageText: string;
  linkUrl: string;
}

export async function getNotifications(): Promise<{
  notifications: EnrichedNotification[];
  unreadCount: number;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { notifications: [], unreadCount: 0 };
  }

  const { data: rawNotifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !rawNotifications) {
    return { notifications: [], unreadCount: 0 };
  }

  const enriched: EnrichedNotification[] = [];
  let unread = 0;

  for (const n of rawNotifications) {
    if (!n.read) unread++;

    let messageText = 'New notification received.';
    let linkUrl = '/matches';

    if (n.type === 'HYPE') {
      // Reference ID is the from_cat_id
      const { data: senderCat } = await supabase
        .from('cats')
        .select('name')
        .eq('id', n.reference_id)
        .maybeSingle();

      const senderName = senderCat?.name || 'A cat';
      messageText = `${senderName} sent you a Hype.`;
      linkUrl = '/discover';
    } else if (n.type === 'KATNIP') {
      const { data: senderCat } = await supabase
        .from('cats')
        .select('name')
        .eq('id', n.reference_id)
        .maybeSingle();

      const senderName = senderCat?.name || 'A cat';
      messageText = `${senderName} gave your cat some Katnip.`;
      linkUrl = '/discover';
    } else if (n.type === 'MATCH') {
      messageText = "IT'S A MATCH.";
      linkUrl = `/meow-room/${n.reference_id}`;
    } else if (n.type === 'NEW_MEOW') {
      messageText = 'A match sent you a Meow.';
      linkUrl = `/meow-room/${n.reference_id}`;
    }

    enriched.push({
      ...n,
      messageText,
      linkUrl,
    });
  }

  return { notifications: enriched, unreadCount: unread };
}

export async function markAllNotificationsRead() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false);

  revalidatePath('/settings');
  return { success: true };
}
