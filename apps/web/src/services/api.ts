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
	title: string;
	partyA?: string;
	partyB?: string;
	purpose?: string;
	clauseArray: any[];
	contentArray: any[];
	industry?: string;
	language?: string;
	source?: string;
	creator?: string;
	appendix?: string[];
}

/**
 * 계약서 데이터를 업로드합니다.
 * @param contractData - 업로드할 계약서 데이터
 * @returns API 응답 프로미스
 */
export const insertContractData = async (contractData: ContractData) => {
	try {
		console.log('Uploading contract data:', contractData);
		// 로컬 백엔드 API를 우선적으로 사용하고, 실패 시 외부 API를 사용
		try {
			const response = await localApiClient.post('/contracts', contractData);
			return response.data;
		} catch (localError) {
			console.warn('로컬 API 호출 실패, 외부 API로 전환:', localError);
			// 로컬 API 실패 시 외부 API 호출
			const response = await apiClient.post('/clibInsertContract', contractData);
			return response.data;
		}
	} catch (error) {
		console.error('계약서 데이터 저장 오류:', error);
		throw error;
	}
};

/**
 * 계약서 목록을 불러옵니다.
 * @returns 계약서 목록 프로미스
 */
export const fetchContracts = async () => {
	try {
		const response = await apiClient.get('/contracts');
		return response.data;
	} catch (error) {
		console.error('Error fetching contracts:', error);
		throw error;
	}
};

/**
 * 계약서 상세 정보를 불러옵니다.
 * @param id - 계약서 ID
 * @returns 계약서 상세 정보 프로미스
 */
export const fetchContractById = async (id: string) => {
	try {
		const response = await apiClient.get(`/contracts/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching contract with ID ${id}:`, error);
		throw error;
	}
};

/**
 * 계약서에 속한 조항 목록을 불러옵니다.
 * @param contractId - 계약서 ID
 * @returns 조항 목록 프로미스
 */
