'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Review {
  id: string;
  wordId: string;
  rating: number;
  learningMethod: string;
  reviewedAt: string;
  nextReviewDate: string;
  word: {
    word: string;
    definition: string;
    difficulty: string;
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    loadReviews();
  }, [user, router]);

  const loadReviews = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/progress/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Failed to load review history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const reviewDate = new Date(review.reviewedAt);
    const now = new Date();

    switch (filter) {
      case 'today':
        return reviewDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return reviewDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return reviewDate >= monthAgo;
      default:
        return true;
    }
  });

  const ratingLabels = {
    1: '다시',
    2: '어려움',
    3: '보통',
    4: '쉬움',
    5: '완벽',
  };

  const ratingColors = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-orange-100 text-orange-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-green-100 text-green-700',
    5: 'bg-blue-100 text-blue-700',
  };

  const methodLabels = {
    FLASHCARD: '플래시카드',
    IMAGE: '이미지',
    MNEMONIC: '연상법',
    ETYMOLOGY: '어원',
    QUIZ: '퀴즈',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← 대시보드
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">학습 기록</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">복습 기록</h2>
          <p className="text-gray-600">
            총 {filteredReviews.length}개의 복습 기록이 있습니다
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-6 font-medium transition ${
                filter === 'all'
                  ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`flex-1 py-3 px-6 font-medium transition ${
                filter === 'today'
                  ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`flex-1 py-3 px-6 font-medium transition ${
                filter === 'week'
                  ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              이번 주
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`flex-1 py-3 px-6 font-medium transition ${
                filter === 'month'
                  ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              이번 달
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">복습 기록이 없습니다</h3>
            <p className="text-gray-600 mb-6">
              단어를 학습하면 여기에 기록이 표시됩니다
            </p>
            <Link
              href="/learn"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              학습 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/words/${review.wordId}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                      >
                        {review.word.word}
                      </Link>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ratingColors[review.rating as keyof typeof ratingColors]
                        }`}
                      >
                        {ratingLabels[review.rating as keyof typeof ratingLabels]}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {methodLabels[review.learningMethod as keyof typeof methodLabels]}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{review.word.definition}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        복습: {new Date(review.reviewedAt).toLocaleString('ko-KR')}
                      </span>
                      <span>
                        다음 복습:{' '}
                        {new Date(review.nextReviewDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredReviews.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">기간 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(ratingLabels).map(([rating, label]) => {
                const count = filteredReviews.filter(
                  (r) => r.rating === parseInt(rating)
                ).length;
                return (
                  <div
                    key={rating}
                    className={`p-4 rounded-lg ${
                      ratingColors[rating as unknown as keyof typeof ratingColors]
                    }`}
                  >
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
