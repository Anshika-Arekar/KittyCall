import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';

export default function OnboardingPlaceholder() {
  return (
    <div className="py-6">
      <EmptyState
        icon="cat"
        title="CAT ONBOARDING"
        subtitle="Step 1 to Step 6 cat setup wizard initializing..."
      />
    </div>
  );
}
