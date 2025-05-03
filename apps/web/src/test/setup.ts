/**
 * 테스트 환경 설정 파일
 *
 * Vitest가 테스트 실행 전에 자동으로 로드하는 설정 파일입니다.
 * 전역적인 테스트 설정, 모킹 및 환경 초기화가 이루어집니다.
 */
import '@testing-library/jest-dom';
import { vi, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { TextEncoder } from 'util';

// 모든 테스트 후에 React Testing Library 정리
afterEach(() => {
	cleanup();
});

// 타입 선언 에러 방지를 위한 처리
declare global {
	interface Window {
		TextEncoder: typeof TextEncoder;
	}
}

// 전역 객체 모킹
beforeAll(() => {
	// TextEncoder가 정의되지 않았거나 문제가 있을 경우에만 polyfill 적용
	if (typeof global.TextEncoder === 'undefined') {
		global.TextEncoder = TextEncoder;
	}

	// window.matchMedia 모킹
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation(query => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});

	// ResizeObserver 모킹
	class MockResizeObserver implements ResizeObserver {
		observe() {
			/* 빈 구현 */
		}
		unobserve() {
			/* 빈 구현 */
		}
		disconnect() {
			/* 빈 구현 */
		}
	}
	global.ResizeObserver = MockResizeObserver as any;

	// IntersectionObserver 모킹
	class MockIntersectionObserver implements IntersectionObserver {
		root: Element | Document | null = null;
		rootMargin: string = '';
		thresholds: readonly number[] = [];
		callback: IntersectionObserverCallback;

		constructor(callback: IntersectionObserverCallback) {
			this.callback = callback;
		}

		observe() {
			/* 빈 구현 */
		}
		unobserve() {
			/* 빈 구현 */
		}
		disconnect() {
			/* 빈 구현 */
		}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
	}
	global.IntersectionObserver = MockIntersectionObserver as any;
});
