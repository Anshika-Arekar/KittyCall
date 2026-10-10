-- ========================================================
-- KITTYCALL INITIAL SCHEMA
-- Postgres Schema with RLS, Constraints, and Atomic Match
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Mirror of auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATS TABLE
CREATE TABLE IF NOT EXISTS public.cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 35),
  bio TEXT NOT NULL,
  breed TEXT NULL,
  gender TEXT NULL,
  location TEXT NULL,
  personality TEXT NULL,
  favorite_food TEXT NULL,
  favorite_toy TEXT NULL,
  favorite_activity TEXT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_cat_per_owner UNIQUE(owner_id)
);

-- 3. CAT PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.cat_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INTERESTS TABLE
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- 5. CAT INTERESTS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.cat_interests (
  cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  PRIMARY KEY (cat_id, interest_id)
);

-- 6. SWIPES TABLE
CREATE TABLE IF NOT EXISTS public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  to_cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('PASS', 'HYPE', 'KATNIP')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_cat_swipe UNIQUE (from_cat_id, to_cat_id),
  CONSTRAINT no_self_swipe CHECK (from_cat_id <> to_cat_id)
);

-- 7. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_a_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  cat_b_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ordered_cat_pair CHECK (cat_a_id < cat_b_id),
  CONSTRAINT unique_match_pair UNIQUE (cat_a_id, cat_b_id)
);

-- 8. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (
    message IN (
      'meow',
      'meow!',
      'MEOW',
      'meow meow',
      'meow meow meow',
      'mrow',
      'mrrp',
      'mrrrr',
      'mew',
      'mew?',
      'purrrrr',
      'meooooow'
    )
  ),
  read_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('HYPE', 'KATNIP', 'MATCH', 'NEW_MEOW')),
  reference_id UUID NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_cats_owner ON public.cats(owner_id);
