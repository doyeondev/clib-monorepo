/**
 * 페이지네이션 클릭 이벤트 처리 함수
 * 버튼 ID와 타입에 따라 페이지 인덱스 변경
 * @param e 클릭 이벤트
 * @param currentIndex 현재 페이지 인덱스
 * @param maxIndex 최대 페이지 인덱스
 * @param setCurrentIndex 페이지 인덱스 설정 함수
 */
export function handlePaginationClick(e: React.MouseEvent<HTMLElement>, currentIndex: number, maxIndex: number, setCurrentIndex: (n: number) => void) {
	const target = e.target as HTMLElement;
	const btnId = target.id;
	const type = target.getAttribute('data-name') || target.getAttribute('name'); // 속성명 다양하게 지원

	// 페이지 버튼(이전/다음) 처리
	if (btnId && type === 'paginationBtn') {
		if (btnId === 'btnNext' && currentIndex < maxIndex) {
			setCurrentIndex(currentIndex + 1); // 다음 페이지로 이동
		} else if (btnId === 'btnPrevious' && currentIndex > 0) {
			setCurrentIndex(currentIndex - 1); // 이전 페이지로 이동
		}
	}

	// 페이지 번호 버튼 처리
	if (btnId && type === 'paginationNum') {
		const pageIndex = parseInt(btnId, 10); // 문자열을 숫자로 변환
		if (!isNaN(pageIndex) && pageIndex >= 0 && pageIndex <= maxIndex) {
			setCurrentIndex(pageIndex); // 해당 페이지로 이동
		}
	}
}

/**
 * 배열을 지정된 크기의 청크로 나눕니다.
 * @param array 청크로 나눌 배열
 * @param size 각 청크의 크기
 * @returns 청크 배열의 배열
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
	if (!array || !array.length || size <= 0) {
		return []; // 유효하지 않은 입력 처리
	}

	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size)); // size 크기의 청크 생성
	}

	return result;
}

/**
 * 페이지네이션에 표시할 페이지 번호 배열 생성
 * @param currentPage 현재 페이지 (0-indexed)
 * @param totalPages 전체 페이지 수
 * @param maxButtons 표시할 최대 버튼 수
 * @returns 표시할 페이지 번호 배열
 */
export function getPageNumbers(currentPage: number, totalPages: number, maxButtons: number = 5): number[] {
	if (totalPages <= maxButtons) {
		// 전체 페이지 수가 표시할 최대 버튼 수보다 작으면 모든 페이지 표시
		return Array.from({ length: totalPages }, (_, i) => i);
	}

	// 현재 페이지를 중심으로 양쪽에 표시할 버튼 수 계산
	const halfButtons = Math.floor(maxButtons / 2);
	let startPage = Math.max(0, currentPage - halfButtons);
	let endPage = Math.min(totalPages - 1, currentPage + halfButtons);

	// 시작 또는 끝 페이지가 범위를 벗어나면 조정
	if (startPage === 0) {
		endPage = Math.min(maxButtons - 1, totalPages - 1);
	} else if (endPage === totalPages - 1) {
		startPage = Math.max(totalPages - maxButtons, 0);
	}

	return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}
