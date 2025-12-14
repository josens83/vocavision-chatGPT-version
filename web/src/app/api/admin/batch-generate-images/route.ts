/**
 * Admin Batch Image Generation API
 *
 * Uses backend database for job persistence (solves serverless memory issue)
 *
 * POST /api/admin/batch-generate-images - Create job & start processing
 * GET /api/admin/batch-generate-images?jobId=xxx - Get job status
 */

import { NextRequest, NextResponse } from 'next/server';

// Configuration
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || '';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || '';

interface WordData {
  id: string;
  word: string;
  definitionEn?: string;
  definitionKo?: string;
  mnemonic?: string;
  mnemonicKorean?: string;
  rhymingWords?: string[];
}

interface BatchGenerateRequest {
  wordIds: string[];
  options?: {
    skipExisting?: boolean;
    types?: ('CONCEPT' | 'MNEMONIC' | 'RHYME')[];
  };
}

/**
 * Fetch word data from backend
 */
async function fetchWordData(wordId: string): Promise<WordData | null> {
  try {
    const response = await fetch(`${API_BASE}/admin/words/${wordId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const word = data.word;
    const content = word.content;

    return {
      id: word.id,
      word: word.word,
      definitionEn: content?.definitions?.[0]?.definitionEn,
      definitionKo: content?.definitions?.[0]?.definitionKo,
      mnemonic: content?.mnemonic,
      mnemonicKorean: content?.mnemonicKorean,
      rhymingWords: content?.rhymingWords,
    };
  } catch (error) {
    console.error(`Failed to fetch word ${wordId}:`, error);
    return null;
  }
}

/**
 * Generate smart content using Claude API
 */
async function generateSmartContent(wordData: WordData): Promise<{
  mnemonicPrompt?: string;
  mnemonicCaption?: { ko: string; en: string };
  rhymeCaption?: { ko: string; en: string };
} | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/generate-smart-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wordData: {
          word: wordData.word,
          definitionEn: wordData.definitionEn,
          definitionKo: wordData.definitionKo,
          mnemonic: wordData.mnemonic,
          mnemonicKorean: wordData.mnemonicKorean,
          rhymingWords: wordData.rhymingWords,
        },
        types: ['MNEMONIC_PROMPT', 'MNEMONIC_CAPTION', 'RHYME_CAPTION'],
      }),
    });

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Generate image using the existing generate-image API
 */
async function generateImage(
  prompt: string,
  visualType: string,
  word: string,
  wordId: string
): Promise<{ imageUrl: string } | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, visualType, word, wordId }),
    });

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Save visuals to backend
 */
async function saveVisuals(wordId: string, visuals: Array<{
  type: string;
  imageUrl: string;
  captionKo?: string;
  captionEn?: string;
  promptEn?: string;
}>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/admin/words/${wordId}/visuals`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY,
      },
      body: JSON.stringify({ visuals }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Update job in backend database
 */
async function updateJobInDB(jobId: string, updateData: {
  status?: string;
  progress?: number;
  result?: Record<string, unknown>;
  error?: string;
}): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/image-jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY,
      },
      body: JSON.stringify(updateData),
    });
  } catch (error) {
    console.error('Failed to update job:', error);
  }
}

/**
 * Process a single word
 */
