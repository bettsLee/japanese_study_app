'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getQuizQuestions, submitQuizAnswer, QuizQuestion } from '@/lib/api/quiz';

interface QuizResult {
  question: QuizQuestion;
  koreanMeaning: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}

type Phase = 'loading' | 'quiz' | 'finishing';

export default function QuizPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [answerError, setAnswerError] = useState('');

  const pendingOps = useRef<Promise<QuizResult>[]>([]);
  const isMounted = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const qs = await getQuizQuestions();
        if (!isMounted.current) return;

        if (qs.length === 0) {
          setQuestions([]);
          setPhase('quiz');
          return;
        }

        setQuestions(qs);

        const translationResults = await Promise.all(
          qs.map(async (q) => {
            try {
              const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: q.content, type: q.type }),
              });
              const data = await res.json();
              return { id: q.id, translation: data.translation ?? q.content };
            } catch {
              return { id: q.id, translation: q.content };
            }
          })
        );

        if (!isMounted.current) return;

        const map: Record<number, string> = {};
        translationResults.forEach(({ id, translation }) => { map[id] = translation; });

        setTranslations(map);
        setPhase('quiz');
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (phase === 'quiz' && questions.length > 0) {
      inputRef.current?.focus();
    }
  }, [phase, currentIndex, questions.length]);

  const gradeAndUpdate = async (
    question: QuizQuestion,
    koreanMeaning: string,
    answer: string,
  ): Promise<QuizResult> => {
    const gradeRes = await fetch('/api/quiz-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: question.content,
        type: question.type,
        koreanMeaning,
        userAnswer: answer,
      }),
    });

    const gradeData = await gradeRes.json();
    const isCorrect: boolean = gradeData.isCorrect ?? false;
    const explanation: string = gradeData.explanation ?? '';
    const correctAnswer: string = gradeData.correctAnswer ?? question.content;

    await submitQuizAnswer(question.id, isCorrect);

    return { question, koreanMeaning, userAnswer: answer, isCorrect, explanation, correctAnswer };
  };

  const handleNext = async () => {
    const answer = userAnswer.trim();
    if (!answer) {
      setAnswerError('답변을 입력해주세요.');
      return;
    }
    setAnswerError('');

    const question = questions[currentIndex];
    const koreanMeaning = translations[question.id] ?? question.content;
    const isLast = currentIndex === questions.length - 1;

    pendingOps.current.push(gradeAndUpdate(question, koreanMeaning, answer));

    if (!isLast) {
      setUserAnswer('');
      setCurrentIndex(prev => prev + 1);
    } else {
      setPhase('finishing');
      const settled = await Promise.allSettled(pendingOps.current);
      const results: QuizResult[] = settled
        .filter((r): r is PromiseFulfilledResult<QuizResult> => r.status === 'fulfilled')
        .map(r => r.value);
      sessionStorage.setItem('quizResults', JSON.stringify(results));
      router.push('/quiz/result');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNext();
  };

  // 로딩 상태
  if (phase === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
        <p className="text-sm text-gray-500">퀴즈를 준비하는 중...</p>
      </main>
    );
  }

  // 채점 중 상태
  if (phase === 'finishing') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
        <p className="text-sm text-gray-500">결과를 분석하는 중...</p>
      </main>
    );
  }

  // 오류 상태
  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-gray-50">
        <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
          <button
            onClick={() => router.push('/list')}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
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
            onClick={() => window.location.reload()}
            className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  // 빈 상태 (퀴즈 대상 없음)
  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen flex-col bg-gray-50">
        <header className="flex items-center border-b border-gray-200 bg-white px-4 py-4">
          <button
            onClick={() => router.push('/list')}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
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

  const current = questions[currentIndex];
  const koreanMeaning = translations[current.id] ?? '';
  const isLast = currentIndex === questions.length - 1;
  const progress = `${currentIndex + 1}/${questions.length}`;

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
        <h1 className="ml-3 text-base font-semibold text-gray-900">퀴즈</h1>
        <span className="ml-auto text-sm font-semibold text-indigo-500">{progress}</span>
      </header>

      {/* 진행 바 */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-indigo-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 문제 영역 */}
      <div className="flex flex-1 flex-col px-5 py-8 gap-6">
        {/* 유형 배지 */}
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
            current.type === 'SENTENCE' ? 'bg-sky-100 text-sky-600' : 'bg-purple-100 text-purple-600'
          }`}>
            {current.type === 'SENTENCE' ? '문장' : '단어'}
          </span>
        </div>

        {/* 한국어 뜻 */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          {koreanMeaning ? (
            <p className="text-xl font-semibold text-gray-900 leading-relaxed">{koreanMeaning}</p>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
              <span className="text-sm text-gray-400">번역 불러오는 중...</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 text-center">일본어로 입력해주세요</p>

        {/* 입력 */}
        <div className="flex flex-col gap-2">
          <input
            key={currentIndex}
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={e => { setUserAnswer(e.target.value); setAnswerError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="일본어 입력..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {answerError && (
            <p className="text-xs text-red-500">{answerError}</p>
          )}
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="border-t border-gray-200 bg-white px-5 py-4">
        <button
          onClick={handleNext}
          disabled={!koreanMeaning}
          className="w-full rounded-xl bg-indigo-500 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLast ? '완료' : '다음'}
        </button>
      </div>
    </main>
  );
}
