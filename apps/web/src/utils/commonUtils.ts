/**
 * 공통 유틸리티 함수 모음
 * 기존 utilities에서 분산되어 있던 함수들을 통합 관리
 */
import _ from 'lodash';

/**
 * 디버그 로그 출력 함수
 * 개발 환경에서만 로그를 출력하여 프로덕션 환경에서의 로그 오염 방지
 * @param message 로그 메시지 접두사
 * @param data 로그에 출력할 데이터
 */
export const debugLog = (message: string, data?: any) => {
	if (process.env.NODE_ENV === 'development') {
		if (data) {
			console.log(`[DEBUG] ${message}:`, data);
		} else {
			console.log(`[DEBUG] ${message}`);
		}
	}
};

/**
 * 배열을 지정된 크기로 청크(조각)으로 나누는 함수
 * @param array 원본 배열
 * @param chunkSize 청크 크기
 * @returns 청크로 나눠진 2차원 배열
 */
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
	if (!array || !Array.isArray(array)) return [];
	return _.chunk(array, chunkSize);
};

/**
 * 페이지네이션 클릭 핸들러
 * @param e 클릭 이벤트
 * @param currentIndex 현재 페이지 인덱스
 * @param maxIndex 최대 페이지 인덱스
 * @param setCurrentIndex 페이지 인덱스 설정 함수
 */
export const handlePaginationClick = (e: React.MouseEvent<HTMLElement>, currentIndex: number, maxIndex: number, setCurrentIndex: React.Dispatch<React.SetStateAction<number>>) => {
	const target = e.target as HTMLElement;
	const btnId = target.id;
	const type = target.getAttribute('name');

	if (btnId && type === 'paginationBtn') {
		if (btnId === 'btnNext' && currentIndex < maxIndex) {
			setCurrentIndex(currentIndex + 1);
		} else if (btnId === 'btnPrevious' && currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	}

	if (btnId && type === 'paginationNum') {
		setCurrentIndex(parseInt(btnId));
	}
};

/**
 * 배열을 특정 필드와 방향으로 정렬
 * @param array 정렬할 배열
 * @param fields 정렬 기준 필드 배열
 * @param orders 정렬 방향 배열 ('asc' | 'desc')
 * @returns 정렬된 배열
 */
export const orderBy = <T>(array: T[], fields: string[], orders: Array<'asc' | 'desc'>): T[] => {
	if (!array || !Array.isArray(array)) return [];
	return _.orderBy(array, fields, orders);
};

/**
 * 검색어에 따라 배열 필터링
 * @param searchTerm 검색어
 * @param items 아이템 배열
 * @param fields 검색할 필드 배열
 * @returns 필터링된 배열
 */
export const filterArray = <T>(searchTerm: string, items: T[], fields: string[]): T[] => {
	if (!searchTerm || !items || !Array.isArray(items)) return items;

	const lowerCaseSearchTerm = searchTerm.toLowerCase();
	return items.filter(item => {
		return fields.some(field => {
			const value = _.get(item, field);
			return typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchTerm);
		});
	});
};

/**
 * 특정 필드에 대해 중복을 제거한 목록 반환
 * @param array 원본 배열
 * @param field 중복 제거할 필드명
 * @returns 중복이 제거된 배열
 */
export const getUniqueByField = <T>(array: T[], field: string): T[] => {
	if (!array || !Array.isArray(array)) return [];
	return _.uniqBy(array, field);
};

/**
 * 검색어와 필드를 기준으로 리스트 필터링
 * @param searchTerm 검색어
 * @param list 필터링할 리스트
 * @param filterFields 검색할 필드 배열
 * @returns 필터링된 리스트
 */
export const filterList = <T>(searchTerm: string, list: T[], filterFields: string[]): T[] => {
	if (!searchTerm || !list) return list;

	const regex = new RegExp(searchTerm, 'i');
	return list.filter(item => {
		return filterFields.some(field => {
			const value = _.get(item, field);
			return typeof value === 'string' && regex.test(value);
		});
	});
};
