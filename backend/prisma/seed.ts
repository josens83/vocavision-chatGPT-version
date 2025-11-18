import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 확장된 단어 데이터베이스 - TOEFL/GRE/SAT 수준의 단어들
const extendedWords = [
  // Beginner Level
  {
    word: 'happy',
    definition: '행복한, 기쁜',
    pronunciation: 'ˈhæpi',
    phonetic: '/ˈhæpi/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 50,
    examples: {
      create: [
        { sentence: 'I am happy to see you.', translation: '당신을 만나서 기뻐요.' },
      ],
    },
    synonyms: {
      create: [
        { synonym: 'joyful', nuance: '더 강한 기쁨' },
        { synonym: 'glad', nuance: '만족스러운' },
      ],
    },
    antonyms: {
      create: [
        { antonym: 'sad', explanation: '슬픈' },
      ],
    },
  },
  {
    word: 'friend',
    definition: '친구',
    pronunciation: 'frend',
    phonetic: '/frend/',
    partOfSpeech: 'NOUN',
    difficulty: 'BEGINNER',
    frequency: 30,
  },
  {
    word: 'beautiful',
    definition: '아름다운',
    pronunciation: 'ˈbjuːtɪfəl',
    phonetic: '/ˈbjuːtɪfəl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 40,
  },

  // Intermediate Level
  {
    word: 'ambitious',
    definition: '야심찬, 욕심 많은',
    pronunciation: 'æmˈbɪʃəs',
    phonetic: '/æmˈbɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 450,
    examples: {
      create: [
        { sentence: 'She is very ambitious and wants to become CEO.', translation: '그녀는 매우 야심차며 CEO가 되고 싶어한다.' },
      ],
    },
    mnemonics: {
      create: [
        {
          title: 'AM-BISH-US',
          content: 'AM (아침) + BISH (비시) + US (우리) → 아침부터 바쁘게 욕심 부리는 우리',
          koreanHint: '앰비셔스 → 야심차게',
          source: 'EXPERT_CREATED',
          rating: 4.3,
          ratingCount: 75,
        },
      ],
    },
    etymology: {
      create: {
        origin: 'Latin',
        rootWords: ['ambi- (around)', 'ire (to go)'],
        evolution: 'Latin ambitiosus → French ambitieux → English ambitious',
        relatedWords: ['ambition', 'ambit'],
      },
    },
  },
  {
    word: 'diligent',
    definition: '부지런한, 근면한',
    pronunciation: 'ˈdɪlɪdʒənt',
    phonetic: '/ˈdɪlɪdʒənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 520,
    mnemonics: {
      create: [
        {
          title: '딜리전트',
          content: 'DILI (딜리) + GENT (젠틀맨) → 딜리버리 하는 젠틀맨처럼 부지런하다',
          koreanHint: '딜리전트 → 부지런하게',
          source: 'AI_GENERATED',
          rating: 4.0,
          ratingCount: 60,
        },
      ],
    },
  },
  {
    word: 'eloquent',
    definition: '웅변의, 표현력이 풍부한',
    pronunciation: 'ˈeləkwənt',
    phonetic: '/ˈeləkwənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 600,
  },
  {
    word: 'meticulous',
    definition: '꼼꼼한, 세심한',
    pronunciation: 'məˈtɪkjələs',
    phonetic: '/məˈtɪkjələs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 550,
  },
  {
    word: 'pragmatic',
    definition: '실용적인, 현실적인',
    pronunciation: 'præɡˈmætɪk',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 580,
  },

  // Advanced Level
  {
    word: 'ubiquitous',
    definition: '어디에나 있는, 편재하는',
    pronunciation: 'juːˈbɪkwɪtəs',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 850,
    examples: {
      create: [
        { sentence: 'Smartphones have become ubiquitous in modern society.', translation: '스마트폰은 현대 사회에서 어디에나 있게 되었다.' },
      ],
    },
    mnemonics: {
      create: [
        {
          title: '유비쿼터스',
          content: 'YOU + BE + QUIT + US → 너는 우리를 그만두지 못해, 어디에나 있어!',
          koreanHint: '유비쿼터스 컴퓨팅처럼 어디에나 존재',
          source: 'EXPERT_CREATED',
          rating: 4.6,
          ratingCount: 95,
        },
      ],
    },
    etymology: {
      create: {
        origin: 'Latin',
        rootWords: ['ubique (everywhere)'],
        evolution: 'Latin ubique → ubiquitas → English ubiquitous',
        relatedWords: ['ubiquity'],
      },
    },
  },
  {
    word: 'ameliorate',
    definition: '개선하다, 향상시키다',
    pronunciation: 'əˈmiːliəreɪt',
    phonetic: '/əˈmiːliəreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 920,
    mnemonics: {
      create: [
        {
          title: 'A-MELIO-RATE',
          content: 'A + MELIO (멜리오) + RATE → A등급으로 평가를 개선하다',
          koreanHint: '아멜리오레이트 → 개선',
          source: 'AI_GENERATED',
          rating: 4.1,
          ratingCount: 50,
        },
      ],
    },
  },
  {
    word: 'benevolent',
    definition: '자비로운, 인자한',
    pronunciation: 'bəˈnevələnt',
    phonetic: '/bəˈnevələnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 780,
    etymology: {
      create: {
        origin: 'Latin',
        rootWords: ['bene (well)', 'volent (wishing)'],
        evolution: 'Latin benevolens → Old French benivolent → English benevolent',
        relatedWords: ['benefit', 'volunteer', 'malevolent'],
      },
    },
  },
  {
    word: 'cacophony',
    definition: '불협화음, 소음',
    pronunciation: 'kəˈkɒfəni',
    phonetic: '/kəˈkɒfəni/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 950,
  },
  {
    word: 'dogmatic',
    definition: '독단적인, 교조적인',
    pronunciation: 'dɒɡˈmætɪk',
    phonetic: '/dɒɡˈmætɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 820,
  },
  {
    word: 'enigmatic',
    definition: '수수께끼 같은, 불가사의한',
    pronunciation: 'ˌenɪɡˈmætɪk',
    phonetic: '/ˌenɪɡˈmætɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 870,
  },

  // Expert Level
  {
    word: 'obsequious',
    definition: '아첨하는, 비굴한',
    pronunciation: 'əbˈsiːkwiəs',
    phonetic: '/əbˈsiːkwiəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1200,
    examples: {
      create: [
        { sentence: 'His obsequious manner annoyed everyone.', translation: '그의 아첨하는 태도가 모두를 짜증나게 했다.' },
      ],
    },
    mnemonics: {
      create: [
        {
          title: 'OB-SEQUIOUS',
          content: 'OB (오브) + SEQU (시퀀스, 따라가다) + IOUS → 계속 따라가며 아첨하는',
          koreanHint: '옵시퀴어스 → 아부하는',
          source: 'EXPERT_CREATED',
          rating: 4.4,
          ratingCount: 40,
        },
      ],
    },
  },
  {
    word: 'perspicacious',
    definition: '통찰력 있는, 명민한',
    pronunciation: 'ˌpɜːspɪˈkeɪʃəs',
    phonetic: '/ˌpɜːspɪˈkeɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1300,
  },
  {
    word: 'recalcitrant',
    definition: '반항적인, 다루기 힘든',
    pronunciation: 'rɪˈkælsɪtrənt',
    phonetic: '/rɪˈkælsɪtrənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1150,
  },
  {
    word: 'sycophant',
    definition: '아첨꾼, 아부하는 사람',
    pronunciation: 'ˈsɪkəfənt',
    phonetic: '/ˈsɪkəfənt/',
    partOfSpeech: 'NOUN',
    difficulty: 'EXPERT',
    frequency: 1250,
  },
  {
    word: 'truculent',
    definition: '호전적인, 사나운',
    pronunciation: 'ˈtrʌkjələnt',
    phonetic: '/ˈtrʌkjələnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1400,
  },

  // Additional Intermediate Words
  {
    word: 'anticipate',
    definition: '예상하다, 기대하다',
    pronunciation: 'ænˈtɪsɪpeɪt',
    phonetic: '/ænˈtɪsɪpeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 380,
  },
  {
    word: 'contemplate',
    definition: '숙고하다, 심사숙고하다',
    pronunciation: 'ˈkɒntəmpleɪt',
    phonetic: '/ˈkɒntəmpleɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 510,
  },
  {
    word: 'deliberate',
    definition: '신중한, 고의적인',
    pronunciation: 'dɪˈlɪbərət',
    phonetic: '/dɪˈlɪbərət/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 440,
  },
  {
    word: 'enumerate',
    definition: '열거하다, 세다',
    pronunciation: 'ɪˈnjuːməreɪt',
    phonetic: '/ɪˈnjuːməreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 630,
  },
  {
    word: 'facilitate',
    definition: '용이하게 하다, 촉진하다',
    pronunciation: 'fəˈsɪlɪteɪt',
    phonetic: '/fəˈsɪlɪteɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 420,
  },

  // More Advanced Words
  {
    word: 'gregarious',
    definition: '사교적인, 군거하는',
    pronunciation: 'ɡrɪˈɡeəriəs',
    phonetic: '/ɡrɪˈɡeəriəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 890,
  },
  {
    word: 'hackneyed',
    definition: '진부한, 낡은',
    pronunciation: 'ˈhæknid',
    phonetic: '/ˈhæknid/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 970,
  },
  {
    word: 'indigenous',
    definition: '토착의, 고유의',
    pronunciation: 'ɪnˈdɪdʒɪnəs',
    phonetic: '/ɪnˈdɪdʒɪnəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 750,
  },
  {
    word: 'juxtapose',
    definition: '병치하다, 나란히 놓다',
    pronunciation: 'ˌdʒʌkstəˈpəʊz',
    phonetic: '/ˌdʒʌkstəˈpəʊz/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 930,
  },
  {
    word: 'lethargic',
    definition: '무기력한, 나른한',
    pronunciation: 'ləˈθɑːdʒɪk',
    phonetic: '/ləˈθɑːdʒɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 840,
  },
];

