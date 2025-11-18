'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { wordsAPI, progressAPI } from '@/lib/api';
import { motion } from 'framer-motion';

interface Word {
  id: string;
  word: string;
  definition: string;
  pronunciation?: string;
}

interface QuizQuestion {
  word: Word;
  correctAnswer: string;
  options: string[];
  type: 'definition' | 'word';
}

export default function QuizPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizType, setQuizType] = useState<'mixed' | 'definition' | 'word'>('mixed');
  const [difficulty, setDifficulty] = useState<string>('');
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, router]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const data = await wordsAPI.getRandomWords(10, difficulty || undefined);
      const allWords = data.words;

      const quizQuestions: QuizQuestion[] = allWords.map((word: Word) => {
        const questionType = quizType === 'mixed'
          ? Math.random() > 0.5 ? 'definition' : 'word'
          : quizType;

        // Generate wrong answers
        const wrongAnswers = allWords
          .filter((w: Word) => w.id !== word.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((w: Word) => questionType === 'definition' ? w.definition : w.word);

        const correctAnswer = questionType === 'definition' ? word.definition : word.word;
        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        return {
          word,
          correctAnswer,
          options,
          type: questionType as 'definition' | 'word',
        };
      });

      setQuestions(quizQuestions);
      setQuizStarted(true);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    const currentQuestion = questions[currentIndex];
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Auto advance after 1.5 seconds
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setShowResult(true);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
    setQuizStarted(false);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-bold text-purple-600">퀴즈 모드</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">퀴즈 설정</h2>
              <p className="text-gray-600">학습한 내용을 테스트해보세요</p>
            </div>

            <div className="space-y-6">
              {/* Quiz Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  퀴즈 유형
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setQuizType('mixed')}
                    className={`p-4 rounded-lg border-2 transition ${
                      quizType === 'mixed'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">혼합</div>
                    <div className="text-xs text-gray-600 mt-1">다양한 문제</div>
                  </button>
                  <button
                    onClick={() => setQuizType('definition')}
                    className={`p-4 rounded-lg border-2 transition ${
                      quizType === 'definition'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">뜻 찾기</div>
                    <div className="text-xs text-gray-600 mt-1">단어 → 뜻</div>
                  </button>
                  <button
                    onClick={() => setQuizType('word')}
                    className={`p-4 rounded-lg border-2 transition ${
                      quizType === 'word'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">단어 찾기</div>
                    <div className="text-xs text-gray-600 mt-1">뜻 → 단어</div>
                  </button>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  난이도 (선택사항)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => setDifficulty('')}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
                      difficulty === ''
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setDifficulty('BEGINNER')}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
                      difficulty === 'BEGINNER'
                        ? 'border-green-600 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    초급
                  </button>
                  <button
                    onClick={() => setDifficulty('INTERMEDIATE')}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
                      difficulty === 'INTERMEDIATE'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    중급
                  </button>
                  <button
                    onClick={() => setDifficulty('ADVANCED')}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
                      difficulty === 'ADVANCED'
                        ? 'border-orange-600 bg-orange-50 text-orange-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    고급
                  </button>
                  <button
                    onClick={() => setDifficulty('EXPERT')}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
                      difficulty === 'EXPERT'
                        ? 'border-red-600 bg-red-50 text-red-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    전문가
                  </button>
                </div>
              </div>

              <button
                onClick={startQuiz}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? '준비 중...' : '퀴즈 시작하기'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">퀴즈 준비 중...</div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">퀴즈 완료!</h2>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-purple-900 mb-2">{percentage}%</div>
            <div className="text-lg text-purple-700">
              {score} / {questions.length} 정답
            </div>
            <div className="text-3xl font-bold text-purple-900 mt-2">등급: {grade}</div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetQuiz}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              다시 풀기
            </button>
            <Link
              href="/dashboard"
              className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              대시보드로
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">
              문제 {currentIndex + 1} / {questions.length}
            </div>
            <div className="text-sm font-semibold text-purple-600">
              점수: {score} / {currentIndex + 1}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          {/* Question */}
          <div className="mb-8 text-center">
            <div className="text-sm text-purple-600 font-medium mb-3">
              {currentQuestion.type === 'definition' ? '다음 단어의 뜻은?' : '다음 뜻의 단어는?'}
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {currentQuestion.type === 'definition' ? currentQuestion.word.word : currentQuestion.word.definition}
            </div>
            {currentQuestion.type === 'definition' && currentQuestion.word.pronunciation && (
              <div className="text-xl text-gray-500 mt-2">{currentQuestion.word.pronunciation}</div>
            )}
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`p-4 rounded-xl border-2 text-left transition transform hover:scale-102 ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : showWrong
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  } disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option}</span>
                    {showCorrect && <span className="text-2xl">✓</span>}
                    {showWrong && <span className="text-2xl">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
