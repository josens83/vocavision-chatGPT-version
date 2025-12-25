'use client';

import { QuickStartMode, QUICK_START_DESTINATIONS } from '@/lib/quickStart';

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mode: QuickStartMode) => void;
}

export function QuickStartModal({ isOpen, onClose, onSelect }: QuickStartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-100">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">빠른 시작</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">바로 이어서 학습할 모드를 선택하세요</h2>
            <p className="mt-1 text-sm text-slate-500">
              로그인 후 이동 단계를 최소화하고, 다음 방문 때도 같은 모드로 바로 열립니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="빠른 시작 닫기"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          {Object.entries(QUICK_START_DESTINATIONS).map(([mode, destination]) => (
            <button
              key={mode}
              onClick={() => onSelect(mode as QuickStartMode)}
              className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-left transition hover:-translate-y-1 hover:border-brand-primary/50 hover:bg-white hover:shadow-lg"
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-primary shadow-sm">
                  <span className="text-lg">{destination.emoji}</span>
                  <span className="text-[11px] uppercase tracking-wide text-brand-primary">Start</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-primary">{destination.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{destination.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-brand-primary">
                <span>{destination.helper}</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600">
          <div>
            선택한 모드는 브라우저에 저장되어 다음 로그인 시에도 바로 열립니다. 이번 세션에서 창을 닫으면 다시 표시되지 않습니다.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-slate-500 underline-offset-4 transition hover:text-slate-700 hover:underline"
          >
            다음에 선택할게요
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickStartModal;
