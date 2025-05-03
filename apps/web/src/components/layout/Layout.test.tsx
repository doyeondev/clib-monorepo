import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './Layout';
import { MemoryRouter } from 'react-router-dom';

// Header와 Footer를 모킹
vi.mock('./Header', () => ({
    default: () => <div data-testid="header-mock">헤더 컴포넌트</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer-mock">푸터 컴포넌트</div>
}));

/**
 * Layout 컴포넌트 테스트
 * 
 * 레이아웃 구조 및 자식 컴포넌트 렌더링 테스트
 */
describe('Layout 컴포넌트', () => {
    it('헤더, 푸터와 함께 자식 컴포넌트가 렌더링되는지 확인', () => {
        render(
            <MemoryRouter>
                <Layout>
                    <div data-testid="child-content">테스트 콘텐츠</div>
                </Layout>
            </MemoryRouter>
        );

        // 헤더와 푸터가 렌더링되었는지 확인
        expect(screen.getByTestId('header-mock')).toBeInTheDocument();
        expect(screen.getByTestId('footer-mock')).toBeInTheDocument();

        // 자식 컴포넌트가 렌더링되었는지 확인
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();

        // 콘솔에 결과 출력
        console.log('Layout 컴포넌트 렌더링 테스트 통과');
    });
}); 