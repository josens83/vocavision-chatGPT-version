'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /study to /learn
export default function StudyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/learn');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">학습 페이지로 이동 중...</div>
    </div>
  );
}
