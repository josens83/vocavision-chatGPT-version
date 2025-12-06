/**
 * Quiz Page
 * 다양한 퀴즈 모드로 단어 학습
 * FastCampus/Skillflo 스타일 적용
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { mockWords, getRandomWords } from '@/lib/mock/data';

// Quiz Mode Types
type QuizMode = 'multiple-choice' | 'reverse' | 'time-attack' | 'spelling';
type QuizState = 'mode-select' | 'playing' | 'result';

interface QuizQuestion {
  word: typeof mockWords[0];
  options: string[];
  correctIndex: number;
}

interface QuizModeOption {
  id: QuizMode;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const quizModes: QuizModeOption[] = [
  {
    id: 'multiple-choice',
    title: '4지선다',
    description: '영단어를 보고 알맞은 뜻을 고르세요',
    icon: '📝',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'reverse',
    title: '역방향',
    description: '뜻을 보고 알맞은 영단어를 고르세요',
    icon: '🔄',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'time-attack',
    title: '타임어택',
    description: '제한 시간 내에 빠르게 풀어보세요',
    icon: '⏱️',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'spelling',
    title: '스펠링',
    description: '뜻을 보고 영단어를 입력하세요',
    icon: '✏️',
    color: 'from-green-500 to-emerald-500',
  },
];

// Generate quiz questions
function generateQuestions(mode: QuizMode, count = 10): QuizQuestion[] {
  const words = getRandomWords(Math.min(count, mockWords.length));

  return words.map(word => {
    const otherWords = mockWords.filter(w => w.id !== word.id);
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);

    // For reverse mode, use words as options; otherwise use definitions
    const isReverse = mode === 'reverse';
    const correctAnswer = isReverse ? word.word : word.definitionKo;
    const wrongAnswers = shuffledOthers.map(w => isReverse ? w.word : w.definitionKo);

    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.indexOf(correctAnswer);

    return {
      word,
      options: allOptions,
      correctIndex,
    };
  });
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('mode-select');
  const [selectedMode, setSelectedMode] = useState<QuizMode>('multiple-choice');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [answers, setAnswers] = useState<boolean[]>([]);

  // Timer for time-attack mode
  useEffect(() => {
    if (quizState !== 'playing' || selectedMode !== 'time-attack' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, selectedMode, timeLeft]);

  const handleTimeUp = useCallback(() => {
    setShowResult(true);
    setTimeout(() => {
      moveToNext(false);
    }, 1500);
  }, []);

  const startQuiz = (mode: QuizMode) => {
    setSelectedMode(mode);
    const newQuestions = generateQuestions(mode);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setSpellingInput('');
    setTimeLeft(mode === 'time-attack' ? 10 : 0);
    setQuizState('playing');
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null && selectedMode !== 'spelling') return;

    let isCorrect = false;

    if (selectedMode === 'spelling') {
      isCorrect = spellingInput.toLowerCase().trim() === questions[currentIndex].word.word.toLowerCase();
    } else {
      isCorrect = selectedAnswer === questions[currentIndex].correctIndex;
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, isCorrect]);
    setShowResult(true);

    setTimeout(() => {
      moveToNext(isCorrect);
    }, 1500);
  };

  const moveToNext = (wasCorrect: boolean) => {
    if (currentIndex >= questions.length - 1) {
      setQuizState('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSpellingInput('');
      if (selectedMode === 'time-attack') {
        setTimeLeft(10);
      }
    }
  };

  const resetQuiz = () => {
    setQuizState('mode-select');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setSpellingInput('');
    setTimeLeft(0);
  };

  // Mode Selection Screen
  if (quizState === 'mode-select') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">퀴즈</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              🎯
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 모드 선택</h2>
            <p className="text-gray-600">원하는 학습 방식을 선택하세요</p>
          </div>

          {/* Mode Cards */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {quizModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startQuiz(mode.id)}
                className="text-left"
              >
                <div className={`bg-gradient-to-br ${mode.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
                  <div className="text-4xl mb-3">{mode.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                  <p className="text-white/80 text-sm">{mode.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> 오늘의 학습 현황
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-pink-500">0</div>
                <div className="text-sm text-gray-500">완료한 퀴즈</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-500">0%</div>
                <div className="text-sm text-gray-500">정답률</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">0</div>
                <div className="text-sm text-gray-500">연속 정답</div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Quiz Playing Screen
  if (quizState === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentIndex];
    const isReverse = selectedMode === 'reverse';
    const isSpelling = selectedMode === 'spelling';
    const isTimeAttack = selectedMode === 'time-attack';

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Progress */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={resetQuiz}
                className="text-gray-600 hover:text-pink-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-600">
                {currentIndex + 1} / {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pink-500">
                  점수: {score}
                </span>
                {isTimeAttack && (
                  <span className={`text-sm font-bold px-2 py-1 rounded ${timeLeft <= 3 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
                    {timeLeft}s
                  </span>
                )}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
            >
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  {isReverse || isSpelling ? '뜻' : '영단어'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {isReverse || isSpelling
                    ? currentQuestion.word.definitionKo
                    : currentQuestion.word.word}
                </h2>
                {!isReverse && !isSpelling && (
                  <p className="text-gray-500 mt-2">{currentQuestion.word.pronunciation}</p>
                )}
              </div>

              {/* Spelling Input */}
              {isSpelling ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    disabled={showResult}
                    placeholder="영단어를 입력하세요"
                    className={`w-full px-4 py-3 text-lg border-2 rounded-xl text-center focus:outline-none transition ${
                      showResult
                        ? spellingInput.toLowerCase().trim() === currentQuestion.word.word.toLowerCase()
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-pink-500'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && spellingInput.trim()) {
                        handleSubmit();
                      }
                    }}
                  />
                  {showResult && spellingInput.toLowerCase().trim() !== currentQuestion.word.word.toLowerCase() && (
                    <p className="text-center text-red-600">
                      정답: <span className="font-bold">{currentQuestion.word.word}</span>
                    </p>
                  )}
                </div>
              ) : (
                /* Multiple Choice Options */
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrectOption = index === currentQuestion.correctIndex;
                    const isSelectedOption = index === selectedAnswer;

                    let optionClass = 'border-gray-200 hover:border-pink-300 hover:bg-pink-50';

                    if (showResult) {
                      if (isCorrectOption) {
                        optionClass = 'border-green-500 bg-green-50';
                      } else if (isSelectedOption && !isCorrectOption) {
                        optionClass = 'border-red-500 bg-red-50';
                      } else {
                        optionClass = 'border-gray-200 opacity-50';
                      }
                    } else if (isSelectedOption) {
                      optionClass = 'border-pink-500 bg-pink-50';
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                        onClick={() => handleSelectAnswer(index)}
                        disabled={showResult}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${optionClass}`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          showResult && isCorrectOption
                            ? 'bg-green-500 text-white'
                            : showResult && isSelectedOption && !isCorrectOption
                              ? 'bg-red-500 text-white'
                              : isSelectedOption
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`text-left flex-1 ${
                          showResult && isCorrectOption
                            ? 'text-green-700 font-medium'
                            : showResult && isSelectedOption && !isCorrectOption
                              ? 'text-red-700'
                              : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                        {showResult && isCorrectOption && (
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {showResult && isSelectedOption && !isCorrectOption && (
                          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          {!showResult && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSubmit}
              disabled={(selectedAnswer === null && !isSpelling) || (isSpelling && !spellingInput.trim())}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-pink-500/25 disabled:shadow-none"
            >
              정답 확인
            </motion.button>
          )}
        </main>
      </div>
    );
  }

  // Result Screen
  if (quizState === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = percentage === 100;
    const isGood = percentage >= 80;
    const isOkay = percentage >= 60;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">퀴즈 결과</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Result Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-7xl mb-4"
            >
              {isPerfect ? '🏆' : isGood ? '🎉' : isOkay ? '👍' : '💪'}
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isPerfect ? '완벽해요!' : isGood ? '잘했어요!' : isOkay ? '좋아요!' : '다시 도전해보세요!'}
            </h2>

            <p className="text-gray-600 mb-6">
              {questions.length}문제 중 {score}문제 정답
            </p>

            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={isPerfect || isGood ? '#EC4899' : isOkay ? '#3B82F6' : '#6B7280'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0, 440' }}
                  animate={{ strokeDasharray: `${percentage * 4.4}, 440` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>

            {/* Answer Summary */}
            <div className="flex justify-center gap-2 mb-6">
              {answers.map((correct, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${correct ? 'bg-green-500' : 'bg-red-500'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Wrong Answers Review */}
          {answers.some(a => !a) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📚</span> 틀린 단어 복습
              </h3>
              <div className="space-y-3">
                {questions
                  .filter((_, index) => !answers[index])
                  .map((q, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-bold text-gray-900">{q.word.word}</span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-gray-600">{q.word.definitionKo}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={resetQuiz}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition"
            >
              다른 모드
            </button>
            <button
              onClick={() => startQuiz(selectedMode)}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-pink-500/25"
            >
              다시 도전
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
