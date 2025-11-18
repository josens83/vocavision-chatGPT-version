# VocaVision API 문서

Base URL: `http://localhost:3001/api`

## 인증 (Authentication)

### POST /auth/register
회원가입

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER",
    "subscriptionStatus": "TRIAL",
    "trialEnd": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
로그인

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER",
    "subscriptionStatus": "ACTIVE"
  },
  "token": "jwt_token"
}
```

### GET /auth/profile
프로필 조회 (인증 필요)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "avatar": "url",
    "role": "USER",
    "subscriptionStatus": "ACTIVE",
    "totalWordsLearned": 150,
    "currentStreak": 7,
    "longestStreak": 30
  }
}
```

## 단어 (Words)

### GET /words
단어 목록 조회 (인증 필요)

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 20)
- `difficulty`: 난이도 필터 (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `search`: 단어 검색

**Response:**
```json
{
  "words": [
    {
      "id": "uuid",
      "word": "example",
      "definition": "예시, 사례",
      "pronunciation": "igˈzampəl",
      "partOfSpeech": "NOUN",
      "difficulty": "INTERMEDIATE",
      "images": [...],
      "mnemonics": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

### GET /words/:id
단어 상세 조회 (인증 필요)

**Response:**
```json
{
  "word": {
    "id": "uuid",
    "word": "example",
    "definition": "예시, 사례",
    "pronunciation": "igˈzampəl",
    "partOfSpeech": "NOUN",
    "difficulty": "INTERMEDIATE",
    "examples": [...],
    "images": [...],
    "videos": [...],
    "rhymes": [...],
    "mnemonics": [...],
    "etymology": {...},
    "synonyms": [...],
    "antonyms": [...]
  }
}
```

### GET /words/random
랜덤 단어 조회 (인증 필요)

**Query Parameters:**
- `count`: 단어 개수 (기본값: 10)
- `difficulty`: 난이도 필터

**Response:**
```json
{
  "words": [...]
}
```

## 학습 진행 (Progress)

### GET /progress
사용자 학습 진행 상황 조회 (인증 필요)

**Response:**
```json
{
  "progress": [
    {
      "id": "uuid",
      "wordId": "uuid",
      "masteryLevel": "LEARNING",
      "correctCount": 5,
      "incorrectCount": 2,
      "nextReviewDate": "2024-01-01T00:00:00Z",
      "word": {...}
    }
  ],
  "stats": {
    "totalWordsLearned": 150,
    "currentStreak": 7,
    "longestStreak": 30
  }
}
```

### GET /progress/due
복습 예정 단어 조회 (인증 필요)

**Response:**
```json
{
  "reviews": [
    {
      "wordId": "uuid",
      "word": {...}
    }
  ],
  "count": 15
}
```

### POST /progress/review
복습 제출 (인증 필요)

**Request Body:**
```json
{
  "wordId": "uuid",
  "rating": 4,
  "responseTime": 3500,
  "learningMethod": "FLASHCARD",
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "message": "Review submitted successfully",
  "progress": {...},
  "nextReviewDate": "2024-01-02T00:00:00Z"
}
```

### POST /progress/session/start
학습 세션 시작 (인증 필요)

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "userId": "uuid",
    "startTime": "2024-01-01T00:00:00Z"
  }
}
```

### POST /progress/session/end
학습 세션 종료 (인증 필요)

**Request Body:**
```json
{
  "sessionId": "uuid",
  "wordsStudied": 20,
  "wordsCorrect": 18
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "duration": 1200,
    "wordsStudied": 20,
    "wordsCorrect": 18
  }
}
```

## 구독 (Subscriptions)

### POST /subscriptions/create-checkout
결제 세션 생성 (인증 필요)

**Request Body:**
```json
{
  "plan": "monthly"
}
```

**Response:**
```json
{
  "sessionUrl": "https://checkout.stripe.com/..."
}
```

### GET /subscriptions/status
구독 상태 조회 (인증 필요)

**Response:**
```json
{
  "subscription": {
    "subscriptionStatus": "ACTIVE",
    "subscriptionPlan": "MONTHLY",
    "subscriptionStart": "2024-01-01T00:00:00Z",
    "subscriptionEnd": "2024-02-01T00:00:00Z"
  }
}
```

### POST /subscriptions/cancel
구독 취소 (인증 필요)

**Response:**
```json
{
  "message": "Subscription cancelled successfully"
}
```

## 에러 응답

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": "Error message",
  "status": 400
}
```

### HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `403`: 권한 없음
- `404`: 리소스 없음
- `409`: 충돌 (중복)
- `429`: 요청 제한 초과
- `500`: 서버 에러

## Rate Limiting

- 시간 창: 15분
- 최대 요청: 100회

제한 초과 시 `429 Too Many Requests` 반환
