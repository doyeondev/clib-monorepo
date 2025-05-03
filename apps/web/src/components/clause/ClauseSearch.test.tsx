import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClauseSearchInput } from './ClauseSearch';
import { useArticleContext } from '../../contexts/ClauseContext';

// ClauseContext를 모킹
vi.mock('../../contexts/ClauseContext', () => ({
    useArticleContext: vi.fn(() => ({
        clauseList: [
            {
                id: '1',
                title_ko: '임차인 책임',
                clause_category: 'lease',
                content_ko: '임차인은 선량한 관리자로서의 주의의무를 다하여야 한다.',
                idx: 0
            },
            {
                id: '2',
                title_ko: '계약 해지',
                clause_category: 'termination',
                content_ko: '계약기간 중 중도해지시 위약금을 지불해야 한다.',
                idx: 1
            }
        ]
    })),
    useCategoryContext: vi.fn(() => ({
        categoryList: [
            { id: 'lease', title: '임대차', assets: [] },
            { id: 'termination', title: '계약해지', assets: [] }
        ],
        updateCategory: vi.fn()
    }))
}));

/**
 * ClauseSearch 컴포넌트 테스트
 * 
 * 조항 검색 입력 및 검색 결과 확인
 */
describe('ClauseSearch 컴포넌트', () => {
    it('검색 입력 필드가 렌더링되는지 확인', () => {
        render(<ClauseSearchInput placeholderText="테스트 검색" />);

        // 검색 필드 확인
        const searchInput = screen.getByPlaceholderText('테스트 검색');
        expect(searchInput).toBeInTheDocument();

        // 검색 버튼 확인
        const searchButton = screen.getByText('검색');
        expect(searchButton).toBeInTheDocument();

        console.log('ClauseSearch 기본 렌더링 테스트 통과');
    });

    it('검색어 입력이 제대로 작동하는지 확인', () => {
        render(<ClauseSearchInput />);

        // 검색 필드 찾기
        const searchInput = screen.getByRole('textbox');

        // 검색어 입력
        fireEvent.change(searchInput, { target: { value: '임차인' } });

        // 입력 값이 제대로 반영되는지 확인
        expect(searchInput).toHaveValue('임차인');

        console.log('ClauseSearch 검색어 입력 테스트 통과');
    });

    it('검색 실행 시 결과가 표시되는지 확인', async () => {
        const setDataMock = vi.fn();
        render(<ClauseSearchInput setData={setDataMock} />);

        // 검색 필드 찾기
        const searchInput = screen.getByRole('textbox');

        // 검색어 입력
        fireEvent.change(searchInput, { target: { value: '임차인' } });

        // 검색 버튼 클릭
        const searchButton = screen.getByText('검색');
        fireEvent.click(searchButton);

        // setData 함수가 호출되었는지 확인
        await waitFor(() => {
            expect(setDataMock).toHaveBeenCalled();
        });

        console.log('ClauseSearch 검색 실행 테스트 통과');
    });

    it('검색 결과가 비어있을 때 결과가 표시되지 않는지 확인', () => {
        const setDataMock = vi.fn();

        // useArticleContext의 구현을 일시적으로 재정의
        (useArticleContext as any).mockReturnValueOnce({
            clauseList: []
        });

        render(<ClauseSearchInput setData={setDataMock} />);

        // 검색 필드 찾기
        const searchInput = screen.getByRole('textbox');

        // 검색어 입력
        fireEvent.change(searchInput, { target: { value: '존재하지 않는 검색어' } });

        // 검색 버튼 클릭
        const searchButton = screen.getByText('검색');
        fireEvent.click(searchButton);

        // 결과 목록이 표시되지 않는지 확인
        const listItems = screen.queryAllByRole('div', { name: /조항/ });
        expect(listItems.length).toBe(0);

        console.log('ClauseSearch 빈 결과 테스트 통과');
    });

    it('X 버튼 클릭 시 검색어가 지워지는지 확인', () => {
        render(<ClauseSearchInput />);

        // 검색 필드 찾기
        const searchInput = screen.getByRole('textbox');

        // 검색어 입력
        fireEvent.change(searchInput, { target: { value: '임차인' } });

        // 입력 후 X 버튼이 표시되는지 확인
        const clearButton = screen.getByRole('button', { name: '' }).closest('button[type="button"]');
        expect(clearButton).toBeInTheDocument();

        // X 버튼 클릭
        if (clearButton) {
            fireEvent.click(clearButton);
        }

        // 검색어가 지워졌는지 확인
        expect(searchInput).toHaveValue('');

        console.log('ClauseSearch 검색어 삭제 테스트 통과');
    });

    it('Enter 키 입력 시 검색이 실행되는지 확인', async () => {
        const setDataMock = vi.fn();
        render(<ClauseSearchInput setData={setDataMock} />);

        // 검색 필드 찾기
        const searchInput = screen.getByRole('textbox');

        // 검색어 입력
        fireEvent.change(searchInput, { target: { value: '임차인' } });

        // Enter 키 입력
        fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

        // setData 함수가 호출되었는지 확인
        await waitFor(() => {
            expect(setDataMock).toHaveBeenCalled();
        });

        console.log('ClauseSearch Enter 키 검색 테스트 통과');
    });
}); 