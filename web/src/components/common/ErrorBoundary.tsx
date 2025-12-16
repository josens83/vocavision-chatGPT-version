'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - React 에러 경계 컴포넌트
 *
 * 특징:
 * - 자식 컴포넌트의 에러를 포착
 * - 폴백 UI 표시
 * - 다시 시도 기능
 * - 에러 로깅 (확장 가능)
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 (Sentry, LogRocket 등과 연동 가능)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // TODO: 프로덕션에서는 에러 리포팅 서비스에 전송
    // if (process.env.NODE_ENV === 'production') {
    //   captureException(error, { extra: errorInfo });
    // }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            {/* 아이콘 */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* 제목 */}
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              문제가 발생했어요
            </h2>

            {/* 설명 */}
            <p className="text-slate-500 mb-6">
              페이지를 불러오는 중 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-brand-primary text-white rounded-xl font-medium
                  hover:bg-brand-primary/90 transition-colors
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                다시 시도
              </button>
              <Link
                href="/"
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-slate-100 text-slate-700 rounded-xl font-medium
                  hover:bg-slate-200 transition-colors
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                홈으로
              </Link>
            </div>

            {/* 개발 모드에서 에러 상세 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-600">
                  에러 상세 정보 (개발용)
                </summary>
                <pre className="mt-2 p-4 bg-slate-100 rounded-lg text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary - HOC로 에러 경계 감싸기
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
