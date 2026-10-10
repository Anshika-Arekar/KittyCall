'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PREDEFINED_INTERESTS, type PredefinedInterest } from '@/lib/constants/interests';
import { compressImage } from '@/lib/utils/image-compression';
import { createCatProfile } from '@/actions/profile';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { Y2KButton } from '@/components/ui/Y2KButton';
import { Y2KBadge } from '@/components/ui/Y2KBadge';
import { RetroWindowHeader, RetroSticker } from '@/components/ui/PixelDecoration';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoCompressing, setPhotoCompressing] = useState(false);
  const [age, setAge] = useState<number | ''>('');
  const [selectedInterests, setSelectedInterests] = useState<PredefinedInterest[]>([]);
  const [bio, setBio] = useState('');

  // Optional fields
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [personality, setPersonality] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [favoriteToy, setFavoriteToy] = useState('');
  const [favoriteActivity, setFavoriteActivity] = useState('');

  // Photo change handler with client-side compression
  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPhotoCompressing(true);

    try {
      const compressed = await compressImage(file, { maxWidth: 1024, maxHeight: 1024, quality: 0.82 });
      setPhotoBlob(compressed);
      const previewUrl = URL.createObjectURL(compressed);
      setPhotoPreview(previewUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to process image');
    } finally {
      setPhotoCompressing(false);
    }
  }

  function toggleInterest(interest: PredefinedInterest) {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  }

  function handleNext() {
    setError(null);
    if (step === 1 && !name.trim()) {
      setError("Please enter your cat's name.");
      return;
    }
    if (step === 2 && !photoBlob && !photoPreview) {
      setError('Please choose a photo for your cat.');
      return;
    }
    if (step === 3 && (age === '' || Number(age) < 0 || Number(age) > 35)) {
      setError('Please enter a valid age between 0 and 35.');
      return;
    }
    if (step === 4 && selectedInterests.length === 0) {
      setError('Please choose at least one interest tag.');
      return;
    }
    if (step === 5 && !bio.trim()) {
      setError('Please write a short bio about your cat.');
      return;
    }
    setStep(step + 1);
  }

  function handleBack() {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function handleFinalSubmit() {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', String(age));
    formData.append('bio', bio);
    formData.append('interests', JSON.stringify(selectedInterests));

    if (breed) formData.append('breed', breed);
    if (gender) formData.append('gender', gender);
    if (location) formData.append('location', location);
    if (personality) formData.append('personality', personality);
    if (favoriteFood) formData.append('favorite_food', favoriteFood);
    if (favoriteToy) formData.append('favorite_toy', favoriteToy);
    if (favoriteActivity) formData.append('favorite_activity', favoriteActivity);

    if (photoBlob) {
      formData.append('photo', photoBlob, `${name.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    }

    const result = await createCatProfile(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/discover');
    }
  }

  return (
    <div className="min-h-screen bg-[#F6EEDC] flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader
          title={`CAT SETUP WIZARD (STEP ${step} OF 6)`}
          variant="pink"
          iconName="cat"
        />

        {/* Progress Bar */}
        <div className="bg-[#FFF8E8] border-b-2 border-[#292631] p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">SETUP PROGRESS:</span>
            <span className="text-[#9B8ACB] font-bold">{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-32 bg-[#F6EEDC] border border-[#292631] h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#F3A6B8] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-5 p-3 bg-[#F08080] border-2 border-[#292631] rounded-retro text-xs text-white font-bold flex items-center gap-2 shadow-[2px_2px_0px_#292631]">
              <PixelIcon name="pass" size={14} className="text-white shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Cat's Name */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <RetroSticker text="STEP 01" color="bg-[#8DB7D6]" />
                <h2 className="text-xl font-black uppercase tracking-wider text-[#292631] mt-2">
                  What's your cat's name?
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  The name that other cats will see on the network.
                </p>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Luna, Sir Paws-a-Lot, Milo"
                  autoFocus
                  className="w-full px-4 py-3 text-sm font-mono bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro focus:outline-none focus:ring-2 focus:ring-[#F3A6B8]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Photo */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <RetroSticker text="STEP 02" color="bg-[#F3A6B8]" />
                <h2 className="text-xl font-black uppercase tracking-wider text-[#292631] mt-2">
                  Show us your cat.
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  Upload a clear portrait. Image is automatically compressed for dial-up speed.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 mb-4">
                {photoPreview ? (
                  <div className="relative w-48 h-48 border-[3px] border-[#292631] rounded-retro overflow-hidden shadow-retro bg-[#F6EEDC]">
                    <img
                      src={photoPreview}
                      alt="Cat preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoBlob(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 px-2 py-1 bg-[#F08080] text-white border border-[#292631] text-[10px] font-bold rounded shadow-retro-sm"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <label className="w-48 h-48 border-2 border-dashed border-[#292631] bg-[#F6EEDC] rounded-retro flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition-colors shadow-retro-sm p-4 text-center">
                    <PixelIcon name="cat" size={36} className="text-[#9B8ACB] mb-2" />
                    <span className="text-xs font-bold uppercase text-[#292631]">
                      {photoCompressing ? 'COMPRESSING...' : 'CHOOSE PHOTO'}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-1">
                      JPG, PNG, WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      disabled={photoCompressing}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Age */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <RetroSticker text="STEP 03" color="bg-[#A7C98B]" />
                <h2 className="text-xl font-black uppercase tracking-wider text-[#292631] mt-2">
                  How old are they?
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  Cat years (human equivalent calculations are up to them).
                </p>
              </div>

              <div className="flex justify-center mb-4">
                <div className="w-32">
                  <input
                    type="number"
                    min={0}
                    max={35}
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    placeholder="3"
                    autoFocus
                    className="w-full text-center px-4 py-3 text-2xl font-black font-mono bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro focus:outline-none focus:ring-2 focus:ring-[#A7C98B]"
                  />
                  <div className="text-center text-xs font-bold text-stone-500 mt-2 uppercase">
                    YEARS OLD
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Interests */}
          {step === 4 && (
            <div>
              <div className="text-center mb-4">
                <RetroSticker text="STEP 04" color="bg-[#9B8ACB] text-white" />
                <h2 className="text-xl font-black uppercase tracking-wider text-[#292631] mt-2">
                  What are they interested in?
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  Select all tags that describe your cat's passions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-[#F6EEDC] border-2 border-[#292631] rounded-retro mb-4">
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
              <p className="text-[11px] text-stone-600 text-right">
                {selectedInterests.length} selected
              </p>
            </div>
          )}

          {/* STEP 5: Bio & Optional fields */}
          {step === 5 && (
            <div>
              <div className="text-center mb-4">
                <RetroSticker text="STEP 05" color="bg-[#F08080] text-white" />
                <h2 className="text-xl font-black uppercase tracking-wider text-[#292631] mt-2">
                  Tell us about them.
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  Write their bio and optional background details.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Bio (Required)
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Professional napper, passionate cardboard box inspector..."
                    className="w-full px-3 py-2 text-xs font-mono bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#F08080]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Breed (Optional)</label>
                    <input
                      type="text"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      placeholder="e.g. Tabby, Siamese"
                      className="w-full px-2 py-1.5 bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Location (Optional)</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. London, Mumbai"
                      className="w-full px-2 py-1.5 bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Personality (Optional)</label>
                    <input
                      type="text"
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      placeholder="e.g. Drama King, Sweetie"
                      className="w-full px-2 py-1.5 bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Favorite Food (Optional)</label>
                    <input
                      type="text"
                      value={favoriteFood}
                      onChange={(e) => setFavoriteFood(e.target.value)}
                      placeholder="e.g. Tuna, Salmon Pate"
                      className="w-full px-2 py-1.5 bg-[#FFF8E8] border-2 border-[#292631] rounded-retro"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Profile Preview */}
          {step === 6 && (
            <div>
              <div className="text-center mb-4">
                <RetroSticker text="STEP 06" color="bg-[#A7C98B]" />
                <h2 className="text-xl font-black uppercase tracking-wider text-[#292631] mt-2">
                  Profile Preview
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  Here is how your cat will appear to other cats on KittyCall.
                </p>
              </div>

              {/* Profile Card Preview */}
              <div className="bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro p-4 mb-4">
                <div className="flex gap-4 items-start">
                  {photoPreview && (
                    <div className="w-24 h-24 shrink-0 rounded-retro border-2 border-[#292631] overflow-hidden shadow-retro-sm">
                      <img
                        src={photoPreview}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-[#292631] truncate uppercase">
                        {name}
                      </h3>
                      <span className="px-2 py-0.5 text-xs bg-[#8DB7D6] font-bold border border-[#292631] rounded-full">
                        {age}y
                      </span>
                    </div>

                    {(breed || location) && (
                      <p className="text-xs text-stone-600 font-mono mt-0.5">
                        {[breed, location].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    <p className="text-xs text-stone-800 font-sans mt-2 line-clamp-3">
                      "{bio}"
                    </p>
                  </div>
                </div>

                {selectedInterests.length > 0 && (
                  <div className="mt-4 pt-3 border-t-2 border-[#292631] flex flex-wrap gap-1.5">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 text-[10px] bg-[#F6EEDC] border border-[#292631] rounded-full font-bold"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-[#292631] mt-4">
            {step > 1 ? (
              <Y2KButton
                type="button"
                variant="cream"
                size="md"
                onClick={handleBack}
                icon="arrow-left"
              >
                BACK
              </Y2KButton>
            ) : <div />}

            {step < 6 ? (
              <Y2KButton
                type="button"
                variant="pink"
                size="md"
                onClick={handleNext}
              >
                CONTINUE
              </Y2KButton>
            ) : (
              <Y2KButton
                type="button"
                variant="green"
                size="lg"
                onClick={handleFinalSubmit}
                disabled={loading}
                icon="check"
              >
                {loading ? 'CREATING PROFILE...' : 'CREATE PROFILE'}
              </Y2KButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
