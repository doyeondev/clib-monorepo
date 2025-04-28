/**
 * 페이지네이션 클릭 이벤트 처리 함수
 * 버튼 ID와 타입에 따라 페이지 인덱스 변경
 */
export function handlePaginationClick(e: React.MouseEvent<HTMLElement>, currentIndex: number, maxIndex: number, setCurrentIndex: (n: number) => void) {
	const target = e.target as HTMLElement;
	const btnId = target.id;
	const type = target.getAttribute('data-name');

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
}

/**
 * 배열을 지정된 크기의 청크로 나눕니다.
 * @param array 청크로 나눌 배열
 * @param size 각 청크의 크기
 * @returns 청크 배열의 배열
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
	if (!array.length || size <= 0) {
		return [];
	}

	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}

	return result;
}
