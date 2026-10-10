-- ========================================================
-- KITTYCALL DATA EXPORT SCRIPT (FOR SUPABASE FREE TIER)
-- Run this in the Supabase SQL Editor to export all project data as JSON
-- ========================================================

SELECT json_build_object(
  'exported_at', NOW(),
  'users', (SELECT coalesce(json_agg(u), '[]'::json) FROM public.users u),
  'cats', (SELECT coalesce(json_agg(c), '[]'::json) FROM public.cats c),
  'cat_photos', (SELECT coalesce(json_agg(cp), '[]'::json) FROM public.cat_photos cp),
  'interests', (SELECT coalesce(json_agg(i), '[]'::json) FROM public.interests i),
  'cat_interests', (SELECT coalesce(json_agg(ci), '[]'::json) FROM public.cat_interests ci),
  'swipes', (SELECT coalesce(json_agg(s), '[]'::json) FROM public.swipes s),
  'matches', (SELECT coalesce(json_agg(m), '[]'::json) FROM public.matches m),
  'messages', (SELECT coalesce(json_agg(msg), '[]'::json) FROM public.messages msg),
  'notifications', (SELECT coalesce(json_agg(n), '[]'::json) FROM public.notifications n)
) AS kittycall_backup_data;
