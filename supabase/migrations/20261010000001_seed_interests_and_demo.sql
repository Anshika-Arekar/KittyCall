-- ========================================================
-- SEED PREDEFINED INTERESTS AND DEMO CATS
-- ========================================================

-- 1. Insert Predefined Interests
INSERT INTO public.interests (name) VALUES
  ('Fish'),
  ('Cardboard Boxes'),
  ('Sleeping'),
  ('Bird Watching'),
  ('Plants'),
  ('Sunbathing'),
  ('Zoomies'),
  ('Treats'),
  ('Laser Pointers'),
  ('Window Watching'),
  ('Cuddles'),
  ('Exploring'),
  ('Napping'),
  ('Catnip'),
  ('Being Dramatic'),
  ('Knocking Things Over')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Demo System User in auth.users if not present
DO $$
DECLARE
  v_demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  v_luna_id UUID := '11111111-1111-1111-1111-111111111111';
  v_milo_id UUID := '22222222-2222-2222-2222-222222222222';
  v_cleo_id UUID := '33333333-3333-3333-3333-333333333333';
  v_oliver_id UUID := '44444444-4444-4444-4444-444444444444';
  v_bella_id UUID := '55555555-5555-5555-5555-555555555555';
BEGIN
  -- Insert dummy demo user in public.users
  INSERT INTO public.users (id, email, username)
  VALUES (v_demo_user_id, 'demo-system@kittycall.internal', 'KittyCall System')
  ON CONFLICT (id) DO NOTHING;

  -- Demo Cat 1: Luna
  INSERT INTO public.cats (id, owner_id, name, age, breed, gender, location, bio, personality, favorite_food, favorite_toy, favorite_activity, is_demo)
  VALUES (
    v_luna_id,
    v_demo_user_id,
    'Luna',
    3,
    'British Shorthair',
    'Female',
    'London',
    'Professional 3am zoomies champion. I take naps seriously and demand tuna on a silver platter.',
    'Royal Diva',
    'Fancy Feast Salmon Pate',
    'Red Laser Pointer',
    'Knocking water cups off counters',
    TRUE
  ) ON CONFLICT (id) DO NOTHING;

  -- Demo Cat 2: Milo
  INSERT INTO public.cats (id, owner_id, name, age, breed, gender, location, bio, personality, favorite_food, favorite_toy, favorite_activity, is_demo)
  VALUES (
    v_milo_id,
    v_demo_user_id,
    'Milo',
    2,
    'Ginger Tabby',
    'Male',
    'New York',
    'Orange cat energy. One braincell, infinite love. Looking for someone who appreciates dramatic window staring.',
    'Cuddle Bug',
    'Crunchy chicken treats',
    'Feather wand',
    'Sunbathing on warm laundry',
    TRUE
  ) ON CONFLICT (id) DO NOTHING;

  -- Demo Cat 3: Cleo
  INSERT INTO public.cats (id, owner_id, name, age, breed, gender, location, bio, personality, favorite_food, favorite_toy, favorite_activity, is_demo)
  VALUES (
    v_cleo_id,
    v_demo_user_id,
    'Cleo',
    4,
    'Siamese',
    'Female',
    'Mumbai',
    'Vocal critic of everything. If you do not give me Katnip immediately, I will sing the song of my people.',
    'Sassy Talker',
    'Fresh grilled fish',
    'Cardboard box castle',
    'Staring into the void',
    TRUE
  ) ON CONFLICT (id) DO NOTHING;

  -- Demo Cat 4: Oliver
  INSERT INTO public.cats (id, owner_id, name, age, breed, gender, location, bio, personality, favorite_food, favorite_toy, favorite_activity, is_demo)
  VALUES (
    v_oliver_id,
    v_demo_user_id,
    'Oliver',
    1,
    'Maine Coon',
    'Male',
    'Delhi',
    'Gentle giant kitten. Huge paws, soft purrs, and deeply fascinated by house plants and bird watching.',
    'Gentle Explorer',
    'Tuna Churu',
    'Crinkly paper balls',
    'Watching pigeons outside',
    TRUE
  ) ON CONFLICT (id) DO NOTHING;

  -- Demo Cat 5: Bella
  INSERT INTO public.cats (id, owner_id, name, age, breed, gender, location, bio, personality, favorite_food, favorite_toy, favorite_activity, is_demo)
  VALUES (
    v_bella_id,
    v_demo_user_id,
    'Bella',
    5,
    'Calico',
    'Female',
    'Tokyo',
    'Queen of the living room sofa. Easily amused by cardboard boxes, hates closed doors.',
    'Cozy Couch Potato',
    'Freeze-dried chicken hearts',
    'Catnip banana',
    'Sleeping in sunbeams',
    TRUE
  ) ON CONFLICT (id) DO NOTHING;

  -- Photos for Demo Cats (Using curated Unsplash cat portraits)
  INSERT INTO public.cat_photos (cat_id, url, position, is_primary) VALUES
    (v_luna_id, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800', 0, TRUE),
    (v_luna_id, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=800', 1, FALSE),
    (v_milo_id, 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800', 0, TRUE),
    (v_cleo_id, 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800', 0, TRUE),
    (v_oliver_id, 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800', 0, TRUE),
    (v_bella_id, 'https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=800', 0, TRUE)
  ON CONFLICT DO NOTHING;

  -- Seed Demo Cat Interests
  INSERT INTO public.cat_interests (cat_id, interest_id)
  SELECT v_luna_id, id FROM public.interests WHERE name IN ('Sleeping', 'Treats', 'Zoomies', 'Being Dramatic')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.cat_interests (cat_id, interest_id)
  SELECT v_milo_id, id FROM public.interests WHERE name IN ('Sunbathing', 'Cuddles', 'Laser Pointers', 'Catnip')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.cat_interests (cat_id, interest_id)
  SELECT v_cleo_id, id FROM public.interests WHERE name IN ('Cardboard Boxes', 'Fish', 'Knocking Things Over', 'Bird Watching')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.cat_interests (cat_id, interest_id)
  SELECT v_oliver_id, id FROM public.interests WHERE name IN ('Plants', 'Exploring', 'Bird Watching', 'Cuddles')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.cat_interests (cat_id, interest_id)
  SELECT v_bella_id, id FROM public.interests WHERE name IN ('Napping', 'Cardboard Boxes', 'Sunbathing', 'Catnip')
  ON CONFLICT DO NOTHING;

END $$;
