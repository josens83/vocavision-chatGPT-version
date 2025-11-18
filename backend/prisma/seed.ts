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

  // Additional Beginner Words
  {
    word: 'brave',
    definition: '용감한, 용기 있는',
    pronunciation: 'breɪv',
    phonetic: '/breɪv/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 25,
  },
  {
    word: 'kind',
    definition: '친절한, 다정한',
    pronunciation: 'kaɪnd',
    phonetic: '/kaɪnd/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 20,
  },
  {
    word: 'smart',
    definition: '똑똑한, 영리한',
    pronunciation: 'smɑːrt',
    phonetic: '/smɑːrt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 30,
  },
  {
    word: 'strong',
    definition: '강한, 튼튼한',
    pronunciation: 'strɒŋ',
    phonetic: '/strɒŋ/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 28,
  },
  {
    word: 'quick',
    definition: '빠른, 신속한',
    pronunciation: 'kwɪk',
    phonetic: '/kwɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 35,
  },

  // Additional Intermediate Words
  {
    word: 'eloquent',
    definition: '웅변적인, 유창한',
    pronunciation: 'ˈeləkwənt',
    phonetic: '/ˈeləkwənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 520,
  },
  {
    word: 'meticulous',
    definition: '꼼꼼한, 세심한',
    pronunciation: 'məˈtɪkjələs',
    phonetic: '/məˈtɪkjələs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 480,
  },
  {
    word: 'pragmatic',
    definition: '실용적인, 실리적인',
    pronunciation: 'præɡˈmætɪk',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 450,
  },
  {
    word: 'resilient',
    definition: '회복력 있는, 탄력적인',
    pronunciation: 'rɪˈzɪliənt',
    phonetic: '/rɪˈzɪliənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 460,
  },
  {
    word: 'tenacious',
    definition: '끈질긴, 집요한',
    pronunciation: 'təˈneɪʃəs',
    phonetic: '/təˈneɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 510,
  },
  {
    word: 'versatile',
    definition: '다재다능한, 다용도의',
    pronunciation: 'ˈvɜːsətaɪl',
    phonetic: '/ˈvɜːsətaɪl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 470,
  },
  {
    word: 'coherent',
    definition: '일관성 있는, 논리적인',
    pronunciation: 'kəʊˈhɪərənt',
    phonetic: '/kəʊˈhɪərənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 490,
  },
  {
    word: 'innovative',
    definition: '혁신적인, 창의적인',
    pronunciation: 'ˈɪnəveɪtɪv',
    phonetic: '/ˈɪnəveɪtɪv/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 440,
  },
  {
    word: 'profound',
    definition: '심오한, 깊은',
    pronunciation: 'prəˈfaʊnd',
    phonetic: '/prəˈfaʊnd/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 500,
  },
  {
    word: 'abundant',
    definition: '풍부한, 많은',
    pronunciation: 'əˈbʌndənt',
    phonetic: '/əˈbʌndənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'INTERMEDIATE',
    frequency: 430,
  },

  // Additional Advanced Words
  {
    word: 'ubiquitous',
    definition: '어디에나 있는, 편재하는',
    pronunciation: 'juːˈbɪkwɪtəs',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 750,
  },
  {
    word: 'ephemeral',
    definition: '일시적인, 덧없는',
    pronunciation: 'ɪˈfemərəl',
    phonetic: '/ɪˈfemərəl/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 880,
  },
  {
    word: 'pernicious',
    definition: '치명적인, 해로운',
    pronunciation: 'pəˈnɪʃəs',
    phonetic: '/pəˈnɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 920,
  },
  {
    word: 'ostentatious',
    definition: '허세부리는, 과시하는',
    pronunciation: 'ˌɒstenˈteɪʃəs',
    phonetic: '/ˌɒstenˈteɪʃəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 890,
  },
  {
    word: 'laconic',
    definition: '간결한, 말수가 적은',
    pronunciation: 'ləˈkɒnɪk',
    phonetic: '/ləˈkɒnɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 940,
  },
  {
    word: 'verbose',
    definition: '장황한, 말이 많은',
    pronunciation: 'vɜːˈbəʊs',
    phonetic: '/vɜːˈbəʊs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 870,
  },
  {
    word: 'indolent',
    definition: '게으른, 나태한',
    pronunciation: 'ˈɪndələnt',
    phonetic: '/ˈɪndələnt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 910,
  },
  {
    word: 'magnanimous',
    definition: '관대한, 아량 있는',
    pronunciation: 'mæɡˈnænɪməs',
    phonetic: '/mæɡˈnænɪməs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 860,
  },
  {
    word: 'perfunctory',
    definition: '형식적인, 대충 하는',
    pronunciation: 'pəˈfʌŋktəri',
    phonetic: '/pəˈfʌŋktəri/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 900,
  },
  {
    word: 'quixotic',
    definition: '이상주의적인, 비현실적인',
    pronunciation: 'kwɪkˈsɒtɪk',
    phonetic: '/kwɪkˈsɒtɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'ADVANCED',
    frequency: 950,
  },

  // Additional Expert Words
  {
    word: 'pusillanimous',
    definition: '소심한, 비겁한',
    pronunciation: 'ˌpjuːsɪˈlænɪməs',
    phonetic: '/ˌpjuːsɪˈlænɪməs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1350,
  },
  {
    word: 'magniloquent',
    definition: '과장된, 거창한',
    pronunciation: 'mæɡˈnɪləkwənt',
    phonetic: '/mæɡˈnɪləkwənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1450,
  },
  {
    word: 'querulous',
    definition: '불평이 많은, 투덜대는',
    pronunciation: 'ˈkwerələs',
    phonetic: '/ˈkwerələs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1280,
  },
  {
    word: 'phlegmatic',
    definition: '냉담한, 무감동한',
    pronunciation: 'fleɡˈmætɪk',
    phonetic: '/fleɡˈmætɪk/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1320,
  },
  {
    word: 'temerity',
    definition: '무모함, 대담함',
    pronunciation: 'təˈmerəti',
    phonetic: '/təˈmerəti/',
    partOfSpeech: 'NOUN',
    difficulty: 'EXPERT',
    frequency: 1380,
  },
  {
    word: 'insidious',
    definition: '교활한, 음험한',
    pronunciation: 'ɪnˈsɪdiəs',
    phonetic: '/ɪnˈsɪdiəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1220,
  },
  {
    word: 'fastidious',
    definition: '까다로운, 결벽증의',
    pronunciation: 'fæˈstɪdiəs',
    phonetic: '/fæˈstɪdiəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1260,
  },
  {
    word: 'paucity',
    definition: '부족, 결핍',
    pronunciation: 'ˈpɔːsəti',
    phonetic: '/ˈpɔːsəti/',
    partOfSpeech: 'NOUN',
    difficulty: 'EXPERT',
    frequency: 1340,
  },
  {
    word: 'deleterious',
    definition: '해로운, 유해한',
    pronunciation: 'ˌdelɪˈtɪəriəs',
    phonetic: '/ˌdelɪˈtɪəriəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1290,
  },
  {
    word: 'parsimonious',
    definition: '인색한, 구두쇠의',
    pronunciation: 'ˌpɑːsɪˈməʊniəs',
    phonetic: '/ˌpɑːsɪˈməʊniəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'EXPERT',
    frequency: 1410,
  },

  // More Common Intermediate/Advanced Words
  {
    word: 'analyze',
    definition: '분석하다',
    pronunciation: 'ˈænəlaɪz',
    phonetic: '/ˈænəlaɪz/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 420,
  },
  {
    word: 'synthesize',
    definition: '종합하다, 합성하다',
    pronunciation: 'ˈsɪnθəsaɪz',
    phonetic: '/ˈsɪnθəsaɪz/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 530,
  },
  {
    word: 'contemplate',
    definition: '숙고하다, 생각하다',
    pronunciation: 'ˈkɒntəmpleɪt',
    phonetic: '/ˈkɒntəmpleɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 480,
  },
  {
    word: 'accommodate',
    definition: '수용하다, 적응시키다',
    pronunciation: 'əˈkɒmədeɪt',
    phonetic: '/əˈkɒmədeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 450,
  },
  {
    word: 'persuade',
    definition: '설득하다',
    pronunciation: 'pəˈsweɪd',
    phonetic: '/pəˈsweɪd/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 410,
  },
  {
    word: 'illuminate',
    definition: '밝히다, 조명하다',
    pronunciation: 'ɪˈluːmɪneɪt',
    phonetic: '/ɪˈluːmɪneɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 490,
  },
  {
    word: 'scrutinize',
    definition: '면밀히 조사하다',
    pronunciation: 'ˈskruːtənaɪz',
    phonetic: '/ˈskruːtənaɪz/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 720,
  },
  {
    word: 'culminate',
    definition: '절정에 이르다',
    pronunciation: 'ˈkʌlmɪneɪt',
    phonetic: '/ˈkʌlmɪneɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 780,
  },
  {
    word: 'exacerbate',
    definition: '악화시키다',
    pronunciation: 'ɪɡˈzæsəbeɪt',
    phonetic: '/ɪɡˈzæsəbeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 820,
  },
  {
    word: 'ameliorate',
    definition: '개선하다, 향상시키다',
    pronunciation: 'əˈmiːliəreɪt',
    phonetic: '/əˈmiːliəreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 880,
  },
  {
    word: 'elucidate',
    definition: '명료하게 하다, 설명하다',
    pronunciation: 'ɪˈluːsɪdeɪt',
    phonetic: '/ɪˈluːsɪdeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 850,
  },
  {
    word: 'substantiate',
    definition: '입증하다, 확증하다',
    pronunciation: 'səbˈstænʃieɪt',
    phonetic: '/səbˈstænʃieɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'ADVANCED',
    frequency: 790,
  },

  // Nouns - Various Difficulties
  {
    word: 'opportunity',
    definition: '기회',
    pronunciation: 'ˌɒpəˈtjuːnəti',
    phonetic: '/ˌɒpəˈtjuːnəti/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    frequency: 390,
  },
  {
    word: 'achievement',
    definition: '성취, 업적',
    pronunciation: 'əˈtʃiːvmənt',
    phonetic: '/əˈtʃiːvmənt/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    frequency: 400,
  },
  {
    word: 'curiosity',
    definition: '호기심',
    pronunciation: 'ˌkjʊəriˈɒsəti',
    phonetic: '/ˌkjʊəriˈɒsəti/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    frequency: 430,
  },
  {
    word: 'dilemma',
    definition: '딜레마, 곤경',
    pronunciation: 'dɪˈlemə',
    phonetic: '/dɪˈlemə/',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    frequency: 470,
  },
  {
    word: 'paradigm',
    definition: '패러다임, 전형',
    pronunciation: 'ˈpærədaɪm',
    phonetic: '/ˈpærədaɪm/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 730,
  },
  {
    word: 'dichotomy',
    definition: '이분법, 양분',
    pronunciation: 'daɪˈkɒtəmi',
    phonetic: '/daɪˈkɒtəmi/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 810,
  },
  {
    word: 'anomaly',
    definition: '변칙, 이상 현상',
    pronunciation: 'əˈnɒməli',
    phonetic: '/əˈnɒməli/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 760,
  },
  {
    word: 'conundrum',
    definition: '난문제, 수수께끼',
    pronunciation: 'kəˈnʌndrəm',
    phonetic: '/kəˈnʌndrəm/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 840,
  },
  {
    word: 'juxtaposition',
    definition: '병치, 나란히 놓음',
    pronunciation: 'ˌdʒʌkstəpəˈzɪʃən',
    phonetic: '/ˌdʒʌkstəpəˈzɪʃən/',
    partOfSpeech: 'NOUN',
    difficulty: 'EXPERT',
    frequency: 1180,
  },
  {
    word: 'vicissitude',
    definition: '변천, 흥망성쇠',
    pronunciation: 'vɪˈsɪsɪtjuːd',
    phonetic: '/vɪˈsɪsɪtjuːd/',
    partOfSpeech: 'NOUN',
    difficulty: 'EXPERT',
    frequency: 1360,
  },
  {
    word: 'serendipity',
    definition: '우연한 발견, 행운',
    pronunciation: 'ˌserənˈdɪpəti',
    phonetic: '/ˌserənˈdɪpəti/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 800,
  },
  {
    word: 'ambivalence',
    definition: '양면감정, 모순된 감정',
    pronunciation: 'æmˈbɪvələns',
    phonetic: '/æmˈbɪvələns/',
    partOfSpeech: 'NOUN',
    difficulty: 'ADVANCED',
    frequency: 770,
  },

  // More Beginner Words
  {
    word: 'learn',
    definition: '배우다',
    pronunciation: 'lɜːn',
    phonetic: '/lɜːn/',
    partOfSpeech: 'VERB',
    difficulty: 'BEGINNER',
    frequency: 15,
  },
  {
    word: 'teach',
    definition: '가르치다',
    pronunciation: 'tiːtʃ',
    phonetic: '/tiːtʃ/',
    partOfSpeech: 'VERB',
    difficulty: 'BEGINNER',
    frequency: 18,
  },
  {
    word: 'study',
    definition: '공부하다',
    pronunciation: 'ˈstʌdi',
    phonetic: '/ˈstʌdi/',
    partOfSpeech: 'VERB',
    difficulty: 'BEGINNER',
    frequency: 22,
  },
  {
    word: 'think',
    definition: '생각하다',
    pronunciation: 'θɪŋk',
    phonetic: '/θɪŋk/',
    partOfSpeech: 'VERB',
    difficulty: 'BEGINNER',
    frequency: 12,
  },
  {
    word: 'create',
    definition: '창조하다, 만들다',
    pronunciation: 'kriˈeɪt',
    phonetic: '/kriˈeɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'BEGINNER',
    frequency: 24,
  },

  // More Intermediate Words
  {
    word: 'collaborate',
    definition: '협력하다',
    pronunciation: 'kəˈlæbəreɪt',
    phonetic: '/kəˈlæbəreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 460,
  },
  {
    word: 'cultivate',
    definition: '재배하다, 계발하다',
    pronunciation: 'ˈkʌltɪveɪt',
    phonetic: '/ˈkʌltɪveɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 500,
  },
  {
    word: 'facilitate',
    definition: '용이하게 하다',
    pronunciation: 'fəˈsɪlɪteɪt',
    phonetic: '/fəˈsɪlɪteɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 510,
  },
  {
    word: 'integrate',
    definition: '통합하다',
    pronunciation: 'ˈɪntɪɡreɪt',
    phonetic: '/ˈɪntɪɡreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 440,
  },
  {
    word: 'demonstrate',
    definition: '시범 보이다, 증명하다',
    pronunciation: 'ˈdemənstreɪt',
    phonetic: '/ˈdemənstreɪt/',
    partOfSpeech: 'VERB',
    difficulty: 'INTERMEDIATE',
    frequency: 430,
  },
  {
    word: 'generous',
    definition: '관대한, 후한',
    pronunciation: 'ˈdʒenərəs',
    phonetic: '/ˈdʒenərəs/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 32,
  },
  {
    word: 'important',
    definition: '중요한',
    pronunciation: 'ɪmˈpɔːtənt',
    phonetic: '/ɪmˈpɔːtənt/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 18,
  },
  {
    word: 'interesting',
    definition: '흥미로운, 재미있는',
    pronunciation: 'ˈɪntrəstɪŋ',
    phonetic: '/ˈɪntrəstɪŋ/',
    partOfSpeech: 'ADJECTIVE',
    difficulty: 'BEGINNER',
    frequency: 26,
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
