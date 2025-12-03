'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FillQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam = searchParams.get('exam');

  useEffect(() => {
    // Redirect to main quiz page with type=fill
    const params = new URLSearchParams();
    params.set('type', 'fill');
    if (exam) params.set('exam', exam);
    router.replace(`/quiz?${params.toString()}`);
  }, [router, exam]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">빈칸 채우기 퀴즈 페이지로 이동 중...</div>
    </div>
  );
}

export default function FillQuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">로딩 중...</div></div>}>
      <FillQuizContent />
    </Suspense>
  );
}
