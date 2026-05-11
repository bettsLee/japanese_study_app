import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavePage from '@/app/save/page';
import * as entriesApi from '@/lib/api/entries';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));
jest.mock('@/lib/api/entries');

const mockSaveEntry = entriesApi.saveEntry as jest.Mock;

describe('SavePage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('문장/단어 타입 버튼이 렌더링된다', () => {
    render(<SavePage />);
    expect(screen.getByRole('button', { name: '문장' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '단어' })).toBeInTheDocument();
  });

  it('입력 없이는 저장 버튼이 비활성화된다', () => {
    render(<SavePage />);
    expect(screen.getByRole('button', { name: /Save Sentence/i })).toBeDisabled();
  });

  it('텍스트 입력 후 저장 버튼이 활성화된다', () => {
    render(<SavePage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Japanese/i), {
      target: { value: 'おはようございます' },
    });
    expect(screen.getByRole('button', { name: /Save Sentence/i })).not.toBeDisabled();
  });

  it('저장 성공 시 saveEntry가 호출된다', async () => {
    mockSaveEntry.mockResolvedValue({ id: 1, type: 'SENTENCE', content: 'おはよう', savedAt: '2026-05-11', quizCount: 0, correctCount: 0, inQuizPool: true });
    render(<SavePage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Japanese/i), {
      target: { value: 'おはよう' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Sentence/i }));
    await waitFor(() => expect(mockSaveEntry).toHaveBeenCalledWith('SENTENCE', 'おはよう'));
  });

  it('저장 실패 시 에러 메시지가 표시된다', async () => {
    mockSaveEntry.mockRejectedValue(new Error('저장에 실패했습니다.'));
    render(<SavePage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Japanese/i), {
      target: { value: 'テスト' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Sentence/i }));
    await waitFor(() => expect(screen.getByText('저장에 실패했습니다. 다시 시도해주세요.')).toBeInTheDocument());
  });
});
