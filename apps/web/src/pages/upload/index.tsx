import React, { useState, useEffect, useRef } from 'react';
import { DragAndDrop } from '../../components/clib/DragAndDrop';
import { formatDate } from '../../utils/dateUtils';
import Layout from '../../components/layoutDemo'
import Select from '../../components/ui/Select';
import { uploadDocxFile, insert_contractData } from '../../services/upload';
import {
    isWordDocument,
    getStyleMapOptions
} from '../../utils/documentUtils';
import mammoth from 'mammoth';

interface UploadedFile {
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

interface UploadFormData {
    source: string;
    industry: string;
    language: string;
    creator: string;
}

interface MetaData {
    title: string;
    partyA: string;
    partyB: string;
    purpose: string;
}

interface HighlightedText {
    text: string;
    color: string;
}

interface ClauseItem {
    tag: string;
    depth?: string;
    text?: string | any[];
    subText?: any[];
    type?: string;
    idx?: number | string;
    _id?: string;
    html?: string;
}

// 처리된 문서 데이터 타입 정의 추가
interface ProcessedDocumentData {
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
    appendix: string[]; // null 허용하지 않음
    html: string;
}

const Upload: React.FC = () => {
    // 상태 관리
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('리걸인사이트');
    const [formData, setFormData] = useState<UploadFormData>({
        source: '리걸인사이트',
        industry: '',
        language: '국문',
        creator: ''
    });
    const [metaData, setMetaData] = useState<MetaData>({
        title: '',
        partyA: '',
        partyB: '',
        purpose: ''
    });
    const [appendix, setAppendix] = useState<string[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [toggleDropzone, setToggleDropzone] = useState<boolean>(true);
    const [contentArray, setContentArray] = useState<ClauseItem[]>([]);
    const [groupedArray, setGroupedArray] = useState<any[]>([]);
    const [html, setHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [success, setSuccess] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [useBackend, setUseBackend] = useState<boolean>(true); // 백엔드 API 사용 여부

    // 하이라이트 처리 관련 상태 추가
    const [highlightedText, setHighlightedText] = useState<HighlightedText[]>([]);
    const [selectedText, setSelectedText] = useState<string>('');
    const [finalData, setFinalData] = useState<ClauseItem[]>([]);
    const [contractAsset, setContractAsset] = useState<any>({});
    const [clauseAsset, setClauseAsset] = useState<any>({});

    // fileInput ref 추가
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 폼 입력 변경 핸들러
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 업로드 버튼 클릭 핸들러
    const onSubmit = async (e: React.FormEvent) => {
        e?.preventDefault();
        if (uploadedFiles.length === 0) {
            setError('업로드할 파일을 선택해주세요.');
            return;
        }

        setDisabled(true);
        setIsLoading(true);
        setError(null);

        try {
            // API 호출에 필요한 데이터 구성
            const dataToSave = {
                title: metaData.title,
                partyA: metaData.partyA,
                partyB: metaData.partyB,
                purpose: metaData.purpose,
                source: formData.source,
                industry: formData.industry,
                language: formData.language,
                creator: formData.creator,
                clauseArray: finalData.filter(item => item.tag === 'h2'),
                contentArray: contentArray,
                groupedArray: groupedArray,
                appendix: appendix.length > 0 ? appendix : [],
                html: html
            };

            console.log('업로드 데이터:', dataToSave);

            // 서버 API 호출
            const response = await insert_contractData(dataToSave);
            console.log('저장 결과:', response);
            setSuccess(true);

            // 폼 초기화
            resetForm();
        } catch (error) {
            console.error('업로드 실패:', error);
            setError('업로드 중 오류가 발생했습니다.');
            alert('업로드 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
            setDisabled(false);
        }
    };

    // 폼 초기화
    const resetForm = () => {
        setUploadedFiles([]);
        setContentArray([]);
        setGroupedArray([]);
        setHtml('');
        setAppendix([]);
        setMetaData({
            title: '',
            partyA: '',
            partyB: '',
            purpose: ''
        });
        setFormData({
            source: '리걸인사이트',
            industry: '',
            language: '국문',
            creator: ''
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
    };

    // 파일 업로드 처리 핸들러
    const handleFileDrop = (files: UploadedFile[]) => {
        setUploadedFiles(files);
        if (files.length > 0) {
            const file = files[0].file;
            // .doc, .docx 파일 검사
            if (isWordDocument(file)) {
                processDocxFile(file);
            } else {
                setError('지원되지 않는 파일 형식입니다. .doc 또는 .docx 파일만 업로드 가능합니다.');
            }
        }
    };

    // DOCX 파일 처리 함수 - 백엔드 API 또는 로컬 처리
    const processDocxFile = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Processing document file:', file.name);

            if (useBackend) {
                // 백엔드 API를 통한 처리 시도
                try {
                    const result = await uploadDocxFile(
                        file,
                        formData.source,
                        formData.industry,
                        formData.language,
                        formData.creator
                    );
                    console.log('백엔드 API 응답:', result);

                    if (result && !result.error) {
                        // HTML 표시
                        const resultDiv = document.getElementById('result1');
                        if (resultDiv && result.html) {
                            resultDiv.innerHTML = result.html;
                        }

                        // 데이터 설정
                        setHtml(result.html || '');

                        // 메타데이터 설정
                        if (result.metaData) {
                            setMetaData({
                                title: result.metaData.title || '',
                                partyA: result.metaData.partyA || '',
                                partyB: result.metaData.partyB || '',
                                purpose: result.metaData.purpose || ''
                            });
                        }

                        // 문서 구조 설정
                        if (result.contentArray) {
                            setContentArray(result.contentArray);
                            setFinalData(result.contentArray);
                        }

                        if (result.groupedArray) {
                            setGroupedArray(result.groupedArray);
                        }

                        if (result.appendix) {
                            setAppendix(result.appendix);
                        }

                        if (result.highlightedText) {
                            setHighlightedText(result.highlightedText);
                        }

                        // 미리보기 데이터 생성
                        generatePreviewData(result.groupedArray || []);

                        console.log('백엔드 문서 처리 완료');
                        setIsLoading(false);
                        return;
                    } else {
                        console.warn('백엔드 API 오류, 로컬 처리로 전환:', result?.error);
                        // 오류 시 로컬 처리로 폴백
                    }
                } catch (apiError) {
                    console.warn('백엔드 API 호출 실패, 로컬 처리로 전환:', apiError);
                    // 오류 시 로컬 처리로 폴백
                }
            }

            // 백엔드 API 실패 또는 로컬 처리 선택 시 로컬에서 처리
            console.log('로컬에서 문서 처리 시작');

            // 수정된 로직: mammoth 라이브러리 직접 사용
            const reader = new FileReader();
            reader.onloadend = async function () {
                try {
                    const arrayBuffer = reader.result as ArrayBuffer;

                    // 스타일맵 설정
                    let options = getStyleMapOptions(formData.source);

                    // 문서 변환
                    const resultObject = await mammoth.convertToHtml(
                        { arrayBuffer: arrayBuffer },
                        options
                    ) as unknown as { value: string, warnings: any[] };

                    // 결과 HTML 정리
                    const regex = /<p><\/p>/gi;
                    const htmlString = resultObject.value.replace(regex, '');

                    // HTML 표시
                    const resultDiv = document.getElementById('result1');
                    if (resultDiv) {
                        resultDiv.innerHTML = htmlString;
                    }

                    // HTML 분석 및 데이터 추출
                    readHtml(htmlString);

                    setHtml(htmlString);

                    console.log('로컬 문서 처리 완료');
                    setIsLoading(false);
                } catch (err) {
                    console.error('문서 변환 중 오류:', err);
                    setError('문서 변환 중 오류가 발생했습니다: ' + String(err));
                    setIsLoading(false);
                }
            };

            reader.onerror = function (error) {
                console.error('파일 읽기 오류:', error);
                setError('파일 읽기 중 오류가 발생했습니다.');
                setIsLoading(false);
            };

            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error('문서 처리 중 오류 발생:', err);
            setError('문서 처리 중 오류가 발생했습니다: ' + String(err));
            setIsLoading(false);
        }
    };

    // HTML 읽기 및 계약서 데이터 구조화 함수 추가
    const readHtml = (htmlString: string) => {
        console.log('readHTML 시작');
        let divToAdd = `<div>${htmlString}</div>`;
        let addedItems: ClauseItem[] = [];
        let div = new DOMParser().parseFromString(divToAdd, 'text/html');

        let divs: string[] = [];
        let noTags = ['table', 'tbody', 'tr', 'td', 'strong'];
        let items = div.getElementsByTagName('*');

        // div 래퍼를 제외하고 모든 요소 추가
        for (let i = 1; i < items.length; i++) {
            divs.push(items[i].outerHTML);
        }
        divs = divs.reverse();

        let list: any[] = [];
        let subList: any[] = [];
        let table: any[] = [];
        let row: any[] = [];
        let annex: string[] = [];

        for (let i = 0; i < divs.length; i++) {
            let nextDoc, nextText, nextTagName;
            let doc = new DOMParser().parseFromString(divs[i], 'text/html');
            const firstChild = doc.body.firstChild as Element;

            if (!firstChild) continue;

            let text = firstChild.textContent || '';
            let tagName = firstChild.tagName.toLowerCase();
            let className = firstChild.className || '';

            if (i + 1 < divs.length) {
                nextDoc = new DOMParser().parseFromString(divs[i + 1], 'text/html');
                const nextFirstChild = nextDoc.body.firstChild as Element;
                nextText = nextFirstChild ? nextFirstChild.textContent || '' : '';
                nextTagName = nextFirstChild ? nextFirstChild.tagName.toLowerCase() : '';
            }

            const hasText = text.length !== 0;
            // 이미 추가된 항목인지 확인
            const alreadyAdded = addedItems.some(item => typeof item.text === 'string' && item.text.trim() === text.trim());

            if (hasText && !alreadyAdded) {
                if (tagName === 'li') {
                    if (className === 'two') {
                        subList.push({
                            tag: tagName,
                            depth: className,
                            text: text
                        });
                    } else if (className === 'one') {
                        list.push({
                            tag: tagName,
                            depth: className,
                            text: text,
                            subText: [...subList].reverse()
                        });
                        subList = [];
                    }
                } else if (tagName === 'ol') {
                    addedItems.push({
                        idx: 0,
                        tag: tagName,
                        text: [...list].reverse()
                    });
                    list = [];
                } else if (tagName === 'span') {
                    if (className === 'party1') {
                        setMetaData(prev => ({ ...prev, partyA: text }));
                    } else if (className === 'party2') {
                        setMetaData(prev => ({ ...prev, partyB: text }));
                    } else if (className === 'purpose') {
                        setMetaData(prev => ({ ...prev, purpose: text }));
                    } else if (className && className.includes('annex')) {
                        annex.push(text);
                    } else {
                        addedItems.push({
                            idx: 0,
                            tag: tagName,
                            type: className,
                            text: text
                        });
                    }
                } else if (tagName === 'h2') {
                    if (formData.source === '리걸인사이트' && text.includes('[') && text.includes(']')) {
                        const cleanedText = text.substring(text.indexOf('[') + 1, text.lastIndexOf(']'));
                        addedItems.push({
                            idx: 0,
                            tag: tagName,
                            text: cleanedText
                        });
                    } else {
                        addedItems.push({
                            idx: 0,
                            tag: tagName,
                            text: text
                        });
                    }
                } else if (tagName === 'h1') {
                    // h1 태그는 계약서 제목으로 처리
                    setMetaData(prev => ({ ...prev, title: text }));
                    addedItems.push({
                        idx: 0,
                        tag: tagName,
                        text: text
                    });
                } else {
                    if (nextTagName === 'td') {
                        row.push({
                            tag: tagName,
                            text: text
                        });
                    } else if (nextTagName === 'tr') {
                        table.push([...row].reverse());
                        row = [];
                    } else if (tagName === 'table') {
                        table = [];
                    } else if (!noTags.includes(tagName)) {
                        addedItems.push({
                            idx: 0,
                            tag: tagName,
                            text: text
                        });

                        if (formData.source === '리걸인사이트' && className === 'opening') {
                            addedItems.push({
                                idx: 0,
                                tag: 'br',
                                _id: String(Math.floor(Math.random() * 10000000000)),
                                html: '<br/>',
                                text: ''
                            });
                        }
                    }
                }
            } else if (tagName === 'br' && tagName !== nextTagName) {
                addedItems.push({
                    idx: 0,
                    tag: tagName,
                    text: ''
                });
            }
        }

        // 첨부 파일 설정
        setAppendix([...annex.reverse()]);

        // 항목 순서 뒤집기
        let contractData = addedItems.reverse();

        // 항목 ID 할당 및 idx 설정
        let idx = 0;
        for (let i = 0; i < contractData.length; i++) {
            contractData[i]._id = String(Math.floor(Math.random() * 10000000000));
            if (contractData[i].tag === 'h2') {
                idx++;
            }
            contractData[i].idx = idx as number;
        }

        console.log('contractData 생성 완료:', contractData);

        // html 생성
        renderHtml(highlightedText, contractData);

        // 그룹화된 배열 생성
        let currentIdx = 0;
        let contractList: any[] = [];
        let contractItem: any[] = [];

        // idx 값을 기준으로 항목들을 그룹화
        for (let i = 0; i < contractData.length; i++) {
            if (Number(contractData[i].idx) === currentIdx) {
                contractItem.push(contractData[i]);
            } else {
                contractList.push(contractItem);
                contractItem = [];
                contractItem.push(contractData[i]);
                currentIdx = Number(contractData[i].idx);
            }

            if (i === contractData.length - 1) {
                contractList.push(contractItem);
            }
        }

        console.log('contractList(그룹화된 배열) 생성 완료:', contractList);
        setGroupedArray(contractList);

        // 미리보기 데이터 생성
        generatePreviewData(contractList);
    };

    // 하이라이트 적용 및 HTML 생성 함수
    const renderHtml = (spansArray: HighlightedText[], clauseArray: ClauseItem[]) => {
        console.log('HTML 생성 시작');

        // 각 항목에 HTML 생성
        for (let i = 0; i < clauseArray.length; i++) {
            const item = clauseArray[i];
            const tag = item.tag;

            // HTML 생성 로직
            if (tag === 'br') {
                // 연속된 br 태그 처리
                if (i + 1 < clauseArray.length && clauseArray[i + 1].tag !== 'br') {
                    item.html = '<br/>';
                } else {
                    item.html = '';
                }
            } else if ((tag === 'ol' || tag === 'ul') && item.text) {
                // 리스트 처리
                const textArray = item.text;
                if (Array.isArray(textArray)) {
                    let listHtml = '';

                    for (let k = 0; k < textArray.length; k++) {
                        const listItem = textArray[k];
                        if (listItem && listItem.tag) {
                            let sublistHtml = '';

                            // 서브리스트 처리
                            if (listItem.subText && listItem.subText.length > 0) {
                                for (let x = 0; x < listItem.subText.length; x++) {
                                    const subItem = listItem.subText[x];
                                    if (subItem && subItem.tag) {
                                        const subItemId = String(Math.floor(Math.random() * 10000000000));
                                        sublistHtml += `<${subItem.tag} name='level-two-item' class='level-two-item' id=${subItemId}>${subItem.text || ''}</${subItem.tag}>`;
                                    }
                                }

                                if (sublistHtml) {
                                    sublistHtml = `<ol name='level-two-list' class='level-two-list list-[upper-roman]'>${sublistHtml}</ol>`;
                                }
                            }

                            const itemId = String(Math.floor(Math.random() * 10000000000));
                            listHtml += `<${listItem.tag} name='level-one-item' class='level-one-item' id=${itemId}>${listItem.text || ''}${sublistHtml}</${listItem.tag}>`;
                        }
                    }

                    const listId = item._id || String(Math.floor(Math.random() * 10000000000));
                    item.html = `<${tag} name='level-one-list' class='level-one-list' id=${listId}>${listHtml}</${tag}>`;
                }
            } else {
                // 일반 요소 HTML 생성
                item.html = `<${tag}>${item.text || ''}</${tag}>`;
            }
        }

        // 상태 업데이트
        setContentArray(clauseArray);
        setFinalData(clauseArray);
    };

    // 미리보기 데이터 생성
    const generatePreviewData = (groups: any[]) => {
        if (!groups || !Array.isArray(groups) || groups.length === 0) {
            return;
        }

        // 각 그룹에서 미리보기 데이터 생성
        const previewData = groups.map(items => {
            const titleItem = items.find((item: any) => item.tag === 'h2');
            const title = titleItem ? titleItem.text : '제목 없음';

            // 본문 HTML 구성
            let contentHtml = '';
            items.forEach((item: any) => {
                if (item.html) {
                    contentHtml += item.html;
                }
            });

            return {
                title,
                contentHtml,
                items
            };
        });

        setPreview(previewData);
        setTotalPages(previewData.length);
    };

    // 선택 변경 핸들러
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'source') {
            setSelectedItem(value);
        }
    };

    // 처리 방식 변경 핸들러
    const handleProcessingMode = (mode: 'backend' | 'local') => {
        setUseBackend(mode === 'backend');
    };

    // 미리보기 페이지 이동 처리
    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        } else if (direction === 'next' && currentPageIndex < totalPages - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    };

    // 하이라이트 선택 함수
    const addHighlight = (str: string) => {
        if (str.length > 0) {
            console.log('선택됨');
            setSelectedText(str);
        } else {
            setSelectedText('');
        }
    };

    // 드롭다운 옵션
    const sourceOptions = [
        { value: '리걸인사이트', label: '리걸인사이트' },
        { value: '엘지', label: '엘지' },
        { value: '법무법인 대륙아주', label: '법무법인 대륙아주' },
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

    // 하이라이트 텍스트 표시
    const renderHighlightedText = () => {
        if (highlightedText.length === 0) return null;

        return (
            <div className="mt-6 border-t pt-4">
                <h3 className="text-md font-medium mb-2">하이라이트된 텍스트</h3>

                <div>
                    <p className="text-sm text-red-600 font-medium">정의된 용어</p>
                    <ul className="list-disc pl-5 text-sm">
                        {highlightedText
                            .filter(ht => ht.color === 'red')
                            .map((ht, idx) => (
                                <li key={`red-${idx}`} className="mb-1">{ht.text}</li>
                            ))}
                    </ul>
                </div>

                <div className="mt-3">
                    <p className="text-sm text-blue-600 font-medium">계약 고유 콘텐츠</p>
                    <ul className="list-disc pl-5 text-sm">
                        {highlightedText
                            .filter(ht => ht.color === 'blue')
                            .map((ht, idx) => (
                                <li key={`blue-${idx}`} className="mb-1">"{ht.text}"</li>
                            ))}
                    </ul>
                </div>

                <div className="mt-3">
                    <p className="text-sm text-purple-600 font-medium">계약 목적과 거래 요약</p>
                    <ul className="list-disc pl-5 text-sm">
                        {highlightedText
                            .filter(ht => ht.color === 'purple')
                            .map((ht, idx) => (
                                <li key={`purple-${idx}`} className="mb-1">"{ht.text}"</li>
                            ))}
                    </ul>
                </div>
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
                    {/* 처리 방식 선택 */}
                    <div className="mb-4 flex justify-center space-x-4">
                        <button
                            onClick={() => handleProcessingMode('backend')}
                            className={`px-4 py-2 rounded ${useBackend ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            백엔드 처리 사용
                        </button>
                        <button
                            onClick={() => handleProcessingMode('local')}
                            className={`px-4 py-2 rounded ${!useBackend ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            로컬 처리 사용
                        </button>
                    </div>

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
                                            onChange={(value) => handleSelectChange('source', value)}
                                            placeholder="선택하세요"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left">산업</label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={onInputChange}
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
                                            onChange={onInputChange}
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
                                            onChange={onInputChange}
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

                                {isLoading && (
                                    <div className="my-4 flex justify-center">
                                        <div className="loader">로딩 중...</div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={onSubmit}
                                        disabled={disabled || isLoading}
                                        className={`rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        계약서 업로드
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽 패널 - 미리보기 */}
                        <div className="w-1/2">
                            <div className="rounded-xl bg-white p-6 shadow-md h-full overflow-auto">
                                <h2 className="mb-4 text-lg font-medium text-left">문서 미리보기</h2>

                                {/* 조항별 미리보기 */}
                                <div className="mb-6">
                                    {renderPreview()}
                                </div>

                                {/* 하이라이트 텍스트 */}
                                {renderHighlightedText()}

                                {appendix.length > 0 && (
                                    <div className="mt-4 text-left">
                                        <p className="font-medium">첨부 파일:</p>
                                        <ul className="list-inside list-disc">
                                            {appendix.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* 전체 HTML 미리보기 */}
                                <div className="mt-6">
                                    <h3 className="mb-2 text-md font-medium">원본 HTML</h3>
                                    <div
                                        id="result1"
                                        className="preview-doc min-h-[200px] max-h-[300px] overflow-y-auto rounded-md border border-gray-300 p-4 text-left"
                                    ></div>
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