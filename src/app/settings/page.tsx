import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';

export default function SettingsPlaceholder() {
  return (
    <div className="py-6">
      <EmptyState
        icon="settings"
        title="SETTINGS & DIAL-UP PREFERENCES"
        subtitle="Manage account privacy and notifications."
      />
    </div>
  );
}
