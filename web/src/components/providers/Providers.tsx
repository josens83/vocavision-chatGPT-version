/**
 * Client-side Providers Wrapper
 * Toast, Confirm Modal, Auth Required Modal 등 클라이언트 Provider들을 래핑
 */

'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from '@/components/ui/ConfirmModal';
import { AuthRequiredProvider } from '@/components/ui/AuthRequiredModal';
import { ComingSoonProvider } from '@/components/ui/ComingSoonModal';

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <ConfirmProvider>
          <AuthRequiredProvider>
            <ComingSoonProvider>
              {children}
            </ComingSoonProvider>
          </AuthRequiredProvider>
        </ConfirmProvider>
      </ToastProvider>
    </NextThemesProvider>
  );
}
