import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';

export default function MatchesPlaceholder() {
  return (
    <div className="py-6">
      <EmptyState
        icon="heart"
        title="NO MEOW SOULMATES YET."
        subtitle="Keep exploring."
      />
    </div>
  );
}
