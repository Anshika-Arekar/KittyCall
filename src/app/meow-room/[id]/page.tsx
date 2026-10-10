import React from 'react';
import Link from 'next/link';
import { getMeowRoomData } from '@/actions/chat';
import { MeowRoom } from '@/components/chat/MeowRoom';
import { EmptyState } from '@/components/common/EmptyState';
import { Y2KButton } from '@/components/ui/Y2KButton';

interface MeowRoomPageProps {
  params: {
    id: string;
  };
}

export default async function MeowRoomPage({ params }: MeowRoomPageProps) {
  const { authorized, userCat, partnerCat, messages, error } = await getMeowRoomData(params.id);

  if (!authorized || !userCat || !partnerCat) {
    return (
      <div className="py-12 max-w-md mx-auto font-mono">
        <EmptyState
          icon="pass"
          title="MEOW ROOM UNAUTHORIZED"
          subtitle={
            error === 'UNAUTHORIZED_ACCESS'
              ? 'You can only access Meow Rooms involving your own cat.'
              : 'Conversation could not be found or connection expired.'
          }
        />
        <div className="text-center mt-4">
          <Link href="/matches">
            <Y2KButton variant="pink" size="md">
              RETURN TO MATCHES
            </Y2KButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <MeowRoom
        matchId={params.id}
        userCat={userCat}
        partnerCat={partnerCat}
        initialMessages={messages}
      />
    </div>
  );
}
