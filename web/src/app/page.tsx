'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VocaVision
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/collections" className="text-gray-600 hover:text-blue-600 transition">
              컬렉션
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition">
              요금제
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              로그인
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              무료 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              영어 단어,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                이미지로 기억하세요
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
              AI 생성 이미지, 동영상, 연상법으로 배우는<br />
              새로운 영어 단어 학습 경험. 과학적 간격 반복으로 장기 기억까지.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/register"
                className="px-10 py-4 bg-blue-600 text-white text-lg rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                7일 무료 체험 시작 →
              </Link>
              <Link
                href="/collections"
                className="px-10 py-4 bg-white text-blue-600 text-lg rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
              >
                컬렉션 둘러보기
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>7일 무료 체험</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>신용카드 불필요</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>언제든 취소 가능</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">101+</div>
              <div className="text-gray-600">엄선된 단어</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">6가지</div>
              <div className="text-gray-600">학습 방법</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">기억 보존율</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              왜 VocaVision인가요?
            </h2>
            <p className="text-xl text-gray-600">
              과학적으로 검증된 6가지 학습 방법으로 단어를 오래 기억하세요
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon="📸"
              title="이미지 학습"
              description="AI 생성 이미지와 전문가 일러스트로 시각적 암기. 뇌는 이미지를 텍스트보다 60,000배 빠르게 처리합니다."
            />
            <FeatureCard
              icon="🎬"
              title="동영상/애니메이션"
              description="생동감 있는 영상으로 단어를 더 오래 기억하세요. 스토리텔링과 결합된 학습은 기억력을 2배 향상시킵니다."
            />
            <FeatureCard
              icon="🎵"
              title="라이밍"
              description="발음이 비슷한 단어로 쉽고 재미있게 학습. 리듬과 운율은 장기 기억 형성에 효과적입니다."
            />
            <FeatureCard
              icon="🧠"
              title="연상법"
              description="AI와 전문가가 만든 기억술로 효과적인 암기. 연상 기법은 일반 암기보다 3배 더 효과적입니다."
            />
            <FeatureCard
              icon="📚"
              title="어원 학습"
              description="단어의 역사와 구조를 이해하며 체계적 학습. 어원을 아는 것은 수천 개의 단어를 추론하게 해줍니다."
            />
            <FeatureCard
              icon="🔄"
              title="간격 반복"
              description="과학적 SM-2 알고리즘으로 최적의 복습 시점 제시. 망각 곡선을 이기고 95% 기억 보존율을 달성하세요."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              어떻게 작동하나요?
            </h2>
            <p className="text-xl text-gray-600">
              간단한 3단계로 영어 실력을 향상시키세요
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <StepCard
                number="1"
                title="단어 선택"
                description="난이도와 주제별로 정리된 컬렉션에서 학습할 단어를 선택하세요. 초급부터 전문가 레벨까지 다양한 단어를 제공합니다."
              />
              <StepCard
                number="2"
                title="다양한 방법으로 학습"
                description="이미지, 동영상, 연상법, 어원 등 6가지 방법으로 단어를 학습하세요. 뇌의 다양한 영역을 활성화하여 기억력을 극대화합니다."
              />
              <StepCard
                number="3"
                title="최적 시점에 복습"
                description="AI가 당신의 학습 패턴을 분석하여 최적의 복습 시점을 알려줍니다. 간격 반복 학습으로 장기 기억을 만드세요."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              학습자들의 이야기
            </h2>
            <p className="text-xl opacity-90">
              VocaVision으로 영어 실력을 향상시킨 학습자들의 후기
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              quote="이미지와 연상법으로 배우니 단어가 정말 오래 기억돼요. 3개월 만에 토익 점수가 200점 올랐습니다!"
              author="김민준"
              role="대학생"
            />
            <TestimonialCard
              quote="간격 반복 시스템이 정말 효과적이에요. 복습할 단어를 알아서 알려줘서 학습 계획 세우기가 너무 편해졌어요."
              author="이서연"
              role="직장인"
            />
            <TestimonialCard
              quote="동영상 학습이 특히 마음에 들어요. 지루하지 않고 재미있게 단어를 배울 수 있어서 매일 학습하게 돼요."
              author="박지호"
              role="고등학생"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              합리적인 가격
            </h2>
            <p className="text-xl text-gray-600">
              7일 무료 체험으로 시작하고, 마음에 드시면 계속 사용하세요
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="무료 체험"
              price="₩0"
              period="7일"
              features={[
                '모든 학습 방법 이용',
                '일일 20단어 학습',
                '기본 통계 제공',
                '퀴즈 모드 이용',
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
                '업적 시스템',
                '우선 고객 지원',
              ]}
              highlighted
            />
            <PricingCard
              name="연간 구독"
              price="₩149,000"
              period="년"
              features={[
                '월간 대비 17% 할인',
                '모든 프리미엄 기능',
                'AI 맞춤 연상법',
                '우선 고객 지원',
                '신규 기능 먼저 체험',
                '평생 학습 자료 보관',
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              오늘부터 시작하세요
            </h2>
            <p className="text-xl mb-10 opacity-90">
              7일 무료 체험으로 VocaVision의 모든 기능을 경험해보세요.<br />
              신용카드 등록 불필요. 언제든 취소 가능합니다.
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-10 py-4 bg-white text-blue-600 text-lg rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
            >
              무료로 시작하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">VocaVision</div>
              <p className="text-gray-400">
                이미지와 과학으로 배우는<br />새로운 영어 학습 경험
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/collections" className="hover:text-white transition">컬렉션</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">요금제</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">도움말</Link></li>
                <li><Link href="#" className="hover:text-white transition">문의하기</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">법적 고지</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">이용약관</Link></li>
                <li><Link href="#" className="hover:text-white transition">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VocaVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
        {number}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
      <div className="text-4xl mb-4">"</div>
      <p className="text-lg mb-6 leading-relaxed">{quote}</p>
      <div className="border-t border-white border-opacity-20 pt-4">
        <div className="font-semibold">{author}</div>
        <div className="text-sm opacity-80">{role}</div>
      </div>
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
    <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition ${highlighted ? 'ring-4 ring-blue-600 transform scale-105' : ''}`}>
      {highlighted && (
        <div className="bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full inline-block mb-4">
          인기
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
            <span className="text-green-600 text-xl">✓</span>
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
