import React, { FC, useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRegExp } from 'korean-regexp'
import { ArticleContext, AssetContext, ClauseItem } from './context'
import { SessionContext } from '../../App'
import axios from 'axios'

/**
 * 검색 입력 컴포넌트
 */
interface SearchInputProps {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    searchType: string
    setSearchType: React.Dispatch<React.SetStateAction<string>>
}

const SearchInput: FC<SearchInputProps> = ({ searchTerm: initialSearchTerm, setSearchTerm: parentSetSearchTerm, searchType, setSearchType }) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm || '')
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [showResults, setShowResults] = useState<boolean>(false) // 검색 결과 표시 여부
    const { clauseList } = useContext(ArticleContext)
    const { contractAsset } = useContext(SessionContext)
    const { setSidebarData, setShowSidebar } = useContext(AssetContext)

    // 검색 인풋과 결과 컨테이너에 대한 ref
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // 컴포넌트 마운트 시 데이터 로드
    const [contractList, setContractList] = useState<any[]>([])

    useEffect(() => {
        if (contractAsset && contractAsset.length > 0) {
            setContractList(contractAsset)
        } else {
            // 필요시 데이터 가져오기
            console.log("또 fetchContractList")
            fetchContractList().then(data => {
                if (data && data.items) {
                    setContractList(data.items)
                }
            }).catch(err => console.error('계약서 목록 로딩 실패:', err))
        }
    }, [contractAsset])

    // 검색어가 변경될 때마다 자동으로 검색 결과 업데이트 및 검색 결과 표시
    useEffect(() => {
        if (searchTerm.length === 0) {
            setSearchResult([])
            return
        }

        let filteredList: any[] = []

        console.log('검색 실행:', searchTerm, searchType)
        if (searchType === 'contract') {
            filteredList = runSearch(searchTerm)
        }
        if (searchType === 'article') {
            filteredList = runClauseSearch(searchTerm)
        }

        console.log('검색 결과:', filteredList.length, '개')
        setSearchResult(filteredList)

        // 검색어가 있고 결과가 하나 이상 있을 때만 결과 표시
        if (searchTerm.length > 0 && filteredList.length > 0) {
            setShowResults(true)
        }
    }, [searchTerm, searchType, contractList, clauseList])

    // 외부 클릭 감지 - 검색 결과 외부 클릭 시 결과 숨김
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        // 이벤트 리스너 등록
        document.addEventListener('mousedown', handleClickOutside)

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // 검색 인풋 클릭 시 결과 다시 표시
    const handleInputClick = () => {
        if (searchTerm.length > 0 && searchResult.length > 0) {
            setShowResults(true)
        }
    }

    // 검색 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('폼 제출 - 검색 실행:', searchTerm, searchType)
        // 부모 컴포넌트에 검색어 상태 업데이트
        parentSetSearchTerm(searchTerm)
    }

    function resetSearch(newType: string) {
        setSearchTerm('')
        parentSetSearchTerm('')
        setSearchResult([])
        setShowResults(false)
        setSearchType(newType)
    }

    // 계약서 검색 실행
    function runSearch(term: string) {
        if (!term || !contractList || contractList.length === 0) return []

        try {
            const regex = getRegExp(term)
            return contractList.filter(contract =>
                regex.test(contract.title) ||
                regex.test(contract.partyA) ||
                regex.test(contract.partyB) ||
                regex.test(contract.industry || '') ||
                regex.test(contract.purpose)
            )
        } catch (e) {
            console.error('검색 오류:', e)
            return []
        }
    }

    // 조항 검색 실행
    function runClauseSearch(term: string) {
        if (!term || !clauseList) return []

        try {
            const regex = getRegExp(term)
            return clauseList.filter((clause: ClauseItem) =>
                regex.test(clause.clause_title) ||
                regex.test(clause.content_array?.[0]?.html || '')
            )
        } catch (e) {
            console.error('조항 검색 오류:', e)
            return []
        }
    }

    // 데이터 가져오기 함수 - 계약서 목록
    const fetchContractList = async () => {
        try {
            const response = await axios.get('https://conan.ai/_functions/clibContractList');
            const data = response.data;
            console.log('계약서 목록 API 응답:', data);
            return data;
        } catch (error) {
            console.error('계약서 목록을 가져오는 중 오류 발생:', error);
            throw error;
        }
    };

    // 검색 결과 항목 클릭 핸들러
    const handleResultClick = (resultObj: any) => {
        // 검색 결과 숨기기
        setShowResults(false);

        if (searchType === 'contract') {
            // 계약서 검색인 경우 해당 링크로 이동
            navigate(`/search/${resultObj.id}`);
        } else if (searchType === 'article') {
            // 조항 검색인 경우 사이드바 데이터 설정
            setSidebarData(resultObj);
        }
    };

    return (
        <>
            <div ref={searchContainerRef} className="mx-auto mt-6 flex w-[560px] flex-col relative">
                <form
                    onSubmit={handleSubmit}
                    className="flex"
                >
                    <div className="relative w-full">
                        {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div> */}
                        <input
                            ref={searchInputRef}
                            type="text"
                            id="search"
                            className="block w-full rounded-lg border border-fuchsia-100 bg-fuchsia-50/30 p-2.5 ps-5 text-sm text-gray-900 hover:border-fuchsia-200 hover:bg-white focus:border-fuchsia-300 focus:ring-blue-200"
                            placeholder={searchType === 'contract' ? '검색어를 입력하세요.' : '검색어를 입력하세요.'}
                            required
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={handleInputClick}
                        />
                        {searchTerm && (
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => {
                                    setSearchTerm('')
                                    parentSetSearchTerm('')
                                    setSearchResult([])
                                    setShowResults(false)
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="#6A7280"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* <div className="flex mt-5 gap-x-4 absolute -top-10 right-0">
                        <div
                            className={`flex cursor-pointer items-center gap-x-2 text-xs ${searchType === 'article' ? 'text-[#5766CB] font-bold' : 'text-gray-500'}`}
                            onClick={() => resetSearch('article')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="pointer-events-none">조항 검색</p>
                        </div>

                        <div
                            className={`flex cursor-pointer items-center gap-x-2 text-xs ${searchType === 'contract' ? 'text-[#F24E1E] font-bold' : 'text-gray-500'}`}
                            onClick={() => resetSearch('contract')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                                    clipRule="evenodd"
                                />
                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                            </svg>
                            <p className="pointer-events-none">계약서 검색</p>
                        </div>
                    </div> */}
                </form>

                {searchResult.length > 0 && showResults && (
                    <div className="absolute z-50 w-full flex flex-col rounded bg-gray-100 shadow-sm top-[50px]">
                        {/* 스크롤 가능한 결과 컨테이너 */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {searchResult.map((resultObj, index) => {
                                let matchingTerm, additionalInfo;

                                // 1. 계약서 제목 검색
                                if (searchType === 'contract') {
                                    matchingTerm = resultObj.title.replace(
                                        searchTerm,
                                        `<span class="font-bold text-blue-800">${searchTerm}</span>`
                                    );
                                    additionalInfo = `<p>${resultObj.source || resultObj.contract_title || '표준계약서'}</p>`;
                                    return (
                                        <a
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleResultClick(resultObj);
                                            }}
                                            className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
                                        >
                                            <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: additionalInfo }}
                                                className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"
                                            ></div>
                                        </a>
                                    );
                                } else if (searchType === 'article') {
                                    matchingTerm = resultObj.clause_title.replace(
                                        searchTerm,
                                        `<span class="font-bold text-blue-800">${searchTerm}</span>`
                                    );
                                    additionalInfo = `<p>${resultObj.contract_title || '표준계약서'}</p>`;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleResultClick(resultObj)}
                                            className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
                                        >
                                            <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: additionalInfo }}
                                                className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"
                                            ></div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* 결과 개수 표시 */}
                        <div className="border-t border-gray-200 bg-white py-2 text-center text-xs text-gray-500">
                            총 {searchResult.length}개 검색 결과
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchInput; 