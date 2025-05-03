/**
 * 검색 관련 상태 관리 스토어
 * 검색 기능에 필요한 모든 상태를 중앙집중식으로 관리
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ClauseItem } from '../types/clib';
import { debugLog } from '../utils/commonUtils';

/**
 * 검색 스토어 상태 인터페이스
 */
interface SearchState {
	// 검색 기본 상태
	searchType: 'contract' | 'article';
	searchTerm: string;
	showResults: boolean;
	searchLoading: boolean;

	// 데이터 상태
	contractList: any[];
	clauseList: ClauseItem[];
	searchResults: any[];

	// 사이드바 상태
	showSidebar: boolean;
	clickedItem: any;
	itemData: any;

	// 에러 상태
	error: Error | null;

	// 액션
	setSearchType: (type: 'contract' | 'article') => void;
	setSearchTerm: (term: string) => void;
	setShowResults: (show: boolean) => void;
	setContractList: (list: any[]) => void;
	setClauseList: (list: ClauseItem[]) => void;
	setSearchResults: (results: any[]) => void;
	setSearchLoading: (loading: boolean) => void;
	setShowSidebar: (show: boolean) => void;
	setClickedItem: (item: any) => void;
	setItemData: (data: any) => void;
	setError: (error: Error | null) => void;

	// 복합 액션
	resetSearch: (type?: 'contract' | 'article') => void;
	setSidebarData: (item: any, contractAsset?: any[]) => void;
	performSearch: (searchTerm: string) => void;
}

export const useSearchStore = create<SearchState>()(
	immer((set, get) => ({
		// 초기 상태
		searchType: 'article' as const,
		searchTerm: '',
		showResults: false,
		searchLoading: false,

		contractList: [] as any[],
		clauseList: [] as ClauseItem[],
		searchResults: [] as any[],

		showSidebar: false,
		clickedItem: {} as any,
		itemData: {} as any,

		error: null,

		// 기본 setter 액션
		setSearchType: type =>
			set(state => {
				state.searchType = type;
			}),

		setSearchTerm: term =>
			set(state => {
				state.searchTerm = term;

				// 검색어가 없으면 결과 초기화
				if (!term.length) {
					state.searchResults = [];
					state.showResults = false;
				}
			}),

		setShowResults: show =>
			set(state => {
				state.showResults = show;
			}),

		setContractList: list =>
			set(state => {
				state.contractList = list;
			}),

		setClauseList: list =>
			set(state => {
				state.clauseList = list;
			}),

		setSearchResults: results =>
			set(state => {
				state.searchResults = results;
			}),

		setSearchLoading: loading =>
			set(state => {
				state.searchLoading = loading;
			}),

		setShowSidebar: show =>
			set(state => {
				state.showSidebar = show;
			}),

		setClickedItem: item =>
			set(state => {
				state.clickedItem = item;
			}),

		setItemData: data =>
			set(state => {
				state.itemData = data;
			}),

		setError: error =>
			set(state => {
				state.error = error;
			}),

		// 검색 초기화
		resetSearch: type =>
			set(state => {
				state.searchTerm = '';
				state.searchResults = [];
				state.showResults = false;

				if (type) {
					state.searchType = type;
				}
			}),

		// 사이드바 데이터 설정
		setSidebarData: (item, contractAsset = []) =>
			set(state => {
				debugLog('검색 결과 항목 클릭됨', item);

				// 조항 제목에서 인덱스 추출 (예: "제3조 계약제품의 거래" -> 3)
				let clauseIndex = -1;
				if (item.clause_title) {
					const match = item.clause_title.match(/제(\d+)조/);
					if (match && match[1]) {
						clauseIndex = parseInt(match[1]);
						debugLog(`조항 제목에서 추출한 인덱스: ${clauseIndex}`);

						// 인덱스 정보 추가 (명시적으로 할당)
						item.cIdx = clauseIndex;
						item.clause_index = clauseIndex;
					}
				}

				// 클릭된 아이템 상태 업데이트
				state.clickedItem = item;

				// contractAsset에서 계약서 찾기
				if (contractAsset?.length > 0) {
					// 계약서 찾기
					const match = contractAsset.filter((x: any) => x.id === item.contract_asset);
					debugLog('일치하는 계약서', match);

					if (match?.length > 0) {
						// 원본 계약서 데이터를 사용하면서, 클릭한 조항의 인덱스를 설정
						const updatedMatch = { ...match[0] };

						// 추출한 인덱스 명시적으로 설정
						if (clauseIndex >= 1) {
							updatedMatch.cIdx = clauseIndex;
							updatedMatch.clause_index = clauseIndex;
						}

						state.itemData = updatedMatch;
					}
				}

				// 사이드바 표시
				state.showSidebar = true;
			}),

		// 검색 실행
		performSearch: searchTerm => {
			const state = get();

			if (!searchTerm.length) {
				set(state => {
					state.searchResults = [];
					state.showResults = false;
				});
				return;
			}

			set(state => {
				state.searchLoading = true;
			});

			// TODO: 실제 검색 로직 구현
			// 임시 로직: searchType에 따라 다른 목록 필터링
			setTimeout(() => {
				set(state => {
					if (state.searchType === 'contract') {
						// 계약서 검색 - contractList에서 필터링
						const regex = new RegExp(searchTerm, 'i');
						const filteredResults = state.contractList.filter(contract => regex.test(contract.title || '') || regex.test(contract.partyA || '') || regex.test(contract.partyB || '') || regex.test(contract.industry || ''));
						state.searchResults = filteredResults;
					} else {
						// 조항 검색 - clauseList에서 필터링
						const regex = new RegExp(searchTerm, 'i');
						const filteredResults = state.clauseList.filter(clause => regex.test(clause.clause_title || '') || clause.content_array?.some(content => regex.test(content.html || '')) || false);
						state.searchResults = filteredResults;
					}

					state.showResults = state.searchResults.length > 0;
					state.searchLoading = false;
				});
			}, 300); // 300ms 지연으로 디바운스 효과
		},
	}))
);

export default useSearchStore;