export const fetchClausesByContractId = async (contractId: string) => {
	try {
		const response = await apiClient.get(`/contracts/${contractId}/clauses`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching clauses for contract ${contractId}:`, error);
		throw error;
	}
};

/**
 * 조항을 검색합니다.
 * @param keyword - 검색 키워드
 * @returns 검색 결과 프로미스
 */
export const searchClauses = async (keyword: string) => {
	try {
		const response = await apiClient.get('/search', { params: { keyword } });
		return response.data;
	} catch (error) {
		console.error('Error searching clauses:', error);
		throw error;
	}
};

/**
 * 카테고리 목록을 가져옵니다.
 * 기존 Next.js API 호환 함수
 */
export const getCategoryList = async (): Promise<any[]> => {
	try {
		// 임시 데이터 반환
		return [
			{
				_id: 'category1',
				name: '카테고리 1',
				assets: [
					{
						_id: 'contract1',
						title: '계약서 1',
						partyA: '갑 회사',
						partyB: '을 회사',
						industry: 'IT',
						purpose: '소프트웨어 개발',
						clauseArray: [
							{ idx: 0, text: '계약의 목적' },
							{ idx: 1, text: '계약 기간' },
							{ idx: 2, text: '계약 금액' },
						],
					},
				],
			},
		];
	} catch (error) {
		console.error('카테고리 목록을 가져오는 중 오류 발생:', error);
		return [];
	}
};

/**
 * 계약서 상세 정보를 가져옵니다.
 * 기존 Next.js API 호환 함수
 */
export const getContractDetail = async (id: string): Promise<any> => {
	try {
		// 임시 데이터 반환
		return {
			_id: id,
			title: '계약서 예시',
			partyA: '갑 회사',
			partyB: '을 회사',
			industry: 'IT',
			purpose: '소프트웨어 개발',
			url: 'https://docs.google.com/document/example',
			clauseArray: [
				{ idx: 0, text: '계약의 목적' },
				{ idx: 1, text: '계약 기간' },
				{ idx: 2, text: '계약 금액' },
			],
			contentArray: [
				[
					{ tag: 'h2', idx: 0, text: '계약의 목적', html: '<h2>계약의 목적</h2>' },
					{ tag: 'p', idx: 0, text: '본 계약의 목적은...', html: '<p>본 계약의 목적은...</p>' },
				],
				[
					{ tag: 'h2', idx: 1, text: '계약 기간', html: '<h2>계약 기간</h2>' },
					{ tag: 'p', idx: 1, text: '계약 기간은...', html: '<p>계약 기간은...</p>' },
				],
				[
					{ tag: 'h2', idx: 2, text: '계약 금액', html: '<h2>계약 금액</h2>' },
					{ tag: 'p', idx: 2, text: '계약 금액은...', html: '<p>계약 금액은...</p>' },
				],
			],
		};
	} catch (error) {
		console.error('계약서 상세 정보를 가져오는 중 오류 발생:', error);
		return null;
	}
};

/**
 * Clib 데이터셋을 가져옵니다.
 * @param datasetName - 데이터셋 이름
 * @param param - 추가 파라미터
 * @returns 데이터셋
 */
export const getClibDataset = async (datasetName: string, param: string): Promise<any[]> => {
	try {
		// 임시 데이터 반환
		return [
			{
				_id: 'clause1',
				name: '계약의 목적',
				clause_category: 'category1',
				idx: 0,
				content: '본 계약의 목적은 소프트웨어 개발 서비스 제공에 관한 사항을 정함에 있다.',
				contract: '소프트웨어 개발 계약서',
			},
			{
				_id: 'clause2',
				name: '계약 기간',
				clause_category: 'category1',
				idx: 1,
				content: '본 계약의 기간은 계약 체결일로부터 1년간으로 한다.',
				contract: '소프트웨어 개발 계약서',
			},
		];
	} catch (error) {
		console.error(`${datasetName} 데이터셋을 가져오는 중 오류 발생:`, error);
		return [];
	}
};

/**
 * 조항 카테고리 목록을 가져옵니다.
 * @returns 조항 카테고리 목록
 */
export const getClauseCategoryList = async (): Promise<any[]> => {
	try {
		// 임시 데이터 반환
		return [
			{
				_id: 'category1',
				title: '일반 조항',
				color: 'blue',
				title_en: 'General',
				idx: 1,
			},
			{
				_id: 'category2',
				title: '계약 당사자',
				color: 'green',
				title_en: 'Parties',
				idx: 2,
			},
		];
	} catch (error) {
		console.error('조항 카테고리 목록을 가져오는 중 오류 발생:', error);
		return [];
	}
};

// DOCX 파일 업로드 및 처리
export const uploadDocxFile = async (file: File, source: string) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('source', source);

	try {
		// 로컬 백엔드 API를 우선적으로 사용하고, 실패 시 외부 API를 사용
		try {
			const response = await localApiClient.post('/upload/docx', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (localError) {
			console.warn('로컬 API 호출 실패, 직접 처리로 전환:', localError);
			// 로컬 API 실패 시 null 반환하여 프론트엔드에서 처리하도록 함
			return null;
		}
	} catch (error) {
		console.error('DOCX 파일 업로드 오류:', error);
		throw error;
	}
};

// 처리된 계약서 데이터 저장
export const saveProcessedContract = async (processedData: any) => {
	try {
		// 로컬 백엔드 API를 우선적으로 사용하고, 실패 시 외부 API를 사용
		try {
			const response = await localApiClient.post('/upload/save-processed', processedData);
			return response.data;
		} catch (localError) {
			console.warn('로컬 API 호출 실패, 외부 API로 전환:', localError);
			// 로컬 API 실패 시 외부 API 호출
			const response = await apiClient.post('/clibInsertContract', processedData);
			return response.data;
		}
	} catch (error) {
		console.error('처리된 계약서 데이터 저장 오류:', error);
		throw error;
	}
};
