import { NextResponse } from 'next/server';

const MOCK_RESPONSE = {
  translation: '감사했습니다 (mock)',
  analysis: '[Mock] 과거형 정중체 표현입니다. ありがとう(감사하다)의 정중 과거형으로 N5 수준의 기본 표현입니다.',
  correction: '올바른 표현입니다',
  suggestedTags: ['인사', '일상회화', 'N5', '정중체'],
};

export async function POST(request: Request) {
  const { content, type } = await request.json();

  if (process.env.NODE_ENV !== 'production') {
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ ...MOCK_RESPONSE, translation: `${content} (mock)` });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const label = type === 'WORD' ? '단어' : '문장';
  const prompt = `당신은 일본어 교육 전문가입니다. 아래 일본어 ${label}을 분석해주세요.

입력: "${content}"

아래 JSON 형식으로만 응답해주세요 (마크다운 코드블록 없이 순수 JSON):
{
  "translation": "한국어 번역",
  "analysis": "단어/문법 분석 (2-3문장, 한국어로)",
  "correction": "교정 이유 설명 (한국어로). 교정이 필요 없으면 '올바른 표현입니다'",
  "correctedContent": "교정된 일본어 표현 (교정 불필요 시 빈 문자열 \"\")",
  "suggestedTags": ["태그1", "태그2", "태그3"]
}

suggestedTags는 이 표현의 특성을 나타내는 한국어 태그 3~5개. 반드시 한국어로만 작성. 예시: 명사, 동사, 형용사, 인사, 일상회화, 경어, 겸양어, N5, N4, N3 등`;

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
    return NextResponse.json({ error: 'Gemini API 호출 실패', status: res.status, detail: errBody }, { status: 502 });
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
