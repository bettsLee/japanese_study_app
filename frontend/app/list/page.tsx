'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEntries, forceAddToQuiz, deleteEntry, EntryResponse } from '@/lib/api/entries';

export default function ListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<EntryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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

  const handleDeleteConfirm = async (id: number) => {
    setConfirmId(null);
    setDeletingId(id);
    try {
      await deleteEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch {
      // 실패 시 무시
    } finally {
      setDeletingId(null);
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
          <h1 className="ml-3 text-base font-semibold text-gray-900">목록</h1>
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

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gray-50">
        {/* 헤더 */}
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
          <h1 className="ml-3 text-base font-semibold text-gray-900">목록</h1>
          <span className="ml-auto text-sm text-gray-400">{entries.length}개</span>
        </header>

        {/* 목록 */}
        <div className="flex flex-1 flex-col gap-3 px-4 py-5">
          {/* 빈 상태 */}
          {entries.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
              <span className="text-5xl">📭</span>
              <div>
                <p className="text-base font-semibold text-gray-700">아직 저장한 단어/문장이 없어요</p>
                <p className="mt-1 text-sm text-gray-400">일본어 단어나 문장을 저장해보세요</p>
              </div>
              <button
                onClick={() => router.push('/save')}
                className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500"
              >
                저장하러 가기
              </button>
            </div>
          )}

          {entries.map(entry => (
            <div key={entry.id} className="rounded-xl border border-gray-200 bg-white p-4">
              {/* 타입 + 내용 + 삭제 버튼 */}
              <div className="mb-3 flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                  entry.type === 'SENTENCE' ? 'bg-sky-100 text-sky-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {entry.type === 'SENTENCE' ? '문장' : '단어'}
                </span>
                <p className="flex-1 text-sm text-gray-900">{entry.content}</p>
                <button
                  onClick={() => setConfirmId(entry.id)}
                  disabled={deletingId === entry.id}
                  className="ml-1 shrink-0 rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-40"
                  aria-label="삭제"
                >
                  {deletingId === entry.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>

              {/* 태그 */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                {entry.tags?.map(tag => (
                  <span key={tag.id} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-600">
                    {tag.content}
                  </span>
                ))}
                <button
                  onClick={() => router.push(`/detail/${entry.id}`)}
                  className="rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs text-gray-400 hover:border-sky-400 hover:text-sky-500"
                >
                  {entry.tags?.length > 0 ? '상세보기' : 'AI 분석'}
                </button>
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

      {/* 삭제 확인 팝업 */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-base font-semibold text-gray-900">삭제하시겠어요?</p>
            <p className="mt-1 text-sm text-gray-500">삭제하면 복구할 수 없어요.</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => handleDeleteConfirm(confirmId)}
                className="flex-1 rounded-xl bg-red-400 py-3 text-sm font-semibold text-white hover:bg-red-500"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
