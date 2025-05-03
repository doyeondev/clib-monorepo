import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingOrError from './LoadingOrError';

/**
 * LoadingOrError 컴포넌트 테스트
 * 
 * 로딩 상태와 에러 상태를 올바르게 표시하는지 확인
 */
describe('LoadingOrError 컴포넌트', () => {
    it('로딩 상태를 올바르게 표시하는지 확인', () => {
        render(
            <LoadingOrError error={null} loading={true}>
                <div>테스트 콘텐츠</div>
            </LoadingOrError>
        );

        // 로딩 중에는 children이 표시되지 않는지 확인
        expect(screen.queryByText('테스트 콘텐츠')).not.toBeInTheDocument();

        // Spinner 컴포넌트가 있는지 확인 (직접적으로 spinner를 찾기는 어려우므로 컨테이너 클래스로 확인)
        const spinnerContainer = document.querySelector('.flex.justify-center.items-center');
        expect(spinnerContainer).toBeInTheDocument();

        console.log('LoadingOrError 로딩 상태 테스트 통과');
    });

    it('에러 상태를 올바르게 표시하는지 확인', () => {
        const errorMessage = '데이터 로드 실패';
        render(
            <LoadingOrError error={new Error(errorMessage)} loading={false}>
                <div>테스트 콘텐츠</div>
            </LoadingOrError>
        );

        // 에러 메시지가 표시되는지 확인
        expect(screen.getByText(new RegExp(errorMessage))).toBeInTheDocument();

        // 에러 메시지 컨테이너가 올바른 클래스를 가지는지 확인
        const errorContainer = document.querySelector('.bg-red-100.border.border-red-400');
        expect(errorContainer).toBeInTheDocument();

        // 에러 시에는 children이 표시되지 않는지 확인
        expect(screen.queryByText('테스트 콘텐츠')).not.toBeInTheDocument();

        console.log('LoadingOrError 에러 상태 테스트 통과');
    });

    it('정상 상태에서는 children을 렌더링하는지 확인', () => {
        render(
            <LoadingOrError error={null} loading={false}>
                <div>테스트 콘텐츠</div>
            </LoadingOrError>
        );

        // children이 표시되는지 확인
        expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();

        // 로딩 컨테이너나 에러 메시지가 없는지 확인
        expect(document.querySelector('.flex.justify-center.items-center')).not.toBeInTheDocument();
        expect(document.querySelector('.bg-red-100.border.border-red-400')).not.toBeInTheDocument();

        console.log('LoadingOrError 정상 상태 테스트 통과');
    });
}); 