import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 시험별 단어 데이터 (수능, TEPS, TOEIC, TOEFL, SAT)

// ============================================
// 수능 (CSAT) 영어단어 - 대학수학능력시험
// ============================================
const csatWords = [
  {
    word: 'accomplish',
    definition: 'to succeed in doing or completing something',
    definitionKo: '성취하다, 달성하다',
    pronunciation: 'əˈkɒmplɪʃ',
    phonetic: '/əˈkɒmplɪʃ/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 350,
    tips: '수능 빈출! ac(to) + complish(완성하다) = 완전히 끝내다',
    examples: { create: [{ sentence: 'She accomplished her goal of becoming a doctor.', translation: '그녀는 의사가 되겠다는 목표를 달성했다.' }] },
  },
  {
    word: 'adequate',
    definition: 'enough in quantity or good enough in quality for a purpose',
    definitionKo: '적절한, 충분한',
    pronunciation: 'ˈædɪkwət',
    phonetic: '/ˈædɪkwət/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 420,
    tips: 'ad(to) + equate(같게 하다) = 필요한 만큼 맞추다',
  },
  {
    word: 'apparent',
    definition: 'clearly visible or understood; obvious',
    definitionKo: '분명한, 명백한',
    pronunciation: 'əˈpærənt',
    phonetic: '/əˈpærənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 380,
    tips: '수능 독해에서 자주 등장! "분명히 보이는"',
  },
  {
    word: 'emphasize',
    definition: 'to give special importance to something',
    definitionKo: '강조하다',
    pronunciation: 'ˈemfəsaɪz',
    phonetic: '/ˈemfəsaɪz/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 310,
    tips: '글의 주제나 요지 파악 문제에서 필수!',
  },
  {
    word: 'circumstance',
    definition: 'the conditions and facts connected with an event or situation',
    definitionKo: '상황, 환경',
    pronunciation: 'ˈsɜːkəmstəns',
    phonetic: '/ˈsɜːkəmstəns/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 400,
    tips: 'circum(주위) + stance(서다) = 주위 상황',
  },
  {
    word: 'consequence',
    definition: 'a result or effect of an action',
    definitionKo: '결과, 영향',
    pronunciation: 'ˈkɒnsɪkwəns',
    phonetic: '/ˈkɒnsɪkwəns/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 360,
    tips: '인과관계 파악 문제 핵심 단어!',
  },
  {
    word: 'distinguish',
    definition: 'to recognize the difference between things',
    definitionKo: '구별하다, 구분하다',
    pronunciation: 'dɪˈstɪŋɡwɪʃ',
    phonetic: '/dɪˈstɪŋɡwɪʃ/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 440,
    tips: 'dis(떨어져) + stinguish(찌르다) = 분리해서 구분하다',
  },
  {
    word: 'perspective',
    definition: 'a particular way of viewing things',
    definitionKo: '관점, 시각',
    pronunciation: 'pəˈspektɪv',
    phonetic: '/pəˈspektɪv/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 390,
    tips: '필자의 관점 파악 문제에서 핵심!',
  },
  {
    word: 'significant',
    definition: 'important or large enough to have an effect',
    definitionKo: '중요한, 의미 있는',
    pronunciation: 'sɪɡˈnɪfɪkənt',
    phonetic: '/sɪɡˈnɪfɪkənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 280,
    tips: 'sign(표시) + ificant = 표시할 만큼 중요한',
  },
  {
    word: 'fundamental',
    definition: 'forming the base from which everything else develops',
    definitionKo: '근본적인, 기본적인',
    pronunciation: 'ˌfʌndəˈmentl',
    phonetic: '/ˌfʌndəˈmentl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 450,
    tips: 'funda(기초) + mental = 기초가 되는',
  },
  // 더 많은 수능 단어
  {
    word: 'acknowledge',
    definition: 'to accept or admit the existence or truth of',
    definitionKo: '인정하다, 알다',
    pronunciation: 'əkˈnɒlɪdʒ',
    phonetic: '/əkˈnɒlɪdʒ/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 380,
  },
  {
    word: 'attribute',
    definition: 'to regard as being caused by',
    definitionKo: '~의 탓으로 하다, 속성',
    pronunciation: 'əˈtrɪbjuːt',
    phonetic: '/əˈtrɪbjuːt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 410,
  },
  {
    word: 'conventional',
    definition: 'based on what is traditionally done',
    definitionKo: '전통적인, 관습적인',
    pronunciation: 'kənˈvenʃənl',
    phonetic: '/kənˈvenʃənl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 430,
  },
  {
    word: 'crucial',
    definition: 'extremely important or necessary',
    definitionKo: '결정적인, 중대한',
    pronunciation: 'ˈkruːʃl',
    phonetic: '/ˈkruːʃl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 340,
  },
  {
    word: 'derive',
    definition: 'to obtain something from a source',
    definitionKo: '얻다, 유래하다',
    pronunciation: 'dɪˈraɪv',
    phonetic: '/dɪˈraɪv/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'CSAT',
    frequency: 460,
  },
];