async function processWord(
  wordData: WordData,
  types: ('CONCEPT' | 'MNEMONIC' | 'RHYME')[],
  jobId: string,
  currentJobResult: {
    processedWords: number;
    totalWords: number;
    currentWord?: string;
    currentType?: string;
    results: Array<{
      wordId: string;
      word: string;
      success: boolean;
      imagesGenerated: number;
      error?: string;
    }>;
  }
): Promise<{ success: boolean; imagesGenerated: number; error?: string }> {
  const generatedVisuals: Array<{
    type: string;
    imageUrl: string;
    captionKo?: string;
    captionEn?: string;
    promptEn?: string;
  }> = [];

  // Get smart content if mnemonic exists
  let smartContent: Awaited<ReturnType<typeof generateSmartContent>> = null;
  if (wordData.mnemonic && (types.includes('MNEMONIC') || types.includes('RHYME'))) {
    smartContent = await generateSmartContent(wordData);
  }

  for (const type of types) {
    // Update job status
    currentJobResult.currentType = type;
    await updateJobInDB(jobId, { result: currentJobResult });

    let prompt: string;
    let captionKo: string;
    let captionEn: string;

    // Generate prompts and captions based on type
    switch (type) {
      case 'CONCEPT':
        prompt = `A 1:1 square flat vector illustration showing the concept: "${wordData.definitionEn || wordData.word}". Style: clean flat design, bright educational colors, minimal, high quality. CRITICAL: Absolutely NO text, NO letters, NO words, NO writing anywhere in the image. Pure visual illustration only.`;
        captionKo = wordData.definitionKo || `${wordData.word}의 의미`;
        captionEn = wordData.definitionEn || `The meaning of ${wordData.word}`;
        break;

      case 'MNEMONIC':
        if (smartContent?.mnemonicPrompt) {
          prompt = smartContent.mnemonicPrompt;
        } else {
          prompt = `A 1:1 square cartoon illustration visualizing: ${wordData.mnemonic || wordData.word}. Style: cute cartoon, memorable, colorful. CRITICAL: NO text in image.`;
        }
        captionKo = smartContent?.mnemonicCaption?.ko || wordData.mnemonicKorean || `${wordData.word} 연상법`;
        captionEn = smartContent?.mnemonicCaption?.en || wordData.mnemonic?.substring(0, 50) || `Memory tip for ${wordData.word}`;
        break;

      case 'RHYME':
        const rhymes = wordData.rhymingWords?.slice(0, 3).join(', ') || '';
        prompt = `A 1:1 square humorous cartoon illustration showing: "${wordData.definitionEn || wordData.word}". Style: playful cartoon, bright colors. CRITICAL: NO text in image.`;
        if (smartContent?.rhymeCaption) {
          captionKo = smartContent.rhymeCaption.ko;
          captionEn = smartContent.rhymeCaption.en;
        } else {
          captionKo = rhymes ? `${wordData.word}는 ${rhymes}와 라임!` : wordData.definitionKo || '';
          captionEn = rhymes ? `${wordData.word} rhymes with ${rhymes}` : wordData.definitionEn || '';
        }
        break;
    }

    // Generate image
    const imageResult = await generateImage(prompt, type, wordData.word, wordData.id);

    if (imageResult?.imageUrl) {
      generatedVisuals.push({
        type,
        imageUrl: imageResult.imageUrl,
        captionKo,
        captionEn,
        promptEn: prompt,
      });
    }

    // Rate limit delay
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Save visuals to backend
  if (generatedVisuals.length > 0) {
    await saveVisuals(wordData.id, generatedVisuals);
  }

  return {
    success: generatedVisuals.length > 0,
    imagesGenerated: generatedVisuals.length,
  };
}

/**
 * Background job processor
 */
async function processJob(jobId: string, wordIds: string[], options: BatchGenerateRequest['options']) {
  const types = options?.types || ['CONCEPT', 'MNEMONIC', 'RHYME'];

  const jobResult = {
    totalWords: wordIds.length,
    processedWords: 0,
    currentWord: undefined as string | undefined,
    currentType: undefined as string | undefined,
    results: [] as Array<{
      wordId: string;
      word: string;
      success: boolean;
      imagesGenerated: number;
      error?: string;
    }>,
  };

  // Update job status to processing
  await updateJobInDB(jobId, {
    status: 'processing',
    progress: 0,
    result: jobResult,
  });

  for (let i = 0; i < wordIds.length; i++) {
    const wordId = wordIds[i];

    // Fetch word data
    const wordData = await fetchWordData(wordId);
    if (!wordData) {
      jobResult.results.push({
        wordId,
        word: 'Unknown',
        success: false,
        imagesGenerated: 0,
        error: 'Failed to fetch word data',
      });
      jobResult.processedWords++;

      const progress = Math.round((jobResult.processedWords / jobResult.totalWords) * 100);
      await updateJobInDB(jobId, { progress, result: jobResult });
      continue;
    }

    jobResult.currentWord = wordData.word;
    await updateJobInDB(jobId, { result: jobResult });

    // Process word
    const result = await processWord(wordData, types, jobId, jobResult);

    jobResult.results.push({
      wordId: wordData.id,
      word: wordData.word,
      success: result.success,
      imagesGenerated: result.imagesGenerated,
      error: result.error,
    });
    jobResult.processedWords++;

    const progress = Math.round((jobResult.processedWords / jobResult.totalWords) * 100);
    await updateJobInDB(jobId, { progress, result: jobResult });
  }

  // Mark job as completed
  jobResult.currentWord = undefined;
  jobResult.currentType = undefined;
  await updateJobInDB(jobId, {
    status: 'completed',
    progress: 100,
    result: jobResult,
  });
}

/**
 * POST handler - Start batch image generation
 */
export async function POST(request: NextRequest) {
  try {
    // Check for required API keys
    if (!STABILITY_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Stability API not configured' },
        { status: 500 }
      );
    }

    const body: BatchGenerateRequest = await request.json();
    const { wordIds, options } = body;

    if (!wordIds || wordIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No word IDs provided' },
        { status: 400 }
      );
    }

    if (wordIds.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Maximum 50 words per batch' },
        { status: 400 }
      );
    }

    // Create job in backend database
    const createResponse = await fetch(`${API_BASE}/admin/image-jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY,
      },
      body: JSON.stringify({ wordIds, types: options?.types }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to create job' },
        { status: 500 }
      );
    }

    const createResult = await createResponse.json();
    const jobId = createResult.data?.jobId;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Failed to get job ID' },
        { status: 500 }
      );
    }

    // Start processing in background (don't await)
    processJob(jobId, wordIds, options).catch(async (error) => {
      console.error('Job processing error:', error);
      await updateJobInDB(jobId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });

    return NextResponse.json({
      success: true,
      data: createResult.data,
    });
  } catch (error) {
    console.error('[Batch Image Gen] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start batch generation',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Get job status from backend database
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: 'Job ID required' },
      { status: 400 }
    );
  }

  try {
    // Fetch job status from backend database
    const response = await fetch(`${API_BASE}/admin/image-jobs/${jobId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Job not found' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Batch Image Gen] Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}
