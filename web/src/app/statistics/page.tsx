'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { progressAPI, authAPI } from '@/lib/api';

interface Stats {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

interface Progress {
  id: string;
  masteryLevel: string;
  correctCount: number;
  incorrectCount: number;
  totalReviews: number;
  word: {
    word: string;
    definition: string;
    difficulty: string;
  };
}

export default function StatisticsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState<Stats | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    loadStatistics();
  }, [user, router]);

  const loadStatistics = async () => {
    try {
      const [profileData, progressData] = await Promise.all([
        authAPI.getProfile(),
        progressAPI.getUserProgress(),
      ]);

      setStats(progressData.stats);
      setProgress(progressData.progress || []);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const masteryLevels = {
    NEW: { label: '새로운', color: 'bg-gray-100 text-gray-700', count: 0 },
    LEARNING: { label: '학습 중', color: 'bg-blue-100 text-blue-700', count: 0 },
    FAMILIAR: { label: '익숙함', color: 'bg-green-100 text-green-700', count: 0 },
    MASTERED: { label: '마스터', color: 'bg-purple-100 text-purple-700', count: 0 },
  };

  // Count by mastery level
  progress.forEach((p) => {
    if (masteryLevels[p.masteryLevel as keyof typeof masteryLevels]) {
      masteryLevels[p.masteryLevel as keyof typeof masteryLevels].count++;
    }
  });

  const totalReviews = progress.reduce((sum, p) => sum + p.totalReviews, 0);
  const totalCorrect = progress.reduce((sum, p) => sum + p.correctCount, 0);
  const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">VocaVision</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                대시보드
              </Link>
              <Link href="/learn" className="text-gray-600 hover:text-gray-900">
                학습
              </Link>
              <Link href="/words" className="text-gray-600 hover:text-gray-900">
                단어 탐색
              </Link>
              <Link href="/statistics" className="text-blue-600 font-semibold">
                통계
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">학습 통계</h2>
          <p className="text-gray-600">나의 학습 진행 상황을 확인하세요</p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📚"
            title="마스터한 단어"
            value={stats?.totalWordsLearned || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon="🔥"
            title="현재 연속"
            value={stats?.currentStreak || 0}
            suffix="일"
            color="bg-orange-500"
          />
          <StatCard
            icon="🏆"
            title="최장 연속"
            value={stats?.longestStreak || 0}
            suffix="일"
            color="bg-purple-500"
          />
          <StatCard
            icon="📊"
            title="정확도"
            value={accuracy}
            suffix="%"
            color="bg-green-500"
          />
        </div>

        {/* Mastery Breakdown */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">숙련도별 단어 수</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(masteryLevels).map(([key, value]) => (
              <div key={key} className={`${value.color} rounded-lg p-4`}>
                <div className="text-2xl font-bold mb-1">{value.count}</div>
                <div className="text-sm font-medium">{value.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart (Placeholder) */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">학습 진행 그래프</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>그래프 기능은 곧 추가됩니다</p>
            </div>
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6">최근 학습 단어</h3>
          {progress.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 학습한 단어가 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {progress.slice(0, 10).map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-lg">{p.word.word}</h4>
                    <p className="text-sm text-gray-600">{p.word.definition}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        masteryLevels[p.masteryLevel as keyof typeof masteryLevels]?.color
                      }`}
                    >
                      {masteryLevels[p.masteryLevel as keyof typeof masteryLevels]?.label}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {p.correctCount}/{p.totalReviews} 정답
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  suffix = '',
  color,
}: {
  icon: string;
  title: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  return (
    <div className={`${color} text-white rounded-xl p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm opacity-90 mb-2">{title}</div>
      <div className="text-3xl font-bold">
        {value}
        {suffix && <span className="text-lg ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
