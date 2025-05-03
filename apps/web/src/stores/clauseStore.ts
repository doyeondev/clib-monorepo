/**
 * 조항 관련 상태 관리 스토어
 * Zustand와 immer를 활용하여 불변성을 유지하며 상태 관리
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useEffect } from 'react';
import { ClauseItem, CategoryItem, ToastDetail } from '../types/clib';
import { debugLog } from '../utils/commonUtils';

/**
 * Clause 스토어 상태 인터페이스
 * 이전 여러 Context의 상태를 통합
 */
interface ClauseState {
	// 기본 데이터
	clauseList: ClauseItem[];
	contractList: ClauseItem[];
	categoryList: CategoryItem[];
	categoryHolder: CategoryItem[];

	// 필터/선택 상태
	clickedCategory: string[];
	currentCategory: any;
	selectedItem: string;

	// 즐겨찾기 관련
	clippedClause: string[];
	toastDetail: ToastDetail;
	toastState: boolean;

	// UI 상태
	error: Error | null;

	// 액션 (상태 변경 함수)
	setClauseList: (clauseList: ClauseItem[]) => void;
	setContractList: (contractList: ClauseItem[]) => void;
	setCategoryList: (categoryList: CategoryItem[]) => void;
	setCategoryHolder: (categoryHolder: CategoryItem[]) => void;
	setClickedCategory: (categoryId: string[] | ((prev: string[]) => string[])) => void;
	setCurrentCategory: (category: any) => void;
	setSelectedItem: (item: string) => void;
	toggleClippedItem: (itemId: string) => void;
	setToastState: (state: boolean) => void;
	setError: (error: Error | null) => void;

	// 통합 액션
	updateCategory: (categoryId: string, type?: string) => void;
}

/**
 * Clause 스토어 생성
 * 이전에 Context로 분산되어 있던 상태를 통합 관리
 */
export const useClauseStore = create<ClauseState>()(
	immer(set => ({
		// 초기 상태
		clauseList: [] as ClauseItem[],
		contractList: [] as ClauseItem[],
		categoryList: [] as CategoryItem[],
		categoryHolder: [] as CategoryItem[],
		clickedCategory: ['allClauses'],
		currentCategory: {} as any,
		selectedItem: '',
		clippedClause: [] as string[],
		toastDetail: { id: '', action: '' },
		toastState: false,
		error: null,

		// 기본 setter 액션
		setClauseList: clauseList =>
			set(state => {
				state.clauseList = clauseList;
			}),

		setContractList: contractList =>
			set(state => {
				state.contractList = contractList;
			}),

		setCategoryList: categoryList =>
			set(state => {
				state.categoryList = categoryList;
			}),

		setCategoryHolder: categoryHolder =>
			set(state => {
				state.categoryHolder = categoryHolder;
			}),

		setClickedCategory: categoryId =>
			set(state => {
				if (typeof categoryId === 'function') {
					state.clickedCategory = categoryId(state.clickedCategory);
				} else {
					state.clickedCategory = categoryId;
				}
			}),

		setCurrentCategory: category =>
			set(state => {
				state.currentCategory = category;
			}),

		setSelectedItem: item =>
			set(state => {
				state.selectedItem = item;
			}),

		// 즐겨찾기 토글 액션
		toggleClippedItem: itemId =>
			set(state => {
				const isAlreadyClipped = state.clippedClause.includes(itemId);
				const actionType = isAlreadyClipped ? '삭제' : '추가';

				if (isAlreadyClipped) {
					state.clippedClause = state.clippedClause.filter(id => id !== itemId);
				} else {
					state.clippedClause.push(itemId);
				}

				// 토스트 알림 설정
				state.toastDetail = {
					id: itemId,
					action: actionType,
				};
				state.toastState = true;

				// 자동으로 토스트 메시지 숨기기 (setTimeout 대신 외부에서 처리)
				debugLog(`항목 ${actionType} 완료: ${itemId}`);
			}),

		setToastState: state =>
			set(draft => {
				draft.toastState = state;
			}),

		setError: error =>
			set(state => {
				state.error = error;
			}),

		// 카테고리 업데이트 통합 액션
		updateCategory: (categoryId, type) =>
			set(state => {
				// 클립된 항목 카테고리 선택
				if (categoryId === 'clippedList') {
					if (state.clickedCategory.includes('clippedList')) {
						// 이미 클립 카테고리가 선택된 상태에서 다시 클릭하면 '전체' 카테고리로 변경
						state.clickedCategory = ['allClauses'];
					} else {
						state.clickedCategory = ['clippedList'];
					}
					return;
				}

				// 검색 결과로 카테고리 선택 시
				if (type === 'search') {
					state.clickedCategory = [categoryId];
				} else {
					// 일반 카테고리 선택 시
					if (state.clickedCategory.includes(categoryId)) {
						// 현재 선택된 카테고리를 다시 클릭하면 '전체' 카테고리로 변경
						state.clickedCategory = ['allClauses'];
					} else {
						// 다른 카테고리 선택 시 이전 선택 초기화하고 새 카테고리만 선택
						state.clickedCategory = [categoryId];
					}
				}
			}),
	}))
);

/**
 * 토스트 타이머 훅 - 일정 시간 후 토스트 상태를 자동으로 false로 설정
 * 컴포넌트에서 사용할 수 있는 훅 형태로 제공
 */
export const useToastTimer = () => {
	const toastState = useClauseStore(state => state.toastState);
	const setToastState = useClauseStore(state => state.setToastState);

	useEffect(() => {
		if (toastState) {
			const timer = setTimeout(() => {
				setToastState(false);
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [toastState, setToastState]);
};
