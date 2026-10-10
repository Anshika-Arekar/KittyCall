import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';

export default function ProfilePlaceholder() {
  return (
    <div className="py-6">
      <EmptyState
        icon="cat"
        title="CAT PROFILE"
        subtitle="Manage your cat's identity, photos, and interests."
      />
    </div>
  );
}
