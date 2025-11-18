# VocaVision - 종합 영어 단어 학습 플랫폼

이미지, 애니메이션, 동영상, Rhyming, 연상법, 어원 등 모든 암기 방법을 활용한 프리미엄 영어 단어 학습 플랫폼

## 🚀 주요 기능

### 학습 방법
- 📸 **이미지 학습**: AI 생성 이미지와 전문가 제작 일러스트
- 🎬 **동영상/애니메이션**: 단어별 맞춤 애니메이션
- 🎵 **라이밍(Rhyming)**: 발음 유사 단어로 쉽게 암기
- 🧠 **연상법(Mnemonics)**: AI와 전문가가 만든 기억술
- 📚 **어원 학습**: 단어의 역사와 구조 이해
- 🔄 **간격 반복(Spaced Repetition)**: 과학적 복습 알고리즘
- 🎴 **플래시카드**: 다양한 학습 모드
- ✍️ **퀴즈/테스트**: 실력 점검 및 게임화

### 플랫폼
- 🌐 **웹 앱**: 반응형 웹 애플리케이션
- 📱 **모바일 앱**: iOS/Android 네이티브 앱
- ☁️ **클라우드 동기화**: 모든 기기에서 학습 진행 상황 동기화

### 유료 서비스
- 💳 **구독 모델**: 월간/연간 구독
- 🎁 **무료 체험**: 7일 무료 체험
- 👨‍👩‍👧‍👦 **가족 플랜**: 최대 5명까지

## 📁 프로젝트 구조

```
vocavision/
├── backend/              # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/  # API 컨트롤러
│   │   ├── models/       # 데이터 모델
│   │   ├── routes/       # API 라우트
│   │   ├── services/     # 비즈니스 로직
│   │   ├── middleware/   # 미들웨어
│   │   └── utils/        # 유틸리티
│   ├── prisma/           # Prisma ORM 스키마
│   └── package.json
│
├── web/                  # Web Application (Next.js + TypeScript)
│   ├── src/
│   │   ├── app/          # Next.js 13+ App Router
│   │   ├── components/   # React 컴포넌트
│   │   ├── lib/          # 라이브러리 및 유틸리티
│   │   ├── hooks/        # Custom React Hooks
│   │   └── styles/       # CSS/Tailwind
│   └── package.json
│
├── mobile/               # Mobile App (React Native + Expo)
│   ├── src/
│   │   ├── screens/      # 화면 컴포넌트
│   │   ├── components/   # 재사용 컴포넌트
│   │   ├── navigation/   # 네비게이션
│   │   └── services/     # API 서비스
│   └── package.json
│
├── shared/               # 공유 코드 (타입, 상수 등)
│   └── types/
│
└── docs/                 # 문서
    ├── API.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

## 🛠 기술 스택

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe
- **File Storage**: AWS S3 / Cloudinary
- **AI Integration**: OpenAI API (이미지, 연상법 생성)

### Web
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod

### Mobile
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **UI Components**: React Native Paper

### DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Web) + AWS (Backend)
- **Mobile**: Expo EAS

## 🚦 시작하기

### 사전 요구사항
- Node.js 20+
- PostgreSQL 14+
- npm or yarn or pnpm

### 설치

1. **레포지토리 클론**
```bash
git clone https://github.com/josens83/vocavision.git
cd vocavision
```

2. **의존성 설치**
```bash
# Backend
cd backend
npm install

# Web
cd ../web
npm install

# Mobile
cd ../mobile
npm install
```

3. **환경 변수 설정**
각 프로젝트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

4. **데이터베이스 설정**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. **개발 서버 실행**
```bash
# Backend (포트 3001)
cd backend
npm run dev

# Web (포트 3000)
cd web
npm run dev

# Mobile
cd mobile
npm start
```

## 📖 API 문서

API 문서는 `/docs/API.md`에서 확인할 수 있습니다.

## 🤝 기여하기

기여 가이드는 `CONTRIBUTING.md`를 참조하세요.

## 📄 라이선스

이 프로젝트는 상용 라이선스를 사용합니다.

## 📞 연락처

- Email: support@vocavision.com
- GitHub: https://github.com/josens83/vocavision
