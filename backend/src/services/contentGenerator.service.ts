// ============================================
// VocaVision - AI Content Generation Service
// Claude API를 사용한 단어 콘텐츠 자동 생성
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient, ExamCategory, CEFRLevel } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Claude API Client
let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

// ---------------------------------------------
// 타입 정의
// ---------------------------------------------

export interface GenerationOptions {
  word: string;
  examCategory: ExamCategory;
  cefrLevel: CEFRLevel;
}

export interface GeneratedContent {
  pronunciation: {
    ipaUs: string;
    ipaUk: string;
    korean: string;
  };
  definitions: Array<{
    partOfSpeech: string;
    definitionEn: string;
    definitionKo: string;
    exampleEn?: string;
    exampleKo?: string;
  }>;
  etymology: {
    description: string;
    language: string;
    breakdown?: string;
  };
  morphology: {
    prefix?: { part: string; meaning: string };
    root?: { part: string; meaning: string };
    suffix?: { part: string; meaning: string };
    note?: string;
  };
  collocations: Array<{
    phrase: string;
    translation: string;
    type?: string;
    exampleEn?: string;
    exampleKo?: string;
  }>;
  rhyming: {
    words: string[];
    note?: string;
  };
  mnemonic: {
    description: string;
    koreanAssociation: string;
    imagePrompt: string;
  };
  examples: Array<{
    sentenceEn: string;
    sentenceKo: string;
    isFunny: boolean;
    source?: string;
  }>;
  relatedWords: {
    synonyms: string[];
    antonyms: string[];
    related: string[];
  };
}

// ---------------------------------------------
// 프롬프트 템플릿
// ---------------------------------------------

const CONTENT_GENERATION_PROMPT = `
당신은 영어 어휘 학습 콘텐츠 전문가입니다. 한국인 영어 학습자를 위한 고품질 단어 학습 자료를 생성합니다.

## 입력 정보
- 단어: {{WORD}}
- 시험 카테고리: {{EXAM_CATEGORY}}
- CEFR 레벨: {{CEFR_LEVEL}}

## 생성해야 할 콘텐츠

### 1. 발음 (Pronunciation)
- IPA 발음 기호 (미국식, 영국식)
- 한글 발음 표기

### 2. 정의 (Definitions)
- 품사별 영어 정의
- 한국어 번역
- 각 정의에 대한 예문

### 3. 어원 (Etymology)
- 단어의 기원과 역사
- 어원 언어 (라틴어, 그리스어, 프랑스어 등)
- 어원을 통한 의미 이해 설명

### 4. 형태 분석 (Morphology)
- 접두사 (prefix): 있다면 의미와 함께
- 어근 (root): 핵심 의미
- 접미사 (suffix): 있다면 품사 변화 설명

### 5. 콜로케이션 (Collocations)
- 자주 함께 쓰이는 단어 조합 5-7개
- 각 콜로케이션의 한국어 번역
- 유형 (verb+noun, adj+noun 등)

### 6. 라이밍 (Rhyming Words)
- 발음이 비슷한 단어 3-5개
- 라이밍을 활용한 암기 팁

### 7. 연상 기억법 (Mnemonic - 경선식 스타일)
- 발음과 의미를 연결하는 창의적 연상법
- 한글 발음을 활용한 기억 트릭
- 이미지화하기 좋은 스토리

### 8. 재미있는 예문 (Fun Examples)
- 기억에 남는 유머러스한 예문 2-3개
- 실제 사용 맥락이 담긴 예문 2-3개
- 한국어 번역 포함

### 9. 관련어
- 동의어 (synonyms) 3-5개
- 반의어 (antonyms) 2-3개
- 관련 단어 (related words) 3-5개

## 출력 형식
반드시 아래 JSON 형식으로 출력하세요:

\`\`\`json
{
  "pronunciation": {
    "ipaUs": "/발음기호/",
    "ipaUk": "/발음기호/",
    "korean": "한글발음"
  },
  "definitions": [
    {
      "partOfSpeech": "noun",
      "definitionEn": "English definition",
      "definitionKo": "한국어 정의",
      "exampleEn": "Example sentence.",
      "exampleKo": "예문 번역."
    }
  ],
  "etymology": {
    "description": "어원 설명",
    "language": "Latin",
    "breakdown": "어원 분석"
  },
  "morphology": {
    "prefix": { "part": "접두사", "meaning": "의미" },
    "root": { "part": "어근", "meaning": "의미" },
    "suffix": { "part": "접미사", "meaning": "의미" },
    "note": "형태 분석 설명"
  },
  "collocations": [
    {
      "phrase": "collocation phrase",
      "translation": "번역",
      "type": "verb+noun",
      "exampleEn": "Example",
      "exampleKo": "예문 번역"
    }
  ],
  "rhyming": {
    "words": ["word1", "word2", "word3"],
    "note": "라이밍 학습 팁"
  },
  "mnemonic": {
    "description": "연상 기억법 설명",
    "koreanAssociation": "한글 발음 연상",
    "imagePrompt": "WHISK 이미지 생성용 프롬프트 (영어)"
  },
  "examples": [
    {
      "sentenceEn": "Example sentence",
      "sentenceKo": "예문 번역",
      "isFunny": true,
      "source": "출처 (선택)"
    }
  ],
  "relatedWords": {
    "synonyms": ["동의어1", "동의어2"],
    "antonyms": ["반의어1", "반의어2"],
    "related": ["관련어1", "관련어2"]
  }
}
\`\`\`

## 주의사항
1. 한국인 학습자의 관점에서 이해하기 쉽게 설명
2. 시험 카테고리({{EXAM_CATEGORY}})에 맞는 난이도와 맥락 유지
3. 재미있고 기억에 남는 콘텐츠 생성
4. 정확한 JSON 형식 준수
5. 연상 기억법은 창의적이고 한국어 발음을 활용
`;

