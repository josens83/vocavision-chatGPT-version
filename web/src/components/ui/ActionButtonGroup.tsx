"use client";

import { ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "premium";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonConfig {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

interface ActionButtonGroupProps {
  /** Primary (main) action */
  primary: ButtonConfig;
  /** Secondary (auxiliary) action */
  secondary?: ButtonConfig;
  /** Button size */
  size?: ButtonSize;
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Full width buttons */
  fullWidth?: boolean;
  /** Additional class */
  className?: string;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const variantStyles: Record<ButtonVariant, { base: string; hover: string; disabled: string }> = {
  primary: {
    base: "bg-brand-primary text-white font-semibold shadow-sm",
    hover: "hover:bg-brand-primary/90 hover:shadow-md hover:-translate-y-0.5",
    disabled: "bg-slate-300 text-slate-500 cursor-not-allowed",
  },
  secondary: {
    base: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700",
    hover: "hover:bg-slate-200 dark:hover:bg-slate-700",
    disabled: "bg-slate-100 text-slate-400 cursor-not-allowed",
  },
  ghost: {
    base: "bg-transparent text-slate-600 dark:text-slate-300 font-medium",
    hover: "hover:bg-slate-100 dark:hover:bg-slate-800",
    disabled: "text-slate-300 cursor-not-allowed",
  },
  danger: {
    base: "bg-red-600 text-white font-semibold shadow-sm",
    hover: "hover:bg-red-700 hover:shadow-md",
    disabled: "bg-red-300 text-white cursor-not-allowed",
  },
  success: {
    base: "bg-emerald-600 text-white font-semibold shadow-sm",
    hover: "hover:bg-emerald-700 hover:shadow-md",
    disabled: "bg-emerald-300 text-white cursor-not-allowed",
  },
  premium: {
    base: "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-sm",
    hover: "hover:from-purple-700 hover:to-pink-700 hover:shadow-md hover:-translate-y-0.5",
    disabled: "bg-gradient-to-r from-purple-300 to-pink-300 text-white cursor-not-allowed",
  },
};

function ActionButton({
  config,
  size,
  fullWidth,
}: {
  config: ButtonConfig;
  size: ButtonSize;
  fullWidth: boolean;
}) {
  const {
    label,
    onClick,
    href,
    variant = "primary",
    icon,
    iconPosition = "right",
    disabled = false,
    loading = false,
    className = "",
  } = config;

  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  const buttonContent = (
    <>
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
      {!loading && icon && iconPosition === "left" && icon}
      <span>{label}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </>
  );

  const buttonClassName = `
    inline-flex items-center justify-center rounded-xl
    transition-all duration-200
    ${sizeStyles[size]}
    ${isDisabled ? styles.disabled : `${styles.base} ${styles.hover}`}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  if (href && !isDisabled) {
    return (
      <Link href={href} className={buttonClassName}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={buttonClassName}
    >
      {buttonContent}
    </button>
  );
}

export function ActionButtonGroup({
  primary,
  secondary,
  size = "md",
  direction = "horizontal",
  fullWidth = false,
  className = "",
}: ActionButtonGroupProps) {
  const containerClass = direction === "vertical"
    ? "flex flex-col gap-3"
    : "flex items-center gap-3";

  return (
    <div className={`${containerClass} ${className}`}>
      <ActionButton
        config={{ ...primary, variant: primary.variant || "primary" }}
        size={size}
        fullWidth={fullWidth}
      />
      {secondary && (
        <ActionButton
          config={{ ...secondary, variant: secondary.variant || "secondary" }}
          size={size}
          fullWidth={fullWidth}
        />
      )}
    </div>
  );
}

/**
 * 학습 시작 CTA (단축 컴포넌트)
 * Fast Campus 패턴: "수강권 선택하기" (Primary) + "인기 클립 미리보기" (Secondary)
 */
interface LearningCTAProps {
  onStartLearning: () => void;
  onPreview?: () => void;
  startLabel?: string;
  previewLabel?: string;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function LearningCTA({
  onStartLearning,
  onPreview,
  startLabel = "학습 시작하기",
  previewLabel = "미리보기",
  size = "lg",
  fullWidth = false,
  className = "",
}: LearningCTAProps) {
  return (
    <ActionButtonGroup
      primary={{
        label: startLabel,
        onClick: onStartLearning,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      }}
      secondary={onPreview ? {
        label: previewLabel,
        onClick: onPreview,
        variant: "ghost",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
        iconPosition: "left",
      } : undefined}
      size={size}
      fullWidth={fullWidth}
      className={className}
    />
  );
}

/**
 * 퀴즈 모드 선택 CTA (단축 컴포넌트)
 */
interface QuizModeCTAProps {
  onEngToKor: () => void;
  onKorToEng: () => void;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function QuizModeCTA({
  onEngToKor,
  onKorToEng,
  size = "md",
  fullWidth = true,
  className = "",
}: QuizModeCTAProps) {
  return (
    <ActionButtonGroup
      primary={{
        label: "영어 → 한글",
        onClick: onEngToKor,
        icon: (
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">EN→KO</span>
        ),
        iconPosition: "left",
      }}
      secondary={{
        label: "한글 → 영어",
        onClick: onKorToEng,
        variant: "secondary",
        icon: (
          <span className="text-xs bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded">KO→EN</span>
        ),
        iconPosition: "left",
      }}
      size={size}
      fullWidth={fullWidth}
      className={className}
    />
  );
}

export default ActionButtonGroup;
