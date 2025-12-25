"use client";

import { useEffect, useState } from "react";
import { Sparkles, HeartHandshake, Quote, Star, Users } from "lucide-react";

interface FeedbackCard {
  name: string;
  role: string;
  message: string;
  highlight: string;
  channel: string;
}

const feedbacks: FeedbackCard[] = [
  {
    name: "김수연",
    role: "수능 재수생",
    message:
      "영어가 가장 불안했는데 VocaVision 덕분에 3주 만에 어휘 감각이 확 올라갔어요. 암기 → 퀴즈 → 복습 흐름이 깔끔해서 손이 계속 가요!",
    highlight: "최근 모의고사 영어 1등급 달성",
    channel: "앱 스토어 후기",
  },
  {
    name: "박지민",
    role: "TEPS 준비 직장인",
    message:
      "출퇴근 지하철에서 슬라이더로 빠르게 돌리기 좋습니다. AI 이미지 연상법이 있어서 단어가 오래 기억돼요. 구독 결제도 부담 없는 가격!",
    highlight: "TEPS 어휘 파트 오답률 32% → 11%",
    channel: "커뮤니티 디엠",
  },
  {
    name: "이하준",
    role: "영어 교육 전공 대학생",
    message:
      "학생들 보카 수업 보조 자료로 활용 중입니다. 단어별 루트/리마인드가 잘 정돈되어 있고, 복습 일정이 자동이라 과제 안내하기도 편해요.",
    highlight: "수업 만족도 설문 4.9점 유지",
    channel: "교수자 피드백",
  },
  {
    name: "한예린",
    role: "N수생 스터디 리더",
    message:
      "스마트 북마크랑 오답노트가 합쳐져 있어서 스터디원들 관리가 쉬워졌어요. 어제 틀린 단어가 바로 오늘 퀴즈에 나와서 복습 리듬이 잡힙니다.",
    highlight: "주간 학습 리텐션 +24%",
    channel: "오픈채팅 후기",
  },
];

const counters = [
  {
    label: "누적 학습 세션",
    value: "1,240,000+",
    subLabel: "오늘만 3,200회 진행",
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
  },
  {
    label: "커뮤니티 후원",
    value: "3,820명",
    subLabel: "월간 구독 유지율 98%",
    icon: <HeartHandshake className="w-5 h-5 text-rose-500" />,
  },
  {
    label: "평균 만족도",
    value: "4.8 / 5.0",
    subLabel: "실사용자 설문 1,200건",
    icon: <Star className="w-5 h-5 text-yellow-400" />,
  },
];

export function CommunityFeedbackSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200 font-semibold mb-2">
              COMMUNITY VOICE
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              실제 사용자들의 후기와 후원
            </h2>
            <p className="text-slate-200/80 max-w-2xl">
              학습자가 직접 남겨준 후기와 후원 지표를 투명하게 보여드려요. 신뢰할 수 있는 학습 경험을 위해 피드백을 계속 반영하고 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span>실시간 응답 챗봇 & FAQ 연결</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {counters.map((counter) => (
            <div
              key={counter.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-black/5"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10">
                {counter.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{counter.value}</div>
                <div className="text-sm text-slate-200/90">{counter.label}</div>
                <div className="text-xs text-slate-400">{counter.subLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="lg:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                <Quote className="w-4 h-4 text-brand-primary" />
                <span>하이라이트 후기</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                "{feedbacks[activeIndex].message}"
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center text-brand-primary font-semibold">
                    {feedbacks[activeIndex].name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{feedbacks[activeIndex].name}</div>
                    <div className="text-xs text-slate-500">{feedbacks[activeIndex].role}</div>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                  {feedbacks[activeIndex].channel}
                </span>
              </div>
              <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                {feedbacks[activeIndex].highlight}
              </div>
              <div className="flex items-center gap-2">
                {feedbacks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === index ? "w-8 bg-brand-primary" : "w-3 bg-slate-200"
                    }`}
                    aria-label={`${index + 1}번째 후기 보기`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-4">
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feedbacks.map((feedback, index) => (
                  <article
                    key={`${feedback.name}-${index}`}
                    className={`h-full rounded-2xl border p-4 shadow-sm transition-all ${
                      activeIndex === index
                        ? "border-brand-primary/40 shadow-brand-primary/10"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-primary font-semibold">
                        {feedback.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{feedback.name}</div>
                        <div className="text-xs text-slate-500">{feedback.role}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
                      {feedback.message}
                    </p>
                    <div className="mt-3 text-xs font-medium text-emerald-700 bg-emerald-50 inline-flex items-center gap-1 px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3 text-amber-500" />
                      {feedback.highlight}
                    </div>
                  </article>
                ))}
              </div>

              <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
                {feedbacks.map((feedback, index) => (
                  <article
                    key={`${feedback.name}-mobile-${index}`}
                    className="min-w-[260px] max-w-[280px] snap-center rounded-2xl border border-slate-100 p-4 shadow-sm bg-white"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-primary font-semibold">
                        {feedback.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{feedback.name}</div>
                        <div className="text-xs text-slate-500">{feedback.role}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">{feedback.message}</p>
                    <div className="text-xs font-medium text-emerald-700 bg-emerald-50 inline-flex items-center gap-1 px-2.5 py-1 rounded-full">
                      <Users className="w-3 h-3 text-emerald-500" />
                      {feedback.highlight}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
