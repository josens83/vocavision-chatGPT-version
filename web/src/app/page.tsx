'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            VocaVision
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            이미지, 동영상, 연상법으로 배우는 <br />
            새로운 영어 단어 학습 경험
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              7일 무료 체험 시작
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              로그인
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard
            icon="📸"
            title="이미지 학습"
            description="AI 생성 이미지와 전문가 일러스트로 시각적 암기"
          />
          <FeatureCard
            icon="🎬"
            title="동영상/애니메이션"
            description="생동감 있는 영상으로 단어를 더 오래 기억하세요"
          />
          <FeatureCard
            icon="🎵"
            title="라이밍"
            description="발음이 비슷한 단어로 쉽고 재미있게 학습"
          />
          <FeatureCard
            icon="🧠"
            title="연상법"
            description="AI와 전문가가 만든 기억술로 효과적인 암기"
          />
          <FeatureCard
            icon="📚"
            title="어원 학습"
            description="단어의 역사와 구조를 이해하며 체계적 학습"
          />
          <FeatureCard
            icon="🔄"
            title="간격 반복"
            description="과학적 알고리즘으로 최적의 복습 시점 제시"
          />
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            요금제
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="무료 체험"
              price="₩0"
              period="7일"
              features={[
                '모든 학습 방법 이용',
                '일일 20단어 학습',
                '기본 통계 제공',
              ]}
            />
            <PricingCard
              name="월간 구독"
              price="₩14,900"
              period="월"
              features={[
                '무제한 단어 학습',
                '모든 프리미엄 기능',
                'AI 맞춤 연상법',
                '상세 학습 분석',
              ]}
              highlighted
            />
            <PricingCard
              name="연간 구독"
              price="₩149,000"
              period="년"
              features={[
                '월간 요금 대비 17% 할인',
                '모든 프리미엄 기능',
                '우선 고객 지원',
                '신규 기능 먼저 체험',
              ]}
            />
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, period, features, highlighted = false }: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg ${highlighted ? 'ring-4 ring-blue-600 scale-105' : ''}`}>
      {highlighted && (
        <div className="bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full inline-block mb-4">
          추천
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/auth/register"
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
          highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        시작하기
      </Link>
    </div>
  );
}
