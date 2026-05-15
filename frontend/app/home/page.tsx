'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEntries } from '@/lib/api/entries';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const router = useRouter();
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? '');
      }

      try {
        const entries = await getEntries();
        const today = new Date();
        const count = entries.filter(e => {
          const d = new Date(e.savedAt);
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        }).length;
        setTodayCount(count);
      } catch {
        setTodayCount(0);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
        <h1 className="text-base font-semibold text-gray-900">📖 Kotoba</h1>
        <button
          onClick={handleLogout}
          className="ml-auto text-sm text-gray-400 hover:text-gray-600"
        >
          로그아웃
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 py-8">
        {/* 인사 + 오늘 저장 수 */}
        <div className="rounded-2xl bg-sky-400 px-6 py-6 text-white shadow-sm">
          <p className="text-sm font-medium opacity-80">
            {userName ? `${userName}님, 안녕하세요!` : '안녕하세요!'}
          </p>
          <p className="mt-1 text-2xl font-bold">
            오늘 저장한 단어/문장
          </p>
          <p className="mt-2 text-4xl font-extrabold">
            {todayCount === null ? (
              <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-sky-300" />
            ) : (
              `${todayCount}개`
            )}
          </p>
        </div>

        {/* 바로가기 */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">바로가기</p>

          <button
            onClick={() => router.push('/save')}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-xl">✏️</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">저장</p>
              <p className="text-xs text-gray-400">새 단어/문장 저장하기</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => router.push('/list')}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-xl">📋</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">목록</p>
              <p className="text-xs text-gray-400">저장한 단어/문장 보기</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => router.push('/quiz')}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-xl">🧠</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">퀴즈</p>
              <p className="text-xs text-gray-400">퀴즈로 복습하기</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
