'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// 시험 카테고리 데이터
const examCategories = [
  {
    id: 'csat',
    name: '수능',
    fullName: '대학수학능력시험',
    description: '수능 영어 영역 필수 어휘',
    wordCount: '3,000+',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    icon: '📝',
    levels: ['기초', '필수', '심화'],
  },
  {
    id: 'teps',
    name: 'TEPS',
    fullName: '서울대 영어능력시험',
    description: '텝스 고득점을 위한 어휘',
    wordCount: '4,000+',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    icon: '🎓',
    levels: ['400점', '600점', '800점+'],
  },
  {
    id: 'toeic',
    name: 'TOEIC',
    fullName: '국제의사소통영어시험',
    description: '비즈니스 영어 핵심 어휘',
    wordCount: '3,500+',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    icon: '💼',
    levels: ['600점', '800점', '900점+'],
  },
  {
    id: 'toefl',
    name: 'TOEFL',
    fullName: '학술영어능력시험',
    description: '유학 준비 학술 어휘',
    wordCount: '5,000+',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    icon: '🌍',
    levels: ['80점', '100점', '110점+'],
  },
  {
    id: 'sat',
    name: 'SAT',
    fullName: '미국대학입학시험',
    description: 'SAT/GRE 고급 어휘',
    wordCount: '4,500+',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    icon: '🇺🇸',
    levels: ['1200점', '1400점', '1500점+'],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VocaVision
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {examCategories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                href={`/exam/${cat.id}`}
                className="text-gray-600 hover:text-blue-600 transition text-sm font-medium"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/exam" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
              전체 시험
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-blue-600 transition text-sm font-medium"
            >
              로그인
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
            >
              무료 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              시험별 영어단어 학습
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              수능, TEPS, TOEIC, TOEFL, SAT<br />
              목표 시험에 맞는 영어단어를 효과적으로 학습하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                무료로 시작하기
              </Link>
              <Link
                href="#exams"
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                시험 선택하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Exam Categories Section */}
      <section id="exams" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              시험 유형 선택
            </h2>
            <p className="text-gray-600">
              준비 중인 시험을 선택하고 맞춤형 단어 학습을 시작하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {examCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/exam/${category.id}`}>
                  <div
                    className={`${category.bgColor} ${category.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{category.icon}</div>
                      <span className={`${category.textColor} text-sm font-medium bg-white px-3 py-1 rounded-full`}>
                        {category.wordCount} 단어
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{category.fullName}</p>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.levels.map((level) => (
                        <span
                          key={level}
                          className="text-xs bg-white text-gray-600 px-2 py-1 rounded-md"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                    <div className={`mt-4 text-sm font-medium ${category.textColor} group-hover:underline`}>
                      학습 시작하기 →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              효과적인 학습 방법
            </h2>
            <p className="text-gray-600">
              VocaVision만의 6가지 학습 방법으로 단어를 오래 기억하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon="📸"
              title="이미지 학습"
              description="AI 생성 이미지로 시각적 암기"
            />
            <FeatureCard
              icon="🎬"
              title="동영상 학습"
              description="생동감 있는 영상으로 기억력 향상"
            />
            <FeatureCard
              icon="🧠"
              title="연상법"
              description="효과적인 기억술로 빠른 암기"
            />
            <FeatureCard
              icon="📚"
              title="어원 학습"
              description="단어의 구조를 이해하며 체계적 학습"
            />
            <FeatureCard
              icon="🎵"
              title="라이밍"
              description="발음이 비슷한 단어로 재미있게"
            />
            <FeatureCard
              icon="🔄"
              title="간격 반복"
              description="과학적 알고리즘으로 최적 복습"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-1">20,000+</div>
              <div className="text-blue-100">수록 단어</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">5개</div>
              <div className="text-blue-100">시험 유형</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">6가지</div>
              <div className="text-blue-100">학습 방법</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">95%</div>
              <div className="text-blue-100">기억 보존율</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              이렇게 학습하세요
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                title="시험 선택"
                description="준비 중인 시험을 선택하고 목표 점수에 맞는 단어장을 찾으세요"
              />
              <StepCard
                number="2"
                title="다양한 방법 학습"
                description="이미지, 연상법, 어원 등 6가지 방법으로 효과적으로 암기하세요"
              />
              <StepCard
                number="3"
                title="간격 반복 복습"
                description="AI가 최적의 복습 시점을 알려줘 장기 기억으로 만들어 드립니다"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              인기 단어장
            </h2>
            <p className="text-gray-600">
              가장 많이 선택된 단어장으로 바로 시작하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <QuickCard
              title="수능 필수 1000"
              exam="수능"
              color="blue"
              link="/exam/csat/essential"
            />
            <QuickCard
              title="토익 빈출 800"
              exam="TOEIC"
              color="green"
              link="/exam/toeic/frequent"
            />
            <QuickCard
              title="토플 학술어휘"
              exam="TOEFL"
              color="orange"
              link="/exam/toefl/academic"
            />
            <QuickCard
              title="TEPS 고급어휘"
              exam="TEPS"
              color="purple"
              link="/exam/teps/advanced"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              무료로 가입하고 목표 시험에 맞는 단어 학습을 시작하세요
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-10 py-4 bg-white text-blue-600 text-lg rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-blue-400 mb-4">VocaVision</div>
              <p className="text-gray-400 text-sm">
                시험별 맞춤 영어단어 학습<br />
                효과적인 암기를 위한 새로운 방법
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">시험별 단어</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/exam/csat" className="hover:text-white transition">수능 단어</Link></li>
                <li><Link href="/exam/teps" className="hover:text-white transition">TEPS 단어</Link></li>
                <li><Link href="/exam/toeic" className="hover:text-white transition">TOEIC 단어</Link></li>
                <li><Link href="/exam/toefl" className="hover:text-white transition">TOEFL 단어</Link></li>
                <li><Link href="/exam/sat" className="hover:text-white transition">SAT 단어</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">학습</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition">대시보드</Link></li>
                <li><Link href="/learn" className="hover:text-white transition">학습하기</Link></li>
                <li><Link href="/review" className="hover:text-white transition">복습하기</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">지원</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">도움말</Link></li>
                <li><Link href="#" className="hover:text-white transition">문의하기</Link></li>
                <li><Link href="#" className="hover:text-white transition">이용약관</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
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
    <div className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
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
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function QuickCard({ title, exam, color, link }: {
  title: string;
  exam: string;
  color: string;
  link: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    red: 'bg-red-50 border-red-200 text-red-600',
  };

  return (
    <Link href={link}>
      <div className={`${colorClasses[color]} border rounded-xl p-4 hover:shadow-md transition cursor-pointer`}>
        <span className="text-xs font-medium uppercase">{exam}</span>
        <h4 className="font-bold text-gray-900 mt-1">{title}</h4>
        <span className="text-sm mt-2 block">시작하기 →</span>
      </div>
    </Link>
  );
}
