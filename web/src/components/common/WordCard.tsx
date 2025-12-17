"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type LevelType = "L1" | "L2" | "L3";

interface WordCardProps {
  /** 단어 ID */
  id?: string;
  /** 영어 단어 */
  word: string;
  /** 한글 뜻 */
  meaning: string;
  /** 레벨 */
  level: LevelType;
  /** 발음 기호 */
  pronunciation?: string;
  /** 한글 발음 */
  pronunciationKo?: string;
  /** 이미지 URL */
  imageUrl?: string;
  /** 숙련도 (0-100) */
  progress?: number;
  /** BEST 뱃지 표시 */
  isBest?: boolean;
  /** NEW 뱃지 표시 */
  isNew?: boolean;
  /** 카드 변형 */
  variant?: "default" | "compact" | "mini";
  /** 링크 URL (없으면 클릭 불가) */
  href?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 클래스 */
  className?: string;
}

const levelStyles: Record<LevelType, { bg: string; text: string; border: string }> = {
  L1: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  L2: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  L3: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
};

export function WordCard({
  id,
  word,
  meaning,
  level,
  pronunciation,
  pronunciationKo,
  imageUrl,
  progress,
  isBest = false,
  isNew = false,
  variant = "default",
  href,
  onClick,
  className = "",
}: WordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const levelStyle = levelStyles[level];

  // 발음 재생
  const playPronunciation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying || typeof window === "undefined") return;

    setIsPlaying(true);
    try {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  // Mini 버전 (리스트 아이템)
  if (variant === "mini") {
    const Wrapper = href ? Link : "div";
    return (
      <Wrapper
        href={href || "#"}
        onClick={onClick}
        className={`
          flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100
          hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer
          ${className}
        `}
      >
        <span className={`px-2 py-0.5 text-xs font-bold rounded ${levelStyle.bg} ${levelStyle.text}`}>
          {level}
        </span>
        <span className="font-medium text-slate-900 flex-1 truncate">{word}</span>
        <span className="text-sm text-slate-500 truncate max-w-[120px]">{meaning}</span>
      </Wrapper>
    );
  }

  // Compact 버전 (가로 카드)
  if (variant === "compact") {
    const Wrapper = href ? Link : "div";
    return (
      <Wrapper
        href={href || "#"}
        onClick={onClick}
        className={`
          group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100
          hover:border-slate-200 hover:shadow-md transition-all cursor-pointer
          ${className}
        `}
      >
        {/* 레벨 뱃지 */}
        <span className={`shrink-0 px-2.5 py-1 text-xs font-bold rounded-lg ${levelStyle.bg} ${levelStyle.text}`}>
          {level}
        </span>

        {/* 단어 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 truncate group-hover:text-brand-primary transition-colors">
              {word}
            </h4>
            <button
              onClick={playPronunciation}
              className="shrink-0 p-1 text-slate-400 hover:text-brand-primary transition-colors"
              aria-label="발음 듣기"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414l-3-3a1 1 0 010-1.414l3-3m0 7.414V8.586a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-sm text-slate-500 truncate">{meaning}</p>
        </div>

        {/* 숙련도 */}
        {progress !== undefined && (
          <div className="shrink-0 w-16 text-right">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  progress >= 80 ? "bg-green-500" : progress >= 50 ? "bg-blue-500" : progress >= 20 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{progress}%</p>
          </div>
        )}

        {/* 화살표 */}
        <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Wrapper>
    );
  }

  // Default 버전 (세로 카드)
  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      href={href || "#"}
      onClick={onClick}
      className={`
        group block bg-white rounded-2xl border border-slate-100 overflow-hidden
        hover:border-slate-200 hover:shadow-lg hover:-translate-y-1
        transition-all duration-200 cursor-pointer
        ${className}
      `}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={word}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-slate-200 uppercase">{word[0]}</span>
          </div>
        )}

        {/* 뱃지들 */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-1 text-xs font-bold rounded-lg shadow-sm ${levelStyle.bg} ${levelStyle.text}`}>
            {level}
          </span>
          {isBest && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-lg shadow-sm">
              BEST
            </span>
          )}
          {isNew && (
            <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* 발음 버튼 */}
        <button
          onClick={playPronunciation}
          className="
            absolute top-3 right-3
            w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full
            flex items-center justify-center
            text-slate-600 hover:text-brand-primary hover:bg-white
            shadow-sm transition-all
          "
          aria-label="발음 듣기"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414l-3-3a1 1 0 010-1.414l3-3m0 7.414V8.586" />
            </svg>
          )}
        </button>
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        {/* 단어 */}
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-primary transition-colors">
          {word}
        </h3>

        {/* 발음 */}
        {(pronunciation || pronunciationKo) && (
          <p className="text-sm text-slate-400 mb-2">
            {pronunciation && <span>{pronunciation}</span>}
            {pronunciation && pronunciationKo && <span> · </span>}
            {pronunciationKo && <span>{pronunciationKo}</span>}
          </p>
        )}

        {/* 뜻 */}
        <p className="text-sm text-slate-600 line-clamp-2">{meaning}</p>

        {/* 숙련도 바 */}
        {progress !== undefined && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400">숙련도</span>
              <span className="text-xs font-medium text-slate-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all
                  ${progress >= 80 ? "bg-green-500" : progress >= 50 ? "bg-blue-500" : progress >= 20 ? "bg-yellow-500" : "bg-red-500"}
                `}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default WordCard;