CREATE INDEX IF NOT EXISTS idx_cat_photos_cat ON public.cat_photos(cat_id);
CREATE INDEX IF NOT EXISTS idx_swipes_from_to ON public.swipes(from_cat_id, to_cat_id);
CREATE INDEX IF NOT EXISTS idx_matches_cat_a ON public.matches(cat_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_cat_b ON public.matches(cat_b_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages(match_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- ========================================================
-- USER SYNC TRIGGER FROM AUTH.USERS
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- ATOMIC SWIPE & MATCH Postgres Function
-- ========================================================
CREATE OR REPLACE FUNCTION public.process_swipe(
  p_from_cat_id UUID,
  p_to_cat_id UUID,
  p_type TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_reciprocal_type TEXT;
  v_is_demo BOOLEAN;
  v_cat_a UUID;
  v_cat_b UUID;
  v_match_id UUID := NULL;
  v_matched BOOLEAN := FALSE;
  v_to_owner_id UUID;
  v_from_owner_id UUID;
BEGIN
  -- Record or update the swipe
  INSERT INTO public.swipes (from_cat_id, to_cat_id, type, created_at)
  VALUES (p_from_cat_id, p_to_cat_id, p_type, NOW())
  ON CONFLICT (from_cat_id, to_cat_id)
  DO UPDATE SET type = EXCLUDED.type, created_at = NOW();

  -- Get target cat demo status and owner
  SELECT is_demo, owner_id INTO v_is_demo, v_to_owner_id
  FROM public.cats WHERE id = p_to_cat_id;

  SELECT owner_id INTO v_from_owner_id
  FROM public.cats WHERE id = p_from_cat_id;

  -- Only HYPE or KATNIP can create a match
  IF p_type IN ('HYPE', 'KATNIP') THEN
    -- If demo cat, automatically create reciprocal HYPE
    IF v_is_demo IS TRUE THEN
      INSERT INTO public.swipes (from_cat_id, to_cat_id, type, created_at)
      VALUES (p_to_cat_id, p_from_cat_id, 'HYPE', NOW())
      ON CONFLICT (from_cat_id, to_cat_id)
      DO UPDATE SET type = 'HYPE';
      v_reciprocal_type := 'HYPE';
    ELSE
      -- Check if target cat already swiped HYPE or KATNIP
      SELECT type INTO v_reciprocal_type
      FROM public.swipes
      WHERE from_cat_id = p_to_cat_id AND to_cat_id = p_from_cat_id;
    END IF;

    -- If both swiped positively, we have a MATCH!
    IF v_reciprocal_type IN ('HYPE', 'KATNIP') THEN
      v_cat_a := LEAST(p_from_cat_id, p_to_cat_id);
      v_cat_b := GREATEST(p_from_cat_id, p_to_cat_id);

      INSERT INTO public.matches (cat_a_id, cat_b_id, created_at)
      VALUES (v_cat_a, v_cat_b, NOW())
      ON CONFLICT (cat_a_id, cat_b_id)
      DO UPDATE SET created_at = public.matches.created_at
      RETURNING id INTO v_match_id;

      v_matched := TRUE;

      -- Create Match notifications for both cats (unless target is demo)
      IF v_from_owner_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, reference_id, created_at)
        VALUES (v_from_owner_id, 'MATCH', v_match_id, NOW());
      END IF;

      IF v_to_owner_id IS NOT NULL AND v_is_demo IS FALSE THEN
        INSERT INTO public.notifications (user_id, type, reference_id, created_at)
        VALUES (v_to_owner_id, 'MATCH', v_match_id, NOW());
      END IF;
    ELSE
      -- Not matched yet: notify the receiving user of HYPE / KATNIP (if not demo cat)
      IF v_to_owner_id IS NOT NULL AND v_is_demo IS FALSE THEN
        INSERT INTO public.notifications (user_id, type, reference_id, created_at)
        VALUES (v_to_owner_id, p_type, p_from_cat_id, NOW());
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'matched', v_matched,
    'match_id', v_match_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- USERS Policies
CREATE POLICY "Users can view usernames" ON public.users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own record" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- CATS Policies
CREATE POLICY "Anyone can view cats" ON public.cats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Owners can insert their cat" ON public.cats
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their cat" ON public.cats
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their cat" ON public.cats
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- CAT PHOTOS Policies
CREATE POLICY "Anyone can view cat photos" ON public.cat_photos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cat owners can manage photos" ON public.cat_photos
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cats WHERE id = cat_photos.cat_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cats WHERE id = cat_photos.cat_id AND owner_id = auth.uid()));

-- INTERESTS Policies
CREATE POLICY "Interests viewable by all" ON public.interests
  FOR SELECT TO authenticated USING (true);

-- CAT INTERESTS Policies
CREATE POLICY "Cat interests viewable by all" ON public.cat_interests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cat owners can manage cat interests" ON public.cat_interests
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cats WHERE id = cat_interests.cat_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cats WHERE id = cat_interests.cat_id AND owner_id = auth.uid()));

-- SWIPES Policies
CREATE POLICY "Users can view own swipes" ON public.swipes
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cats WHERE id = swipes.from_cat_id AND owner_id = auth.uid()));

CREATE POLICY "Users can create swipes from their cat" ON public.swipes
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.cats WHERE id = swipes.from_cat_id AND owner_id = auth.uid()));

-- MATCHES Policies
CREATE POLICY "Users can view their cat's matches" ON public.matches
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.cats WHERE id = matches.cat_a_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.cats WHERE id = matches.cat_b_id AND owner_id = auth.uid())
  );

-- MESSAGES Policies
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.cats c ON c.id = m.cat_a_id OR c.id = m.cat_b_id
      WHERE m.id = messages.match_id AND c.owner_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send meows" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cats
      WHERE id = messages.sender_cat_id AND owner_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = messages.match_id AND (m.cat_a_id = messages.sender_cat_id OR m.cat_b_id = messages.sender_cat_id)
    )
  );

CREATE POLICY "Participants can update message read_at" ON public.messages
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.cats c ON c.id = m.cat_a_id OR c.id = m.cat_b_id
      WHERE m.id = messages.match_id AND c.owner_id = auth.uid()
    )
  );

-- NOTIFICATIONS Policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Realtime publication for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ========================================================
-- STORAGE BUCKET POLICY (Ensure 'cat-photos' bucket exists and is public)
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('cat-photos', 'cat-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public cat photos access" ON storage.objects
  FOR SELECT USING (bucket_id = 'cat-photos');

CREATE POLICY "Authenticated users can upload cat photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cat-photos');

CREATE POLICY "Authenticated users can update their uploaded cat photos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'cat-photos');

CREATE POLICY "Authenticated users can delete their uploaded cat photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'cat-photos');
