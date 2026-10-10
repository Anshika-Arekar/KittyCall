import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';

export default function DiscoverPlaceholder() {
  return (
    <div className="py-6">
      <EmptyState
        icon="paw"
        title="DISCOVER DECK READY"
        subtitle="Swipe deck and demo cats initializing..."
      />
    </div>
  );
}