// ---------------------------------------------
// Content Generation Function
// ---------------------------------------------

export async function generateWordContent(
  options: GenerationOptions
): Promise<GeneratedContent> {
  const { word, examCategory, cefrLevel } = options;

  // 프롬프트 생성
  const prompt = CONTENT_GENERATION_PROMPT
    .replace(/\{\{WORD\}\}/g, word)
    .replace(/\{\{EXAM_CATEGORY\}\}/g, examCategory)
    .replace(/\{\{CEFR_LEVEL\}\}/g, cefrLevel);

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 응답에서 JSON 추출
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // JSON 파싱
    const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const generatedContent: GeneratedContent = JSON.parse(jsonMatch[1]);
    return generatedContent;
  } catch (error) {
    logger.error('Content generation failed:', error);
    throw error;
  }
}

// ---------------------------------------------
// Save Generated Content to DB
// ---------------------------------------------

export async function saveGeneratedContent(
  wordId: string,
  generated: GeneratedContent
): Promise<void> {
  try {
    // Update Word with generated content
    await prisma.word.update({
      where: { id: wordId },
      data: {
        // Pronunciation
        ipaUs: generated.pronunciation.ipaUs,
        ipaUk: generated.pronunciation.ipaUk,
        pronunciation: generated.pronunciation.korean,

        // Morphology
        prefix: generated.morphology.prefix?.part,
        root: generated.morphology.root?.part,
        suffix: generated.morphology.suffix?.part,
        morphologyNote: generated.morphology.note,

        // Related words (arrays)
        synonymList: generated.relatedWords.synonyms,
        antonymList: generated.relatedWords.antonyms,
        rhymingWords: generated.rhyming.words,
        relatedWords: generated.relatedWords.related,

        // AI metadata
        aiModel: 'claude-sonnet-4-20250514',
        aiGeneratedAt: new Date(),
        humanReviewed: false,
      },
    });

    // Create Etymology
    if (generated.etymology) {
      await prisma.etymology.upsert({
        where: { wordId },
        update: {
          origin: generated.etymology.description,
          language: generated.etymology.language,
          breakdown: generated.etymology.breakdown,
        },
        create: {
          wordId,
          origin: generated.etymology.description,
          language: generated.etymology.language,
          evolution: generated.etymology.description,
          breakdown: generated.etymology.breakdown,
        },
      });
    }

    // Create Mnemonic
    if (generated.mnemonic) {
      await prisma.mnemonic.create({
        data: {
          wordId,
          title: 'AI Generated Mnemonic',
          content: generated.mnemonic.description,
          koreanHint: generated.mnemonic.koreanAssociation,
          whiskPrompt: generated.mnemonic.imagePrompt,
          source: 'AI_GENERATED',
        },
      });
    }

    // Create Examples
    for (let i = 0; i < generated.examples.length; i++) {
      const example = generated.examples[i];
      await prisma.example.create({
        data: {
          wordId,
          sentence: example.sentenceEn,
          translation: example.sentenceKo,
          isFunny: example.isFunny,
          isReal: !example.isFunny,
          source: example.source,
          order: i,
        },
      });
    }

    // Create Collocations
    for (let i = 0; i < generated.collocations.length; i++) {
      const collocation = generated.collocations[i];
      await prisma.collocation.create({
        data: {
          wordId,
          phrase: collocation.phrase,
          translation: collocation.translation,
          type: collocation.type,
          exampleEn: collocation.exampleEn,
          exampleKo: collocation.exampleKo,
          order: i,
        },
      });
    }

    // Create Synonyms
    for (const synonym of generated.relatedWords.synonyms) {
      await prisma.synonym.create({
        data: {
          wordId,
          synonym,
        },
      });
    }

    // Create Antonyms
    for (const antonym of generated.relatedWords.antonyms) {
      await prisma.antonym.create({
        data: {
          wordId,
          antonym,
        },
      });
    }

    // Create Rhymes
    for (const rhymingWord of generated.rhyming.words) {
      await prisma.rhyme.create({
        data: {
          wordId,
          rhymingWord,
          similarity: 0.8, // Default similarity
          example: generated.rhyming.note,
        },
      });
    }

    logger.info(`Content saved for word: ${wordId}`);
  } catch (error) {
    logger.error('Failed to save generated content:', error);
    throw error;
  }
}

