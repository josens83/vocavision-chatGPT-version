# Chapter 1: 디자인 이상 징후 진단 및 우선순위

## 스샷 기준으로 보이는 이상 징후 5개 (원인 후보 포함)

### A. 상단 배너 + 헤더가 섹션을 "덮는 느낌"
- 최상단 프로모 배너가 sticky/fixed처럼 보이고, 아래 섹션이 살짝 밀리거나 겹쳐보임.
- 원인 후보: `position: fixed` + `padding-top` 보정 누락 / 헤더 높이 계산 불일치 / 배너가 닫힌 후 높이 transition 미처리.
- **액션**: 헤더/배너가 fixed면 전체 레이아웃에 top padding 통일(`body { padding-top: var(--header-offset) }` 등), 배너 닫기 상태에서 height=0이 되도록 `overflow-hidden + transition-height` 정리.

### B. 섹션 배경이 "툭툭 끊기고" 톤이 뒤죽박죽
- 상단은 파스텔/그리드 느낌, 중간은 딥 네이비, 그 다음은 청록 그라데이션 등 톤 전환이 급함.
- 원인 후보: 섹션 컴포넌트가 각각 독자적으로 배경 설정(전역 테마 토큰 없이 하드코딩).
- **액션**: `Section` 공통 컴포넌트로 배경을 3종(`default|muted|dark`)으로 제한하고, 다크 섹션 전환 시 gradient-divider를 넣어 부드럽게 전환.

### C. "오늘의 추천 단어" 카드 UI 깨짐
- 카드가 과도하게 희미하고(텍스트 대비 낮음), 숫자 배지/타이포가 일정하지 않아 보임.
- 원인 후보: 카드 컴포넌트의 `opacity`/`backdrop`/`mix-blend`가 배경과 충돌하거나 글로벌 CSS 변경.
- **액션**: 카드 베이스 스타일을 한 파일로 고정(`bg-white/80 + border + shadow-sm` 등), 텍스트 대비를 높이고(`text-slate-900`, `text-slate-600` 등), 부모 opacity는 제거하고 배경 레이어에만 적용.

### D. 채팅 위젯/플로팅 버튼이 콘텐츠를 가림
- 우하단 "고객센터&FAQ" 위젯이 섹션 CTA/푸터 링크를 침범.
- 원인 후보: `z-index` 과다 + bottom padding 미확보.
- **액션**: 페이지 공통 `SafeAreaBottom` 패딩 추가(`pb-[120px]` 등) 또는 위젯이 있는 페이지에서만 bottom offset을 올려 충돌 방지.

### E. 한 페이지 안에 CTA가 너무 많아 시선이 흩어짐
- 상단 CTA 2개 + 중간 D-day CTA + 하단 CTA가 반복 배치되어 전체가 광고배너처럼 느껴짐.
- **액션**: 랜딩 CTA는 "Primary 1개, Secondary 1개"만 유지하고, 중간 CTA는 정보 섹션처럼 보이도록 버튼 대비/크기를 낮춰 정돈.

## 정확한 조사 순서
1. Header/Banner 레이아웃 확인: fixed/sticky 여부 및 배너 닫기 전후 레이아웃 shift 측정.
2. Section 배경 토큰화: 랜딩 페이지에 쓰이는 배경 클래스(`bg-gradient`, `bg-slate-900` 등) 사용처를 리스트업.
3. Card 컴포넌트 대비 복구: 추천단어/패키지/후기 카드의 base 스타일 통일.
4. Floating UI Safe Area 처리: 위젯이 있는 페이지에 `pb` 확보 또는 위젯 위치 조정.

## 한 방 프롬프트(복붙용)
```
랜딩 페이지 디자인이 깨졌습니다. 아래 우선순위로 수정해주세요.

1) Header + Promo banner가 fixed/sticky면 레이아웃 보정(top padding)과 닫기 후 height=0 처리로 겹침/점프를 제거하세요.
2) 섹션 배경이 제각각이라 톤이 튑니다. Section 공통 컴포넌트를 만들고 background variant를 default/muted/dark 3개로 제한해 전환을 부드럽게 해주세요.
3) “오늘의 추천 단어” 카드가 흐리고 대비가 낮습니다. 부모 opacity 제거, 카드 base를 bg-white/80 + border + shadow-sm로 통일하고 텍스트 대비를 올리세요.
4) 우하단 고객센터 위젯이 CTA/푸터를 가립니다. 랜딩 페이지에 safe-area bottom padding을 추가하거나 위젯 bottom offset을 올리세요.
변경은 PR 단위로, 스크린샷 비교가 가능하게 최소 단위 커밋으로 나눠주세요.
```