// ============================================
// TEPS 영어단어 - 서울대 영어시험
// ============================================
const tepsWords = [
  {
    word: 'astute',
    definition: 'having an ability to notice and understand things clearly',
    definitionKo: '기민한, 명민한',
    pronunciation: 'əˈstjuːt',
    phonetic: '/əˈstjuːt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 720,
    tips: 'TEPS 고급 어휘! acute(날카로운)와 비교',
  },
  {
    word: 'discern',
    definition: 'to see, recognize, or understand something',
    definitionKo: '분별하다, 알아차리다',
    pronunciation: 'dɪˈsɜːn',
    phonetic: '/dɪˈsɜːn/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 680,
    tips: 'dis(분리) + cern(구분하다) = 분리해서 구분하다',
  },
  {
    word: 'eloquent',
    definition: 'expressing yourself clearly and effectively',
    definitionKo: '웅변적인, 유창한',
    pronunciation: 'ˈeləkwənt',
    phonetic: '/ˈeləkwənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 750,
  },
  {
    word: 'substantiate',
    definition: 'to provide evidence to support or prove',
    definitionKo: '입증하다, 실체화하다',
    pronunciation: 'səbˈstænʃieɪt',
    phonetic: '/səbˈstænʃieɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 800,
    tips: 'substance(실체) + ate = 실체로 만들다 → 입증하다',
  },
  {
    word: 'meticulous',
    definition: 'very careful about details',
    definitionKo: '꼼꼼한, 세심한',
    pronunciation: 'məˈtɪkjələs',
    phonetic: '/məˈtɪkjələs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 690,
  },
  {
    word: 'pervasive',
    definition: 'existing in all parts of something',
    definitionKo: '만연한, 퍼져있는',
    pronunciation: 'pəˈveɪsɪv',
    phonetic: '/pəˈveɪsɪv/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 770,
    tips: 'per(완전히) + vas(가다) + ive = 완전히 퍼져나간',
  },
  {
    word: 'unprecedented',
    definition: 'never having happened before',
    definitionKo: '전례 없는',
    pronunciation: 'ʌnˈpresɪdentɪd',
    phonetic: '/ʌnˈpresɪdentɪd/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 640,
    tips: 'un + precedent(선례) + ed = 선례가 없는',
  },
  {
    word: 'alleviate',
    definition: 'to make something less severe',
    definitionKo: '완화하다, 경감하다',
    pronunciation: 'əˈliːvieɪt',
    phonetic: '/əˈliːvieɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 710,
    tips: 'al(to) + lev(가볍게) + iate = 가볍게 하다',
  },
  {
    word: 'exacerbate',
    definition: 'to make a problem worse',
    definitionKo: '악화시키다',
    pronunciation: 'ɪɡˈzæsəbeɪt',
    phonetic: '/ɪɡˈzæsəbeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 780,
    tips: 'alleviate의 반의어! ex + acerb(신랄한) = 더 신랄하게',
  },
  {
    word: 'mitigate',
    definition: 'to make something less harmful or serious',
    definitionKo: '완화하다, 줄이다',
    pronunciation: 'ˈmɪtɪɡeɪt',
    phonetic: '/ˈmɪtɪɡeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 730,
  },
  // 더 많은 TEPS 단어
  {
    word: 'arduous',
    definition: 'demanding great effort or labor',
    definitionKo: '힘든, 고된',
    pronunciation: 'ˈɑːdjuəs',
    phonetic: '/ˈɑːdjuəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 760,
  },
  {
    word: 'commensurate',
    definition: 'corresponding in size or degree',
    definitionKo: '상응하는, 비례하는',
    pronunciation: 'kəˈmenʃərət',
    phonetic: '/kəˈmenʃərət/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 820,
  },
  {
    word: 'convoluted',
    definition: 'extremely complex and difficult to follow',
    definitionKo: '복잡한, 난해한',
    pronunciation: 'ˈkɒnvəluːtɪd',
    phonetic: '/ˈkɒnvəluːtɪd/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 790,
  },
  {
    word: 'efficacious',
    definition: 'producing the desired result',
    definitionKo: '효과적인',
    pronunciation: 'ˌefɪˈkeɪʃəs',
    phonetic: '/ˌefɪˈkeɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 850,
  },
  {
    word: 'surreptitious',
    definition: 'done secretly or without anyone noticing',
    definitionKo: '은밀한, 비밀스러운',
    pronunciation: 'ˌsʌrəpˈtɪʃəs',
    phonetic: '/ˌsʌrəpˈtɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TEPS',
    frequency: 880,
  },
];

