'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /stats to /statistics
export default function StatsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/statistics');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">통계 페이지로 이동 중...</div>
    </div>
  );
}
