"use client";

import { useState, ReactNode, createContext, useContext } from "react";

// ============================================
// Accordion Context
// ============================================

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }
  return context;
}

// ============================================
// Accordion Root
// ============================================

interface AccordionProps {
  children: ReactNode;
  /** 여러 항목을 동시에 열 수 있는지 */
  allowMultiple?: boolean;
  /** 기본으로 열려있는 항목 ID 배열 */
  defaultOpen?: string[];
  /** 추가 클래스 */
  className?: string;
}

export function Accordion({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={`divide-y divide-slate-200 dark:divide-slate-700 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ============================================
// Accordion Item
// ============================================

interface AccordionItemProps {
  /** 고유 ID */
  id: string;
  /** 헤더 제목 */
  title: string;
  /** 헤더 부제목 (선택) */
  subtitle?: string;
  /** 헤더 우측 배지/라벨 */
  badge?: ReactNode;
  /** 헤더 좌측 아이콘 */
  icon?: ReactNode;
  /** 펼친 내용 */
  children: ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
}

export function AccordionItem({
  id,
  title,
  subtitle,
  badge,
  icon,
  children,
  disabled = false,
  className = "",
}: AccordionItemProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.has(id);

  return (
    <div className={`${disabled ? "opacity-50" : ""} ${className}`}>
      {/* Header */}
      <button
        onClick={() => !disabled && toggleItem(id)}
        disabled={disabled}
        className={`
          w-full flex items-center gap-3 px-4 py-4
          text-left transition-colors
          ${disabled ? "cursor-not-allowed" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"}
        `}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}

        {/* Title & Subtitle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <div className="flex-shrink-0">
            {badge}
          </div>
        )}

        {/* Chevron */}
        <svg
          className={`
            w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0
            transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      <div
        id={`accordion-content-${id}`}
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pb-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 단축 컴포넌트: 레벨별 단어 목록 (커리큘럼 스타일)
// ============================================

interface WordListItem {
  id: string;
  word: string;
  definitionKo?: string;
  isLearned?: boolean;
}

interface LevelSection {
  level: "L1" | "L2" | "L3";
  title: string;
  wordCount: number;
  learnedCount?: number;
  words?: WordListItem[];
}

interface LevelAccordionProps {
  sections: LevelSection[];
  onWordClick?: (wordId: string) => void;
  defaultOpen?: string[];
  className?: string;
}

const levelIcons = {
  L1: (
    <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
      L1
    </span>
  ),
  L2: (
    <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold">
      L2
    </span>
  ),
  L3: (
    <span className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">
      L3
    </span>
  ),
};

export function LevelAccordion({
  sections,
  onWordClick,
  defaultOpen = [],
  className = "",
}: LevelAccordionProps) {
  return (
    <Accordion allowMultiple defaultOpen={defaultOpen} className={`rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {sections.map((section) => (
        <AccordionItem
          key={section.level}
          id={section.level}
          title={section.title}
          subtitle={`${section.wordCount}개 단어`}
          icon={levelIcons[section.level]}
          badge={
            section.learnedCount !== undefined && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                {section.learnedCount}/{section.wordCount} 완료
              </span>
            )
          }
        >
          {section.words && section.words.length > 0 ? (
            <div className="space-y-1">
              {section.words.map((word, index) => (
                <button
                  key={word.id}
                  onClick={() => onWordClick?.(word.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg
                    text-left transition-colors
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    ${word.isLearned ? "opacity-60" : ""}
                  `}
                >
                  <span className="w-6 text-xs text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </span>
                  <span className={`font-medium ${word.isLearned ? "text-slate-500 line-through" : "text-slate-900 dark:text-slate-100"}`}>
                    {word.word}
                  </span>
                  {word.definitionKo && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1">
                      {word.definitionKo}
                    </span>
                  )}
                  {word.isLearned && (
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              단어 목록을 불러오는 중...
            </p>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ============================================
// 단축 컴포넌트: FAQ 아코디언
// ============================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpen?: string[];
  className?: string;
}

export function FAQAccordion({
  items,
  defaultOpen = [],
  className = "",
}: FAQAccordionProps) {
  return (
    <Accordion allowMultiple defaultOpen={defaultOpen} className={`rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.question}
          icon={
            <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-bold">
              Q
            </span>
          }
        >
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {item.answer}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Accordion;
