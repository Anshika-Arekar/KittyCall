'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Cat, CatPhoto, Interest } from '@/lib/types/database';

export async function getMyCat(): Promise<{ cat: Cat | null; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { cat: null, error: 'Not authenticated' };
  }

  const { data: cat, error } = await supabase
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

  if (error) {
    return { cat: null, error: error.message };
  }

  if (!cat) {
    return { cat: null };
  }

  // Flatten interests
  const interests: Interest[] = (cat.cat_interests || [])
    .map((ci: { interest: Interest }) => ci.interest)
    .filter(Boolean);

  // Sort photos by position
  const photos: CatPhoto[] = (cat.photos || []).sort(
    (a: CatPhoto, b: CatPhoto) => a.position - b.position
  );

  return {
    cat: {
      ...cat,
      interests,
      photos,
    },
  };
}

export async function createCatProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated. Please sign in.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const age = parseInt(formData.get('age') as string, 10);
  const bio = (formData.get('bio') as string)?.trim();
  const breed = (formData.get('breed') as string)?.trim() || null;
  const gender = (formData.get('gender') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || null;
  const personality = (formData.get('personality') as string)?.trim() || null;
  const favorite_food = (formData.get('favorite_food') as string)?.trim() || null;
  const favorite_toy = (formData.get('favorite_toy') as string)?.trim() || null;
  const favorite_activity = (formData.get('favorite_activity') as string)?.trim() || null;
  const interestNamesRaw = formData.get('interests') as string;
  const photoFile = formData.get('photo') as File | null;

  if (!name || isNaN(age) || !bio) {
    return { error: 'Please fill in cat name, valid age, and bio.' };
  }

  if (age < 0 || age > 35) {
    return { error: 'Please enter a realistic age between 0 and 35.' };
  }

  let interestNames: string[] = [];
  try {
    interestNames = JSON.parse(interestNamesRaw || '[]');
  } catch {
    interestNames = [];
  }

  if (interestNames.length === 0) {
    return { error: 'Please select at least one interest tag.' };
  }

  // 1. Create Cat row
  const { data: newCat, error: catError } = await supabase
    .from('cats')
    .insert({
      owner_id: user.id,
      name,
      age,
      bio,
      breed,
      gender,
      location,
      personality,
      favorite_food,
      favorite_toy,
      favorite_activity,
      is_demo: false,
    })
    .select('id')
    .single();

  if (catError) {
    return { error: catError.message };
  }

  // 2. Upload photo if provided
  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${newCat.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('cat-photos')
      .upload(filePath, photoFile, {
        contentType: photoFile.type || 'image/jpeg',
        upsert: true,
      });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('cat-photos')
        .getPublicUrl(filePath);

      await supabase.from('cat_photos').insert({
        cat_id: newCat.id,
        url: publicUrl,
        position: 0,
        is_primary: true,
      });
    }
  }

  // 3. Associate interests
  const { data: allInterests } = await supabase
    .from('interests')
    .select('id, name')
    .in('name', interestNames);

  if (allInterests && allInterests.length > 0) {
    const interestRows = allInterests.map((i) => ({
      cat_id: newCat.id,
      interest_id: i.id,
    }));

    await supabase.from('cat_interests').insert(interestRows);
  }

  revalidatePath('/discover');
  revalidatePath('/profile');
  return { success: true, catId: newCat.id };
}

