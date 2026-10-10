'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signInWithEmail } from '@/actions/auth';
import { createClient } from '@/lib/supabase/client';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { Y2KButton } from '@/components/ui/Y2KButton';
import { RetroWindowHeader } from '@/components/ui/PixelDecoration';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signInWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6EEDC] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader title="KITTYCALL LOGIN.EXE" variant="pink" iconName="cat" />

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#F3A6B8] border-2 border-[#292631] rounded-retro mx-auto flex items-center justify-center shadow-retro mb-3">
              <PixelIcon name="paw" size={24} className="text-[#292631]" />
            </div>
            <h1 className="font-black text-xl text-[#292631] uppercase tracking-wider">
              WELCOME BACK
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Connect to your cat's network profile
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-[#F08080] border-2 border-[#292631] rounded-retro text-xs text-white font-bold flex items-center gap-2 shadow-[2px_2px_0px_#292631]">
              <PixelIcon name="pass" size={14} className="text-white shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#292631] mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="catparent@example.com"
                className="w-full px-3 py-2 text-xs font-mono bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#9B8ACB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#292631] mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs font-mono bg-[#FFF8E8] border-2 border-[#292631] rounded-retro shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#9B8ACB]"
              />
            </div>

            <Y2KButton
              type="submit"
              variant="pink"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'CONNECTING...' : 'SIGN IN'}
            </Y2KButton>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#292631]" />
            </div>
            <span className="relative bg-[#FFF8E8] px-3 text-[11px] font-bold uppercase text-stone-500">
              OR DIAL IN WITH
            </span>
          </div>

          <Y2KButton
            type="button"
            onClick={handleGoogleSignIn}
            variant="blue"
            size="md"
            fullWidth
            icon="star"
            disabled={googleLoading}
          >
            {googleLoading ? 'CONNECTING TO GOOGLE...' : 'SIGN IN WITH GOOGLE'}
          </Y2KButton>

          <div className="mt-6 pt-4 border-t-2 border-[#292631] text-center text-xs">
            <span className="text-stone-600">No account yet? </span>
            <Link
              href="/auth/sign-up"
              className="font-bold text-[#292631] underline hover:text-[#F08080]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
