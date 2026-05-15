'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEntries, EntryResponse } from '@/lib/api/entries';

export default function QuizPage() {
  const router = useRouter();
  const [quizItems, setQuizItems] = useState<EntryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const entries = await getEntries();
      setQuizItems(entries.filter(e => e.inQuizPool));
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-gray-50">
        <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
          <button
            onClick={() => router.push('/home')}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="홈으로"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="ml-3 text-base font-semibold text-gray-900">퀴즈</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <p className="text-center text-sm text-gray-500">{error}</p>
          <button
            onClick={load}
            className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  // 빈 상태
  if (quizItems.length === 0) {
    return (
      <main className="flex min-h-screen flex-col bg-gray-50">
        <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
          <button
            onClick={() => router.push('/home')}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="홈으로"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="ml-3 text-base font-semibold text-gray-900">퀴즈</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <span className="text-5xl">🎉</span>
          <div>
            <p className="text-base font-semibold text-gray-800">모든 단어를 마스터했어요!</p>
            <p className="mt-1 text-sm text-gray-500">새로운 단어를 저장해보세요</p>
          </div>
          <button
            onClick={() => router.push('/save')}
            className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500"
          >
            단어 저장하러 가기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => router.push('/home')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="홈으로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-3 text-base font-semibold text-gray-900">퀴즈</h1>
        <span className="ml-auto text-sm text-gray-400">{quizItems.length}개 대기 중</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <span className="text-6xl">🧠</span>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">퀴즈 준비 완료!</p>
          <p className="mt-1 text-sm text-gray-500">{quizItems.length}개의 단어/문장이 기다리고 있어요</p>
        </div>
        <button
          disabled
          className="rounded-xl bg-gray-200 px-8 py-4 text-sm font-bold text-gray-400 cursor-not-allowed"
        >
          퀴즈 시작 (준비 중)
        </button>
      </div>
    </main>
  );
}
