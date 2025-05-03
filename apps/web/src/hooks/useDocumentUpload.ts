/**
 * useDocumentUpload 훅 - 문서 업로드 관련 로직을 추상화한 커스텀 훅
 * 업로드, 파일 처리, 메타데이터 추출, HTML 변환 등 문서 처리 관련 기능 제공
 */
import { useState, useCallback } from 'react';
import { insert_contractData } from '../services/upload';
import { convertDocxToHtml, parseContractHtml, groupContractData, generateClauseHtml, generatePreviewData, isWordFile } from '../utils/docxUtils';
import { MetaData, UploadedFile, UploadFormData, ClauseItem, ProcessedDocumentData } from '../types/clib';
import { debugLog } from '../utils/commonUtils';

/**
 * 문서 업로드 훅 반환 타입
 */
interface UseDocumentUploadResult {
	// 상태
	uploadedFiles: UploadedFile[];
	formData: UploadFormData;
	metaData: MetaData;
	appendix: string[];
	isLoading: boolean;
	error: string | null;
	success: boolean;
	contentArray: ClauseItem[];
	groupedArray: any[];
	html: string;
	preview: any[];
	currentPageIndex: number;
	totalPages: number;

	// 액션
	handleFileDrop: (files: UploadedFile[]) => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectChange: (name: string, value: string) => void;
	handlePageChange: (direction: 'prev' | 'next') => void;
	onSubmit: (e?: React.FormEvent) => Promise<void>;
	resetForm: () => void;
}

/**
 * 문서 업로드 커스텀 훅
 * @returns 문서 업로드 관련 상태와 함수를 포함한 객체
 */
export const useDocumentUpload = (): UseDocumentUploadResult => {
	// 기본 상태들
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [formData, setFormData] = useState<UploadFormData>({
		source: '리걸인사이트',
		industry: '',
		language: '국문',
		creator: '',
	});
	const [metaData, setMetaData] = useState<MetaData>({
		title: '',
		partyA: '',
		partyB: '',
		purpose: '',
	});
	const [appendix, setAppendix] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	// 문서 처리 결과
	const [contentArray, setContentArray] = useState<ClauseItem[]>([]);
	const [groupedArray, setGroupedArray] = useState<any[]>([]);
	const [html, setHtml] = useState<string>('');
	const [finalData, setFinalData] = useState<ClauseItem[]>([]);

	// 미리보기 관련
	const [preview, setPreview] = useState<any[]>([]);
	const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(0);

	/**
	 * 폼 입력 변경 처리
	 */
	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	}, []);

	/**
	 * 드롭다운 선택 변경 처리
	 */
	const handleSelectChange = useCallback((name: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	}, []);

	/**
	 * 파일 드롭 처리 - 업로드된 파일을 처리하고 문서로 변환
	 */
	const handleFileDrop = useCallback(
		async (files: UploadedFile[]) => {
			setUploadedFiles(files);

			if (files.length === 0) return;

			const file = files[0].file;

			// 파일 형식 검사
			if (!isWordFile(file)) {
				setError('지원되지 않는 파일 형식입니다. .doc 또는 .docx 파일만 업로드 가능합니다.');
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				// 문서 변환 프로세스 시작
				debugLog('문서 처리 시작', file.name);

				// 1. DOCX를 HTML로 변환
				const htmlString = await convertDocxToHtml(file, formData.source);

				// HTML 표시
				const resultDiv = document.getElementById('result1');
				if (resultDiv) {
					resultDiv.innerHTML = htmlString;
				}

				// 2. HTML 분석하여 메타데이터와 조항 추출
				const { metaData: extractedMeta, contractData, appendix: extractedAppendix } = parseContractHtml(htmlString, formData.source);

				// 3. HTML 생성
				const htmlEnrichedData = generateClauseHtml(contractData);

				// 4. 조항 그룹화
				const groupedData = groupContractData(htmlEnrichedData);

				// 5. 미리보기 데이터 생성
				const previewData = generatePreviewData(groupedData);

				// 상태 업데이트
				setMetaData(extractedMeta);
				setContentArray(htmlEnrichedData);
				setFinalData(htmlEnrichedData);
				setGroupedArray(groupedData);
				setAppendix(extractedAppendix);
				setHtml(htmlString);
				setPreview(previewData);
				setTotalPages(previewData.length);

				setIsLoading(false);
				debugLog('문서 처리 완료');
			} catch (err) {
				console.error('문서 처리 오류:', err);
				setError(`문서 처리 중 오류가 발생했습니다: ${String(err)}`);
				setIsLoading(false);
			}
		},
		[formData.source]
	);

	/**
	 * 미리보기 페이지 변경 처리
	 */
	const handlePageChange = useCallback(
		(direction: 'prev' | 'next') => {
			if (direction === 'prev' && currentPageIndex > 0) {
				setCurrentPageIndex(currentPageIndex - 1);
			} else if (direction === 'next' && currentPageIndex < totalPages - 1) {
				setCurrentPageIndex(currentPageIndex + 1);
			}
		},
		[currentPageIndex, totalPages]
	);

	/**
	 * 폼 제출 처리 - 서버에 데이터 저장
	 */
	const onSubmit = useCallback(
		async (e?: React.FormEvent) => {
			if (e) e.preventDefault();

			if (uploadedFiles.length === 0) {
				setError('업로드할 파일을 선택해주세요.');
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				// API 호출에 필요한 데이터 구성
				const dataToSave: ProcessedDocumentData = {
					title: metaData.title,
					partyA: metaData.partyA,
					partyB: metaData.partyB,
					purpose: metaData.purpose,
					source: formData.source,
					industry: formData.industry,
					language: formData.language,
					creator: formData.creator,
					clauseArray: finalData.filter(item => item.tag === 'h2'),
					contentArray: groupedArray,
					groupedArray: groupedArray,
					appendix: appendix.length > 0 ? appendix : [],
					html: html,
				};

				debugLog('업로드 데이터 준비 완료', dataToSave);

				// 서버 API 호출
				const response = await insert_contractData(dataToSave);
				debugLog('저장 결과', response);

				setSuccess(true);

				// 폼 초기화
				resetForm();
			} catch (error) {
				console.error('업로드 실패:', error);
				setError('업로드 중 오류가 발생했습니다.');
			} finally {
				setIsLoading(false);
			}
		},
		[uploadedFiles, metaData, formData, finalData, groupedArray, appendix, html]
	);

	/**
	 * 폼 초기화
	 */
	const resetForm = useCallback(() => {
		setUploadedFiles([]);
		setContentArray([]);
		setGroupedArray([]);
		setHtml('');
		setAppendix([]);
		setFinalData([]);
		setMetaData({
			title: '',
			partyA: '',
			partyB: '',
			purpose: '',
		});
		setFormData({
			source: '리걸인사이트',
			industry: '',
			language: '국문',
			creator: '',
		});

		// HTML 결과를 보여주는 div 초기화
		const resultDiv = document.getElementById('result1');
		if (resultDiv) {
			resultDiv.innerHTML = '';
		}

		setPreview([]);
		setSuccess(false);
		setCurrentPageIndex(0);
		setTotalPages(0);
	}, []);

	return {
		// 상태
		uploadedFiles,
		formData,
		metaData,
		appendix,
		isLoading,
		error,
		success,
		contentArray,
		groupedArray,
		html,
		preview,
		currentPageIndex,
		totalPages,

		// 액션
		handleFileDrop,
		handleInputChange,
		handleSelectChange,
		handlePageChange,
		onSubmit,
		resetForm,
	};
};

export default useDocumentUpload;
