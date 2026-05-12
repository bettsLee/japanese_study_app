'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEntries, forceAddToQuiz, EntryResponse } from '@/lib/api/entries';

export default function ListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<EntryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    getEntries()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleForceAdd = async (id: number) => {
    setAddingId(id);
    try {
      const updated = await forceAddToQuiz(id);
      setEntries(prev => prev.map(e => e.id === id ? updated : e));
    } catch {
      // 실패 시 무시
    } finally {
      setAddingId(null);
    }
  };

  const accuracyLabel = (entry: EntryResponse) => {
    if (entry.quizCount === 0) return '-';
    const pct = Math.round((entry.correctCount / entry.quizCount) * 100);
    return `${pct}%`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => router.push('/save')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="홈으로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-3 text-base font-semibold text-gray-900">목록</h1>
        <span className="ml-auto text-sm text-gray-400">{entries.length}개</span>
      </header>

      {/* 목록 */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-5">
        {entries.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400">
            <p className="text-sm">저장된 항목이 없습니다.</p>
            <button onClick={() => router.push('/save')} className="text-sm font-semibold text-sky-500">
              문장 저장하러 가기
            </button>
          </div>
        )}

        {entries.map(entry => (
          <div key={entry.id} className="rounded-xl border border-gray-200 bg-white p-4">
            {/* 타입 + 내용 */}
            <div className="mb-3 flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                entry.type === 'SENTENCE' ? 'bg-sky-100 text-sky-600' : 'bg-purple-100 text-purple-600'
              }`}>
                {entry.type === 'SENTENCE' ? '문장' : '단어'}
              </span>
              <p className="text-sm text-gray-900">{entry.content}</p>
            </div>

            {/* 퀴즈 통계 */}
            <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
              <span>노출 {entry.quizCount}회</span>
              <span>정답 {entry.correctCount}/{entry.quizCount}</span>
              <span>정답률 {accuracyLabel(entry)}</span>
            </div>

            {/* 퀴즈 상태 / 수동 추가 버튼 */}
            <div className="flex items-center justify-between">
              {entry.inQuizPool ? (
                <span className="text-xs font-semibold text-green-600">✓ 퀴즈 대상</span>
              ) : (
                <span className="text-xs font-semibold text-gray-400">퀴즈 제외 (정답률 90% 이상)</span>
              )}
              {!entry.inQuizPool && (
                <button
                  onClick={() => handleForceAdd(entry.id)}
                  disabled={addingId === entry.id}
                  className="rounded-lg bg-sky-400 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
                >
                  {addingId === entry.id ? '추가 중...' : '퀴즈 추가'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 저장 버튼 */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => router.push('/save')}
          className="w-full rounded-xl bg-sky-400 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 active:scale-[0.98]"
        >
          새 문장 저장
        </button>
      </div>
    </main>
  );
}
