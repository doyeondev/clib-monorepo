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

// 업로드된 문서 데이터 인터페이스
export interface ProcessedDocumentData {
	title: string;
	partyA: string;
	partyB: string;
	purpose: string;
	source: string;
	industry: string;
	language: string;
	creator: string;
	contentArray: any[];
	groupedArray?: any[];
	clauseArray?: any[];
	appendix: string[];
	html: string;
	highlightedText?: any[];
}

/**
 * 계약서 데이터 저장 함수
 * 백엔드 API 우선 사용, 실패 시 외부 API로 폴백
 * @param data - 처리된 계약서 데이터
 * @returns 저장 결과 Promise
 */
export const insert_contractData = async (data: any): Promise<any> => {
	console.log('[Clib] 계약서 데이터 POST');

	try {
		// 로컬 백엔드 API 먼저 시도
		try {
			const response = await localApiClient.post('/upload/insert-contract', {
				data: data,
			});
			console.log('계약서 데이터 저장 로컬 API 응답:', response.data);
			return response.data;
		} catch (localError) {
			console.warn('로컬 API 호출 실패, 외부 API로 전환:', localError);

			// 외부 API로 폴백
			const apiUrlEndpoint = `${API_BASE_URL}/saveClibData`;
			const body = JSON.stringify({
				data: data,
			});

			const response = await fetch(apiUrlEndpoint, {
				method: 'post',
				body,
			});

			console.log('외부 API 응답:', response);
			if (response.ok) {
				return response.json();
			}
			throw new Error('외부 API 호출 실패: ' + response.status);
		}
	} catch (e) {
		console.error(`Error: ${String(e)}`);
		throw e;
	}
};

/**
 * Word 문서 파일 업로드 및 처리
 * 백엔드 API 우선 사용, 실패 시 외부 API로 폴백
 * @param file - 업로드할 Word 문서 파일 (.doc 또는 .docx)
 * @param source - 문서 출처
 * @param industry - 산업 분야 (선택)
 * @param language - 언어 (선택, 기본값: '국문')
 * @param creator - 작성자 (선택)
 * @returns 처리된 문서 데이터 Promise
 */
export const uploadDocxFile = async (file: File, source: string, industry?: string, language?: string, creator?: string): Promise<any> => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('source', source);

	// 추가 정보가 있으면 폼 데이터에 추가
	if (industry) formData.append('industry', industry);
	if (language) formData.append('language', language);
	if (creator) formData.append('creator', creator);

	try {
		// 로컬 백엔드 API를 우선적으로 사용하고, 실패 시 외부 API를 사용
		try {
			console.log('로컬 백엔드 API 호출 시작:', file.name, source, industry, language, creator);
			const response = await localApiClient.post('/upload/docx', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log('문서 업로드 로컬 API 응답:', response.data);
			return response.data;
		} catch (localError: any) {
			console.warn('로컬 API 호출 실패, 외부 API로 전환:', localError);
			console.error('로컬 API 에러 상세:', localError?.message, localError?.response?.data);

			// 파일 형식에 따라 다른 API 엔드포인트 사용
			const endpoint = file.type === 'application/msword' ? 'clibUploadDoc' : 'clibUploadDocx';
			console.log('외부 API 엔드포인트 사용:', endpoint);

			try {
				const response = await apiClient.post(`/${endpoint}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				console.log('문서 업로드 외부 API 응답:', response.data);
				return response.data;
			} catch (externalError: any) {
				console.error('외부 API 호출 실패:', externalError?.message);
				throw new Error(`외부 API 호출 실패: ${externalError?.message}`);
			}
		}
	} catch (error: any) {
		console.error('문서 파일 업로드 오류:', error, error?.message);
		// 오류 객체 포함하여 반환
		return {
			error: `문서 파일 업로드 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}`,
			success: false,
		};
	}
};

/**
 * 처리된 계약서 데이터 저장
 * 백엔드 API 우선 사용, 실패 시 외부 API로 폴백
 * @param processedData - 처리된 계약서 데이터
 * @returns 저장 결과 Promise
 */
export const saveProcessedContract = async (processedData: ProcessedDocumentData): Promise<any> => {
	try {
		// 로컬 백엔드 API를 우선적으로 사용하고, 실패 시 외부 API를 사용
		try {
			const response = await localApiClient.post('/upload/save-processed', processedData);
			console.log('처리된 계약서 저장 로컬 API 응답:', response.data);
			return response.data;
		} catch (localError) {
			console.warn('로컬 API 호출 실패, 외부 API로 전환:', localError);
			const response = await apiClient.post('/clibInsertContract', processedData);
			console.log('처리된 계약서 저장 외부 API 응답:', response.data);
			return response.data;
		}
	} catch (error) {
		console.error('처리된 계약서 데이터 저장 오류:', error);
		throw error;
	}
};
