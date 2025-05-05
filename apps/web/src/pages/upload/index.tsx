/**
 * 업로드 페이지 - 계약서 파일 업로드 및 처리
 * useDocumentUpload 훅을 사용하여 전체 로직 리팩토링
 */
import React, { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import { DragAndDrop } from '../../components/upload/DragAndDrop';
import Select from '../../components/ui/Select';
import { HighlightedText, UploadedFile } from '../../types/clib';
import { useDocumentUpload } from '../../hooks/useDocumentUpload';
import { debugLog } from '../../utils/commonUtils';

const Upload: React.FC = () => {
    // useDocumentUpload 훅 사용하여 문서 관련 상태와 함수 가져오기
    const {
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
        handleFileDrop,
        handleInputChange,
        handleSelectChange,
        handlePageChange,
        onSubmit,
        resetForm,
    } = useDocumentUpload();

    // 나머지 UI 관련 상태
    const [disabled, setDisabled] = useState<boolean>(false);
    const [toggleDropzone, setToggleDropzone] = useState<boolean>(true);

    // 하이라이트 처리 관련 상태 
    const [highlightedText, setHighlightedText] = useState<HighlightedText[]>([]);
    const [selectedText, setSelectedText] = useState<string>('');
    const [contractAsset, setContractAsset] = useState<any>({});
    const [clauseAsset, setClauseAsset] = useState<any>({});

    // fileInput ref 추가
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 하이라이트 선택 함수
    const addHighlight = (str: string) => {
        if (str.length > 0) {
            debugLog('선택됨');
            setSelectedText(str);
        } else {
            setSelectedText('');
        }
    };

    // 드롭다운 옵션
    const sourceOptions = [
        // { value: '리걸인사이트', label: '리걸인사이트' },
        // { value: '엘지', label: '엘지' },
        // { value: '기관 계약서', label: '기관 계약서' },
        { value: '업무 계약서', label: '업무 계약서' },
        { value: '통상 계약서', label: '통상 계약서' },
        { value: '표준 계약서', label: '표준 계약서' },
        { value: '기타', label: '기타' }
    ];

    // 미리보기 렌더링
    const renderPreview = () => {
        if (preview.length === 0) return <p className="text-gray-500 text-center">문서를 업로드하면 미리보기가 표시됩니다.</p>;

        // 현재 페이지의 내용만 표시
        const currentPageContent = preview[currentPageIndex] || {};

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => handlePageChange('prev')}
                        className={`px-2 py-1 ${currentPageIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                        disabled={currentPageIndex === 0}
                    >
                        이전
                    </button>
                    <span className="text-sm text-gray-700">
                        {totalPages > 0 ? `${currentPageIndex + 1} / ${totalPages}` : '0 / 0'}
                    </span>
                    <button
                        onClick={() => handlePageChange('next')}
                        className={`px-2 py-1 ${currentPageIndex >= totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                        disabled={currentPageIndex >= totalPages - 1}
                    >
                        다음
                    </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">{currentPageContent.title || "제목 없음"}</h2>
                <div
                    dangerouslySetInnerHTML={{ __html: currentPageContent.contentHtml || "" }}
                    className="prose prose-sm max-w-none text-gray-800 max-h-[400px] overflow-auto p-4 border rounded-md"
                ></div>
            </div>
        );
    };

    return (
        <Layout>
            <main className="mx-auto my-4 min-h-[calc(100vh-120px)] bg-white px-4 py-6 text-black">
                <h1 className="mb-6 text-center text-2xl font-bold">문서 업로드</h1>

                {error && (
                    <div className="mb-6 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        <p>계약서가 성공적으로 업로드되었습니다!</p>
                    </div>
                )}

                <div className="w-full max-w-7xl mx-auto">
                    {/* 좌우 분할 레이아웃으로 변경 */}
                    <div className="flex flex-row gap-6">
                        {/* 왼쪽 패널 - 업로드 폼 */}
                        <div className="w-1/2">
                            <div className="rounded-xl bg-gray-50 p-6 shadow-md h-full">
                                <h2 className="mb-4 text-lg font-medium text-left">문서 정보</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left">문서 출처</label>
                                        <Select
                                            options={sourceOptions}
                                            value={formData.source}
                                            onChange={(value: string) => handleSelectChange('source', value)}
                                            placeholder="선택하세요"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left">산업</label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="예: IT, 금융, 부동산..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left">언어</label>
                                        <input
                                            type="text"
                                            name="language"
                                            value={formData.language}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="국문 또는 영문"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left">작성자</label>
                                        <input
                                            type="text"
                                            name="creator"
                                            value={formData.creator}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="작성자 이름"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="mb-6 flex justify-start items-center">
                                        <span className="mr-2 text-sm font-medium text-gray-700">문서를 드래그하여 업로드하세요</span>
                                        <span className="text-xs text-gray-500">(DOCX 파일만 지원)</span>
                                    </div>
                                    <DragAndDrop onDrop={handleFileDrop} />
                                </div>

                                {metaData.title && (
                                    <div className="mt-6 p-4 border rounded-md bg-white">
                                        <h3 className="text-md font-medium mb-2">추출된 메타데이터</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="font-medium">문서 제목:</span> {metaData.title}
                                            </div>
                                            <div>
                                                <span className="font-medium">당사자 A:</span> {metaData.partyA || '-'}
                                            </div>
                                            <div>
                                                <span className="font-medium">당사자 B:</span> {metaData.partyB || '-'}
                                            </div>
                                            <div>
                                                <span className="font-medium">목적:</span> {metaData.purpose || '-'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={e => onSubmit(e)}
                                    disabled={disabled || isLoading || uploadedFiles.length === 0}
                                    className="mt-6 w-full bg-blue-600 py-2 px-4 rounded-md text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? '처리 중...' : '저장하기'}
                                </button>
                            </div>
                        </div>

                        {/* 오른쪽 패널 - 미리보기 */}
                        <div className="w-1/2">
                            <div className="rounded-xl bg-gray-50 p-6 shadow-md h-full">
                                <h2 className="mb-4 text-lg font-medium">미리보기</h2>
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    renderPreview()
                                )}

                                <div className="mt-4">
                                    <div id="result1" className="hidden"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Upload;