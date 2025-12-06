/**
 * WordVisualPanel - 3-이미지 단어 시각화 패널
 *
 * VocaVision의 핵심 차별점: 각 단어마다 3가지 이미지로 시각화
 * - Concept (의미): 단어 의미를 직관적으로 보여주는 이미지
 * - Mnemonic (연상): 한국어식 연상법에 맞는 이미지
 * - Rhyme (라이밍): 발음/라이밍 기반 상황 이미지
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface WordImage {
  type: 'concept' | 'mnemonic' | 'rhyme';
  url: string | null;
  caption: string | null;
}

interface WordVisualPanelProps {
  images: WordImage[];
  word: string;
}

const TAB_CONFIG = {
  concept: {
    label: '의미',
    description: '단어 의미 시각화',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  mnemonic: {
    label: '연상',
    description: '한국어식 연상법',
    color: 'bg-green-500',
    lightColor: 'bg-green-50 text-green-700 border-green-200',
  },
  rhyme: {
    label: '라이밍',
    description: '발음 기반 연상',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

type TabType = 'concept' | 'mnemonic' | 'rhyme';

export default function WordVisualPanel({ images, word }: WordVisualPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('concept');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // 유효한 이미지만 필터링
  const validImages = images.filter((img) => img.url && !imageError[img.type]);

  // 이미지가 하나도 없으면 패널 숨김
  if (validImages.length === 0) {
    return null;
  }

  const currentImage = images.find((img) => img.type === activeTab);
  const tabOrder: TabType[] = ['concept', 'mnemonic', 'rhyme'];
  const currentIndex = tabOrder.indexOf(activeTab);

  const handleSwipe = (direction: 'left' | 'right') => {
    // 유효한 탭만 순회
    const validTabs = tabOrder.filter(
      (tab) => images.find((img) => img.type === tab)?.url && !imageError[tab]
    );
    if (validTabs.length === 0) return;

    const currentValidIndex = validTabs.indexOf(activeTab);
    let newIndex: number;

    if (direction === 'left') {
      newIndex = (currentValidIndex + 1) % validTabs.length;
    } else {
      newIndex = (currentValidIndex - 1 + validTabs.length) % validTabs.length;
    }

    setActiveTab(validTabs[newIndex]);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      handleSwipe('left');
    } else if (info.offset.x > 50) {
      handleSwipe('right');
    }
  };

  const handleImageError = (type: string) => {
    setImageError((prev) => ({ ...prev, [type]: true }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-100">
        {tabOrder.map((tab) => {
          const config = TAB_CONFIG[tab];
          const img = images.find((i) => i.type === tab);
          const hasImage = img?.url && !imageError[tab];
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => hasImage && setActiveTab(tab)}
              disabled={!hasImage}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors relative
                ${
                  isActive
                    ? 'text-gray-900'
                    : hasImage
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                }
              `}
            >
              {config.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.color}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 이미지 영역 */}
      <div className="relative aspect-square bg-gray-50">
        <AnimatePresence mode="wait">
          {currentImage?.url && !imageError[currentImage.type] ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              <img
                src={currentImage.url}
                alt={`${word} - ${TAB_CONFIG[activeTab].label}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(currentImage.type)}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImageOff className="w-12 h-12 mb-2" />
              <span className="text-sm">이미지 없음</span>
            </div>
          )}
        </AnimatePresence>

        {/* 좌우 화살표 (데스크톱) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={() => handleSwipe('right')}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleSwipe('left')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* 캡션 */}
      {currentImage?.caption && (
        <div className="p-4 border-t border-gray-100">
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-2 ${TAB_CONFIG[activeTab].lightColor}`}
          >
            {TAB_CONFIG[activeTab].label}
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">{currentImage.caption}</p>
        </div>
      )}

      {/* 도트 인디케이터 (모바일) */}
      {validImages.length > 1 && (
        <div className="flex justify-center gap-2 pb-3 md:hidden">
          {tabOrder.map((tab) => {
            const img = images.find((i) => i.type === tab);
            const hasImage = img?.url && !imageError[tab];
            if (!hasImage) return null;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  w-2 h-2 rounded-full transition-colors
                  ${activeTab === tab ? TAB_CONFIG[tab].color : 'bg-gray-300'}
                `}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
