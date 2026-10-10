'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMyCat, updateCatProfile } from '@/actions/profile';
import { PREDEFINED_INTERESTS, type PredefinedInterest } from '@/lib/constants/interests';
import type { Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { Y2KButton } from '@/components/ui/Y2KButton';
import { Y2KBadge } from '@/components/ui/Y2KBadge';
import { RetroWindowHeader } from '@/components/ui/PixelDecoration';
import { LoadingState } from '@/components/common/LoadingState';

export default function EditProfilePage() {
  const router = useRouter();
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [bio, setBio] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [personality, setPersonality] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [favoriteToy, setFavoriteToy] = useState('');
  const [favoriteActivity, setFavoriteActivity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<PredefinedInterest[]>([]);

  useEffect(() => {
    async function loadCat() {
      const res = await getMyCat();
      if (res.cat) {
        setCat(res.cat);
        setName(res.cat.name);
        setAge(res.cat.age);
        setBio(res.cat.bio);
        setBreed(res.cat.breed || '');
        setGender(res.cat.gender || '');
        setLocation(res.cat.location || '');
        setPersonality(res.cat.personality || '');
        setFavoriteFood(res.cat.favorite_food || '');
        setFavoriteToy(res.cat.favorite_toy || '');
        setFavoriteActivity(res.cat.favorite_activity || '');
        setSelectedInterests(
          (res.cat.interests?.map((i) => i.name as PredefinedInterest) || [])
        );
      }
      setLoading(false);
    }
    loadCat();
  }, []);

  function toggleInterest(interest: PredefinedInterest) {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cat) return;

    setError(null);
    setSaving(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', String(age));
    formData.append('bio', bio);
    formData.append('breed', breed);
    formData.append('gender', gender);
    formData.append('location', location);
    formData.append('personality', personality);
    formData.append('favorite_food', favoriteFood);
    formData.append('favorite_toy', favoriteToy);
    formData.append('favorite_activity', favoriteActivity);
    formData.append('interests', JSON.stringify(selectedInterests));

    const res = await updateCatProfile(cat.id, formData);
    if (res.error) {
      setError(res.error);
      setSaving(false);
    } else {
      router.push('/profile');
    }
  }

  if (loading) {
    return <LoadingState text="LOADING CAT PROFILE..." />;
  }

  if (!cat) {
    return (
      <div className="py-8 text-center font-mono">
        <p>No profile to edit.</p>
        <Link href="/onboarding" className="underline mt-2 inline-block">
          Create profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 font-mono">
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader
          title="EDIT CAT PROFILE.EXE"
          variant="purple"
          iconName="settings"
        />

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-[#F08080] border-2 border-[#292631] rounded-retro text-xs text-white font-bold flex items-center gap-2">
              <PixelIcon name="pass" size={14} className="text-white shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Cat Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Age (Years)</label>
              <input
                type="number"
                min={0}
                max={35}
                required
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Bio</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Gender</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City only"
                className="w-full px-2 py-1.5 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase mb-1">Personality / Vibe</label>
            <input
              type="text"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g. Sassy, Sleepy King"
              className="w-full px-3 py-2 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Favorite Food</label>
              <input
                type="text"
                value={favoriteFood}
                onChange={(e) => setFavoriteFood(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Favorite Toy</label>
              <input
                type="text"
                value={favoriteToy}
                onChange={(e) => setFavoriteToy(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Favorite Activity</label>
              <input
                type="text"
                value={favoriteActivity}
                onChange={(e) => setFavoriteActivity(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Interests & Passions</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#F6EEDC] border-2 border-[#292631] rounded-retro max-h-48 overflow-y-auto">
              {PREDEFINED_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <Y2KBadge
                    key={interest}
                    selected={isSelected}
                    variant="cream"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Y2KBadge>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#292631]">
            <Link href="/profile">
              <Y2KButton type="button" variant="cream" size="md">
                CANCEL
              </Y2KButton>
            </Link>
            <Y2KButton type="submit" variant="green" size="md" disabled={saving}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </Y2KButton>
          </div>
        </form>
      </div>
    </div>
  );
}
