/**
 * VocaVision Admin Layout
 * 관리자 대시보드 레이아웃 (인증 체크 포함)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    if (!token) {
      // Redirect to login with return URL
      router.push('/auth/login?redirect=/admin');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {children}
    </div>
  );
}
