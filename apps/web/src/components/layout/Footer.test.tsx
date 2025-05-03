import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

/**
 * Footer 컴포넌트 테스트
 * 
 * 페이지 푸터의 렌더링 및 요소 표시 확인
 */
describe('Footer 컴포넌트', () => {
    it('저작권 텍스트가 표시되는지 확인', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        // 저작권 텍스트가 표시되는지 확인
        const copyrightText = screen.getByText(/©/i);
        expect(copyrightText).toBeInTheDocument();

        // 회사명이 표시되는지 확인
        const companyName = screen.getByText(/주식회사 마이리걸팀/i);
        expect(companyName).toBeInTheDocument();

        // 대표자 정보가 표시되는지 확인
        const contactInfo = screen.getByText(/대표 김도연/i);
        expect(contactInfo).toBeInTheDocument();

        console.log('Footer 기본 렌더링 테스트 통과');
    });

    it('푸터가 적절한 스타일로 렌더링되는지 확인', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        // footer 태그가 있는지 확인
        const footer = document.querySelector('footer');
        expect(footer).toBeInTheDocument();

        // 반응형 디자인을 위한 클래스가 적용되었는지 확인
        expect(footer?.className).toMatch(/px-/);

        console.log('Footer 스타일 테스트 통과');
    });

    it('푸터에 로고와 링크가 포함되어 있는지 확인', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        // 이미지 요소 확인
        const images = screen.getAllByAltText('클립');
        expect(images.length).toBeGreaterThan(0);

        // 링크 요소가 있는지 확인
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        console.log('Footer 링크 테스트 통과');
    });
}); 