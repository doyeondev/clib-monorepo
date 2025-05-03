/**
 * 통합된 계약 관련 타입 정의
 * 기존 search/clause/upload 페이지에서 중복 사용하던 타입들을 공통화
 */

/**
 * 계약서 조항 기본 타입
 * search, clause, upload 페이지에서 공통적으로 사용
 */
export interface ClauseItem {
	// 공통 속성
	id?: string; // 고유 ID (대부분의 경우 사용)
	_id?: string; // 내부 ID (docx 파싱 시 생성되는 임시 ID)

	// 조항 내용 관련 속성
	clause_title?: string; // 조항 제목 (예: "제3조 계약제품의 거래")
	title?: string; // 제목 (legacy)
	title_ko?: string; // 한글 제목
	title_en?: string; // 영문 제목
	clause_content?: string; // 조항 내용
	content?: string; // 내용 (legacy)
	content_ko?: string; // 한글 내용
	content_en?: string; // 영문 내용
	content_array?: Array<{ html: string }>; // 내용 배열 (HTML 형식)

	// 계약서 메타데이터
	contract_title?: string; // 계약서 제목
	contract_asset?: string; // 계약 자산 ID
	docId?: string; // 문서 ID
	partyA?: string; // 계약 당사자(갑)
	partyB?: string; // 계약 당사자(을)
	industry?: string; // 산업 분야
	industry_name?: string; // 산업 이름 (legacy)
	purpose?: string; // 계약 목적
	fileURL?: string; // 파일 URL
	source?: string; // 출처

	// 구조적 속성
	clause_category?: string; // 조항 카테고리
	tag?: string; // 태그 (HTML 태그 등)
	depth?: string; // 계층 깊이
	subText?: any[]; // 하위 텍스트
	type?: string; // 타입
	note?: string; // 노트

	// 표시/순서 관련
	idx?: number; // 인덱스
	cIdx?: number; // 조항 인덱스
	clause_index?: number; // 조항 인덱스 (alternative)
	disabled?: boolean; // 비활성화 여부
	color?: string; // 색상

	// 내부 처리용
	text?: string | any[]; // 텍스트 내용
	html?: string; // HTML 컨텐츠
}

/**
 * 계약서 카테고리 타입
 */
export interface CategoryItem {
	id: string; // 카테고리 ID
	title: string; // 카테고리 제목 (한글)
	title_en: string; // 카테고리 제목 (영문)
	color: string; // 카테고리 색상
	idx: number; // 카테고리 순서
	assets?: ClauseItem[]; // 카테고리에 속한 계약 조항 리스트
}

/**
 * 계약서 상세 정보 타입
 */
export interface ContractDetailType {
	url: string; // 계약서 URL
	clauseArray: { idx: number; text: string }[]; // 조항 배열
	contentArray: { tag: string; idx: number; text: string; html: string }[][]; // 내용 배열
}

/**
 * 업로드된 파일 타입
 */
export interface UploadedFile {
	file: File;
	id: string;
	name: string;
	size: number;
	type: string;
	upload?: string;
	uploadURL?: string;
	buffer?: any;
	_id?: string;
}

/**
 * 업로드 폼 데이터 타입
 */
export interface UploadFormData {
	source: string;
	industry: string;
	language: string;
	creator: string;
}

/**
 * 메타데이터 타입
 */
export interface MetaData {
	title: string;
	partyA: string;
	partyB: string;
	purpose: string;
}

/**
 * 하이라이트된 텍스트 타입
 */
export interface HighlightedText {
	text: string;
	color: string;
}

/**
 * 처리된 문서 데이터 타입
 */
export interface ProcessedDocumentData {
	title: string;
	partyA: string;
	partyB: string;
	purpose: string;
	source: string;
	industry: string;
	language: string;
	creator: string;
	clauseArray: ClauseItem[];
	contentArray: ClauseItem[];
	groupedArray: any[];
	appendix: string[];
	html: string;
}

/**
 * 토스트 알림 상세 정보 타입
 */
export interface ToastDetail {
	id: string;
	action: string;
}
