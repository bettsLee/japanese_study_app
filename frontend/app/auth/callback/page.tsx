'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    // useSearchParams는 정적 페이지 첫 렌더에서 빈 값을 반환할 수 있으므로
    // window.location.search로 직접 파싱
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const next = params.get('next') ?? '/save';

    if (!code) {
      router.push('/login?error=auth_error');
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          router.push(`/login?error=auth_error&detail=${encodeURIComponent(error.message)}`);
        } else {
          router.push(next);
        }
      })
      .catch((err) => {
        router.push(`/login?error=auth_error&detail=${encodeURIComponent(String(err))}`);
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">로그인 처리 중...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
