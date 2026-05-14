const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function upsertMe(token: string, email: string, name: string | null): Promise<void> {
  const controller = new AbortController();
  // Render 무료 플랜 콜드 스타트 대비 30초
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, name }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('유저 정보 저장 실패');
  } finally {
    clearTimeout(timeout);
  }
}
