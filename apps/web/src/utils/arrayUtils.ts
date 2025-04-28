/**
 * 배열을 여러 기준으로 정렬합니다 (lodash orderBy 대체)
 * @param array 정렬할 배열
 * @param keys 정렬 기준이 될 속성 배열
 * @param directions 각 정렬 기준에 대한 방향 (asc 또는 desc)
 * @returns 정렬된 배열의 복사본
 */
export function orderBy<T>(array: T[], keys: (keyof T)[], directions: ('asc' | 'desc')[]): T[] {
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

			const comparison = a[key] < b[key] ? -1 : 1;
			// 오름차순이면 그대로, 내림차순이면 반대로
			return direction === 'asc' ? comparison : -comparison;
		}

		return 0;
	});
}

/**
 * 배열에서 조건에 맞는 요소만 필터링합니다
 * @param array 필터링할 배열
 * @param predicate 각 요소를 평가할 함수
 * @returns 필터링된 배열
 */
export function filterArray<T>(array: T[], predicate: (value: T) => boolean): T[] {
	return array.filter(predicate);
}