// ============================================
// TOEIC 영어단어 - 비즈니스 영어
// ============================================
const toeicWords = [
  {
    word: 'comply',
    definition: 'to act in accordance with rules or standards',
    definitionKo: '준수하다, 따르다',
    pronunciation: 'kəmˈplaɪ',
    phonetic: '/kəmˈplaɪ/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 290,
    tips: 'TOEIC 필수! comply with regulations (규정을 준수하다)',
    commonMistakes: 'comply는 자동사! comply with + 목적어 형태로 사용',
  },
  {
    word: 'expedite',
    definition: 'to make an action happen sooner or faster',
    definitionKo: '촉진하다, 신속히 처리하다',
    pronunciation: 'ˈekspədaɪt',
    phonetic: '/ˈekspədaɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 380,
    tips: '비즈니스 이메일에서 자주 사용! "신속히 처리해 주세요"',
  },
  {
    word: 'reimburse',
    definition: 'to pay back money that someone has spent',
    definitionKo: '상환하다, 환급하다',
    pronunciation: 'ˌriːɪmˈbɜːs',
    phonetic: '/ˌriːɪmˈbɜːs/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 420,
    tips: 'TOEIC 경비 관련 문제 필수! reimburse expenses (경비를 환급하다)',
  },
  {
    word: 'invoice',
    definition: 'a list of goods sent or services provided with costs',
    definitionKo: '송장, 청구서',
    pronunciation: 'ˈɪnvɔɪs',
    phonetic: '/ˈɪnvɔɪs/',
    partOfSpeech: 'NOUN',
    difficulty: 'BASIC',
    examCategory: 'TOEIC',
    frequency: 250,
    tips: 'bill보다 공식적인 표현. issue an invoice (송장을 발행하다)',
  },
  {
    word: 'quarterly',
    definition: 'happening or produced every three months',
    definitionKo: '분기별의, 분기마다',
    pronunciation: 'ˈkwɔːtəli',
    phonetic: '/ˈkwɔːtəli/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BASIC',
    examCategory: 'TOEIC',
    frequency: 310,
    tips: 'quarter(4분의 1) + ly = 분기별',
  },
  {
    word: 'tentative',
    definition: 'not certain or fixed; provisional',
    definitionKo: '잠정적인, 임시의',
    pronunciation: 'ˈtentətɪv',
    phonetic: '/ˈtentətɪv/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 360,
    tips: 'tentative schedule (잠정적인 일정)',
  },
  {
    word: 'amenity',
    definition: 'a desirable feature or facility of a place',
    definitionKo: '편의시설, 생활편의',
    pronunciation: 'əˈmenəti',
    phonetic: '/əˈmenəti/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 400,
    tips: '호텔/사무실 관련 문제에서 자주 등장!',
  },
  {
    word: 'adjacent',
    definition: 'next to or near something',
    definitionKo: '인접한, 가까운',
    pronunciation: 'əˈdʒeɪsnt',
    phonetic: '/əˈdʒeɪsnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 350,
    tips: 'adjacent to the building (건물에 인접한)',
  },
  {
    word: 'prospective',
    definition: 'expected or expecting to be something',
    definitionKo: '장래의, 예상되는',
    pronunciation: 'prəˈspektɪv',
    phonetic: '/prəˈspektɪv/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 380,
    tips: 'prospective client (잠재 고객)',
  },
  {
    word: 'unanimous',
    definition: 'agreed by everyone',
    definitionKo: '만장일치의',
    pronunciation: 'juːˈnænɪməs',
    phonetic: '/juːˈnænɪməs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 450,
    tips: 'uni(하나) + anim(마음) = 마음이 하나인 → 만장일치',
  },
  // 더 많은 TOEIC 단어
  {
    word: 'consolidate',
    definition: 'to combine several things into one',
    definitionKo: '통합하다, 강화하다',
    pronunciation: 'kənˈsɒlɪdeɪt',
    phonetic: '/kənˈsɒlɪdeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 410,
  },
  {
    word: 'mandatory',
    definition: 'required by law or rules; compulsory',
    definitionKo: '의무적인, 필수의',
    pronunciation: 'ˈmændətəri',
    phonetic: '/ˈmændətəri/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 320,
  },
  {
    word: 'feasible',
    definition: 'possible and practical to do easily',
    definitionKo: '실행 가능한',
    pronunciation: 'ˈfiːzəbl',
    phonetic: '/ˈfiːzəbl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 390,
  },
  {
    word: 'warranty',
    definition: 'a written guarantee promising to repair or replace',
    definitionKo: '보증, 품질보증서',
    pronunciation: 'ˈwɒrənti',
    phonetic: '/ˈwɒrənti/',
    partOfSpeech: 'NOUN',
    difficulty: 'BASIC',
    examCategory: 'TOEIC',
    frequency: 270,
  },
  {
    word: 'liable',
    definition: 'legally responsible for something',
    definitionKo: '책임이 있는, ~하기 쉬운',
    pronunciation: 'ˈlaɪəbl',
    phonetic: '/ˈlaɪəbl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEIC',
    frequency: 430,
  },
];

