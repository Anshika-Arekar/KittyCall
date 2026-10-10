'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '@/lib/types/database';

interface MeowBubbleProps {
  message: Message;
  isSender: boolean;
  senderName?: string;
}

export function MeowBubble({ message, isSender, senderName }: MeowBubbleProps) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} my-1.5 font-mono`}
    >
      {senderName && !isSender && (
        <span className="text-[10px] font-bold text-stone-500 uppercase ml-1 mb-0.5">
          {senderName}
        </span>
      )}

      <div
        className={`
          max-w-[75%] px-3.5 py-2 border-2 border-[#292631] rounded-retro
          shadow-[2px_2px_0px_#292631]
          ${
            isSender
              ? 'bg-[#8DB7D6] text-[#292631] rounded-br-none'
              : 'bg-[#FFF8E8] text-[#292631] rounded-bl-none'
          }
        `}
      >
        <p className="text-sm font-bold uppercase tracking-wide">
          {message.message}
        </p>

        <span className="block text-[9px] text-stone-600 font-bold uppercase mt-1 text-right">
          {formattedTime}
        </span>
      </div>
    </motion.div>
  );
}