export async function updateCatProfile(catId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const name = (formData.get('name') as string)?.trim();
  const age = parseInt(formData.get('age') as string, 10);
  const bio = (formData.get('bio') as string)?.trim();
  const breed = (formData.get('breed') as string)?.trim() || null;
  const gender = (formData.get('gender') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || null;
  const personality = (formData.get('personality') as string)?.trim() || null;
  const favorite_food = (formData.get('favorite_food') as string)?.trim() || null;
  const favorite_toy = (formData.get('favorite_toy') as string)?.trim() || null;
  const favorite_activity = (formData.get('favorite_activity') as string)?.trim() || null;
  const interestNamesRaw = formData.get('interests') as string;

  if (!name || isNaN(age) || !bio) {
    return { error: 'Please enter name, age, and bio.' };
  }

  // Verify ownership
  const { error: updateError } = await supabase
    .from('cats')
    .update({
      name,
      age,
      bio,
      breed,
      gender,
      location,
      personality,
      favorite_food,
      favorite_toy,
      favorite_activity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', catId)
    .eq('owner_id', user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  // Update interests if provided
  if (interestNamesRaw) {
    try {
      const interestNames: string[] = JSON.parse(interestNamesRaw);
      await supabase.from('cat_interests').delete().eq('cat_id', catId);

      const { data: allInterests } = await supabase
        .from('interests')
        .select('id, name')
        .in('name', interestNames);

      if (allInterests && allInterests.length > 0) {
        await supabase.from('cat_interests').insert(
          allInterests.map((i) => ({
            cat_id: catId,
            interest_id: i.id,
          }))
        );
      }
    } catch {
      // Ignore interest json parse error
    }
  }

  revalidatePath('/profile');
  return { success: true };
}

export async function uploadCatPhoto(catId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Verify cat ownership
  const { data: cat } = await supabase
    .from('cats')
    .select('id')
    .eq('id', catId)
    .eq('owner_id', user.id)
    .single();

  if (!cat) {
    return { error: 'Unauthorized to add photos to this cat.' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided.' };
  }

  // Server-side file validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file format. Only JPG, PNG, WEBP, and GIF allowed.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File size exceeds 5MB limit.' };
  }

  // Get current max position
  const { data: existingPhotos } = await supabase
    .from('cat_photos')
    .select('position')
    .eq('cat_id', catId)
    .order('position', { ascending: false });

  const nextPos = existingPhotos && existingPhotos.length > 0 ? existingPhotos[0].position + 1 : 0;
  const isPrimary = nextPos === 0;

  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${user.id}/${catId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('cat-photos')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('cat-photos')
    .getPublicUrl(filePath);

  const { data: newPhoto, error: insertError } = await supabase
    .from('cat_photos')
    .insert({
      cat_id: catId,
      url: publicUrl,
      position: nextPos,
      is_primary: isPrimary,
    })
    .select('*')
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath('/profile');
  return { success: true, photo: newPhoto };
}

export async function deleteCatPhoto(catId: string, photoId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Verify ownership
  const { data: cat } = await supabase
    .from('cats')
    .select('id')
    .eq('id', catId)
    .eq('owner_id', user.id)
    .single();

  if (!cat) {
    return { error: 'Unauthorized.' };
  }

  const { error } = await supabase
    .from('cat_photos')
    .delete()
    .eq('id', photoId)
    .eq('cat_id', catId);

  if (error) {
    return { error: error.message };
  }

  // Ensure there's still a primary photo if photos remain
  const { data: remaining } = await supabase
    .from('cat_photos')
    .select('id, is_primary')
    .eq('cat_id', catId)
    .order('position', { ascending: true });

  if (remaining && remaining.length > 0 && !remaining.some((p) => p.is_primary)) {
    await supabase
      .from('cat_photos')
      .update({ is_primary: true, position: 0 })
      .eq('id', remaining[0].id);
  }

  revalidatePath('/profile');
  return { success: true };
}

export async function setPrimaryPhoto(catId: string, photoId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Verify ownership
  const { data: cat } = await supabase
    .from('cats')
    .select('id')
    .eq('id', catId)
    .eq('owner_id', user.id)
    .single();

  if (!cat) {
    return { error: 'Unauthorized' };
  }

  // Clear previous primary
  await supabase
    .from('cat_photos')
    .update({ is_primary: false })
    .eq('cat_id', catId);

  // Set new primary
  await supabase
    .from('cat_photos')
    .update({ is_primary: true, position: 0 })
    .eq('id', photoId)
    .eq('cat_id', catId);

  revalidatePath('/profile');
  return { success: true };
}