// ============================================
// TOEFL 영어단어 - 학술 영어
// ============================================
const toeflWords = [
  {
    word: 'paradigm',
    definition: 'a typical example or pattern of something',
    definitionKo: '패러다임, 전형',
    pronunciation: 'ˈpærədaɪm',
    phonetic: '/ˈpærədaɪm/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 620,
    tips: '학술적 글에서 자주 사용! paradigm shift (패러다임 전환)',
  },
  {
    word: 'proliferate',
    definition: 'to increase rapidly in number',
    definitionKo: '급증하다, 확산되다',
    pronunciation: 'prəˈlɪfəreɪt',
    phonetic: '/prəˈlɪfəreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 680,
    tips: 'pro(앞으로) + lifer(생명) + ate = 생명이 늘어나다',
  },
  {
    word: 'inherent',
    definition: 'existing as a natural or basic part of something',
    definitionKo: '내재하는, 고유의',
    pronunciation: 'ɪnˈhɪərənt',
    phonetic: '/ɪnˈhɪərənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 590,
    tips: 'in(안에) + here(붙어있다) = 안에 붙어있는',
  },
  {
    word: 'catalyst',
    definition: 'something that causes an important change',
    definitionKo: '촉매, 촉진제',
    pronunciation: 'ˈkætəlɪst',
    phonetic: '/ˈkætəlɪst/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 650,
    tips: '과학 지문에서 자주 등장! 비유적으로도 사용',
  },
  {
    word: 'synthesis',
    definition: 'the combination of ideas into a complete whole',
    definitionKo: '종합, 합성',
    pronunciation: 'ˈsɪnθəsɪs',
    phonetic: '/ˈsɪnθəsɪs/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 610,
    tips: 'syn(함께) + thesis(놓다) = 함께 놓다 → 종합',
  },
  {
    word: 'hypothesis',
    definition: 'an idea or explanation that is not yet proved',
    definitionKo: '가설',
    pronunciation: 'haɪˈpɒθəsɪs',
    phonetic: '/haɪˈpɒθəsɪs/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEFL',
    frequency: 520,
    tips: 'hypo(아래) + thesis(놓다) = 아래 깔린 것 → 가설',
  },
  {
    word: 'empirical',
    definition: 'based on observation or experience rather than theory',
    definitionKo: '경험적인, 실증적인',
    pronunciation: 'ɪmˈpɪrɪkl',
    phonetic: '/ɪmˈpɪrɪkl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 700,
    tips: '과학 연구 관련 지문 필수 단어!',
  },
  {
    word: 'phenomenon',
    definition: 'a fact or situation observed to exist or happen',
    definitionKo: '현상',
    pronunciation: 'fɪˈnɒmɪnən',
    phonetic: '/fɪˈnɒmɪnən/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    examCategory: 'TOEFL',
    frequency: 480,
    tips: '복수형 phenomena 주의!',
  },
  {
    word: 'analogous',
    definition: 'similar or comparable in certain respects',
    definitionKo: '유사한, 비슷한',
    pronunciation: 'əˈnæləɡəs',
    phonetic: '/əˈnæləɡəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 720,
    tips: 'analog(유추) + ous = 유추할 수 있는 → 유사한',
  },
  {
    word: 'prevalent',
    definition: 'widespread in a particular area or at a particular time',
    definitionKo: '널리 퍼진, 유행하는',
    pronunciation: 'ˈprevələnt',
    phonetic: '/ˈprevələnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 660,
  },
  // 더 많은 TOEFL 단어
  {
    word: 'indigenous',
    definition: 'originating or occurring naturally in a place',
    definitionKo: '토착의, 고유의',
    pronunciation: 'ɪnˈdɪdʒɪnəs',
    phonetic: '/ɪnˈdɪdʒɪnəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 640,
  },
  {
    word: 'ambiguous',
    definition: 'open to more than one interpretation',
    definitionKo: '모호한, 애매한',
    pronunciation: 'æmˈbɪɡjuəs',
    phonetic: '/æmˈbɪɡjuəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 580,
  },
  {
    word: 'scrutinize',
    definition: 'to examine something very carefully',
    definitionKo: '면밀히 조사하다',
    pronunciation: 'ˈskruːtənaɪz',
    phonetic: '/ˈskruːtənaɪz/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 710,
  },
  {
    word: 'imminent',
    definition: 'about to happen',
    definitionKo: '임박한, 절박한',
    pronunciation: 'ˈɪmɪnənt',
    phonetic: '/ˈɪmɪnənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 630,
  },
  {
    word: 'tangible',
    definition: 'able to be touched or physically felt',
    definitionKo: '만질 수 있는, 실체가 있는',
    pronunciation: 'ˈtændʒəbl',
    phonetic: '/ˈtændʒəbl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'TOEFL',
    frequency: 600,
  },
];

