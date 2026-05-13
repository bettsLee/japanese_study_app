import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_MS = 30_000;

export type EntryType = 'SENTENCE' | 'WORD';

export interface EntryResponse {
  id: number;
  type: EntryType;
  content: string;
  savedAt: string;
  quizCount: number;
  correctCount: number;
  inQuizPool: boolean;
  tags: { id: number; content: string; createdAt: string }[];
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

export async function saveEntry(type: EntryType, content: string): Promise<EntryResponse> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
    },
    body: JSON.stringify({ type, content }),
  });
  if (!res.ok) throw new Error(`저장 실패 (${res.status})`);
  return res.json();
}

export async function getEntry(id: number): Promise<EntryResponse> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/entries/${id}`, {
    headers: { 'Authorization': auth },
  });
  if (!res.ok) throw new Error('조회에 실패했습니다.');
  return res.json();
}

export async function getEntries(): Promise<EntryResponse[]> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/entries`, {
    headers: { 'Authorization': auth },
  });
  if (!res.ok) throw new Error('조회에 실패했습니다.');
  return res.json();
}

export async function forceAddToQuiz(id: number): Promise<EntryResponse> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/entries/${id}/quiz-add`, {
    method: 'PUT',
    headers: { 'Authorization': auth },
  });
  if (!res.ok) throw new Error('퀴즈 추가에 실패했습니다.');
  return res.json();
}
