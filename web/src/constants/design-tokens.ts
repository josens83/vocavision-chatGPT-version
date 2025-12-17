// /web/src/constants/design-tokens.ts
// VocaVision 디자인 시스템 토큰

/**
 * 컬러 팔레트
 */
export const COLORS = {
  // Primary - Brand Color
  brand: {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    accent: '#F59E0B',
  },

  // Level Colors
  level: {
    L1: { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' }, // Green
    L2: { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' }, // Blue
    L3: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' }, // Purple
  },

  // Study Mode Colors
  study: {
    flashcard: { bg: '#FEF3C7', text: '#92400E', accent: '#F59E0B' },
    quiz: { bg: '#FEE2E2', text: '#991B1B', accent: '#EF4444' },
    review: { bg: '#DBEAFE', text: '#1E40AF', accent: '#3B82F6' },
    vocabulary: { bg: '#E0E7FF', text: '#3730A3', accent: '#6366F1' },
  },

  // Semantic Colors
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Neutral - Slate
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const;

/**
 * 간격 (Spacing)
 */
export const SPACING = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
} as const;

/**
 * 보더 라디우스
 */
export const RADIUS = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

/**
 * 타이포그래피
 */
export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'var(--font-pretendard), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'var(--font-pretendard), -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * 애니메이션
 */
export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

/**
 * 그림자
 */
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: {
    green: '0 0 20px rgba(34, 197, 94, 0.3)',
    blue: '0 0 20px rgba(59, 130, 246, 0.3)',
    purple: '0 0 20px rgba(139, 92, 246, 0.3)',
    orange: '0 0 20px rgba(249, 115, 22, 0.3)',
  },
} as const;

/**
 * 브레이크포인트
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Z-Index 레이어
 */
export const Z_INDEX = {
  dropdown: 50,
  sticky: 100,
  modal: 200,
  popover: 300,
  tooltip: 400,
  toast: 500,
} as const;

// 타입 export
export type LevelType = 'L1' | 'L2' | 'L3';
export type StudyModeType = 'flashcard' | 'quiz' | 'review' | 'vocabulary';
