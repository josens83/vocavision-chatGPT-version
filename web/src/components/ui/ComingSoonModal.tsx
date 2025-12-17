/**
 * Coming Soon Modal Component
 * 준비 중인 기능/시험 접근 시 표시되는 모달
 * GPT 권장: 토스트 대신 모달로 대안(CSAT) 안내
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface ComingSoonOptions {
  /** 준비 중인 항목 이름 */
  itemName?: string;
  /** 모달 제목 */
  title?: string;
  /** 안내 메시지 */
  message?: string;
  /** 대안 CTA 텍스트 */
  alternativeText?: string;
  /** 대안 CTA URL */
  alternativeHref?: string;
}

interface ComingSoonContextType {
  /** 준비중 모달 표시 */
  showComingSoon: (options?: ComingSoonOptions) => void;
}

const ComingSoonContext = createContext<ComingSoonContextType | null>(null);

// Provider
export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ComingSoonOptions>({});

  const showComingSoon = useCallback((opts?: ComingSoonOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
  }, []);

  const handleAlternative = useCallback(() => {
    setIsOpen(false);
    const href = options.alternativeHref || '/courses/csat';
    router.push(href);
  }, [options.alternativeHref, router]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ComingSoonContext.Provider value={{ showComingSoon }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <ComingSoonModalContent
            options={options}
            onAlternative={handleAlternative}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </ComingSoonContext.Provider>
  );
}

// Hook
export function useComingSoon() {
  const context = useContext(ComingSoonContext);
  if (!context) {
    throw new Error('useComingSoon must be used within a ComingSoonProvider');
  }
  return context;
}

// Modal Content
function ComingSoonModalContent({
  options,
  onAlternative,
  onClose,
}: {
  options: ComingSoonOptions;
  onAlternative: () => void;
  onClose: () => void;
}) {
  const itemName = options.itemName || '이 기능';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[110]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-[111] flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛠️</span>
          </div>

          {/* Title */}
          <h2 id="coming-soon-title" className="text-xl font-bold text-gray-900 text-center mb-2">
            {options.title || '준비 중이에요'}
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {options.message || `${itemName}은(는) 곧 추가될 예정이에요.\n조금만 기다려 주세요!`}
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">지금 바로 학습하기</p>
                <p className="text-sm text-blue-700">
                  수능(CSAT) 필수 어휘 3,200개로 먼저 학습을 시작해 보세요!
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onAlternative}
              className="w-full px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-xl transition"
            >
              {options.alternativeText || 'CSAT로 시작하기'}
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 font-medium transition"
            >
              닫기
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ComingSoonProvider;