// ============================================
// SAT 영어단어 - 미국 대입 시험
// ============================================
const satWords = [
  {
    word: 'ubiquitous',
    definition: 'present, appearing, or found everywhere',
    definitionKo: '어디에나 있는, 편재하는',
    pronunciation: 'juːˈbɪkwɪtəs',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 750,
    tips: 'SAT 고빈출! ubiqui(어디에나) + tous = 어디에나 있는',
  },
  {
    word: 'ephemeral',
    definition: 'lasting for a very short time',
    definitionKo: '일시적인, 덧없는',
    pronunciation: 'ɪˈfemərəl',
    phonetic: '/ɪˈfemərəl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 820,
    tips: '그리스어 ephemeros(하루만 사는) 에서 유래',
  },
  {
    word: 'pragmatic',
    definition: 'dealing with things sensibly and realistically',
    definitionKo: '실용적인, 현실적인',
    pronunciation: 'præɡˈmætɪk',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 680,
    tips: 'pragma(행동) + tic = 행동 중심의 → 실용적인',
  },
  {
    word: 'superfluous',
    definition: 'unnecessary, more than enough',
    definitionKo: '불필요한, 과잉의',
    pronunciation: 'suːˈpɜːfluəs',
    phonetic: '/suːˈpɜːfluəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 790,
    tips: 'super(위에) + flu(흐르다) + ous = 넘쳐흐르는 → 불필요한',
  },
  {
    word: 'verbose',
    definition: 'using or expressed in more words than needed',
    definitionKo: '장황한, 말이 많은',
    pronunciation: 'vɜːˈbəʊs',
    phonetic: '/vɜːˈbəʊs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 850,
    tips: 'verb(말) + ose = 말이 많은',
  },
  {
    word: 'laconic',
    definition: 'using very few words',
    definitionKo: '간결한, 말수가 적은',
    pronunciation: 'ləˈkɒnɪk',
    phonetic: '/ləˈkɒnɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 880,
    tips: 'verbose의 반의어! 라코니아(스파르타) 사람들의 간결한 말버릇에서 유래',
  },
  {
    word: 'ostentatious',
    definition: 'characterized by vulgar or pretentious display',
    definitionKo: '과시하는, 허세부리는',
    pronunciation: 'ˌɒstenˈteɪʃəs',
    phonetic: '/ˌɒstenˈteɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 860,
  },
  {
    word: 'candid',
    definition: 'truthful and straightforward; frank',
    definitionKo: '솔직한, 숨김없는',
    pronunciation: 'ˈkændɪd',
    phonetic: '/ˈkændɪd/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    examCategory: 'SAT',
    frequency: 620,
    tips: 'candid photo (자연스러운 사진), candid opinion (솔직한 의견)',
  },
  {
    word: 'ambivalent',
    definition: 'having mixed feelings about something',
    definitionKo: '양면감정의, 상반된 감정을 가진',
    pronunciation: 'æmˈbɪvələnt',
    phonetic: '/æmˈbɪvələnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 740,
    tips: 'ambi(양쪽) + valent(힘이 있는) = 양쪽에 힘이 있는',
  },
  {
    word: 'ameliorate',
    definition: 'to make something bad better',
    definitionKo: '개선하다, 향상시키다',
    pronunciation: 'əˈmiːliəreɪt',
    phonetic: '/əˈmiːliəreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 800,
    tips: 'a + melior(더 나은) + ate = 더 낫게 만들다',
  },
  // 더 많은 SAT 단어
  {
    word: 'benevolent',
    definition: 'well-meaning and kindly',
    definitionKo: '자비로운, 인자한',
    pronunciation: 'bəˈnevələnt',
    phonetic: '/bəˈnevələnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 720,
  },
  {
    word: 'capricious',
    definition: 'given to sudden changes of mood or behavior',
    definitionKo: '변덕스러운',
    pronunciation: 'kəˈprɪʃəs',
    phonetic: '/kəˈprɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 840,
  },
  {
    word: 'didactic',
    definition: 'intended to teach or instruct',
    definitionKo: '교훈적인, 가르치려는',
    pronunciation: 'daɪˈdæktɪk',
    phonetic: '/daɪˈdæktɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 870,
  },
  {
    word: 'eclectic',
    definition: 'deriving ideas from a broad range of sources',
    definitionKo: '절충적인, 다양한 소스에서 온',
    pronunciation: 'ɪˈklektɪk',
    phonetic: '/ɪˈklektɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 810,
  },
  {
    word: 'fervent',
    definition: 'having or displaying passionate intensity',
    definitionKo: '열렬한, 열정적인',
    pronunciation: 'ˈfɜːvənt',
    phonetic: '/ˈfɜːvənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    examCategory: 'SAT',
    frequency: 760,
  },
];

