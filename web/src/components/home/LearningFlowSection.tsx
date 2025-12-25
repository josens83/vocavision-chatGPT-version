"use client";

import Link from "next/link";
import { JSX } from "react";
import { landingLocales } from "@/constants/landingContent";

const stepIcons: Record<string, JSX.Element> = {
  learn: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  test: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  review: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  progress: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3H5v18h14V11h-8zm0 0h8l-8-8" />
    </svg>
  ),
};

export function LearningFlowSection() {
  const { learningFlow } = landingLocales.ko;

  return (
    <section className="py-14 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-brand-primary mb-2">학습 → 테스트 → 복습 → 성과 확인</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">AI가 짜주는 학습 여정</h2>
            <p className="text-slate-600 mt-2">단계별로 필요한 화면과 기능을 한 번에 살펴보세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningFlow.map((step, index) => (
            <div key={step.key} className="card p-5 h-full flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-semibold">
                  {stepIcons[step.key] || <span>{index + 1}</span>}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">STEP {index + 1}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                </div>
              </div>
              <p className="text-slate-600 flex-1 leading-relaxed">{step.description}</p>
              <Link href={step.cta.href} className="inline-flex items-center gap-2 text-brand-primary font-semibold">
                <span>{step.cta.label}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
