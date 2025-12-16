"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface StickyActionBarProps {
  /** 진행률 (0-100) */
  progress?: number;
  /** 진행률 라벨 (예: "12/20 완료") */
  progressLabel?: string;
  /** 메인 CTA 텍스트 */
  primaryText: string;
  /** 메인 CTA 클릭 핸들러 */
  onPrimaryClick?: () => void;
  /** 메인 CTA 링크 (onPrimaryClick 대신 사용) */
  primaryHref?: string;
  /** 보조 CTA 텍스트 */
  secondaryText?: string;
  /** 보조 CTA 클릭 핸들러 */
  onSecondaryClick?: () => void;
  /** 보조 CTA 링크 */
  secondaryHref?: string;
  /** 메인 버튼 비활성화 */
  primaryDisabled?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 정보 (가격, 할인 등) */
  extraInfo?: ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 색상 변형 */
  variant?: "default" | "success" | "warning" | "premium";
}

const variantStyles = {
  default: {
    bar: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
    primary: "bg-brand-primary hover:bg-brand-primary/90 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200",
    progress: "bg-brand-primary",
  },
  success: {
    bar: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondary: "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-200",
    progress: "bg-emerald-500",
  },
  warning: {
    bar: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    primary: "bg-amber-600 hover:bg-amber-700 text-white",
    secondary: "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-200",
    progress: "bg-amber-500",
  },
  premium: {
    bar: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800",
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
    secondary: "bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300",
    progress: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
};

export function StickyActionBar({
  progress,
  progressLabel,
  primaryText,
  onPrimaryClick,
  primaryHref,
  secondaryText,
  onSecondaryClick,
  secondaryHref,
  primaryDisabled = false,
  loading = false,
  extraInfo,
  className = "",
  variant = "default",
}: StickyActionBarProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        border-t shadow-lg backdrop-blur-sm
        ${styles.bar}
        safe-area-bottom
        ${className}
      `}
    >
      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="h-1 bg-slate-200 dark:bg-slate-700">
          <div
            className={`h-full transition-all duration-500 ${styles.progress}`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-3">
        {/* Progress Label / Extra Info */}
        <div className="flex-1 min-w-0">
          {progressLabel && (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
              {progressLabel}
            </p>
          )}
          {extraInfo && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {extraInfo}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Secondary Button */}
          {secondaryText && (
            secondaryHref ? (
              <Link
                href={secondaryHref}
                onClick={onSecondaryClick}
                className={`
                  px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-colors
                  ${styles.secondary}
                `}
              >
                {secondaryText}
              </Link>
            ) : (
              <button
                onClick={onSecondaryClick}
                className={`
                  px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-colors
                  ${styles.secondary}
                `}
              >
                {secondaryText}
              </button>
            )
          )}

          {/* Primary Button */}
          {primaryHref && !primaryDisabled && !loading ? (
            <Link
              href={primaryHref}
              onClick={onPrimaryClick}
              className={`
                px-6 py-2.5 rounded-xl font-semibold text-sm
                transition-all
                ${styles.primary}
                hover:-translate-y-0.5 hover:shadow-md
                flex items-center gap-2
              `}
            >
              {primaryText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={onPrimaryClick}
              disabled={primaryDisabled || loading}
              className={`
                px-6 py-2.5 rounded-xl font-semibold text-sm
                transition-all
                ${styles.primary}
                ${primaryDisabled || loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow-md"}
                flex items-center gap-2
              `}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {primaryText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 학습 진행 스티키 바 (단축 컴포넌트)
 */
interface LearningProgressBarProps {
  current: number;
  total: number;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  skipLabel?: string;
  variant?: "default" | "success" | "warning";
}

export function LearningProgressBar({
  current,
  total,
  onNext,
  onSkip,
  nextLabel = "다음 단어",
  skipLabel = "건너뛰기",
  variant = "default",
}: LearningProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const progressLabel = `${current}/${total} 완료`;

  return (
    <StickyActionBar
      progress={progress}
      progressLabel={progressLabel}
      primaryText={nextLabel}
      onPrimaryClick={onNext}
      secondaryText={onSkip ? skipLabel : undefined}
      onSecondaryClick={onSkip}
      variant={variant}
    />
  );
}

/**
 * 결제 스티키 바 (단축 컴포넌트)
 */
interface CheckoutBarProps {
  originalPrice?: number;
  discountedPrice: number;
  discountPercent?: number;
  onCheckout: () => void;
  checkoutLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function CheckoutBar({
  originalPrice,
  discountedPrice,
  discountPercent,
  onCheckout,
  checkoutLabel = "결제하기",
  disabled = false,
  loading = false,
}: CheckoutBarProps) {
  const formatPrice = (price: number) => price.toLocaleString() + "원";

  return (
    <StickyActionBar
      primaryText={checkoutLabel}
      onPrimaryClick={onCheckout}
      primaryDisabled={disabled}
      loading={loading}
      variant="premium"
      extraInfo={
        <div className="flex items-center gap-2">
          {discountPercent && discountPercent > 0 && (
            <span className="text-red-500 font-bold text-sm">{discountPercent}%</span>
          )}
          {originalPrice && originalPrice !== discountedPrice && (
            <span className="text-slate-400 line-through text-xs">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-slate-900 dark:text-white font-bold">
            {formatPrice(discountedPrice)}
          </span>
        </div>
      }
    />
  );
}

export default StickyActionBar;
