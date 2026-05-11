'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveEntry, EntryType } from '@/lib/api/entries';

export default function SavePage() {
  const router = useRouter();
  const [type, setType] = useState<EntryType>('SENTENCE');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      const entry = await saveEntry(type, content.trim());
      // 저장 완료 후 태깅 화면으로 이동 (JP-8)
      router.push(`/tag?entryId=${entry.id}&type=${entry.type}`);
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="뒤로가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-900">문장 저장</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 py-6">
        {/* 타입 선택 */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-1">
          <button
            onClick={() => setType('SENTENCE')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              type === 'SENTENCE'
                ? 'bg-sky-400 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            문장
          </button>
          <button
            onClick={() => setType('WORD')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              type === 'WORD'
                ? 'bg-sky-400 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            단어
          </button>
        </div>

        {/* 텍스트 입력 */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {type === 'SENTENCE' ? 'Japanese Sentence' : 'Japanese Word'}
          </label>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'SENTENCE' ? 'Enter Japanese text here...' : 'Enter Japanese word here...'}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            <span className="absolute bottom-3 right-3 text-xs font-semibold text-gray-400">JP</span>
          </div>
          <p className="text-xs text-gray-400">
            {type === 'SENTENCE' ? 'Tip: Use kanji for better practice.' : 'Tip: Include kanji if known.'}
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* 저장 버튼 (하단 고정) */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <button
          onClick={handleSave}
          disabled={loading || !content.trim()}
          className="w-full rounded-xl bg-sky-400 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? '저장 중...' : 'Save Sentence'}
        </button>
      </div>
    </main>
  );
}
