import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from './Loader';

/**
 * Loader 컴포넌트 테스트
 * 
 * 로딩 인디케이터가 올바르게 렌더링되는지 확인
 */
describe('Loader 컴포넌트', () => {
    it('로더가 올바르게 렌더링되는지 확인', () => {
        const { container } = render(<Loader />);

        // 로딩 메시지가 표시되는지 확인
        expect(screen.getByText('문서를 로딩중입니다')).toBeInTheDocument();

        // 로딩 애니메이션 요소(loading-screen)가 렌더링되는지 확인
        const loadingScreen = container.querySelector('.loading-screen');
        expect(loadingScreen).toBeInTheDocument();

        // 애니메이션을 위한 dot 요소들이 존재하는지 확인
        const dots = container.querySelectorAll('.dot');
        expect(dots.length).toBe(5);

        console.log('Loader 렌더링 테스트 통과');
    });
}); 