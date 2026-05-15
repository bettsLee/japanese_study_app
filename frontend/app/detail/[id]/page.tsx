'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getEntry, updateEntry, EntryResponse } from '@/lib/api/entries';
import { saveTags, getTags } from '@/lib/api/tags';

interface AiResult {
  translation: string;
  analysis: string;
  correction: string;
  suggestedTags: string[];
}

const AI_CACHE_PREFIX = 'ai_result_';

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = Number(params.id);

  const [entry, setEntry] = useState<EntryResponse | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!entryId) {
      router.replace('/list');
      return;
    }

    const init = async () => {
      try {
        const [e, existingTags] = await Promise.all([
          getEntry(entryId),
          getTags(entryId).catch(() => []),
        ]);
        setEntry(e);
        setSelectedTags(existingTags.map(t => t.content));

        // 캐시 확인
        const cacheKey = `${AI_CACHE_PREFIX}${entryId}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setAiResult(JSON.parse(cached));
          setAiLoading(false);
          return;
        }

        // 캐시 없으면 AI 호출
        const aiRes = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: e.content, type: e.type }),
        });
        if (!aiRes.ok) throw new Error('AI 분석에 실패했습니다.');
        const result: AiResult = await aiRes.json();
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
        setAiResult(result);
      } catch (err) {
        setAiError(err instanceof Error ? err.message : 'AI 분석에 실패했습니다.');
      } finally {
        setAiLoading(false);
      }
    };

    init();
  }, [entryId, router]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!entry) return;
    setSaving(true);
    setSaveError('');
    try {
      await saveTags(entryId, entry.type, selectedTags);
      router.push('/list');
    } catch {
      setSaveError('태그 저장에 실패했습니다. 다시 시도해주세요.');
      setSaving(false);
    }
  };

  const handleAcceptCorrection = async () => {
    if (!entry || !aiResult) return;
    setAccepting(true);
    try {
      const updated = await updateEntry(entryId, aiResult.correction);
      setEntry(updated);
      // 캐시 무효화 (내용이 바뀌었으므로)
      sessionStorage.removeItem(`${AI_CACHE_PREFIX}${entryId}`);
      setAiResult(prev => prev ? { ...prev, correction: '올바른 표현입니다' } : null);
    } catch {
      setSaveError('교정 수락에 실패했습니다.');
    } finally {
      setAccepting(false);
    }
  };

  if (!entry && aiLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      </main>
    );
  }

  const allTagOptions = [
    ...selectedTags,
    ...(aiResult?.suggestedTags ?? []).filter(t => !selectedTags.includes(t)),
  ];

  const hasCorrectionSuggestion =
    aiResult?.correction && aiResult.correction !== '올바른 표현입니다';

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => router.push('/list')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="목록으로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-3 text-base font-semibold text-gray-900">상세보기</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        {/* 저장된 내용 */}
        {entry && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <span className={`mb-2 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
              entry.type === 'SENTENCE' ? 'bg-sky-100 text-sky-600' : 'bg-purple-100 text-purple-600'
            }`}>
              {entry.type === 'SENTENCE' ? '문장' : '단어'}
            </span>
            <p className="text-base font-medium text-gray-900">{entry.content}</p>
          </div>
        )}

        {/* AI 분석 결과 */}
        {aiLoading ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
            <p className="text-sm text-gray-400">AI 분석 중...</p>
          </div>
        ) : aiError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm text-red-500">{aiError}</p>
          </div>
        ) : aiResult && (
          <div className="flex flex-col gap-3">
            {/* 번역 */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-sky-500">번역</p>
              <p className="text-sm text-gray-800">{aiResult.translation}</p>
            </div>

            {/* 분석 */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-sky-500">단어/문법 분석</p>
              <p className="text-sm text-gray-800 leading-relaxed">{aiResult.analysis}</p>
            </div>

            {/* 교정 */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-sky-500">교정 제안</p>
              <p className="text-sm text-gray-800">{aiResult.correction}</p>
              {hasCorrectionSuggestion && (
                <button
                  onClick={handleAcceptCorrection}
                  disabled={accepting}
                  className="mt-3 rounded-lg bg-sky-400 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
                >
                  {accepting ? '수락 중...' : '교정 수락'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 태그 선택 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-sky-500">태그 선택</p>
          {aiLoading ? (
            <p className="text-sm text-gray-400">AI 분석 완료 후 표시됩니다...</p>
          ) : allTagOptions.length === 0 ? (
            <p className="text-sm text-gray-400">추천 태그가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allTagOptions.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    selectedTags.includes(tag)
                      ? 'bg-sky-400 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          {selectedTags.length > 0 && (
            <p className="mt-2.5 text-xs text-gray-400">
              선택됨: {selectedTags.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        {saveError && <p className="mb-3 text-sm text-red-500">{saveError}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-sky-400 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? '저장 중...' : '태그 저장'}
        </button>
      </div>
    </main>
  );
}
