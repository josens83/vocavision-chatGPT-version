# 수능 3000 단어 구조 설계

## 레벨 분류

| 레벨 | 단어 수 | CEFR | 난이도 | 설명 |
|------|--------|------|--------|------|
| L1 | 1,000 | B1-B2 | BASIC-INTERMEDIATE | 수능 기출 필수 어휘 |
| L2 | 1,000 | B2 | INTERMEDIATE | 수능 고빈도 어휘 |
| L3 | 1,000 | B2-C1 | ADVANCED | 수능 고난도/변별력 어휘 |

## CSV 구조

```csv
word,examCategory,cefrLevel,difficulty,partOfSpeech,level,frequency,tags
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| word | string | Y | 영단어 |
| examCategory | enum | Y | CSAT |
| cefrLevel | enum | Y | A1, A2, B1, B2, C1, C2 |
| difficulty | enum | Y | BASIC, INTERMEDIATE, ADVANCED |
| partOfSpeech | enum | Y | NOUN, VERB, ADJECTIVE, ADVERB, etc. |
| level | string | Y | L1, L2, L3 |
| frequency | int | Y | 1-100 (100이 가장 고빈도) |
| tags | string | N | 쉼표로 구분된 태그들 |

## 태그 분류

### 주제별
- 사회/정치
- 과학/기술
- 경제/비즈니스
- 환경/자연
- 문화/예술
- 심리/감정
- 교육/학습
- 건강/의학

### 출제 유형별
- 빈칸추론
- 어휘추론
- 글의순서
- 주제파악
- 요약문

## 수능 기출 단어 수집 방법

### 1. EBS 연계 교재 분석
- 수능특강 영어
- 수능완성 영어

### 2. 최근 5개년 수능/모의고사 분석
- 2020-2024 수능 기출
- 평가원 모의고사
- 교육청 모의고사

### 3. 빈도 분석
- 각 단어의 출제 빈도 계산
- 고빈도 단어 우선 L1 배치

## Admin UI 활용 방법

### CSV Import
1. Admin UI (/admin) 접속
2. Words 탭 → Import 버튼
3. CSV 파일 업로드
4. 배치로 단어 생성

### AI 콘텐츠 생성
1. Import 완료 후 단어 선택
2. "AI 일괄 생성" 버튼 클릭
3. 9가지 콘텐츠 자동 생성:
   - 발음 (IPA)
   - 정의 (영/한)
   - 어원
   - 형태소 분석
   - 콜로케이션
   - 라이밍
   - 연상 기억법
   - 예문
   - 관련어

### 워크플로우
```
CSV Import → DRAFT
     ↓
AI 콘텐츠 생성
     ↓
검토/편집 → PENDING_REVIEW
     ↓
일괄 승인 → APPROVED
     ↓
일괄 발행 → PUBLISHED
```

## 샘플 데이터 (L1 추가 예정)

현재 100개 (csat-starter-100.csv)
→ L1 추가 900개 필요
→ L2 1000개 필요
→ L3 1000개 필요

## 데이터 소스

### 무료 공개 데이터
1. EBS 연계 교재 단어 목록 (공개된 것)
2. 수능 기출 분석 자료
3. CEFR 기준 단어 목록

### 참고 자료
- Oxford 3000/5000
- Academic Word List (AWL)
- 수능 어휘 빈도 분석 논문
