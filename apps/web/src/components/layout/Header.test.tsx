import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

/**
 * Header 컴포넌트 테스트
 * 
 * 페이지 헤더의 렌더링 및 요소 표시 확인
 */
describe('Header 컴포넌트', () => {
    it('로고와 주요 UI 요소가 렌더링되는지 확인', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        // 로고가 표시되는지 확인
        const logos = screen.getAllByAltText('클립');
        expect(logos.length).toBeGreaterThan(0);
        expect(logos[0]).toBeInTheDocument();

        // Clib 텍스트가 표시되는지 확인
        const clibText = screen.getByText('Clib');
        expect(clibText).toBeInTheDocument();

        // 헤더가 적절한 스타일로 렌더링되는지 확인
        const header = screen.getByRole('banner');
        expect(header).toHaveClass('bg-white');

        console.log('Header 기본 렌더링 테스트 통과');
    });

    it('헤더가 네비게이션 링크를 포함하는지 확인', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        // 네비게이션 링크가 있는지 확인
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThanOrEqual(1);

        // 특정 페이지로 연결되는 링크가 있는지 확인
        const uploadLink = screen.getByText('계약서 업로드').closest('a');
        expect(uploadLink).toHaveAttribute('href', '/upload');

        console.log('Header 네비게이션 요소 테스트 통과');
    });

    it('헤더가 반응형 레이아웃을 가지는지 확인', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        // 컨테이너가 최대 너비 클래스를 가지는지 확인
        const containerElement = screen.getByRole('banner').querySelector('.mx-auto');
        expect(containerElement).toBeTruthy();

        // 반응형 패딩 클래스가 적용되었는지 확인
        expect(containerElement?.className).toMatch(/px-\d+/);

        console.log('Header 반응형 레이아웃 테스트 통과');
    });
}); 