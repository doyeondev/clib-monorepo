import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardFooter from './DashboardFooter';

/**
 * DashboardFooter 컴포넌트 테스트
 * 
 * 대시보드 푸터 UI 및 버튼 기능 확인
 */
describe('DashboardFooter 컴포넌트', () => {
    it('기본 UI 요소가 렌더링되는지 확인', () => {
        render(<DashboardFooter onClickHandler={() => { }} currentIndex={0} maxIndex={2} />);

        // 이전 버튼 확인 (<)
        const prevButton = screen.getByText('<');
        expect(prevButton).toBeInTheDocument();

        // 다음 버튼 확인 (>)
        const nextButton = screen.getByText('>');
        expect(nextButton).toBeInTheDocument();

        // 페이지 번호 버튼들 확인
        const pageButtons = screen.getAllByRole('button', { name: /[0-9]+/ });
        expect(pageButtons.length).toBe(3); // 0~2까지 3개의 페이지

        console.log('DashboardFooter 기본 UI 렌더링 테스트 통과');
    });

    it('버튼 클릭 시 이벤트 핸들러가 호출되는지 확인', () => {
        const mockClickHandler = vi.fn();

        render(
            <DashboardFooter
                onClickHandler={mockClickHandler}
                currentIndex={1}
                maxIndex={2}
            />
        );

        // 이전 버튼 클릭
        const prevButton = screen.getByText('<');
        fireEvent.click(prevButton);
        expect(mockClickHandler).toHaveBeenCalledTimes(1);

        // 다음 버튼 클릭
        const nextButton = screen.getByText('>');
        fireEvent.click(nextButton);
        expect(mockClickHandler).toHaveBeenCalledTimes(2);

        // 페이지 번호 버튼 클릭
        const pageButton = screen.getByText('3'); // 3번째 페이지 (인덱스는 0부터 시작하므로 2에 해당)
        fireEvent.click(pageButton);
        expect(mockClickHandler).toHaveBeenCalledTimes(3);

        console.log('DashboardFooter 버튼 클릭 이벤트 테스트 통과');
    });

    it('첫 페이지에서는 이전 버튼이 비활성화되는지 확인', () => {
        // 첫 번째 페이지 렌더링
        render(
            <DashboardFooter
                onClickHandler={() => { }}
                currentIndex={0}
                maxIndex={2}
            />
        );

        // 첫 번째 페이지에서는 이전 버튼이 비활성화됨
        const prevButton = screen.getByText('<');
        expect(prevButton.closest('button')).toBeDisabled();

        // 현재 페이지 버튼이 강조 표시되는지 확인
        const currentPageButton = screen.getByText('1');
        expect(currentPageButton).toHaveClass('bg-[#1E2A69]');
        expect(currentPageButton).toHaveClass('text-white');

        console.log('DashboardFooter 첫 페이지 UI 테스트 통과');
    });

    it('마지막 페이지에서는 다음 버튼이 비활성화되는지 확인', () => {
        // 마지막 페이지 렌더링
        render(
            <DashboardFooter
                onClickHandler={() => { }}
                currentIndex={2}
                maxIndex={2}
            />
        );

        // 마지막 페이지에서는 다음 버튼이 비활성화됨
        const nextButton = screen.getByText('>');
        expect(nextButton.closest('button')).toBeDisabled();

        console.log('DashboardFooter 마지막 페이지 UI 테스트 통과');
    });
}); 