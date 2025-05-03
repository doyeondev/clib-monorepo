import { useState, useCallback, useEffect } from 'react';

export interface ToastState {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	visible: boolean;
	duration?: number;
}

interface UseToastOptions {
	defaultDuration?: number; // 기본 표시 시간 (ms)
	maxToasts?: number; // 최대 표시 토스트 수
}

/**
 * 토스트 알림 관리를 위한 커스텀 훅
 * @param options 토스트 설정 옵션
 * @returns 토스트 상태와 관련 함수들
 */
export function useToast(options: UseToastOptions = {}) {
	const { defaultDuration = 3000, maxToasts = 1 } = options;
	const [toasts, setToasts] = useState<ToastState[]>([]);

	// 토스트 추가 함수
	const showToast = useCallback(
		(type: ToastState['type'], message: string, id: string = Date.now().toString(), duration: number = defaultDuration) => {
			setToasts(currentToasts => {
				// 최대 토스트 수 제한
				const updatedToasts = [...currentToasts];
				while (updatedToasts.length >= maxToasts) {
					updatedToasts.shift(); // 가장 오래된 토스트 제거
				}

				// 새 토스트 추가
				return [...updatedToasts, { id, type, message, visible: true, duration }];
			});

			// 자동으로 토스트 숨기기
			if (duration > 0) {
				setTimeout(() => {
					hideToast(id);
				}, duration);
			}

			return id; // 토스트 ID 반환 (제어에 사용)
		},
		[defaultDuration, maxToasts]
	);

	// 특정 토스트 숨기기
	const hideToast = useCallback((id: string) => {
		setToasts(currentToasts => currentToasts.map(toast => (toast.id === id ? { ...toast, visible: false } : toast)));

		// 일정 시간 후 완전히 제거
		setTimeout(() => {
			setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
		}, 300); // 페이드 아웃 애니메이션 시간
	}, []);

	// 모든 토스트 숨기기
	const clearAllToasts = useCallback(() => {
		setToasts(currentToasts => currentToasts.map(toast => ({ ...toast, visible: false })));

		setTimeout(() => {
			setToasts([]);
		}, 300);
	}, []);

	// 편의를 위한 타입별 토스트 함수
	const success = useCallback((message: string, id?: string, duration?: number) => showToast('success', message, id, duration), [showToast]);

	const error = useCallback((message: string, id?: string, duration?: number) => showToast('error', message, id, duration), [showToast]);

	const warning = useCallback((message: string, id?: string, duration?: number) => showToast('warning', message, id, duration), [showToast]);

	const info = useCallback((message: string, id?: string, duration?: number) => showToast('info', message, id, duration), [showToast]);

	return {
		toasts,
		showToast,
		hideToast,
		clearAllToasts,
		success,
		error,
		warning,
		info,
	};
}

export default useToast;
