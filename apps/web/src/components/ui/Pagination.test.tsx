import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

/**
 * Pagination 컴포넌트 테스트
 * 
 * 페이지네이션 UI 및 동작 확인
 */
describe('Pagination 컴포넌트', () => {
    it('기본 렌더링과 현재 페이지 표시 확인', () => {
        render(
            <Pagination
                currentIndex={2}
                maxIndex={4}
                maxButtons={5}
                setCurrentIndex={() => { }}
            />
        );

        // 이전/다음 버튼이 렌더링되는지 확인
        const prevButton = document.getElementById('btnPrevious');
        const nextButton = document.getElementById('btnNext');
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();

        // 현재 페이지가 강조 표시되는지 확인
        const currentPage = screen.getByText('3'); // 인덱스가 2일 때 표시되는 페이지는 3
        expect(currentPage).toHaveClass('bg-gray-700');
        expect(currentPage).toHaveClass('text-white');

        // 다른 페이지들이 올바르게 표시되는지 확인
        const otherPages = ['1', '2', '4', '5'];
        otherPages.forEach(page => {
            const pageButton = screen.getByText(page);
            expect(pageButton).not.toHaveClass('bg-gray-700');
            expect(pageButton).toHaveClass('text-gray-700');
        });

        console.log('Pagination 기본 렌더링 테스트 통과');
    });

    it('이전/다음 버튼 클릭 시 setCurrentIndex가 호출되는지 확인', () => {
        const mockSetCurrentIndex = vi.fn();
        render(
            <Pagination
                currentIndex={3}
                maxIndex={5}
                maxButtons={6}
                setCurrentIndex={mockSetCurrentIndex}
            />
        );

        // 이전 버튼 클릭
        const prevButton = document.getElementById('btnPrevious');
        if (prevButton) {
            fireEvent.click(prevButton);
            expect(mockSetCurrentIndex).toHaveBeenCalledWith(2); // 현재 인덱스(3)에서 이전(2)로 이동
        }

        // 다음 버튼 클릭
        const nextButton = document.getElementById('btnNext');
        if (nextButton) {
            fireEvent.click(nextButton);
            expect(mockSetCurrentIndex).toHaveBeenCalledWith(4); // 현재 인덱스(3)에서 다음(4)로 이동
        }

        // 페이지 번호 클릭
        const pageButton = screen.getByText('1'); // 1페이지 (인덱스 0)
        fireEvent.click(pageButton);
        expect(mockSetCurrentIndex).toHaveBeenCalledWith(0);

        console.log('Pagination 이벤트 핸들러 테스트 통과');
    });

    it('첫 페이지일 때 이전 버튼이 비활성화되는지 확인', () => {
        render(
            <Pagination
                currentIndex={0}
                maxIndex={5}
                maxButtons={6}
                setCurrentIndex={() => { }}
            />
        );

        // 이전 버튼이 비활성화되는지 확인
        const prevButton = document.getElementById('btnPrevious');
        expect(prevButton).toBeDisabled();

        // 1번 페이지가 활성화되어 있는지 확인
        const firstPage = screen.getByText('1');
        expect(firstPage).toHaveClass('bg-gray-700');

        console.log('Pagination 첫 페이지 상태 테스트 통과');
    });

    it('마지막 페이지일 때 다음 버튼이 비활성화되는지 확인', () => {
        render(
            <Pagination
                currentIndex={5}
                maxIndex={5}
                maxButtons={6}
                setCurrentIndex={() => { }}
            />
        );

        // 다음 버튼이 비활성화되는지 확인
        const nextButton = document.getElementById('btnNext');
        expect(nextButton).toBeDisabled();

        // 마지막 페이지가 활성화되어 있는지 확인
        const lastPage = screen.getByText('6');
        expect(lastPage).toHaveClass('bg-gray-700');

        console.log('Pagination 마지막 페이지 상태 테스트 통과');
    });

    it('maxButtons 속성에 따라 페이지 번호 개수가 제한되는지 확인', () => {
        render(
            <Pagination
                currentIndex={2}
                maxIndex={9}
                maxButtons={5}
                setCurrentIndex={() => { }}
            />
        );

        // maxButtons에 따라 표시되는 페이지 수가 제한되는지 확인
        const pageButtons = screen.getAllByRole('button', { name: /\d+/ });
        expect(pageButtons.length).toBe(5);

        console.log('Pagination maxButtons 테스트 통과');
    });
}); 