// 모든 단어 합치기
const allWords = [...csatWords, ...tepsWords, ...toeicWords, ...toeflWords, ...satWords];

// 시험 카테고리별 업적
const achievements = [
  // 일반 업적
  { name: '첫 발자국', description: '첫 번째 단어를 학습하세요', icon: '🎯', requirement: 1, type: 'WORDS_LEARNED' },
  { name: '열정적인 학습자', description: '10개의 단어를 학습하세요', icon: '📚', requirement: 10, type: 'WORDS_LEARNED' },
  { name: '단어 마스터', description: '50개의 단어를 학습하세요', icon: '🏆', requirement: 50, type: 'WORDS_LEARNED' },
  { name: '일주일 연속', description: '7일 연속 학습하세요', icon: '🔥', requirement: 7, type: 'DAILY_STREAK' },
  { name: '한 달 챌린지', description: '30일 연속 학습하세요', icon: '💪', requirement: 30, type: 'DAILY_STREAK' },
  { name: '백 일의 기적', description: '100일 연속 학습하세요', icon: '👑', requirement: 100, type: 'DAILY_STREAK' },
  { name: '완벽주의자', description: '10개의 단어를 완벽하게 복습하세요', icon: '💯', requirement: 10, type: 'PERFECT_REVIEWS' },
  { name: '다재다능', description: '5가지 학습 방법을 모두 사용하세요', icon: '🌟', requirement: 5, type: 'METHODS_USED' },
  { name: '시간 투자', description: '총 10시간 학습하세요', icon: '⏰', requirement: 36000, type: 'STUDY_TIME' },
];

