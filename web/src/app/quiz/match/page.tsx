'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function MatchQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam = searchParams.get('exam');

  useEffect(() => {
    // Redirect to games/match (matching game)
    const params = new URLSearchParams();
    if (exam) params.set('exam', exam);
    router.replace(`/games/match?${params.toString()}`);
  }, [router, exam]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">매칭 게임 페이지로 이동 중...</div>
    </div>
  );
}

export default function MatchQuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">로딩 중...</div></div>}>
      <MatchQuizContent />
    </Suspense>
  );
}
