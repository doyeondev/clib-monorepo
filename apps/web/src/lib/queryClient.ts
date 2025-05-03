/**
 * 공통 QueryClient 설정
 * 모든 페이지에서 일관된 React-Query 설정을 사용하기 위한 파일
 */
import { QueryClient } from '@tanstack/react-query';
import { debugLog } from '../utils/commonUtils';

/**
 * QueryClient 인스턴스 생성 - 전역 설정 포함
 * 중복 코드 제거 및 일관된 캐싱 전략 적용
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 'fresh'하게 유지
			gcTime: 10 * 60 * 1000, // 10분 동안 미사용 데이터 캐시 유지 (이전의 cacheTime)
			retry: 1, // 실패 시 1번 재시도
			refetchOnWindowFocus: false, // 창 포커스 시 자동 리페치 비활성화
			refetchOnMount: false, // 컴포넌트 마운트 시 자동 리페치 비활성화
		},
		mutations: {
			onError: (error: unknown) => {
				debugLog('뮤테이션 에러 발생', error);
			},
		},
	},
});

/**
 * 쿼리 키 팩토리
 * 일관된 쿼리 키 관리를 위한 함수들
 */
export const queryKeys = {
	// 계약 관련 쿼리 키
	contracts: {
		all: ['contracts'] as const,
		list: () => [...queryKeys.contracts.all, 'list'] as const,
		detail: (id: string) => [...queryKeys.contracts.all, 'detail', id] as const,
	},

	// 조항 관련 쿼리 키
	clauses: {
		all: ['clauses'] as const,
		assets: () => [...queryKeys.clauses.all, 'assets'] as const,
		categories: () => [...queryKeys.clauses.all, 'categories'] as const,
		byCategory: (categoryId: string) => [...queryKeys.clauses.all, 'byCategory', categoryId] as const,
	},

	// 사용자 관련 쿼리 키
	user: {
		all: ['user'] as const,
		preferences: () => [...queryKeys.user.all, 'preferences'] as const,
		clippedItems: () => [...queryKeys.user.all, 'clippedItems'] as const,
	},
};
