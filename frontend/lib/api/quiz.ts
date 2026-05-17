import { createClient } from '@/lib/supabase/client';
import { EntryType } from '@/lib/api/entries';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_MS = 30_000;

export interface QuizQuestion {
  id: number;
  type: EntryType;
  content: string;
}

async function getAuthHeader(): Promise<string> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('로그인이 필요합니다.');
  return `Bearer ${session.access_token}`;
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/quiz`, {
    headers: { 'Authorization': auth },
  });
  if (!res.ok) throw new Error('퀴즈 문제를 불러오지 못했습니다.');
  return res.json();
}

export async function submitQuizAnswer(entryId: number, correct: boolean): Promise<void> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/quiz/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
    },
    body: JSON.stringify({ entryId, correct }),
  });
  if (!res.ok) throw new Error('답변 제출에 실패했습니다.');
}
