import React, { useState, useEffect } from 'react';
import { getRegExp } from 'korean-regexp';
import { useCategoryContext, useArticleContext, ClauseItem } from '../../contexts/ClauseContext';

interface SearchInputProps {
    setData?: React.Dispatch<React.SetStateAction<any>>;
    placeholderText?: string;
    className?: string;
    contractList?: ClauseItem[];
}

/**
 * 조항 검색 입력 컴포넌트
 */
export const ClauseSearchInput: React.FC<SearchInputProps> = ({
    setData,
    placeholderText = '필요한 조항을 검색해보세요!',
    className = ''
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<ClauseItem[]>([]);
    const { clauseList } = useArticleContext();

    // 검색 실행 함수
    const runSearch = () => {
        if (!searchTerm) return;

        setSearchLoading(true);
        try {
            // 한글 정규식 패턴 적용
            const results = clauseList.filter((item: ClauseItem) => {
                const titleMatch =
                    (item.title_ko && item.title_ko.match(getRegExp(searchTerm)) !== null) ||
                    (item.clause_title && item.clause_title.match(getRegExp(searchTerm)) !== null) ||
                    (item.title && item.title.match(getRegExp(searchTerm)) !== null);

                // 콘텐츠 검색
                let contentMatch = false;
                if (item.content_ko) {
                    contentMatch = item.content_ko.match(getRegExp(searchTerm)) !== null;
                } else if (item.content_en) {
                    contentMatch = item.content_en.match(getRegExp(searchTerm)) !== null;
                } else if (item.content) {
                    contentMatch = item.content.match(getRegExp(searchTerm)) !== null;
                }

                return titleMatch || contentMatch;
            });

            console.log('검색 결과:', results); // 검색 결과 로깅
            setSearchResults(results);

            // 검색 결과를 상위 컴포넌트로도 전달
            if (setData) setData(results);
        } catch (error) {
            console.error('검색 오류:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    // 검색어 변경 시 디바운스 처리
    useEffect(() => {
        if (!searchTerm.length) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(runSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, clauseList]);

    // 엔터키 처리
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            runSearch();
        }
    };

    return (
        <div className={`mx-auto mt-4 flex w-[540px] flex-col ${className}`}>
            <div className="flex w-full">
                <div className="relative w-full">
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        className="block w-full rounded-lg border border-fuchsia-100 bg-fuchsia-50/30 p-2.5 ps-5 text-sm text-gray-900 hover:border-fuchsia-200 hover:bg-white focus:border-fuchsia-300 focus:ring-blue-200"
                        placeholder={placeholderText}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        required
                    />
                    {searchTerm.length > 0 && (
                        <button
                            onClick={() => setSearchTerm('')}
                            type="button"
                            className="group absolute inset-y-0 end-0 flex items-center pe-9"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none h-5 w-5 fill-gray-400 group-hover:fill-gray-800">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={runSearch}
                        type="button"
                        className="absolute inset-y-0 end-0 flex items-center pr-3"
                    >
                        <svg className="h-5 w-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </button>
                </div>
                <button
                    type="submit"
                    onClick={runSearch}
                    className="ms-2 flex items-center rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800/90 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                    <svg className="me-2 h-4 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                    <span className="w-full">검색</span>
                </button>
            </div>

            {searchResults.length > 0 && (
                <ClauseSearchResult
                    setSearchTerm={setSearchTerm}
                    searchResult={searchResults}
                    searchTerm={searchTerm}
                />
            )}
        </div>
    );
};

interface SearchResultProps {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    searchResult: ClauseItem[];
    searchTerm: string;
}

/**
 * 조항 검색 결과 컴포넌트
 */
export const ClauseSearchResult: React.FC<SearchResultProps> = ({
    setSearchTerm,
    searchResult,
    searchTerm
}) => {
    const { categoryList, updateCategory } = useCategoryContext();

    if (searchResult.length === 0) return null;

    return (
        <div className="flex w-[458px] flex-col rounded rounded-b-lg bg-white shadow">
            {searchResult.map((resultObj, index) => {
                const category = categoryList.find((x) => x.id === resultObj.clause_category);

                if (!category) return null;

                const titleText = resultObj.title_ko || resultObj.clause_title || resultObj.title || '';
                // 검색어 하이라이트 처리
                const matchingTerm = titleText.replace(
                    searchTerm,
                    `<span class="font-bold text-purple-800">${searchTerm}</span>`
                );

                return (
                    <div
                        key={index}
                        id={category.id}
                        onClick={(e) => {
                            updateCategory(e);
                            setSearchTerm('');
                        }}
                        className="flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className="pointer-events-none"></p>
                        <div className="ml-4 flex items-center space-x-2 text-xs">
                            <div key={category.id} className="rounded px-1.5 py-0.5 text-gray-700">
                                {category?.title_en || ''}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface SearchWrapperProps {
    contractList: ClauseItem[];
    setData: React.Dispatch<React.SetStateAction<any>>;
    title?: string;
}

/**
 * 조항 검색 래퍼 컴포넌트
 */
export const ClauseSearchWrapper: React.FC<SearchWrapperProps> = ({
    contractList,
    setData,
    title = '클립이 제공하는 조항 라이브러리입니다'
}) => {
    return (
        <section className="mt-6 flex flex-col px-[10vw] py-4">
            <aside className="mx-auto flex w-fit items-center gap-x-2 text-2xl">
                <h2 className="text-xl font-semibold">{title}</h2>
            </aside>
            <ClauseSearchInput setData={setData} />
        </section>
    );
};

export default ClauseSearchInput; 