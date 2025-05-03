import { createContext } from 'react';

/**
 * 조항(아티클) 타입 정의 - 계약서 조항의 데이터 구조
 */
export interface ClauseItem {
	id: string; // 조항 고유 ID
	docId?: string; // 문서 ID
	clause_title: string; // 조항 제목 (예: "제3조 계약제품의 거래")
	clause_content?: string; // 조항 내용
	contract_title?: string; // 계약서 제목
	contract_asset?: string; // 계약 자산 ID
	partyA?: string; // 계약 당사자(갑)
	partyB?: string; // 계약 당사자(을)
	industry?: string; // 산업 분야
	industry_name?: string; // 산업 이름 (legacy)
	purpose?: string; // 계약 목적
	fileURL?: string; // 파일 URL
	cIdx?: number; // 조항 인덱스
	content_array: Array<{ html: string }>; // 내용 배열 (HTML 형식)
	clause_index?: number; // 조항 인덱스 (추가)
}

// ArticleContext 타입 정의
export type ArticleContextType = {
	articleData: any[];
	clauseList: ClauseItem[];
};

// 에셋 컨텍스트 타입 정의
export interface AssetContextType {
	data: any;
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	clickedItem: any;
	setClickedItem: (item: any) => void;
	itemData: any;
	setItemData: (data: any) => void;
	setSidebarData: (item: any) => void;
}

// Context 생성 (기본값 제공)
export const ArticleContext = createContext<ArticleContextType>({
	articleData: [],
	clauseList: [],
});

export const AssetContext = createContext<AssetContextType>({
	data: null,
	showSidebar: false,
	setShowSidebar: () => {},
	clickedItem: null,
	setClickedItem: () => {},
	itemData: null,
	setItemData: () => {},
	setSidebarData: () => {},
});
