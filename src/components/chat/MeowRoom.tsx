'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { sendMeow } from '@/actions/chat';
import type { Message, Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { MeowBubble } from './MeowBubble';
import { MeowComposer } from './MeowComposer';
import { MeowIndicator } from './MeowIndicator';
import { EmptyState } from '@/components/common/EmptyState';

interface MeowRoomProps {
  matchId: string;
  userCat: Cat;
  partnerCat: Cat;
  initialMessages: Message[];
}

export function MeowRoom({
  matchId,
  userCat,
  partnerCat,
  initialMessages,
}: MeowRoomProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [sending, setSending] = useState(false);
  const [isPartnerMeowing, setIsPartnerMeowing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const partnerPhoto =
    partnerCat.photos?.find((p) => p.is_primary)?.url ||
    partnerCat.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800';

  // Auto-scroll to bottom of conversation
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerMeowing]);

  // Supabase Realtime subscription for incoming Meows
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`meow-room-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicate additions if already in state
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setIsPartnerMeowing(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  async function handleSendMeow(meowText: string) {
    if (sending) return;
    setSending(true);

    // Optimistically add user's Meow to local state
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      match_id: matchId,
      sender_cat_id: userCat.id,
      message: meowText as any,
      read_at: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    // If partner cat is a demo cat, trigger the meowing indicator
    if (partnerCat.is_demo) {
      setTimeout(() => {
        setIsPartnerMeowing(true);
      }, 600);
    }

    const res = await sendMeow(matchId, meowText);
    setSending(false);

    if (res.error) {
      // Revert if failed
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setIsPartnerMeowing(false);
    } else if (res.message) {
      // Update optimistic message with real ID
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? res.message! : m))
      );
    }
  }

  return (
    <div className="flex flex-col h-[82vh] max-w-2xl mx-auto bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden font-mono">
      {/* Meow Room Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#F3A6B8] border-b-2 border-[#292631] text-[#292631]">
        <div className="flex items-center gap-2.5">
          {/* Back button for mobile */}
          <Link
            href="/matches"
            aria-label="Back to matches"
            className="w-7 h-7 bg-[#FFF8E8] hover:bg-white border-2 border-[#292631] rounded flex items-center justify-center shadow-retro-sm y2k-pressable"
          >
            <PixelIcon name="arrow-left" size={14} />
          </Link>

          {/* Partner Cat avatar & name */}
          <div className="relative w-8 h-8 rounded-retro border-2 border-[#292631] overflow-hidden bg-[#F6EEDC]">
            <img
              src={partnerPhoto}
              alt={partnerCat.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm uppercase">
                {partnerCat.name}
              </span>
              {partnerCat.is_demo && (
                <span className="px-1 py-0.2 text-[8px] font-bold bg-[#9B8ACB] text-white border border-[#292631] rounded">
                  DEMO
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold text-stone-700 uppercase -mt-1 block">
              MEOW ROOM ACTIVE
            </span>
          </div>
        </div>

        {/* Dial-up connection status */}
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase bg-[#FFF8E8] px-2 py-0.5 border border-[#292631] rounded shadow-retro-sm">
          <span className="w-2 h-2 bg-[#A7C98B] border border-[#292631] rounded-full inline-block animate-pulse" />
          <span>CONNECTED</span>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F6EEDC] flex flex-col justify-between">
        {messages.length > 0 ? (
          <div className="flex flex-col">
            {messages.map((msg) => {
              const isSender = msg.sender_cat_id === userCat.id;
              return (
                <MeowBubble
                  key={msg.id}
                  message={msg}
                  isSender={isSender}
                  senderName={isSender ? userCat.name : partnerCat.name}
                />
              );
            })}

            {/* Live Typing Indicator */}
            {isPartnerMeowing && <MeowIndicator catName={partnerCat.name} />}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="my-auto">
            <EmptyState
              icon="chat"
              title="YOUR MEOWBOX IS EMPTY."
              subtitle="Start the conversation."
            />
          </div>
        )}
      </div>

      {/* Soundboard Composer */}
      <MeowComposer onSend={handleSendMeow} disabled={sending} />
    </div>
  );
}
