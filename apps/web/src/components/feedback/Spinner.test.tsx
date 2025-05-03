import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

/**
 * Spinner 컴포넌트 테스트
 * 
 * 로딩 스피너 UI 요소 및 애니메이션 확인
 */
describe('Spinner 컴포넌트', () => {
    it('로딩 스피너가 화면에 표시되는지 확인', () => {
        render(<Spinner />);

        // status 역할의 요소가 있는지 확인
        const statusElement = screen.getByRole('status');
        expect(statusElement).toBeInTheDocument();

        // 로딩 텍스트가 표시되는지 확인
        const loadingText = screen.getByText('데이터를 로딩중입니다');
        expect(loadingText).toBeInTheDocument();

        console.log('Spinner 기본 렌더링 테스트 통과');
    });

    it('스피너 애니메이션 클래스가 적용되는지 확인', () => {
        render(<Spinner />);

        // SVG 요소를 찾고 애니메이션 클래스 확인
        const spinnerElement = screen.getByRole('status').querySelector('svg');
        expect(spinnerElement).toHaveClass('animate-spin');

        console.log('Spinner 애니메이션 클래스 테스트 통과');
    });

    it('스피너 컨테이너가 적절한 스타일로 렌더링되는지 확인', () => {
        render(<Spinner />);

        // 스피너 상태 요소의 부모가 적절한 스타일을 가지는지 확인
        const statusElement = screen.getByRole('status');
        expect(statusElement).toHaveClass('mx-auto');

        // 최상위 컨테이너가 grid 스타일을 가지는지 확인
        const containerElement = document.querySelector('div.grid');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('min-h-[calc(100vh-120px)]');
        expect(containerElement).toHaveClass('place-content-center');

        console.log('Spinner 컨테이너 스타일 테스트 통과');
    });
}); 