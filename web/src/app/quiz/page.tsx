/**
 * Quiz Page
 * 다양한 퀴즈 모드로 단어 학습
 */

'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  QuizModeSelector,
  MultipleChoiceQuiz,
  QuizResultCard,
  type QuizMode,
  type QuizResultData,
} from '@/components/quiz';

type QuizStep = 'mode-select' | 'quiz' | 'result';

function QuizPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const exam = searchParams.get('exam') || 'CSAT';
  const level = searchParams.get('level') || 'L1';
  const modeParam = searchParams.get('mode') as QuizMode | null;

  const [step, setStep] = useState<QuizStep>(modeParam ? 'quiz' : 'mode-select');
  const [mode, setMode] = useState<QuizMode>(modeParam || 'eng-to-kor');
  const [result, setResult] = useState<QuizResultData | null>(null);

  const handleModeSelect = (selectedMode: QuizMode) => {
    if (selectedMode === 'flashcard') {
      // 플래시카드는 기존 learn 페이지로
      router.push(`/learn?exam=${exam}&level=${level}`);
      return;
    }

    if (selectedMode === 'spelling') {
      // 스펠링 모드는 아직 미구현
      return;
    }

    setMode(selectedMode);
    setStep('quiz');
  };

  const handleQuizComplete = (quizResult: QuizResultData) => {
    setResult(quizResult);
    setStep('result');
  };

  const handleRetry = () => {
    setResult(null);
    setStep('quiz');
  };

  const handleChangeMode = () => {
    setResult(null);
    setStep('mode-select');
  };

  const handleBack = () => {
    if (step === 'quiz') {
      setStep('mode-select');
    } else {
      router.push('/dashboard');
    }
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'mode-select' && (
        <QuizModeSelector
          exam={exam}
          level={level}
          onSelect={handleModeSelect}
          onBack={handleHome}
        />
      )}

      {step === 'quiz' && (mode === 'eng-to-kor' || mode === 'kor-to-eng') && (
        <MultipleChoiceQuiz
          exam={exam}
          level={level}
          mode={mode}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {step === 'result' && result && (
        <QuizResultCard
          result={result}
          mode={mode}
          onRetry={handleRetry}
          onChangeMode={handleChangeMode}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
