import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample words
  const words = [
    {
      word: 'persevere',
      definition: '인내하다, 끈기있게 계속하다',
      pronunciation: 'ˌpɜːrsəˈvɪr',
      phonetic: '/ˌpɜːrsəˈvɪr/',
      partOfSpeech: 'VERB',
      difficulty: 'INTERMEDIATE',
      frequency: 500,
      examples: {
        create: [
          {
            sentence: 'Despite many setbacks, she persevered and achieved her goal.',
            translation: '많은 좌절에도 불구하고, 그녀는 인내하여 목표를 달성했다.',
          },
          {
            sentence: 'You must persevere through difficult times.',
            translation: '어려운 시기를 인내해야 합니다.',
          },
        ],
      },
      images: {
        create: [
          {
            imageUrl: 'https://via.placeholder.com/400x300?text=Persevere',
            thumbnailUrl: 'https://via.placeholder.com/200x150?text=Persevere',
            description: 'A person climbing a steep mountain, never giving up',
            source: 'ILLUSTRATION',
          },
        ],
      },
      rhymes: {
        create: [
          { rhymingWord: 'severe', similarity: 0.9, example: 'Persevere through severe weather' },
          { rhymingWord: 'here', similarity: 0.7, example: 'Stay here and persevere' },
        ],
      },
      mnemonics: {
        create: [
          {
            title: '끝까지 보는 사람',
            content: 'PER(끝까지) + SEVERE(힘든). 끝까지 힘든 상황을 보는 것이 인내하는 것!',
            koreanHint: '퍼(per) + 시비어(severe) → 퍼지는 힘든 상황도 끝까지 본다',
            source: 'EXPERT_CREATED',
            rating: 4.5,
            ratingCount: 120,
          },
        ],
      },
      etymology: {
        create: {
          origin: 'Latin',
          rootWords: ['per- (through, thoroughly)', 'severus (strict, serious)'],
          evolution: 'Latin perseverare → Old French perseverer → Middle English perseveren',
          relatedWords: ['perseverance', 'persistent', 'severe'],
        },
      },
      synonyms: {
        create: [
          { synonym: 'persist', nuance: '더 일반적인 표현' },
          { synonym: 'endure', nuance: '고통을 견디는 느낌' },
          { synonym: 'continue', nuance: '단순히 계속하는 것' },
        ],
      },
    },
    {
      word: 'ephemeral',
      definition: '덧없는, 일시적인',
      pronunciation: 'ɪˈfemərəl',
      phonetic: '/ɪˈfemərəl/',
      partOfSpeech: 'ADJECTIVE',
      difficulty: 'ADVANCED',
      frequency: 800,
      examples: {
        create: [
          {
            sentence: 'Youth is ephemeral and should be cherished.',
            translation: '젊음은 덧없으니 소중히 여겨야 한다.',
          },
        ],
      },
      images: {
        create: [
          {
            imageUrl: 'https://via.placeholder.com/400x300?text=Ephemeral',
            thumbnailUrl: 'https://via.placeholder.com/200x150?text=Ephemeral',
            description: 'A beautiful sunset fading away',
            source: 'AI_GENERATED',
          },
        ],
      },
      mnemonics: {
        create: [
          {
            title: '에페메랄',
            content: '에페소스의 메랄(미네랄)은 곧 사라진다 → 덧없다',
            koreanHint: '에페(Ephe) + 메랄(meral) 발음이 미네랄 같은데 금방 사라짐',
            source: 'AI_GENERATED',
            rating: 4.2,
            ratingCount: 85,
          },
        ],
      },
      etymology: {
        create: {
          origin: 'Greek',
          rootWords: ['epi- (upon)', 'hēmera (day)'],
          evolution: 'Greek ephēmeros → Latin ephemerus → English ephemeral',
          relatedWords: ['ephemera', 'ephemeris'],
        },
      },
    },
    {
      word: 'collaborate',
      definition: '협력하다, 공동으로 작업하다',
      pronunciation: 'kəˈlæbəreɪt',
      phonetic: '/kəˈlæbəreɪt/',
      partOfSpeech: 'VERB',
      difficulty: 'INTERMEDIATE',
      frequency: 300,
      examples: {
        create: [
          {
            sentence: 'The two companies collaborated on the new project.',
            translation: '두 회사는 새 프로젝트에서 협력했다.',
          },
        ],
      },
      images: {
        create: [
          {
            imageUrl: 'https://via.placeholder.com/400x300?text=Collaborate',
            thumbnailUrl: 'https://via.placeholder.com/200x150?text=Collaborate',
            description: 'People working together on a project',
            source: 'STOCK_PHOTO',
          },
        ],
      },
      mnemonics: {
        create: [
          {
            title: '콜라보레이트',
            content: 'COL(함께) + LABOR(일하다) + ATE(동사) → 함께 일하다 = 협력하다',
            koreanHint: '콜라보(collabo)는 협업을 의미하는 외래어',
            source: 'EXPERT_CREATED',
            rating: 4.8,
            ratingCount: 200,
          },
        ],
      },
      etymology: {
        create: {
          origin: 'Latin',
          rootWords: ['col- (together)', 'laborare (to work)'],
          evolution: 'Latin collaborare → French collaborer → English collaborate',
          relatedWords: ['collaboration', 'collaborative', 'labor'],
        },
      },
    },
    {
      word: 'serendipity',
      definition: '우연한 행운, 뜻밖의 발견',
      pronunciation: 'ˌserənˈdɪpəti',
      phonetic: '/ˌserənˈdɪpəti/',
      partOfSpeech: 'NOUN',
      difficulty: 'ADVANCED',
      frequency: 900,
      examples: {
        create: [
          {
            sentence: 'Meeting her was pure serendipity.',
            translation: '그녀를 만난 것은 순전한 우연이었다.',
          },
        ],
      },
      mnemonics: {
        create: [
          {
            title: '세렌디피티',
            content: '세렌(평온한) + 디피티(deputy, 대리) → 평온한 대리인이 우연히 발견!',
            koreanHint: '세렌디피티는 우연한 발견을 의미하는 유명한 단어',
            source: 'COMMUNITY',
            rating: 4.0,
            ratingCount: 50,
          },
        ],
      },
    },
    {
      word: 'resilient',
      definition: '회복력 있는, 탄력적인',
      pronunciation: 'rɪˈzɪliənt',
      phonetic: '/rɪˈzɪliənt/',
      partOfSpeech: 'ADJECTIVE',
      difficulty: 'INTERMEDIATE',
      frequency: 400,
      examples: {
        create: [
          {
            sentence: 'Children are remarkably resilient.',
            translation: '아이들은 놀랍도록 회복력이 있다.',
          },
        ],
      },
      etymology: {
        create: {
          origin: 'Latin',
          rootWords: ['re- (back)', 'salire (to jump)'],
          evolution: 'Latin resilire → English resilient',
          relatedWords: ['resilience', 'result', 'salient'],
        },
      },
    },
  ];

  for (const wordData of words) {
    await prisma.word.create({
      data: wordData as any,
    });
    console.log(`✅ Created word: ${wordData.word}`);
  }

  // Create sample collections
  const collection = await prisma.collection.create({
    data: {
      name: 'TOEFL 필수 단어',
      description: 'TOEFL 시험에 자주 나오는 필수 영어 단어 모음',
      category: 'TOEFL',
      difficulty: 'ADVANCED',
      isPublic: true,
      wordIds: [], // Will be populated later
    },
  });
  console.log(`✅ Created collection: ${collection.name}`);

  // Create achievements
  const achievements = [
    {
      name: '첫 단어 마스터',
      description: '첫 번째 단어를 마스터하세요',
      icon: '🎯',
      requirement: 1,
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
      name: '백점 마스터',
      description: '10개의 단어를 완벽하게 복습하세요',
      icon: '💯',
      requirement: 10,
      type: 'PERFECT_REVIEWS',
    },
    {
      name: '다양한 학습',
      description: '5가지 학습 방법을 모두 사용하세요',
      icon: '🌟',
      requirement: 5,
      type: 'METHODS_USED',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement as any });
    console.log(`✅ Created achievement: ${achievement.name}`);
  }

  console.log('✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
