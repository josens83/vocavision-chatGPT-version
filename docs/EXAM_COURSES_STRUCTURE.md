# VocaVision 시험별 코스 구조

## 코스 개요

| 시험 | 목표 단어 수 | 현재 상태 | 우선순위 |
|------|-------------|----------|----------|
| CSAT (수능) | 3,000 | 429개 구축 | ★★★ (1순위) |
| TOEIC | 3,500 | 0개 | ★★☆ (2순위) |
| TEPS | 4,000 | 0개 | ★★☆ (2순위) |
| TOEFL | 5,000 | 0개 | ★☆☆ (3순위) |
| SAT | 4,500 | 0개 | ★☆☆ (3순위) |

---

## CSAT (수능) 3,000

### 레벨 구조
| 레벨 | 단어 수 | CEFR | 특징 |
|------|--------|------|------|
| L1 | 1,000 | B1-B2 | 수능 기출 필수 |
| L2 | 1,000 | B2 | 수능 고빈도 |
| L3 | 1,000 | B2-C1 | 고난도 변별력 |

### 데이터 소스
- EBS 연계 교재
- 최근 5개년 수능/모의고사 기출
- 수능 어휘 빈도 분석

---

## TOEIC 3,500

### 레벨 구조
| 레벨 | 단어 수 | 점수대 | 특징 |
|------|--------|--------|------|
| L1 | 1,000 | 600+ | 기본 비즈니스 어휘 |
| L2 | 1,200 | 750+ | 핵심 비즈니스 표현 |
| L3 | 1,300 | 900+ | 고급 비즈니스/전문 용어 |

### 주제 분류
- 일반 비즈니스 (General Business)
- 인사/채용 (Personnel/Recruitment)
- 마케팅/광고 (Marketing/Advertising)
- 재무/회계 (Finance/Accounting)
- 제조/품질 (Manufacturing/Quality)
- 사무/행정 (Office/Administration)
- 출장/여행 (Travel/Transportation)
- 회의/협상 (Meetings/Negotiations)

### 데이터 소스
- ETS 공식 TOEIC 기출
- TOEIC 빈출 어휘 분석
- 비즈니스 영어 코퍼스

---

## TEPS 4,000

### 레벨 구조
| 레벨 | 단어 수 | 점수대 | 특징 |
|------|--------|--------|------|
| L1 | 1,200 | 400+ | TEPS 기본 어휘 |
| L2 | 1,400 | 500+ | 어휘 파트 집중 |
| L3 | 1,400 | 550+ | 고난도 어휘/숙어 |

### 특징
- 동의어/반의어 중심
- 다의어 활용
- 관용 표현 중시
- 문맥 속 어휘 추론

### 데이터 소스
- 서울대학교 TEPS 관리위원회 기출
- TEPS 어휘 빈도 분석
- 학술 영어 어휘 목록

---

## CSV 공통 형식

```csv
word,examCategory,cefrLevel,difficulty,partOfSpeech,level,frequency,tags
```

### examCategory 값
- CSAT
- TOEIC
- TEPS
- TOEFL
- SAT

### difficulty 값
- BASIC
- INTERMEDIATE
- ADVANCED

### level 값 (시험별)
- CSAT: L1, L2, L3
- TOEIC: L1, L2, L3
- TEPS: L1, L2, L3

---

## Admin UI 대량 등록 절차

### 1. CSV 준비
```bash
# 형식 검증
head -1 data/csat-starter-100.csv
# word,examCategory,cefrLevel,difficulty,partOfSpeech,level,frequency,tags
```

### 2. Admin UI Import
1. `/admin` 접속
2. Words → Import
3. CSV 파일 선택
4. 필드 매핑 확인
5. Import 실행

### 3. AI 콘텐츠 생성
1. 생성된 단어 선택 (전체 또는 일부)
2. "AI 일괄 생성" 클릭
3. 배치 작업 모니터링

### 4. 검토 및 발행
```
DRAFT → [AI 생성] → PENDING_REVIEW → [검토] → APPROVED → [발행] → PUBLISHED
```

---

## 콘텐츠 품질 기준 (GOLD Standard)

### 필수 콘텐츠 (9가지)
1. ✅ 발음 (IPA 미국/영국)
2. ✅ 정의 (영어/한국어)
3. ✅ 어원 분석
4. ✅ 형태소 분석
5. ✅ 콜로케이션 5-7개
6. ✅ 라이밍 단어 3-5개
7. ✅ 연상 기억법 (경선식 스타일)
8. ✅ 예문 4-6개
9. ✅ 관련어 (동의어/반의어)

### 품질 체크리스트
- [ ] 한국어 정의가 자연스러운가?
- [ ] 연상 기억법이 발음과 연결되는가?
- [ ] 예문이 시험 출제 유형과 맞는가?
- [ ] 콜로케이션이 실제로 자주 쓰이는가?

---

## 마일스톤

### Phase 1: CSAT 완성 (현재)
- [x] 100개 기본 단어
- [ ] L1 1,000개 완성
- [ ] L2 1,000개 완성
- [ ] L3 1,000개 완성

### Phase 2: TOEIC 구축
- [ ] L1 1,000개
- [ ] L2 1,200개
- [ ] L3 1,300개

### Phase 3: TEPS 구축
- [ ] L1 1,200개
- [ ] L2 1,400개
- [ ] L3 1,400개