// ---------------------------------------------
// Batch Processing
// ---------------------------------------------

export interface BatchGenerationResult {
  word: string;
  wordId?: string;
  success: boolean;
  content?: GeneratedContent;
  error?: string;
}

export async function generateBatchContent(
  words: string[],
  examCategory: ExamCategory,
  cefrLevel: CEFRLevel,
  onProgress?: (current: number, total: number) => void
): Promise<BatchGenerationResult[]> {
  const results: BatchGenerationResult[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    try {
      const content = await generateWordContent({
        word,
        examCategory,
        cefrLevel,
      });

      results.push({
        word,
        success: true,
        content,
      });
    } catch (error) {
      results.push({
        word,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // 진행률 콜백
    onProgress?.(i + 1, words.length);

    // Rate limiting - 요청 간 딜레이 (1초)
    if (i < words.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// ---------------------------------------------
// WHISK Image Prompt Generator
// ---------------------------------------------

export function generateWhiskPrompt(
  word: string,
  mnemonic: string,
  style: 'animation' | 'illustration' = 'animation'
): string {
  const basePrompt = `
Create a memorable, educational ${style} for the English word "${word}".

Visual concept: ${mnemonic}

Style requirements:
- Bright, engaging colors suitable for education
- Clear, simple composition
- Friendly and approachable aesthetic
- ${style === 'animation' ? 'Smooth looping animation, 2-3 seconds' : 'Clean illustration style'}
- No text or letters in the image

The image should help Korean learners remember both the pronunciation and meaning of "${word}" through visual association.
`.trim();

  return basePrompt;
}

// ---------------------------------------------
// Job Queue Processing
// ---------------------------------------------

export async function processGenerationJob(jobId: string): Promise<void> {
  const job = await prisma.contentGenerationJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error(`Job not found: ${jobId}`);
  }

  try {
    // Update job status
    await prisma.contentGenerationJob.update({
      where: { id: jobId },
      data: { status: 'processing', startedAt: new Date() },
    });

    const results: BatchGenerationResult[] = [];
    const words = job.inputWords;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      try {
        const content = await generateWordContent({
          word,
          examCategory: job.examCategory || 'CSAT',
          cefrLevel: job.cefrLevel || 'B1',
        });

        results.push({ word, success: true, content });

        // Update progress
        const progress = Math.round(((i + 1) / words.length) * 100);
        await prisma.contentGenerationJob.update({
          where: { id: jobId },
          data: { progress },
        });
      } catch (error) {
        results.push({
          word,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Rate limiting
      if (i < words.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Update job as completed
    await prisma.contentGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress: 100,
        result: results as any,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    // Update job as failed
    await prisma.contentGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

export default {
  generateWordContent,
  saveGeneratedContent,
  generateBatchContent,
  generateWhiskPrompt,
  processGenerationJob,
};
