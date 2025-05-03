/**
 * usePagination - 페이지네이션 관련 로직을 재사용 가능한 훅으로 구현
 * 페이지 나누기, 인덱스 관리, 클릭 핸들러 등을 포함
 */
import { useState, useEffect, useCallback } from 'react';
import { chunkArray } from '../utils/commonUtils';

interface UsePaginationProps<T> {
	items: T[];
	itemsPerPage?: number;
	initialPage?: number;
}

interface UsePaginationResult<T> {
	// 페이지네이션 상태
	currentIndex: number;
	maxIndex: number;
	paginatedItems: T[][];
	currentPageItems: T[];

	// 상태 변경 함수
	setCurrentIndex: (index: number) => void;

	// 페이지 이동 함수
	goToNextPage: () => void;
	goToPrevPage: () => void;
	goToPage: (index: number) => void;

	// 이벤트 핸들러
	handlePaginationClick: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * 페이지네이션 로직을 제공하는 훅
 * @param items 페이지네이션할 아이템 배열
 * @param itemsPerPage 페이지당 아이템 개수 (기본값: 5)
 * @param initialPage 초기 페이지 인덱스 (기본값: 0)
 * @returns 페이지네이션 관련 상태와 함수를 포함하는 객체
 */
export const usePagination = <T>({ items = [], itemsPerPage = 5, initialPage = 0 }: UsePaginationProps<T>): UsePaginationResult<T> => {
	const [currentIndex, setCurrentIndex] = useState<number>(initialPage);
	const [paginatedItems, setPaginatedItems] = useState<T[][]>([]);
	const [maxIndex, setMaxIndex] = useState<number>(0);

	// 아이템 배열이 변경되면 청크로 나누어 페이지네이션 적용
	useEffect(() => {
		if (!items.length) {
			setPaginatedItems([]);
			setMaxIndex(0);
			return;
		}

		// 배열을 청크로 나누기
		const chunkedItems = chunkArray(items, itemsPerPage);
		setPaginatedItems(chunkedItems);
		setMaxIndex(chunkedItems.length - 1);

		// 현재 인덱스가 최대 인덱스보다 크면 조정
		if (currentIndex > chunkedItems.length - 1) {
			setCurrentIndex(0);
		}
	}, [items, itemsPerPage, currentIndex]);

	// 다음 페이지로 이동
	const goToNextPage = useCallback(() => {
		if (currentIndex < maxIndex) {
			setCurrentIndex(currentIndex + 1);
		}
	}, [currentIndex, maxIndex]);

	// 이전 페이지로 이동
	const goToPrevPage = useCallback(() => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	}, [currentIndex]);

	// 특정 페이지로 이동
	const goToPage = useCallback(
		(index: number) => {
			if (index >= 0 && index <= maxIndex) {
				setCurrentIndex(index);
			}
		},
		[maxIndex]
	);

	// 페이지네이션 클릭 이벤트 핸들러
	const handlePaginationClick = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			const target = e.target as HTMLElement;
			const btnId = target.id;
			const type = target.getAttribute('name');

			if (btnId && type === 'paginationBtn') {
				if (btnId === 'btnNext') {
					goToNextPage();
				} else if (btnId === 'btnPrevious') {
					goToPrevPage();
				}
			}

			if (btnId && type === 'paginationNum') {
				const pageNum = parseInt(btnId);
				goToPage(pageNum);
			}
		},
		[goToNextPage, goToPrevPage, goToPage]
	);

	return {
		currentIndex,
		maxIndex,
		paginatedItems,
		currentPageItems: paginatedItems[currentIndex] || [],
		setCurrentIndex,
		goToNextPage,
		goToPrevPage,
		goToPage,
		handlePaginationClick,
	};
};

export default usePagination;
