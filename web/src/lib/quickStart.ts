'use client';

export type QuickStartMode = 'vocabulary' | 'test' | 'flashcards';

export const QUICK_START_STORAGE_KEY = 'vv-quick-start-mode';
export const QUICK_START_TRIGGER_KEY = 'vv-trigger-quick-start';
export const QUICK_START_DISMISS_KEY = 'vv-quick-start-dismissed';
export const QUICK_START_ROUTED_KEY = 'vv-quick-start-routed';

export const QUICK_START_DESTINATIONS: Record<QuickStartMode, { href: string; title: string; description: string; helper: string; emoji: string }> = {
  vocabulary: {
    href: '/vocabulary',
    title: '단어장으로 시작',
    description: '분야별 단어장을 훑어보며 오늘 외울 목록을 고릅니다.',
    helper: '추천 레벨 · 시험 태그로 바로 필터링',
    emoji: '📚',
  },
  test: {
    href: '/exam',
    title: '테스트로 점검',
    description: '실전형 테스트로 현재 어휘력을 빠르게 체크합니다.',
    helper: '오답노트와 연동해 다음 학습 목표 제안',
    emoji: '🧠',
  },
  flashcards: {
    href: '/learn',
    title: '단어 암기 카드',
    description: 'AI 플래시카드로 연상 이미지와 함께 바로 암기합니다.',
    helper: '스와이프/키보드 제스처 지원',
    emoji: '⚡️',
  },
};

export const isQuickStartEnabled = () => process.env.NEXT_PUBLIC_QUICK_START_ENABLED !== 'false';

export const getStoredQuickStartMode = (): QuickStartMode | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(QUICK_START_STORAGE_KEY) as QuickStartMode | null;
  if (!stored) return null;
  if (Object.keys(QUICK_START_DESTINATIONS).includes(stored)) {
    return stored as QuickStartMode;
  }
  return null;
};

export const persistQuickStartMode = (mode: QuickStartMode) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUICK_START_STORAGE_KEY, mode);
  sessionStorage.removeItem(QUICK_START_TRIGGER_KEY);
  sessionStorage.removeItem(QUICK_START_DISMISS_KEY);
  sessionStorage.removeItem(QUICK_START_ROUTED_KEY);
};

export const clearQuickStartMode = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUICK_START_STORAGE_KEY);
};

export const markQuickStartRouted = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(QUICK_START_ROUTED_KEY, 'true');
};

export const hasQuickStartRouted = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(QUICK_START_ROUTED_KEY) === 'true';
};

export const queueQuickStartPrompt = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(QUICK_START_DISMISS_KEY);
  sessionStorage.setItem(QUICK_START_TRIGGER_KEY, 'true');
};

export const consumeQuickStartPrompt = () => {
  if (typeof window === 'undefined') return false;
  const shouldPrompt = sessionStorage.getItem(QUICK_START_TRIGGER_KEY) === 'true';
  if (shouldPrompt) {
    sessionStorage.removeItem(QUICK_START_TRIGGER_KEY);
  }
  return shouldPrompt;
};

export const hasDismissedQuickStart = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(QUICK_START_DISMISS_KEY) === 'true';
};

export const dismissQuickStart = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(QUICK_START_DISMISS_KEY, 'true');
};
