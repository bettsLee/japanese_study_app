import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListPage from '@/app/list/page';
import * as entriesApi from '@/lib/api/entries';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/lib/api/entries');

const mockGetEntries = entriesApi.getEntries as jest.Mock;
const mockForceAddToQuiz = entriesApi.forceAddToQuiz as jest.Mock;

const inPoolEntry = {
  id: 1, type: 'SENTENCE' as const, content: 'おはよう', savedAt: '2026-05-11',
  quizCount: 5, correctCount: 3, inQuizPool: true,
};
const excludedEntry = {
  id: 2, type: 'WORD' as const, content: '猫', savedAt: '2026-05-11',
  quizCount: 10, correctCount: 9, inQuizPool: false,
};

describe('ListPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('항목 목록을 렌더링한다', async () => {
    mockGetEntries.mockResolvedValue([inPoolEntry]);
    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('おはよう')).toBeInTheDocument());
  });

  it('퀴즈 대상 항목에 "✓ 퀴즈 대상" 표시', async () => {
    mockGetEntries.mockResolvedValue([inPoolEntry]);
    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('✓ 퀴즈 대상')).toBeInTheDocument());
  });

  it('퀴즈 제외 항목에 "퀴즈 추가" 버튼 표시', async () => {
    mockGetEntries.mockResolvedValue([excludedEntry]);
    render(<ListPage />);
    await waitFor(() => expect(screen.getByRole('button', { name: '퀴즈 추가' })).toBeInTheDocument());
  });

  it('퀴즈 추가 버튼 클릭 시 forceAddToQuiz 호출', async () => {
    mockGetEntries.mockResolvedValue([excludedEntry]);
    mockForceAddToQuiz.mockResolvedValue({ ...excludedEntry, inQuizPool: true });
    render(<ListPage />);
    await waitFor(() => screen.getByRole('button', { name: '퀴즈 추가' }));
    fireEvent.click(screen.getByRole('button', { name: '퀴즈 추가' }));
    await waitFor(() => expect(mockForceAddToQuiz).toHaveBeenCalledWith(2));
  });

  it('정답률을 올바르게 계산하여 표시', async () => {
    mockGetEntries.mockResolvedValue([inPoolEntry]); // 3/5 = 60%
    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('정답률 60%')).toBeInTheDocument());
  });

  it('퀴즈 이력 없으면 정답률 "-" 표시', async () => {
    const noHistory = { ...inPoolEntry, quizCount: 0, correctCount: 0 };
    mockGetEntries.mockResolvedValue([noHistory]);
    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('정답률 -')).toBeInTheDocument());
  });

  it('목록이 비어있으면 안내 문구 표시', async () => {
    mockGetEntries.mockResolvedValue([]);
    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('저장된 항목이 없습니다.')).toBeInTheDocument());
  });
});
