const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type EntryType = 'SENTENCE' | 'WORD';

export interface EntryResponse {
  id: number;
  type: EntryType;
  content: string;
  savedAt: string;
}

export async function saveEntry(type: EntryType, content: string): Promise<EntryResponse> {
  const res = await fetch(`${API_URL}/api/v1/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content }),
  });

  if (!res.ok) throw new Error('저장에 실패했습니다.');
  return res.json();
}
