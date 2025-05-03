import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Toast from './Toast';

/**
 * Toast 컴포넌트 테스트
 * 
 * 다양한 타입의 토스트 메시지 표시 및 동작 검증
 */
describe('Toast 컴포넌트', () => {
    // 테스트 전 타이머 모킹 설정
    beforeEach(() => {
        vi.useFakeTimers();
    });

    // 테스트 후 타이머 리셋
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('success 타입 토스트가 올바르게 렌더링되는지 확인', () => {
        render(
            <Toast
                type="success"
                message="성공 메시지입니다"
                isVisible={true}
            />
        );

        // 메시지 표시 확인
        expect(screen.getByText('성공 메시지입니다')).toBeInTheDocument();

        // success 타입의 스타일 확인 - 컨테이너에 적절한 클래스가 있는지
        const toastContainer = screen.getByText('성공 메시지입니다').closest('div[class*="rounded-md"]');
        expect(toastContainer).toHaveClass('bg-green-50');

        console.log('Toast success 타입 렌더링 테스트 통과');
    });

    it('error 타입 토스트가 올바르게 렌더링되는지 확인', () => {
        render(
            <Toast
                type="error"
                message="에러가 발생했습니다"
                isVisible={true}
            />
        );

        // 메시지 표시 확인
        expect(screen.getByText('에러가 발생했습니다')).toBeInTheDocument();

        // error 타입의 스타일 확인
        const toastContainer = screen.getByText('에러가 발생했습니다').closest('div[class*="rounded-md"]');
        expect(toastContainer).toHaveClass('bg-red-50');

        console.log('Toast error 타입 렌더링 테스트 통과');
    });

    it('닫기 버튼이 작동하는지 확인', () => {
        const onCloseMock = vi.fn();
        render(
            <Toast
                type="info"
                message="닫기 가능한 메시지"
                isVisible={true}
                onClose={onCloseMock}
                autoClose={false}
            />
        );

        // 닫기 버튼 확인
        const closeButton = screen.getByRole('button');
        expect(closeButton).toBeInTheDocument();

        // 닫기 버튼 클릭
        fireEvent.click(closeButton);

        // onClose 콜백 호출 확인
        expect(onCloseMock).toHaveBeenCalledTimes(1);

        console.log('Toast 닫기 버튼 테스트 통과');
    });

    it('autoClose가 활성화된 경우 지정된 시간 후 자동으로 닫히는지 확인', () => {
        const onCloseMock = vi.fn();
        render(
            <Toast
                type="warning"
                message="자동으로 닫히는 메시지"
                isVisible={true}
                onClose={onCloseMock}
                autoClose={true}
                autoCloseTime={3000}
            />
        );

        // 초기에는 onClose가 호출되지 않아야 함
        expect(onCloseMock).not.toHaveBeenCalled();

        // 3초 시간 진행
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // 시간 경과 후 onClose 호출 확인
        expect(onCloseMock).toHaveBeenCalledTimes(1);

        console.log('Toast 자동 닫힘 테스트 통과');
    });

    it('isVisible이 false인 경우 렌더링되지 않는지 확인', () => {
        render(
            <Toast
                type="info"
                message="보이지 않는 메시지"
                isVisible={false}
            />
        );

        // 메시지가 화면에 없는지 확인
        const messageElement = screen.queryByText('보이지 않는 메시지');
        expect(messageElement).not.toBeInTheDocument();

        console.log('Toast 비표시 테스트 통과');
    });
}); 