'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { wordsAPI } from '@/lib/api';

interface Word {
  id: string;
  word: string;
  definition: string;
  pronunciation?: string;
  difficulty: string;
  partOfSpeech: string;
}

export default function WordsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    loadWords();
  }, [user, page, difficulty]);

  const loadWords = async () => {
    setLoading(true);
    try {
      const data = await wordsAPI.getWords({
        page,
        limit: 20,
        difficulty: difficulty || undefined,
        search: search || undefined,
      });
      setWords(data.words);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadWords();
  };

  const difficultyColors = {
    BEGINNER: 'bg-green-100 text-green-700',
    INTERMEDIATE: 'bg-blue-100 text-blue-700',
    ADVANCED: 'bg-orange-100 text-orange-700',
    EXPERT: 'bg-red-100 text-red-700',
  };

  const difficultyLabels = {
    BEGINNER: '초급',
    INTERMEDIATE: '중급',
    ADVANCED: '고급',
    EXPERT: '전문가',
  };

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
              <Link href="/words" className="text-blue-600 font-semibold">
                단어 탐색
              </Link>
              <Link href="/statistics" className="text-gray-600 hover:text-gray-900">
                통계
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">단어 탐색</h2>
          <p className="text-gray-600">학습하고 싶은 단어를 찾아보세요</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="단어 검색..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                검색
              </button>
            </div>
          </form>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setDifficulty('');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficulty === ''
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => {
                setDifficulty('BEGINNER');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficulty === 'BEGINNER'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              초급
            </button>
            <button
              onClick={() => {
                setDifficulty('INTERMEDIATE');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficulty === 'INTERMEDIATE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              중급
            </button>
            <button
              onClick={() => {
                setDifficulty('ADVANCED');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficulty === 'ADVANCED'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              고급
            </button>
            <button
              onClick={() => {
                setDifficulty('EXPERT');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficulty === 'EXPERT'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              전문가
            </button>
          </div>
        </div>

        {/* Words Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">로딩 중...</div>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl text-gray-600 mb-2">검색 결과가 없습니다</div>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {words.map((word) => (
                <WordCard key={word.id} word={word} difficultyColors={difficultyColors} difficultyLabels={difficultyLabels} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                <div className="flex items-center px-4 py-2">
                  {page} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function WordCard({
  word,
  difficultyColors,
  difficultyLabels,
}: {
  word: Word;
  difficultyColors: any;
  difficultyLabels: any;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{word.word}</h3>
          {word.pronunciation && (
            <p className="text-sm text-gray-500">{word.pronunciation}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            difficultyColors[word.difficulty]
          }`}
        >
          {difficultyLabels[word.difficulty]}
        </span>
      </div>
      <p className="text-gray-700 mb-3">{word.definition}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{word.partOfSpeech}</span>
        <Link
          href={`/words/${word.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          자세히 보기 →
        </Link>
      </div>
    </div>
  );
}
