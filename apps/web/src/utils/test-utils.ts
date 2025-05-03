/**
 * 테스트 유틸리티 함수 모음
 *
 * 이 파일은 테스트 파일에서 공통적으로 사용되는 유틸리티 함수들을 제공합니다.
 * 모킹, 렌더링, 이벤트 시뮬레이션 등 테스트 작성에 도움이 되는 함수들이 포함되어 있습니다.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';

/**
 * 테스트용 파일 목록을 생성합니다.
 *
 * @param files - 파일 객체 배열
 * @returns FileList와 유사한 객체
 *
 * @example
 * const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
 * const fileList = createMockFileList([file]);
 */
export const createMockFileList = (files: File[]): { item: (index: number) => File | null; length: number } => {
	return {
		item: (index: number) => files[index] || null,
		length: files.length,
	};
};

/**
 * DOMRect 객체를 모의합니다.
 *
 * @param rect - DOMRect 속성 객체
 * @returns DOMRect 객체
 *
 * @example
 * const rect = createMockDOMRect({ width: 100, height: 50, top: 0, left: 0 });
 */
export const createMockDOMRect = (rect: Partial<DOMRect> = {}): DOMRect => {
	return {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...rect,
		toJSON: () => ({}),
	};
};

// 기본 테스트 프로바이더 인터페이스
interface TestProviderProps {
	children: ReactNode;
}

/**
 * 테스트 컴포넌트를 위한 커스텀 렌더 함수입니다.
 * 필요한 Provider들을 포함시킵니다.
 *
 * @param ui - 렌더링할 리액트 엘리먼트
 * @param options - 렌더링 옵션
 * @returns 테스팅 라이브러리의 렌더 결과
 *
 * @example
 * const { getByText } = renderWithProviders(<MyComponent />);
 */
export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
	const AllTheProviders = ({ children }: TestProviderProps) => {
		// 필요한 경우 여기에 Provider를 추가할 수 있습니다.
		return children;
	};

	return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * 비동기 이벤트 발생 후 컴포넌트가 다시 렌더링될 수 있도록 지연시키는 유틸리티 함수입니다.
 *
 * @param ms - 지연 시간 (밀리초)
 * @returns Promise 객체
 *
 * @example
 * await sleep(100); // 100ms 지연
 */
export const sleep = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * ResizeObserver를 모킹합니다.
 *
 * @example
 * beforeEach(() => {
 *   mockResizeObserver();
 * });
 */
export const mockResizeObserver = (): void => {
	class MockResizeObserver {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	}

	// @ts-ignore
	global.ResizeObserver = MockResizeObserver;
};

/**
 * IntersectionObserver를 모킹합니다.
 *
 * @example
 * beforeEach(() => {
 *   mockIntersectionObserver();
 * });
 */
export const mockIntersectionObserver = (): void => {
	class MockIntersectionObserver {
		constructor(callback: IntersectionObserverCallback) {
			// 생성자에서 콜백을 저장하는 로직을 구현할 수 있습니다.
		}
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	}

	// @ts-ignore
	global.IntersectionObserver = MockIntersectionObserver;
};

/**
 * 드래그 앤 드롭 이벤트를 시뮬레이션합니다.
 *
 * @param source - 드래그할 요소
 * @param target - 드롭할 대상 요소
 *
 * @example
 * const sourceElement = screen.getByTestId('drag-source');
 * const targetElement = screen.getByTestId('drop-target');
 * simulateDragAndDrop(sourceElement, targetElement);
 */
export const simulateDragAndDrop = (source: Element, target: Element): void => {
	// Drag start
	const dragStartEvent = new MouseEvent('dragstart', {
		bubbles: true,
		cancelable: true,
	});
	Object.defineProperty(dragStartEvent, 'dataTransfer', {
		value: {
			setData: vi.fn(),
			getData: vi.fn(),
			clearData: vi.fn(),
			dropEffect: 'move' as const,
			effectAllowed: 'all' as const,
			types: [],
		},
	});
	source.dispatchEvent(dragStartEvent);

	// Drag over
	const dragOverEvent = new MouseEvent('dragover', {
		bubbles: true,
		cancelable: true,
	});
	Object.defineProperty(dragOverEvent, 'dataTransfer', {
		value: { dropEffect: 'move' as const, effectAllowed: 'all' as const },
	});
	target.dispatchEvent(dragOverEvent);

	// Drop
	const dropEvent = new MouseEvent('drop', {
		bubbles: true,
		cancelable: true,
	});
	Object.defineProperty(dropEvent, 'dataTransfer', {
		value: {
			getData: vi.fn(),
			dropEffect: 'move' as const,
			effectAllowed: 'all' as const,
			types: [],
		},
	});
	target.dispatchEvent(dropEvent);

	// Drag end
	const dragEndEvent = new MouseEvent('dragend', {
		bubbles: true,
		cancelable: true,
	});
	source.dispatchEvent(dragEndEvent);
};

/**
 * 로컬 스토리지를 모킹합니다.
 *
 * @example
 * beforeEach(() => {
 *   mockLocalStorage();
 * });
 */
export const mockLocalStorage = (): void => {
	const localStorageMock = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		length: 0,
		key: vi.fn(),
	};

	Object.defineProperty(window, 'localStorage', {
		value: localStorageMock,
		writable: true,
	});
};

/**
 * 세션 스토리지를 모킹합니다.
 *
 * @example
 * beforeEach(() => {
 *   mockSessionStorage();
 * });
 */
export const mockSessionStorage = (): void => {
	const sessionStorageMock = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		length: 0,
		key: vi.fn(),
	};

	Object.defineProperty(window, 'sessionStorage', {
		value: sessionStorageMock,
		writable: true,
	});
};
