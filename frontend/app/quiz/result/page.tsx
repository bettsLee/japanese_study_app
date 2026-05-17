'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/lib/api/quiz';

interface QuizResult {
  question: QuizQuestion;
  koreanMeaning: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}

export default function QuizResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResults');
    if (!stored) {
      router.replace('/quiz');
      return;
    }
    try {
      setResults(JSON.parse(stored));
    } catch {
      router.replace('/quiz');
      return;
    }
    sessionStorage.removeItem('quizResults');
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
      </main>
    );
  }

  const correctCount = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const summaryEmoji = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚';
  const summaryMsg =
    pct >= 80 ? '잘 하셨어요!' : pct >= 50 ? '조금만 더 연습해봐요!' : '꾸준히 복습해봐요!';

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => router.push('/list')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-3 text-base font-semibold text-gray-900">퀴즈 결과</h1>
      </header>

      <div className="flex flex-col gap-4 px-4 py-6">
        {/* 점수 요약 */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center shadow-sm">
          <span className="text-4xl">{summaryEmoji}</span>
          <p className="mt-3 text-2xl font-bold text-gray-900">{pct}%</p>
          <p className="mt-1 text-sm text-gray-500">
            {total}개 중 {correctCount}개 정답
          </p>
          <p className="mt-2 text-sm font-semibold text-indigo-500">{summaryMsg}</p>
        </div>

        {/* 문제별 결과 */}
        <div className="flex flex-col gap-3">
          {results.map((result, i) => (
            <div
              key={result.question.id}
              className={`rounded-xl border bg-white p-4 shadow-sm ${
                result.isCorrect ? 'border-green-200' : 'border-red-200'
              }`}
            >
              {/* 번호 + 유형 + 정오 */}
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400">#{i + 1}</span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                  result.question.type === 'SENTENCE'
                    ? 'bg-sky-100 text-sky-600'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {result.question.type === 'SENTENCE' ? '문장' : '단어'}
                </span>
                <span className="ml-auto text-base">
                  {result.isCorrect ? '✅' : '❌'}
                </span>
              </div>

              {/* 한국어 뜻 */}
              <p className="mb-3 text-sm font-semibold text-gray-800">{result.koreanMeaning}</p>

              {/* 내 답 / 정답 */}
              {!result.isCorrect && (
                <div className="mb-2 rounded-lg bg-red-50 px-3 py-2">
                  <p className="text-xs text-gray-400">내 답변</p>
                  <p className="text-sm text-gray-700">{result.userAnswer || '(입력 없음)'}</p>
                </div>
              )}
              <div className={`mb-3 rounded-lg px-3 py-2 ${result.isCorrect ? 'bg-green-50' : 'bg-green-50'}`}>
                <p className="text-xs text-gray-400">정답</p>
                <p className="text-sm font-semibold text-gray-900">{result.correctAnswer}</p>
              </div>

              {/* AI 해설 */}
              <div className="rounded-lg bg-indigo-50 px-3 py-2">
                <p className="text-xs text-indigo-400 mb-0.5">AI 해설</p>
                <p className="text-xs text-gray-700">{result.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 flex gap-3">
        <button
          onClick={() => router.push('/quiz')}
          className="flex-1 rounded-xl bg-indigo-500 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-[0.98]"
        >
          다시 풀기
        </button>
        <button
          onClick={() => router.push('/save')}
          className="flex-1 rounded-xl bg-sky-400 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 active:scale-[0.98]"
        >
          단어 저장하러 가기
        </button>
      </div>
    </main>
  );
}
