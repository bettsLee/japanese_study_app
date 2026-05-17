import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { content, type, koreanMeaning, userAnswer } = await request.json();

  if (process.env.NODE_ENV !== 'production') {
    await new Promise(r => setTimeout(r, 300));
    const isEmpty = !userAnswer || userAnswer.trim() === '';
    return NextResponse.json({
      isCorrect: !isEmpty,
      explanation: isEmpty
        ? '답변을 입력하지 않았습니다.'
        : `정답입니다! "${content}"의 올바른 표현입니다. (mock)`,
      correctAnswer: content,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const label = type === 'WORD' ? '단어' : '문장';
  const criteria = type === 'WORD'
    ? `- 한자로 입력해도 정답
- 히라가나/가타카나로 입력해도 정답
- 반각/전각 상관없이 정답
- 의미가 맞으면 정답
- 답변이 비어있으면 오답`
    : `- 문법이 맞고 의미가 통하면 정답
- 원문과 완전히 일치하지 않아도 정답 가능
- 유도리있게 판단
- 답변이 비어있으면 오답`;

  const prompt = `당신은 일본어 교사입니다. 아래 ${label}에 대한 학습자의 답변을 채점해주세요.

원래 ${label}: ${content}
한국어 뜻: ${koreanMeaning}
학습자 답변: ${userAnswer || '(없음)'}

채점 기준:
${criteria}

아래 JSON 형식으로만 응답해주세요 (마크다운 코드블록 없이 순수 JSON):
{
  "isCorrect": true 또는 false,
  "explanation": "채점 이유 한두 문장 (한국어로)",
  "correctAnswer": "모범 답안 (일본어)"
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    return NextResponse.json({ error: 'Gemini API 호출 실패', detail: errBody }, { status: 502 });
  }

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch {
    return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
  }
}
