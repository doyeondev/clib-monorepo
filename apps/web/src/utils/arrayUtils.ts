/**
 * 배열을 여러 기준으로 정렬합니다 (lodash orderBy 대체)
 * @param array 정렬할 배열
 * @param keys 정렬 기준이 될 속성 배열
 * @param directions 각 정렬 기준에 대한 방향 (asc 또는 desc)
 * @returns 정렬된 배열의 복사본
 */
export function orderBy<T>(array: T[], keys: (keyof T)[], directions: ('asc' | 'desc')[]): T[] {
	if (!array.length) return []; // 빈 배열 처리 // 빈 배열이면 즉시 반환

	// 배열 복사
	const result = [...array];

	// 정렬 함수
	return result.sort((a, b) => {
		// 모든 정렬 기준을 순회
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const direction = directions[i];

			// 동일한 값이면 다음 기준으로 이동
			if (a[key] === b[key]) continue;

			// 비교 값 계산
			const comparison = a[key] < b[key] ? -1 : 1;
			// 오름차순이면 그대로, 내림차순이면 반대로
			return direction === 'asc' ? comparison : -comparison;
		}

		return 0; // 모든 값이 동일하면 순서 유지
	});
}

/**
 * 배열에서 조건에 맞는 요소만 필터링합니다
 * @param array 필터링할 배열
 * @param predicate 각 요소를 평가할 함수
 * @returns 필터링된 배열
 */
export function filterArray<T>(array: T[], predicate: (value: T) => boolean): T[] {
	if (!array.length) return []; // 빈 배열이면 즉시 반환
	return array.filter(predicate);
}

/**
 * 배열에서 특정 속성으로 그룹화하는 함수
 * @param array 그룹화할 배열
 * @param key 그룹화 기준이 될 속성
 * @returns 그룹화된 객체
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		(result, item) => {
			const groupKey = String(item[key]); // 키를 문자열로 변환
			if (!result[groupKey]) {
				result[groupKey] = []; // 새 그룹 초기화
			}
			result[groupKey].push(item); // 항목을 그룹에 추가
			return result;
		},
		{} as Record<string, T[]>
	);
}

/**
 * 배열에서 중복 제거
 * @param array 중복을 제거할 배열
 * @returns 중복이 제거된 배열
 */
export function uniqueArray<T>(array: T[]): T[] {
	return [...new Set(array)]; // Set을 사용하여 중복 제거
}
