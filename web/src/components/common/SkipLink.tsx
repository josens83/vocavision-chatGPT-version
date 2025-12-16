'use client';

/**
 * SkipLink - 접근성을 위한 본문 바로가기 링크
 *
 * 키보드 사용자가 반복적인 네비게이션을 건너뛰고
 * 바로 메인 콘텐츠로 이동할 수 있게 해줍니다.
 *
 * 사용법:
 * 1. layout.tsx에서 <body> 바로 아래에 <SkipLink /> 추가
 * 2. 메인 콘텐츠에 id="main-content" 추가
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4 focus:z-[100]
        focus:px-4 focus:py-2
        focus:bg-brand-primary focus:text-white
        focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
        focus:shadow-lg
        transition-all
      "
    >
      본문으로 건너뛰기
    </a>
  );
}

/**
 * FocusableContainer - 키보드 포커스 가능한 컨테이너
 *
 * 동적으로 로드되는 콘텐츠에 포커스를 맞출 때 사용
 */
interface FocusableContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** 마운트 시 자동 포커스 */
  autoFocus?: boolean;
}

export function FocusableContainer({
  children,
  id,
  className = '',
  autoFocus = false,
}: FocusableContainerProps) {
  return (
    <div
      id={id}
      className={`focus:outline-none ${className}`}
      tabIndex={-1}
      ref={(el) => {
        if (autoFocus && el) {
          el.focus();
        }
      }}
    >
      {children}
    </div>
  );
}

/**
 * VisuallyHidden - 시각적으로 숨기고 스크린 리더에만 보이는 텍스트
 *
 * 접근성을 위한 추가 설명 텍스트에 사용
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/**
 * LiveRegion - 스크린 리더 알림을 위한 라이브 영역
 *
 * 동적 콘텐츠 변경을 스크린 리더에 알릴 때 사용
 */
interface LiveRegionProps {
  message: string;
  /** politeness level */
  level?: 'polite' | 'assertive';
}

export function LiveRegion({ message, level = 'polite' }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
