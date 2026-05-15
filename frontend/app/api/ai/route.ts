import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { content, type } = await request.json();

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
  "correction": "교정 제안 또는 이미 올바르면 '올바른 표현입니다'",
  "suggestedTags": ["태그1", "태그2", "태그3"]
}

suggestedTags는 이 표현의 특성을 나타내는 태그 3~5개. 예시: 명사, 동사, 형용사, 인사, 일상회화, 경어, 겸양어, N5, N4, N3 등`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Gemini API 호출 실패' }, { status: 502 });
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
