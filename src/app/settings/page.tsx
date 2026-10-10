'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, deleteAccount } from '@/actions/auth';
import { getNotifications, markAllNotificationsRead, type EnrichedNotification } from '@/actions/notifications';
import { getMyCat } from '@/actions/profile';
import type { Cat } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { Y2KButton } from '@/components/ui/Y2KButton';
import { RetroWindowHeader, RetroSticker } from '@/components/ui/PixelDecoration';
import { LoadingState } from '@/components/common/LoadingState';

export default function SettingsPage() {
  const router = useRouter();
  const [cat, setCat] = useState<Cat | null>(null);
  const [notifications, setNotifications] = useState<EnrichedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [catRes, notifRes] = await Promise.all([
        getMyCat(),
        getNotifications(),
      ]);

      if (catRes.cat) setCat(catRes.cat);
      setNotifications(notifRes.notifications);
      setUnreadCount(notifRes.unreadCount);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    await deleteAccount();
  }

  if (loading) {
    return <LoadingState text="LOADING SETTINGS & PREFERENCES..." />;
  }

  return (
    <div className="max-w-2xl mx-auto py-6 font-mono flex flex-col gap-6">
      {/* SECTION 1: Account & Profile Overview */}
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader title="ACCOUNT SETTINGS.EXE" variant="pink" iconName="user" />

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-stone-500 block">
                ACTIVE CAT PROFILE
              </span>
              <h2 className="text-xl font-black uppercase text-[#292631]">
                {cat ? cat.name : 'NO CAT PROFILE CREATED'}
              </h2>
            </div>

            {cat ? (
              <Link href="/profile/edit">
                <Y2KButton variant="pink" size="sm" icon="settings">
                  EDIT PROFILE
                </Y2KButton>
              </Link>
            ) : (
              <Link href="/onboarding">
                <Y2KButton variant="green" size="sm">
                  CREATE PROFILE
                </Y2KButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: In-App Notifications Feed */}
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader
          title={`IN-APP NOTIFICATIONS (${unreadCount} NEW)`}
          variant="purple"
          iconName="bell"
        />

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-stone-600">
              NETWORK ACTIVITY ALERTS
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold uppercase text-[#9B8ACB] hover:underline cursor-pointer"
              >
                MARK ALL AS READ
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="flex flex-col gap-2">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.linkUrl}
                  className={`
                    p-3 border-2 border-[#292631] rounded-retro text-xs transition-all flex items-center justify-between
                    ${n.read ? 'bg-[#FFF8E8] opacity-80' : 'bg-[#FFF2F5] shadow-retro-sm font-bold'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-[#F3A6B8] border border-[#292631] flex items-center justify-center shrink-0">
                      <PixelIcon
                        name={
                          n.type === 'HYPE'
                            ? 'hype'
                            : n.type === 'KATNIP'
                            ? 'katnip'
                            : n.type === 'MATCH'
                            ? 'heart'
                            : 'chat'
                        }
                        size={12}
                      />
                    </div>
                    <span>{n.messageText}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 uppercase">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic py-2 text-center">
              No recent notifications on the network.
            </p>
          )}
        </div>
      </div>

      {/* SECTION 3: Privacy & Location Notice */}
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader title="PRIVACY MANIFESTO" variant="blue" iconName="star" />

        <div className="p-5 flex flex-col gap-3 text-xs leading-relaxed font-sans text-stone-700">
          <p>
            <strong>Broad Locations Only:</strong> KittyCall only stores broad cities or regions (e.g. Mumbai, London, New York). We never request, store, or expose home addresses, street names, or GPS coordinates.
          </p>
          <p>
            <strong>Cat-Only Experience:</strong> Your human owner account and email remain completely private and are never exposed publicly to other users.
          </p>
          <p>
            <strong>Meow-Only Messaging:</strong> Meow Rooms only support playful cat vocalizations to preserve humor, novelty, and safety.
          </p>
        </div>
      </div>

      {/* SECTION 4: Danger Zone & Logout */}
      <div className="bg-[#FFF8E8] border-[3px] border-[#292631] rounded-retro-lg shadow-retro-lg overflow-hidden">
        <RetroWindowHeader title="ACCOUNT SESSION CONTROLS" variant="coral" iconName="pass" />

        <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form action={signOut}>
            <Y2KButton type="submit" variant="cream" size="md">
              LOGOUT FROM KITTYCALL
            </Y2KButton>
          </form>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="text-xs font-bold text-[#F08080] hover:underline uppercase"
          >
            DELETE ACCOUNT & ALL DATA
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-mono">
          <div className="bg-[#FFF8E8] border-[3.5px] border-[#292631] rounded-retro-lg shadow-retro-lg max-w-sm w-full p-6 text-center">
            <RetroSticker text="PERMANENT ACTION" color="bg-[#F08080] text-white" />
            <h3 className="text-base font-black uppercase text-[#292631] mt-3 mb-2">
              DELETE CAT ACCOUNT?
            </h3>
            <p className="text-xs text-stone-600 mb-6 font-sans">
              This will permanently delete your account, your cat profile, all photos, matches, and meow conversations. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Y2KButton
                variant="coral"
                size="md"
                fullWidth
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
              >
                {isDeleting ? 'DELETING...' : 'YES, DELETE'}
              </Y2KButton>
              <Y2KButton
                variant="cream"
                size="md"
                fullWidth
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
              >
                CANCEL
              </Y2KButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
