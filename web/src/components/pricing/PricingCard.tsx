"use client";

import { ReactNode } from "react";

// ============================================
// Billing Toggle Component
// ============================================

export type BillingPeriod = "monthly" | "yearly";

interface BillingToggleProps {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  savingsPercent?: number;
}

export function BillingToggle({ value, onChange, savingsPercent = 58 }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center bg-gray-200 rounded-full p-1 gap-1">
      <button
        onClick={() => onChange("monthly")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          value === "monthly"
            ? "bg-white text-slate-800 shadow-sm"
            : "bg-transparent text-slate-600 hover:text-slate-800"
        }`}
      >
        Monthly <span className="hidden sm:inline">payments</span>
      </button>
      <button
        onClick={() => onChange("yearly")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          value === "yearly"
            ? "bg-white text-slate-800 shadow-sm"
            : "bg-transparent text-slate-600 hover:text-slate-800"
        }`}
      >
        Yearly <span className="hidden sm:inline">payment</span>
        {savingsPercent > 0 && (
          <span className="px-2 py-0.5 bg-slate-700 text-white text-xs font-bold rounded-full">
            Save {savingsPercent}%
          </span>
        )}
      </button>
    </div>
  );
}

// ============================================
// Feature List Item
// ============================================

interface FeatureItemProps {
  children: ReactNode;
}

function FeatureItem({ children }: FeatureItemProps) {
  return (
    <li className="flex items-center gap-3 text-slate-500">
      <span className="w-5 h-5 flex-shrink-0">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

// ============================================
// Pricing Card Component
// ============================================

export type PlanType = "free" | "pro";

interface PricingCardProps {
  type: PlanType;
  price: string;
  priceLabel: string;
  description: string;
  features: string[];
  featuresTitle?: string;
  buttonLabel: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  highlighted?: boolean;
}

export function PricingCard({
  type,
  price,
  priceLabel,
  description,
  features,
  featuresTitle = "Features",
  buttonLabel,
  buttonHref,
  onButtonClick,
  highlighted = false,
}: PricingCardProps) {
  const isProPlan = type === "pro";

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonHref) {
      window.open(buttonHref, "_blank");
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-8 flex flex-col ${highlighted ? "ring-2 ring-green-500 shadow-lg" : "shadow-md"}`}>
      {/* Plan Name */}
      <h2 className="text-2xl font-bold text-slate-500 mb-4">
        {type === "free" ? "Free" : "Pro"}
      </h2>

      {/* Price */}
      <div className="flex items-end gap-1 mb-4">
        <span className="text-4xl font-bold text-slate-900">{price}</span>
        <span className="text-base text-slate-500 mb-1">{priceLabel}</span>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleClick}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 mb-6 ${
          isProPlan
            ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
            : "bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
        }`}
      >
        {buttonLabel}
      </button>

      {/* Features */}
      <div className="flex-1">
        <p className="font-bold text-slate-800 mb-4">{featuresTitle}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <FeatureItem key={index}>{feature}</FeatureItem>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================
// Pricing Cards Container
// ============================================

interface PricingCardsProps {
  children: ReactNode;
}

export function PricingCards({ children }: PricingCardsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto">
      {children}
    </div>
  );
}

// ============================================
// Default Plan Data for VocaVision
// ============================================

export const vocaVisionPlans = {
  free: {
    type: "free" as const,
    price: "₩0",
    priceLabel: "/영원히",
    description: "모든 기본 학습 기능을 무료로 이용하세요. 가입 없이 바로 학습을 시작할 수 있습니다.",
    features: [
      "기초 플래시카드",
      "기본 퀴즈",
      "단어장 열람",
      "일일 학습 5개",
      "기본 통계",
    ],
    featuresTitle: "기본 기능",
    buttonLabel: "무료로 시작",
    buttonHref: "/study",
  },
  pro: {
    monthly: {
      type: "pro" as const,
      price: "₩4,900",
      priceLabel: "/월",
      description: "모든 Pro 기능을 월 ₩4,900에 이용하세요. 언제든지 취소 가능합니다.",
      features: [
        "광고 없음",
        "무제한 학습",
        "고급 통계 & 분석",
        "PDF 다운로드",
        "진도 추적",
        "스킬별 레벨 측정",
        "리더보드",
        "우선 지원",
      ],
      featuresTitle: "Free 포함, 추가:",
      buttonLabel: "Pro 시작하기",
      buttonHref: "/register/pro-month",
    },
    yearly: {
      type: "pro" as const,
      price: "₩2,900",
      priceLabel: "/월",
      description: "연간 결제 시 ₩34,800 (월 ₩2,900)으로 41% 할인! 12개월 동안 모든 Pro 기능을 이용하세요.",
      features: [
        "광고 없음",
        "무제한 학습",
        "고급 통계 & 분석",
        "PDF 다운로드",
        "진도 추적",
        "스킬별 레벨 측정",
        "리더보드",
        "우선 지원",
      ],
      featuresTitle: "Free 포함, 추가:",
      buttonLabel: "Pro 시작하기",
      buttonHref: "/register/pro-year",
    },
  },
};
