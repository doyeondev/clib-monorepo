/**
 * CLIB API 함수 모음
 * AWS RDS의 PostgreSQL 데이터베이스와 통신하는 API 함수들
 */

// 기본 API URL 설정
// 환경 변수에서 API URL을 읽어오거나 기본값 사용 - 항상 api.clib.kr 사용
const API_BASE_URL = import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`) : 'https://api.clib.kr/api'; // 개발 및 프로덕션 환경 모두 동일한 API 서버 사용

console.log('[API] 사용 중인 API URL:', API_BASE_URL);

/**
 * 조항 카테고리 목록을 가져옵니다.
 * 이전: https://conan.ai/_functions/clibClauseCategory
 * 현재: /api/clause/categories
 * @returns 조항 카테고리 목록 (Promise)
 */
export async function getClauseCategoryList() {
	console.log('[api] 조항 카테고리 목록 요청');

	try {
		const apiUrlEndpoint = `${API_BASE_URL}/clause/categories`;
		console.log('[api] 요청 URL:', apiUrlEndpoint);

		const response = await fetch(apiUrlEndpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		console.log('[api] 응답 상태:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[api] 서버 응답 오류:`, errorText);
			throw new Error(`API 응답 오류: ${response.status}, 상세: ${errorText}`);
		}

		const res = await response.json();
		console.log('[api] 응답 데이터:', res);
		return res.items || res;
	} catch (error) {
		console.error('조항 카테고리 목록을 가져오는 중 오류:', error);
		// 에러 발생 시 빈 배열 반환하여 프론트엔드 오류 방지
		return [];
	}
}

/**
 * 일반 조항 데이터를 가져옵니다.
 * /api/clib/clauses 엔드포인트를 사용해 모든 활성화된 조항을 가져옵니다.
 * @returns 조항 데이터 (Promise)
 */
export async function getClibDataset() {
	console.log('[api] 조항 데이터 요청');

	try {
		// 단순화: 항상 기본 API 엔드포인트 사용
		const apiUrlEndpoint = `${API_BASE_URL}/clib/clauses`;
		console.log('[api] 요청 URL:', apiUrlEndpoint);

		const response = await fetch(apiUrlEndpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		console.log('[api] 응답 상태:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[api] 서버 응답 오류:`, errorText);
			throw new Error(`API 응답 오류: ${response.status}, 상세: ${errorText}`);
		}

		const res = await response.json();
		console.log('[api] 응답 데이터:', res);
		return res.items || res;
	} catch (error) {
		console.error('조항 데이터를 가져오는 중 오류:', error);
		// 에러 발생 시 빈 배열 반환
		return [];
	}
}

/**
 * 계약서 자산 목록을 가져옵니다.
 * 이전: https://conan.ai/_functions/clibContractList
 * 현재: /api/contract/assets 또는 /api/contract/assets
 * @returns 계약서 자산 목록 (Promise)
 */
export async function getContractList() {
	console.log('[api] 계약서 자산 목록 요청');

	try {
		const apiUrlEndpoint = `${API_BASE_URL}/contract/assets`;
		console.log('[api] 요청 URL:', apiUrlEndpoint);

		const response = await fetch(apiUrlEndpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		console.log('[api] 응답 상태:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[api] 서버 응답 오류:`, errorText);
			throw new Error(`API 응답 오류: ${response.status}, 상세: ${errorText}`);
		}

		const res = await response.json();
		console.log('[api] 응답 데이터:', res);
		return res.items || res;
	} catch (error) {
		console.error('계약서 자산 목록을 가져오는 중 오류:', error);
		return [];
	}
}

/**
 * 특정 계약서 자산을 가져옵니다.
 * 이전: https://conan.ai/_functions/clibContractItem/{id}
 * 현재: /api/contract/assets/{id} 또는 /api/contract/assets/compatibility/contract-item/{id}
 * @param id 계약서 자산 ID
 * @returns 계약서 자산 정보 (Promise)
 */
export async function getContractItem(id: string) {
	console.log('[api] 특정 계약서 자산 요청:', id);

	try {
		const apiUrlEndpoint = `${API_BASE_URL}/contract/assets/${id}`;
		console.log('[api] 요청 URL:', apiUrlEndpoint);

		const response = await fetch(apiUrlEndpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		console.log('[api] 응답 상태:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[api] 서버 응답 오류:`, errorText);
			throw new Error(`API 응답 오류: ${response.status}, 상세: ${errorText}`);
		}

		const res = await response.json();
		console.log('[api] 응답 데이터:', res);
		return res;
	} catch (error) {
		console.error('특정 계약서 자산을 가져오는 중 오류:', error);
		return null;
	}
}

/**
 * 조항 자산 목록을 가져옵니다.
 * 이전: https://conan.ai/_functions/clibClauseAsset
 * 현재: /api/clause/assets 또는 /api/clause/assets/compatibility/clause-asset
 * @returns 조항 자산 목록 (Promise)
 */
export async function getClauseAssets() {
	console.log('[api] 조항 자산 목록 요청');

	try {
		const apiUrlEndpoint = `${API_BASE_URL}/clause/assets`;
		console.log('[api] 요청 URL:', apiUrlEndpoint);

		const response = await fetch(apiUrlEndpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		console.log('[api] 응답 상태:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[api] 서버 응답 오류:`, errorText);
			throw new Error(`API 응답 오류: ${response.status}, 상세: ${errorText}`);
		}

		const res = await response.json();
		console.log('[api] 응답 데이터:', res);
		return res.items ? res : { items: res };
	} catch (error) {
		console.error('조항 자산 목록을 가져오는 중 오류:', error);
		return { items: [] };
	}
}
