'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function CallbackHandler() {
  const router = useRouter();
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const search = window.location.search;
    const hash = window.location.hash;
    const params = new URLSearchParams(search);
    const code = params.get('code');
    const next = params.get('next') ?? '/save';

    setDebug(`search: ${search || '(empty)'} | hash: ${hash || '(empty)'} | code: ${code ?? 'NULL'}`);

    if (!code) {
      setTimeout(() => router.push('/login?error=auth_error'), 3000);
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
      <p className="text-sm text-gray-500">로그인 처리 중...</p>
      {debug && (
        <p className="max-w-lg break-all rounded bg-gray-100 p-3 font-mono text-xs text-gray-700">
          {debug}
        </p>
      )}
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
