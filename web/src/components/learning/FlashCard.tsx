'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  id: string;
  word: string;
  definition: string;
  pronunciation?: string;
  images?: any[];
  mnemonics?: any[];
  examples?: any[];
  rhymes?: any[];
  etymology?: any;
}

interface FlashCardProps {
  word: Word;
  onAnswer: (correct: boolean, rating: number) => void;
}

export default function FlashCard({ word, onAnswer }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<'definition' | 'image' | 'mnemonic' | 'etymology'>('definition');

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleRating = (rating: number) => {
    const correct = rating >= 3;
    onAnswer(correct, rating);
    setFlipped(false);
    setActiveTab('definition');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={flipped ? 'back' : 'front'}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {!flipped ? (
            // Front of card - Show word
            <div className="p-12 text-center min-h-[500px] flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-6xl font-bold text-gray-900 mb-4">
                  {word.word}
                </h2>
                {word.pronunciation && (
                  <p className="text-2xl text-gray-500">
                    {word.pronunciation}
                  </p>
                )}
              </div>

              <button
                onClick={handleFlip}
                className="mx-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
              >
                답 확인하기
              </button>

              <p className="text-gray-400 mt-8 text-sm">
                카드를 클릭하여 답을 확인하세요
              </p>
            </div>
          ) : (
            // Back of card - Show answer with tabs
            <div className="min-h-[500px]">
              {/* Tabs */}
              <div className="flex border-b">
                <TabButton
                  active={activeTab === 'definition'}
                  onClick={() => setActiveTab('definition')}
                  icon="📝"
                  label="정의"
                />
                {word.images && word.images.length > 0 && (
                  <TabButton
                    active={activeTab === 'image'}
                    onClick={() => setActiveTab('image')}
                    icon="📸"
                    label="이미지"
                  />
                )}
                {word.mnemonics && word.mnemonics.length > 0 && (
                  <TabButton
                    active={activeTab === 'mnemonic'}
                    onClick={() => setActiveTab('mnemonic')}
                    icon="🧠"
                    label="연상법"
                  />
                )}
                {word.etymology && (
                  <TabButton
                    active={activeTab === 'etymology'}
                    onClick={() => setActiveTab('etymology')}
                    icon="📚"
                    label="어원"
                  />
                )}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'definition' && (
                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">
                      {word.word}
                    </h3>
                    <p className="text-3xl text-gray-700 mb-8">
                      {word.definition}
                    </p>
                    {word.examples && word.examples.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-6 text-left max-w-2xl mx-auto">
                        <h4 className="font-semibold mb-4">예문:</h4>
                        {word.examples.slice(0, 2).map((example: any, i: number) => (
                          <div key={i} className="mb-4">
                            <p className="text-gray-800 italic">"{example.sentence}"</p>
                            {example.translation && (
                              <p className="text-gray-600 text-sm mt-1">
                                {example.translation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'image' && word.images && word.images.length > 0 && (
                  <div className="text-center">
                    <div className="relative w-full max-w-lg mx-auto mb-4 rounded-xl overflow-hidden">
                      <img
                        src={word.images[0].imageUrl}
                        alt={word.word}
                        className="w-full h-auto"
                      />
                    </div>
                    {word.images[0].description && (
                      <p className="text-gray-600">{word.images[0].description}</p>
                    )}
                  </div>
                )}

                {activeTab === 'mnemonic' && word.mnemonics && word.mnemonics.length > 0 && (
                  <div>
                    <h4 className="text-2xl font-bold mb-4">
                      {word.mnemonics[0].title}
                    </h4>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-4">
                      <p className="text-lg text-gray-800 whitespace-pre-wrap">
                        {word.mnemonics[0].content}
                      </p>
                    </div>
                    {word.mnemonics[0].koreanHint && (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-700">
                          💡 {word.mnemonics[0].koreanHint}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'etymology' && word.etymology && (
                  <div>
                    <h4 className="text-2xl font-bold mb-4">어원</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">기원</p>
                        <p className="text-lg font-semibold">{word.etymology.origin}</p>
                      </div>
                      {word.etymology.rootWords && word.etymology.rootWords.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-2">어근</p>
                          <ul className="space-y-1">
                            {word.etymology.rootWords.map((root: string, i: number) => (
                              <li key={i} className="text-gray-800">• {root}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {word.etymology.evolution && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">발전 과정</p>
                          <p className="text-gray-800">{word.etymology.evolution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Buttons */}
              <div className="border-t p-6 bg-gray-50">
                <p className="text-center text-gray-700 mb-4 font-medium">
                  이 단어를 얼마나 잘 기억하고 있나요?
                </p>
                <div className="flex gap-3 justify-center">
                  <RatingButton
                    rating={1}
                    label="다시"
                    color="red"
                    onClick={() => handleRating(1)}
                  />
                  <RatingButton
                    rating={2}
                    label="어려움"
                    color="orange"
                    onClick={() => handleRating(2)}
                  />
                  <RatingButton
                    rating={3}
                    label="보통"
                    color="yellow"
                    onClick={() => handleRating(3)}
                  />
                  <RatingButton
                    rating={4}
                    label="쉬움"
                    color="green"
                    onClick={() => handleRating(4)}
                  />
                  <RatingButton
                    rating={5}
                    label="완벽"
                    color="blue"
                    onClick={() => handleRating(5)}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 px-4 text-center transition ${
        active
          ? 'bg-white border-b-2 border-blue-600 text-blue-600 font-semibold'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function RatingButton({
  rating,
  label,
  color,
  onClick,
}: {
  rating: number;
  label: string;
  color: string;
  onClick: () => void;
}) {
  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
  }[color];

  return (
    <button
      onClick={onClick}
      className={`${colorClasses} text-white px-6 py-3 rounded-lg font-semibold transition flex-1 hover:shadow-lg transform hover:scale-105`}
    >
      {label}
    </button>
  );
}