async function main() {
  console.log('🌱 Starting extended database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning up existing data...');
  await prisma.review.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.customMnemonic.deleteMany();
  await prisma.userAchievement.deleteMany();

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

  // Create words
  let wordCount = 0;
  for (const wordData of extendedWords) {
    await prisma.word.create({
      data: wordData as any,
    });
    wordCount++;
    console.log(`✅ Created word ${wordCount}/${extendedWords.length}: ${wordData.word}`);
  }

  // Create collections
  const beginnerWords = await prisma.word.findMany({
    where: { difficulty: 'BEGINNER' },
    select: { id: true },
  });

  const intermediateWords = await prisma.word.findMany({
    where: { difficulty: 'INTERMEDIATE' },
    select: { id: true },
  });

  const advancedWords = await prisma.word.findMany({
    where: { difficulty: 'ADVANCED' },
    select: { id: true },
  });

  const expertWords = await prisma.word.findMany({
    where: { difficulty: 'EXPERT' },
    select: { id: true },
  });

  await prisma.collection.create({
    data: {
      name: '초급 영어 단어',
      description: '영어 학습을 시작하는 분들을 위한 기초 필수 단어',
      category: 'BEGINNER',
      difficulty: 'BEGINNER',
      isPublic: true,
      wordIds: beginnerWords.map(w => w.id),
    },
  });

  await prisma.collection.create({
    data: {
      name: '중급 영어 단어',
      description: '중급 학습자를 위한 실용 영어 단어',
      category: 'INTERMEDIATE',
      difficulty: 'INTERMEDIATE',
      isPublic: true,
      wordIds: intermediateWords.map(w => w.id),
    },
  });

  await prisma.collection.create({
    data: {
      name: 'TOEFL 필수 단어',
      description: 'TOEFL 시험에 자주 출제되는 고급 어휘',
      category: 'TOEFL',
      difficulty: 'ADVANCED',
      isPublic: true,
      wordIds: advancedWords.map(w => w.id),
    },
  });

  await prisma.collection.create({
    data: {
      name: 'GRE 고난도 단어',
      description: 'GRE 시험 대비 최고 난이도 어휘',
      category: 'GRE',
      difficulty: 'EXPERT',
      isPublic: true,
      wordIds: expertWords.map(w => w.id),
    },
  });

  console.log('✅ Created 4 collections');

  // Create achievements
  const achievements = [
    {
      name: '첫 발자국',
      description: '첫 번째 단어를 마스터하세요',
      icon: '🎯',
      requirement: 1,
      type: 'WORDS_LEARNED',
    },
    {
      name: '열정적인 학습자',
      description: '10개의 단어를 마스터하세요',
      icon: '📚',
      requirement: 10,
      type: 'WORDS_LEARNED',
    },
    {
      name: '단어 마스터',
      description: '50개의 단어를 마스터하세요',
      icon: '🏆',
      requirement: 50,
      type: 'WORDS_LEARNED',
    },
    {
      name: '일주일 연속',
      description: '7일 연속 학습하세요',
      icon: '🔥',
      requirement: 7,
      type: 'DAILY_STREAK',
    },
    {
      name: '한 달 챌린지',
      description: '30일 연속 학습하세요',
      icon: '💪',
      requirement: 30,
      type: 'DAILY_STREAK',
    },
    {
      name: '백 일의 기적',
      description: '100일 연속 학습하세요',
      icon: '👑',
      requirement: 100,
      type: 'DAILY_STREAK',
    },
    {
      name: '완벽주의자',
      description: '10개의 단어를 완벽하게 복습하세요',
      icon: '💯',
      requirement: 10,
      type: 'PERFECT_REVIEWS',
    },
    {
      name: '다재다능',
      description: '5가지 학습 방법을 모두 사용하세요',
      icon: '🌟',
      requirement: 5,
      type: 'METHODS_USED',
    },
    {
      name: '시간 투자',
      description: '총 10시간 학습하세요',
      icon: '⏰',
      requirement: 36000,
      type: 'STUDY_TIME',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement as any });
    console.log(`✅ Created achievement: ${achievement.name}`);
  }

  console.log('\n✨ Extended database seeding completed!');
  console.log(`📊 Total words created: ${wordCount}`);
  console.log(`📚 Collections created: 4`);
  console.log(`🏆 Achievements created: ${achievements.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