// 시험별 컬렉션
const collections = [
  { name: '수능 필수 어휘', description: '대학수학능력시험 영어 영역 필수 단어', icon: '📝', category: 'CSAT', difficulty: 'INTERMEDIATE' },
  { name: 'TEPS 고급 어휘', description: '서울대 TEPS 시험 고급 어휘', icon: '🎓', category: 'TEPS', difficulty: 'ADVANCED' },
  { name: 'TOEIC 비즈니스 어휘', description: '비즈니스 영어 필수 단어', icon: '💼', category: 'TOEIC', difficulty: 'INTERMEDIATE' },
  { name: 'TOEFL 학술 어휘', description: '학술 영어 및 유학 준비 단어', icon: '🌍', category: 'TOEFL', difficulty: 'ADVANCED' },
  { name: 'SAT 고빈출 어휘', description: '미국 SAT 시험 고빈출 단어', icon: '🇺🇸', category: 'SAT', difficulty: 'ADVANCED' },
];

async function main() {
  console.log('🌱 VocaVision 데이터베이스 시딩 시작...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 기존 데이터 정리
  console.log('\n🧹 기존 데이터 정리 중...');
  await prisma.review.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.customMnemonic.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.interactiveDocProgress.deleteMany();
  await prisma.interactiveDocCompletion.deleteMany();
  await prisma.example.deleteMany();
  await prisma.wordImage.deleteMany();
  await prisma.wordVideo.deleteMany();
  await prisma.rhyme.deleteMany();
  await prisma.mnemonic.deleteMany();
  await prisma.etymology.deleteMany();
  await prisma.synonym.deleteMany();
  await prisma.antonym.deleteMany();
  await prisma.word.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.achievement.deleteMany();

  // 단어 생성
  console.log('\n📚 단어 생성 중...');
  let wordCount = 0;
  const wordIdsByCategory: Record<string, string[]> = {
    CSAT: [],
    TEPS: [],
    TOEIC: [],
    TOEFL: [],
    SAT: [],
  };

  for (const wordData of allWords) {
    try {
      const word = await prisma.word.create({
        data: wordData as any,
      });
      wordIdsByCategory[wordData.examCategory].push(word.id);
      wordCount++;

      if (wordCount % 10 === 0) {
        console.log(`  ✅ ${wordCount}/${allWords.length} 단어 생성됨`);
      }
    } catch (error) {
      console.log(`  ⚠️ 중복 단어 스킵: ${wordData.word}`);
    }
  }

  // 컬렉션 생성
  console.log('\n📁 컬렉션 생성 중...');
  for (const collection of collections) {
    const wordIds = wordIdsByCategory[collection.category] || [];
    await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        icon: collection.icon,
        category: collection.category,
        difficulty: collection.difficulty as any,
        isPublic: true,
        wordIds: wordIds,
      },
    });
    console.log(`  ✅ ${collection.name} (${wordIds.length}개 단어)`);
  }

  // 업적 생성
  console.log('\n🏆 업적 생성 중...');
  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement as any });
    console.log(`  ✅ ${achievement.name}`);
  }

  // 결과 출력
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ 데이터베이스 시딩 완료!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 총 단어: ${wordCount}개`);
  console.log(`   - 수능 (CSAT): ${wordIdsByCategory.CSAT.length}개`);
  console.log(`   - TEPS: ${wordIdsByCategory.TEPS.length}개`);
  console.log(`   - TOEIC: ${wordIdsByCategory.TOEIC.length}개`);
  console.log(`   - TOEFL: ${wordIdsByCategory.TOEFL.length}개`);
  console.log(`   - SAT: ${wordIdsByCategory.SAT.length}개`);
  console.log(`📁 컬렉션: ${collections.length}개`);
  console.log(`🏆 업적: ${achievements.length}개`);
}

main()
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
