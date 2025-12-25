export const landingLocales = {
  ko: {
    hero: {
      badge: "스마트 영어 학습 플랫폼",
      headline: {
        primary: "영어 단어 학습 루틴을",
        secondary: "AI가 하루 60분으로 설계",
      },
      description:
        "레벨별 목표에 맞춰 AI가 하루 60분 학습 루틴과 복습 타이밍을 제안합니다. 오답 기반 적응형 퀴즈로 실제 시험처럼 대비하세요.",
      guestCtas: {
        primary: { label: "60초 맛보기", href: "/learn?exam=CSAT&demo=1" },
        secondary: { label: "무료 회원가입", href: "/auth/login" },
      },
      authCtas: {
        primary: { label: "학습 시작하기", href: "/study" },
        secondary: { label: "복습하기", href: "/review?exam=CSAT" },
      },
      experienceCard: {
        title: "60초 안에 체험해보세요!",
        description: "회원가입 없이 샘플 단어로 빠르게 체험",
        cta: { label: "맛보기 시작", href: "/learn?exam=CSAT&demo=1" },
      },
      dailyGoalCard: {
        title: "오늘의 학습 목표",
        description: "새로운 단어 10개 학습 + 복습 퀴즈 완료 도전",
        cta: { label: "퀴즈 시작", href: "/quiz" },
      },
      features: [
        { title: "스마트 플래시카드", description: "AI가 이해도에 맞춰 카드 순서를 조정" },
        { title: "적응형 퀴즈", description: "최근 오답을 중심으로 난이도 자동 조절" },
        { title: "학습 분석", description: "일별 학습 시간·정답률을 한눈에 확인" },
      ],
    },
    learningFlow: [
      {
        key: "learn",
        title: "학습",
        description: "AI 추천 루틴으로 오늘 배울 단어와 예문을 제시합니다.",
        cta: { label: "학습 시작", href: "/learn?exam=CSAT" },
      },
      {
        key: "test",
        title: "테스트",
        description: "적응형 퀴즈와 레벨 테스트로 이해도를 점검합니다.",
        cta: { label: "퀴즈 풀기", href: "/quiz?exam=CSAT" },
      },
      {
        key: "review",
        title: "복습",
        description: "틀린 문제와 약점 어휘를 복습 노트로 바로 확인합니다.",
        cta: { label: "복습 노트", href: "/review?exam=CSAT" },
      },
      {
        key: "progress",
        title: "성과 확인",
        description: "일별 학습 시간과 정답률, 레벨 변화를 대시보드에서 확인합니다.",
        cta: { label: "학습 통계", href: "/dashboard" },
      },
    ],
  },
};

export type LandingLocale = (typeof landingLocales)[keyof typeof landingLocales];
