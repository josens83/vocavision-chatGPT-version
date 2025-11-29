"use client";

import { useState } from "react";
import {
  BillingToggle,
  BillingPeriod,
  PricingCard,
  PricingCards,
  vocaVisionPlans,
} from "./PricingCard";
import {
  TestimonialCard,
  TestimonialsGrid,
  vocaVisionTestimonials,
} from "./Testimonial";
import { FAQSection, vocaVisionFAQ } from "./FAQ";

// ============================================
// Video Section Component
// ============================================

interface VideoSectionProps {
  videoUrl?: string;
  posterUrl?: string;
  youtubeId?: string;
}

function VideoSection({ videoUrl, posterUrl, youtubeId }: VideoSectionProps) {
  if (youtubeId) {
    return (
      <div className="w-full max-w-3xl mx-auto my-10">
        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="VocaVision 소개 영상"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className="w-full max-w-3xl mx-auto my-10">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <video
            src={videoUrl}
            poster={posterUrl}
            controls
            className="w-full aspect-video"
          />
        </div>
      </div>
    );
  }

  return null;
}

// ============================================
// Pricing Page Component
// ============================================

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("yearly");

  const proPlan =
    billingPeriod === "yearly"
      ? vocaVisionPlans.pro.yearly
      : vocaVisionPlans.pro.monthly;

  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          나에게 맞는 플랜을 선택하세요
        </h1>

        {/* Billing Toggle */}
        <BillingToggle
          value={billingPeriod}
          onChange={setBillingPeriod}
          savingsPercent={41}
        />
      </section>

      {/* Pricing Cards Section */}
      <section className="pb-12 px-6">
        <PricingCards>
          {/* Free Plan */}
          <div className="flex-1 max-w-sm">
            <PricingCard {...vocaVisionPlans.free} />
          </div>

          {/* Pro Plan */}
          <div className="flex-1 max-w-sm">
            <PricingCard {...proPlan} highlighted />
          </div>
        </PricingCards>
      </section>

      {/* Video Section (Optional) */}
      <section className="px-6">
        <VideoSection youtubeId="dQw4w9WgXcQ" />
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            사용자들의 이야기
          </h2>
          <p className="text-slate-600">
            VocaVision으로 영어 학습에 성공한 분들의 후기입니다.
          </p>
        </div>

        <TestimonialsGrid columns={3}>
          {vocaVisionTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </TestimonialsGrid>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="자주 묻는 질문"
        subtitle="플랜에 관한 궁금한 점을 확인하세요."
        contactLink="/contact"
        contactLabel="문의하기"
        items={vocaVisionFAQ}
      />

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-green-500 to-green-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 영어 단어 마스터가 되세요!
          </h2>
          <p className="text-lg text-white/90 mb-8">
            과학적인 학습 방법으로 효율적인 단어 암기를 시작하세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/study"
              className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              무료로 시작하기
            </a>
            <a
              href="/register/pro-year"
              className="px-8 py-3 bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/30 transition-colors"
            >
              Pro 가입하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
