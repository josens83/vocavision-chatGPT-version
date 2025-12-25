'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  QuickStartMode,
  QUICK_START_DESTINATIONS,
  QUICK_START_TRIGGER_KEY,
  consumeQuickStartPrompt,
  dismissQuickStart,
  getStoredQuickStartMode,
  hasDismissedQuickStart,
  hasQuickStartRouted,
  isQuickStartEnabled,
  markQuickStartRouted,
  persistQuickStartMode,
  queueQuickStartPrompt,
} from '@/lib/quickStart';
import QuickStartModal from './QuickStartModal';

function useQuickStartEligibility() {
  const pathname = usePathname();

  const allowQuickStart = useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith('/auth')) return false;
    const landingPages = ['/', '/my', '/dashboard'];
    if (landingPages.includes(pathname)) return true;
    return false;
  }, [pathname]);

  return { pathname, allowQuickStart };
}

export default function QuickStartFlow() {
  const router = useRouter();
  const { user, _hasHydrated } = useAuthStore();
  const { pathname, allowQuickStart } = useQuickStartEligibility();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!_hasHydrated || !user || !isQuickStartEnabled()) return;
    if (!allowQuickStart || !pathname) return;

    const preferredMode = getStoredQuickStartMode();
    const alreadyRouted = hasQuickStartRouted();
    if (preferredMode && !alreadyRouted) {
      const destination = QUICK_START_DESTINATIONS[preferredMode];
      if (!pathname.startsWith(destination.href)) {
        markQuickStartRouted();
        router.replace(destination.href);
      }
      return;
    }

    if (hasDismissedQuickStart()) return;

    const shouldPrompt = consumeQuickStartPrompt();
    if (shouldPrompt) {
      setIsModalOpen(true);
      return;
    }

    // If the user never picked a mode, gently prompt once on eligible screens
    const hasTrigger = sessionStorage.getItem(QUICK_START_TRIGGER_KEY) === 'true';
    if (!hasTrigger) {
      queueQuickStartPrompt();
      setIsModalOpen(true);
    }
  }, [allowQuickStart, pathname, router, user, _hasHydrated]);

  const handleSelect = (mode: QuickStartMode) => {
    persistQuickStartMode(mode);
    markQuickStartRouted();
    router.replace(QUICK_START_DESTINATIONS[mode].href);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    dismissQuickStart();
    setIsModalOpen(false);
  };

  return <QuickStartModal isOpen={isModalOpen} onClose={handleClose} onSelect={handleSelect} />;
}
