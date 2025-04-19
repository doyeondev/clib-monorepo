import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'https://conan.ai/_functions';
const API_LOCAL_URL = '/api';

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 로컬 백엔드 API 클라이언트 인스턴스 생성
const localApiClient = axios.create({
	baseURL: API_LOCAL_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 인터페이스 정의
export interface ContractData {
	_id?: string;
	title: string;
	partyA?: string;
	partyB?: string;
	purpose?: string;
	clauseArray?: any[];
	contentArray?: any[];
	industry?: string;
	language?: string;
	source?: string;
	creator?: string;
	appendix?: string[];
}

/**
 * 계약서 목록을 가져옵니다.
 * @returns 계약서 목록 Promise
 */
export const getContractList = async (): Promise<any[]> => {
	try {
		const response = await apiClient.get('/clibContractList');
		console.log('계약서 목록 API 응답:', response.data);

		if (response.data && response.data.items) {
			return response.data.items;
		}
		return [];
	} catch (error) {
		console.error('계약서 목록을 가져오는 중 오류 발생:', error);
		throw error;
	}
};

/**
 * 계약서 상세 정보를 가져옵니다.
 * @param id - 계약서 ID
 * @returns 계약서 상세 정보 Promise
 */
export const getContractDetail = async (id: string): Promise<any> => {
	try {
		const response = await apiClient.get(`/clibContractItem?item_id=${id}`);
		console.log('계약서 상세 API 응답:', response.data);

		if (response.data && response.data.items) {
			return response.data.items;
		}
		return null;
	} catch (error) {
		console.error(`계약서 상세 정보(ID: ${id})를 가져오는 중 오류 발생:`, error);
		throw error;
	}
};

/**
 * 계약서를 검색합니다.
 * @param keyword - 검색 키워드
 * @returns 검색 결과 Promise
 */
export const searchContracts = async (keyword: string): Promise<any[]> => {
	try {
		const response = await apiClient.get(`/clibSearch?search_term=${encodeURIComponent(keyword)}`);
		console.log('계약서 검색 API 응답:', response.data);

		if (response.data && response.data.items) {
			return response.data.items;
		}
		return [];
	} catch (error) {
		console.error('계약서 검색 중 오류 발생:', error);
		throw error;
	}
};

/**
 * 조항 목록을 가져옵니다.
 * @returns 조항 목록 Promise
 */
export const getClauseList = async (): Promise<any[]> => {
	try {
		const response = await apiClient.get('/clibClauseAsset');
		console.log('조항 목록 API 응답:', response.data);

		if (response.data && response.data.items) {
			return response.data.items;
		}
		return [];
	} catch (error) {
		console.error('조항 목록을 가져오는 중 오류 발생:', error);
		throw error;
	}
};

/**
 * 카테고리 목록을 가져옵니다.
 * @returns 카테고리 목록 Promise
 */
export const getCategoryList = async (): Promise<any[]> => {
	try {
		const response = await apiClient.get('/clibCategoryList');
		console.log('카테고리 목록 API 응답:', response.data);

		if (response.data && response.data.items) {
			return response.data.items;
		}
		return [];
	} catch (error) {
		console.error('카테고리 목록을 가져오는 중 오류 발생:', error);
		throw error;
	}
};
