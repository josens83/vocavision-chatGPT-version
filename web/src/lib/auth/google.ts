// /web/src/lib/auth/google.ts
// 구글 OAuth 로그인 유틸리티

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * 구글 로그인 URL 생성
 */
export function getGoogleLoginUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * 구글 로그인 처리 (백엔드 연동)
 */
export async function loginWithGoogle(code: string): Promise<{
  success: boolean;
  token: string;
  user: {
    id: string;
    name?: string;
    email?: string | null;
    avatar?: string | null;
    role: string;
    provider?: string;
    subscriptionStatus: string;
  };
}> {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || '구글 로그인에 실패했습니다');
  }

  return data;
}
