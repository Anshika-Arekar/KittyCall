import React from 'react';
import Link from 'next/link';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { RetroSticker } from '@/components/ui/PixelDecoration';

export default function LandingPage() {
  const steps = [
    { number: '01', title: 'Create your cat', desc: 'Set up your cat’s profile with photos, bio, and favorite interests.' },
    { number: '02', title: 'Discover cats', desc: 'Explore other cats on the network one card at a time.' },
    { number: '03', title: 'Hype the ones you like', desc: 'Swipe right or tap Hype to show positive interest.' },
    { number: '04', title: 'Give Katnips to your favorites', desc: 'Send Katnip to cats that deserve extra appreciation.' },
    { number: '05', title: 'Match', desc: 'When the feeling is mutual, an instant Match is formed.' },
    { number: '06', title: 'Meow', desc: 'Enter the Meow Room and communicate exclusively in meows.' },
  ];

  const features = [
    {
      title: 'DISCOVER',
      subtitle: 'Find cats worth knowing.',
      color: 'bg-[#8DB7D6]',
      icon: 'paw' as const,
    },
    {
      title: 'HYPE',
      subtitle: 'Show them some attention.',
      color: 'bg-[#F3A6B8]',
      icon: 'hype' as const,
    },
    {
      title: 'KATNIP',
      subtitle: 'For cats you really like.',
      color: 'bg-[#9B8ACB]',
      icon: 'katnip' as const,
    },
    {
      title: 'MATCH',
      subtitle: 'When the feeling is mutual.',
      color: 'bg-[#F08080]',
      icon: 'heart' as const,
    },
    {
      title: 'MEOW',
      subtitle: 'Communicate with your match.',
      color: 'bg-[#A7C98B]',
      icon: 'chat' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6EEDC] text-[#292631] flex flex-col font-mono selection:bg-[#F3A6B8] selection:text-[#292631]">
      {/* Top Bar */}
      <header className="w-full bg-[#FFF8E8] border-b-[2.5px] border-[#292631] px-4 py-3 shadow-[0px_2px_0px_#292631]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F3A6B8] border-2 border-[#292631] rounded-retro flex items-center justify-center shadow-[2px_2px_0px_#292631]">
              <PixelIcon name="cat" size={18} className="text-[#292631]" />
            </div>
            <span className="font-black text-xl tracking-wider text-[#292631]">KITTYCALL</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/sign-in"
              className="px-3 py-1.5 text-xs font-bold uppercase bg-[#FFF8E8] hover:bg-[#F6EEDC] border-2 border-[#292631] rounded-retro shadow-retro y2k-pressable"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-1.5 text-xs font-bold uppercase bg-[#F3A6B8] hover:bg-[#efa0b2] border-2 border-[#292631] rounded-retro shadow-retro y2k-pressable"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <RetroSticker text="Y2K CAT DIAL-UP NETWORK" color="bg-[#9B8ACB] text-white" />
          <RetroSticker text="EST. 2000" color="bg-[#A7C98B]" rotate="rotate-[2deg]" />
        </div>

        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg flex items-center justify-center shadow-retro-lg">
            <PixelIcon name="cat" size={56} className="text-[#292631]" />
          </div>
          <div className="absolute -top-3 -right-3">
            <PixelIcon name="sparkle" size={24} className="text-[#F08080]" />
          </div>
          <div className="absolute -bottom-2 -left-3">
            <PixelIcon name="paw" size={20} className="text-[#9B8ACB]" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 uppercase">
          Swipe. Hype. Meow.
        </h1>

        <p className="text-sm sm:text-base text-stone-700 max-w-xl mb-8 leading-relaxed font-sans">
          The nostalgic early-2000s social matching network built exclusively for cats.
          Humans manage the profiles, but cats do the discovering, hyping, and meowing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider bg-[#F3A6B8] hover:bg-[#efa0b2] border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg y2k-pressable flex items-center gap-2"
          >
            <PixelIcon name="paw" size={18} />
            <span>Get Started</span>
          </Link>
          <Link
            href="/auth/sign-in"
            className="px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider bg-[#FFF8E8] hover:bg-white border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg y2k-pressable flex items-center gap-2"
          >
            <PixelIcon name="user" size={18} />
            <span>Sign In</span>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-12 max-w-5xl mx-auto w-full">
        <div className="bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro-lg shadow-retro-lg p-6 sm:p-8">
          <div className="border-b-2 border-[#292631] pb-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PixelIcon name="star" size={18} className="text-[#9B8ACB]" />
              <h2 className="font-black text-lg sm:text-xl uppercase tracking-wider">
                How It Works
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              6-STEP CYCLE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-[#F6EEDC] border-2 border-[#292631] rounded-retro p-4 shadow-retro flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 bg-[#292631] text-[#FFF8E8] text-xs font-bold rounded mb-2">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-sm text-[#292631] uppercase mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-700 font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider mb-2">
            Features
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Dial-up into the features shaping the feline social landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-[#FFF8E8] border-[2.5px] border-[#292631] rounded-retro shadow-retro-lg p-5 flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-retro border-2 border-[#292631] ${feat.color} flex items-center justify-center shadow-retro shrink-0`}
              >
                <PixelIcon name={feat.icon} size={22} className="text-[#292631]" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-[#292631] mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-stone-700 font-sans">{feat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-[#292631] bg-[#FFF8E8] px-4 py-6 text-center font-mono text-xs text-stone-600">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PixelIcon name="cat" size={14} className="text-[#292631]" />
            <span className="font-bold text-[#292631]">KITTYCALL</span>
            <span>- Novelty cat matching app</span>
          </div>
          <span className="text-[11px] text-stone-500">
            For humor & fun only. No real-world meetups.
          </span>
        </div>
      </footer>
    </div>
  );
}
