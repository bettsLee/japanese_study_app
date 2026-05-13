'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEntry, EntryResponse, EntryType } from '@/lib/api/entries';
import { saveTags, getTags } from '@/lib/api/tags';

function TagContent() {
  const router = useRouter();
  const params = useSearchParams();
  const entryId = Number(params.get('entryId'));

  const [entry, setEntry] = useState<EntryResponse | null>(null);
  const [selectedType, setSelectedType] = useState<EntryType>('SENTENCE');
  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!entryId) {
      router.replace('/save');
      return;
    }
    getEntry(entryId)
      .then(async (e) => {
        setEntry(e);
        setSelectedType(e.type);
        const existingTags = await getTags(entryId).catch(() => []);
        if (existingTags.length > 0) {
          setTags(existingTags.map(t => t.content));
        }
      })
      .catch(() => router.replace('/save'))
      .finally(() => setLoading(false));
  }, [entryId, router]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleDone = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await saveTags(entryId, selectedType, tags);
      router.push('/list');
    } catch (err) {
      setSaveError((err as Error).message || '저장에 실패했습니다. 다시 시도해주세요.');
      setSaving(false);
    }
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
          aria-label="뒤로가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-3 text-base font-semibold text-gray-900">태깅</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 py-6">
        {/* 저장된 문장/단어 표시 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-500">Saved</p>
          <p className="text-base text-gray-900">{entry?.content}</p>
        </div>

        {/* 태깅 종류 선택 */}
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">태깅 종류</p>
          <div className="flex rounded-xl border border-gray-200 bg-white p-1">
            <button
              onClick={() => setSelectedType('SENTENCE')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                selectedType === 'SENTENCE'
                  ? 'bg-sky-400 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              문장
            </button>
            <button
              onClick={() => setSelectedType('WORD')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                selectedType === 'WORD'
                  ? 'bg-sky-400 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              단어
            </button>
          </div>
        </div>

        {/* 태그 입력 */}
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">태그</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="태그 입력 후 Enter"
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            <button
              onClick={addTag}
              className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              추가
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 text-sky-400 hover:text-sky-600"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        {saveError && <p className="mb-3 text-sm text-red-500">{saveError}</p>}
        <button
          onClick={handleDone}
          disabled={saving}
          className="w-full rounded-xl bg-sky-400 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? '저장 중...' : '완료'}
        </button>
      </div>
    </main>
  );
}

export default function TagPage() {
  return (
    <Suspense>
      <TagContent />
    </Suspense>
  );
}
