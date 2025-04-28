import { getRegExp } from 'korean-regexp';

/**
 * 검색어와 필드 목록을 이용한 아이템 필터링 함수
 * @param term 검색어
 * @param list 필터링할 아이템 목록
 * @param fields 검색 대상 필드 배열
 * @returns 필터링된 아이템 목록
 */
export function filterList(term: string, list: any[], fields: string[]) {
	if (!term || !list?.length) return [];

	try {
		const regex = getRegExp(term);
		return list.filter(item => fields.some(field => regex.test(item[field] || '')));
	} catch (e) {
		console.error('검색 오류:', e);
		return [];
	}
}
