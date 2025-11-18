# VocaVision 아키텍처

## 시스템 개요

VocaVision은 다양한 학습 방법을 제공하는 영어 단어 학습 플랫폼입니다.

## 기술 스택

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Payment**: Stripe
- **AI Integration**: OpenAI API

### Web Application
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios

### Mobile Application
- **Framework**: React Native + Expo
- **UI Library**: React Native Paper
- **Navigation**: React Navigation

## 시스템 구조

```
┌─────────────────────────────────────────────────┐
│                    Client Layer                  │
├─────────────────┬───────────────────────────────┤
│   Web App       │      Mobile App               │
│  (Next.js)      │   (React Native)              │
└────────┬────────┴──────────┬────────────────────┘
         │                   │
         └───────────┬───────┘
                     │
         ┌───────────▼──────────────┐
         │     API Gateway          │
         │   (Express.js)           │
         └───────────┬──────────────┘
                     │
         ┌───────────▼──────────────┐
         │   Business Logic         │
         │   - Auth Service         │
         │   - Word Service         │
         │   - Progress Service     │
         │   - Subscription Service │
         └───────────┬──────────────┘
                     │
         ┌───────────▼──────────────┐
         │     Data Layer           │
         │   - PostgreSQL           │
         │   - Prisma ORM           │
         └──────────────────────────┘
```

## 데이터베이스 설계

### 주요 엔티티

1. **User**: 사용자 정보 및 구독 상태
2. **Word**: 영어 단어 및 기본 정보
3. **WordImage**: 단어 관련 이미지
4. **WordVideo**: 단어 관련 동영상/애니메이션
5. **Rhyme**: 라이밍 단어
6. **Mnemonic**: 연상법/기억술
7. **Etymology**: 어원 정보
8. **UserProgress**: 사용자 학습 진행 상황
9. **Review**: 복습 기록
10. **StudySession**: 학습 세션

### 관계도

```
User ──┬── UserProgress ── Word
       ├── Review
       ├── StudySession
       └── CustomMnemonic

Word ──┬── WordImage
       ├── WordVideo
       ├── Rhyme
       ├── Mnemonic
       ├── Etymology
       ├── Example
       ├── Synonym
       └── Antonym
```

## 학습 방법

### 1. 이미지 학습
- AI 생성 이미지 (OpenAI DALL-E)
- 전문가 제작 일러스트
- 스톡 사진

### 2. 동영상/애니메이션
- 애니메이션
- 실사 영상
- 모션 그래픽스

### 3. 라이밍 (Rhyming)
- 발음 유사도 알고리즘
- 예문 제공

### 4. 연상법 (Mnemonics)
- AI 생성 연상법
- 전문가 제작 연상법
- 커뮤니티 제작 연상법
- 사용자 맞춤 연상법

### 5. 어원 학습
- 단어의 기원
- 어근 분석
- 관련 단어 제시

### 6. 간격 반복 (Spaced Repetition)
- SM-2 알고리즘 사용
- 최적의 복습 시점 계산
- 장기 기억 강화

## 보안

### 인증 및 권한
- JWT 토큰 기반 인증
- 비밀번호 해싱 (bcrypt)
- Role-based Access Control (RBAC)

### API 보안
- Rate Limiting
- CORS 설정
- Helmet.js 보안 헤더

### 결제 보안
- Stripe 결제 게이트웨이
- Webhook 서명 검증
- PCI DSS 준수

## 성능 최적화

### Backend
- 데이터베이스 인덱싱
- API 응답 캐싱
- 페이지네이션

### Frontend
- 이미지 최적화
- 코드 스플리팅
- 서버 사이드 렌더링 (SSR)

## 배포

### Backend
- AWS EC2 또는 Heroku
- PostgreSQL (AWS RDS)
- Cloudinary (미디어 스토리지)

### Web
- Vercel

### Mobile
- Expo EAS Build
- App Store / Google Play

## 모니터링

- 에러 로깅
- 성능 메트릭
- 사용자 분석

## 확장성

### Horizontal Scaling
- 로드 밸런서
- 다중 서버 인스턴스

### Vertical Scaling
- 서버 리소스 업그레이드
- 데이터베이스 성능 향상

## 향후 개선 사항

1. **Redis 캐싱**: API 응답 캐싱
2. **CDN**: 정적 자산 배포
3. **GraphQL**: REST API 대체
4. **WebSocket**: 실시간 기능
5. **마이크로서비스**: 서비스 분리
