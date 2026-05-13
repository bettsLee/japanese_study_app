import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_MS = 30_000;

export interface TagResponse {
  id: number;
  content: string;
  createdAt: string;
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

export async function saveTags(entryId: number, type: string, tags: string[]): Promise<TagResponse[]> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/entries/${entryId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
    },
    body: JSON.stringify({ type, tags }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`태그 저장 실패 (${res.status}${body ? ': ' + body.slice(0, 100) : ''})`);
  }
  return res.json();
}

export async function getTags(entryId: number): Promise<TagResponse[]> {
  const auth = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_URL}/api/v1/entries/${entryId}/tags`, {
    headers: { 'Authorization': auth },
  });
  if (!res.ok) throw new Error('태그 조회에 실패했습니다.');
  return res.json();
}
