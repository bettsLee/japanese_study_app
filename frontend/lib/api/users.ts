const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function upsertMe(token: string, email: string, name: string | null): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/users/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) throw new Error('유저 정보 저장 실패');
}
