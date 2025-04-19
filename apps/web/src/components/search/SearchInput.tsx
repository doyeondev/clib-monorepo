// import React, { useState, useRef, useContext, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { getRegExp } from 'korean-regexp'
// import { ArticleContext, AssetContext, SessionContext } from '../../App'
// import { getContractList } from '../../api/clib'
// import SearchResult from './SearchResult'

// interface SearchInputProps {
//     searchTerm: string
//     setSearchTerm: React.Dispatch<React.SetStateAction<string>>
//     searchType: string
//     setSearchType: React.Dispatch<React.SetStateAction<string>>
// }

// /**
//  * 검색 입력 컴포넌트
//  * - 검색어 입력 및 검색 타입(계약서/조항) 선택 기능
//  * - 실시간 검색 결과 표시
//  * - 검색 결과 외부 클릭 시 결과 숨김 처리
//  */
// const SearchInput: React.FC<SearchInputProps> = ({ searchTerm: initialSearchTerm, setSearchTerm: parentSetSearchTerm, searchType, setSearchType }) => {
//     const navigate = useNavigate()
//     const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm || '')
//     const [searchResult, setSearchResult] = useState<any[]>([])
//     const [showResults, setShowResults] = useState<boolean>(false)
//     const { clauseList } = useContext(ArticleContext)
//     const { contractAsset } = useContext(SessionContext)
//     const { setSidebarData } = useContext(AssetContext)

//     const searchContainerRef = useRef<HTMLDivElement>(null)
//     const searchInputRef = useRef<HTMLInputElement>(null)
//     const [contractList, setContractList] = useState<any[]>([])

//     // 계약서 목록 데이터 로드
//     useEffect(() => {
//         if (contractAsset && contractAsset.length > 0) {
//             setContractList(contractAsset)
//         } else {
//             getContractList().then((data: any) => {
//                 if (data && data.items) {
//                     setContractList(data.items)
//                 }
//             }).catch((err: Error) => console.error('계약서 목록 로딩 실패:', err))
//         }
//     }, [contractAsset])

//     // 검색어 변경 시 검색 결과 업데이트
//     useEffect(() => {
//         if (searchTerm.length === 0) {
//             setSearchResult([])
//             return
//         }

//         let filteredList: any[] = []
//         console.log('검색 실행:', searchTerm, searchType)

//         if (searchType === 'contract') {
//             filteredList = runSearch(searchTerm)
//         }
//         if (searchType === 'article') {
//             filteredList = runClauseSearch(searchTerm)
//         }

//         console.log('검색 결과:', filteredList.length, '개')
//         setSearchResult(filteredList)

//         if (searchTerm.length > 0 && filteredList.length > 0) {
//             setShowResults(true)
//         }
//     }, [searchTerm, searchType, contractList, clauseList])

//     // 외부 클릭 감지
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
//                 setShowResults(false)
//             }
//         }

//         document.addEventListener('mousedown', handleClickOutside)
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside)
//         }
//     }, [])

//     const handleInputClick = () => {
//         if (searchTerm.length > 0 && searchResult.length > 0) {
//             setShowResults(true)
//         }
//     }

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         console.log('폼 제출 - 검색 실행:', searchTerm, searchType)
//         parentSetSearchTerm(searchTerm)
//     }

//     function resetSearch(newType: string) {
//         setSearchTerm('')
//         parentSetSearchTerm('')
//         setSearchResult([])
//         setShowResults(false)
//         setSearchType(newType)
//     }

//     // 계약서 검색 실행
//     function runSearch(term: string) {
//         if (!term || !contractList || contractList.length === 0) return []

//         try {
//             const regex = getRegExp(term)
//             return contractList.filter(contract =>
//                 regex.test(contract.title) ||
//                 regex.test(contract.partyA) ||
//                 regex.test(contract.partyB) ||
//                 regex.test(contract.industry || '') ||
//                 regex.test(contract.purpose)
//             )
//         } catch (e) {
//             console.error('검색 오류:', e)
//             return []
//         }
//     }

//     // 조항 검색 실행
//     function runClauseSearch(term: string) {
//         if (!term || !clauseList) return []

//         try {
//             const regex = getRegExp(term)
//             return clauseList.filter((clause: any) =>
//                 regex.test(clause.clause_title) ||
//                 regex.test(clause.content_array?.[0]?.html || '')
//             )
//         } catch (e) {
//             console.error('조항 검색 오류:', e)
//             return []
//         }
//     }

//     return (
//         <div ref={searchContainerRef} className="mx-auto mt-6 flex w-[560px] flex-col relative">
//             <form className="flex w-full flex-col" onSubmit={handleSubmit}>
//                 <label htmlFor="search" className="sr-only">
//                     Search
//                 </label>
//                 <div className="flex w-full">
//                     <div className="relative w-full">
//                         <div className="flex space-x-4 py-3 text-xs font-semibold">
//                             <div
//                                 onClick={() => resetSearch('contract')}
//                                 className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'contract' ? 'bg-gray-200/70' : 'bg-white'}`}
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F53" className="pointer-events-none h-5 w-5">
//                                     <path
//                                         fillRule="evenodd"
//                                         d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
//                                         clipRule="evenodd"
//                                     />
//                                     <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
//                                 </svg>
//                                 <p className="pointer-events-none">제목검색</p>
//                             </div>
//                             <div
//                                 onClick={() => resetSearch('article')}
//                                 className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'article' ? 'bg-gray-200/70' : 'bg-white'}`}
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="pointer-events-none h-5 w-5">
//                                     <path
//                                         fillRule="evenodd"
//                                         d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
//                                         clipRule="evenodd"
//                                     />
//                                 </svg>
//                                 <p className="pointer-events-none">조항검색</p>
//                             </div>
//                         </div>
//                         <div className="mt-4 flex">
//                             <div className="relative w-full">
//                                 <input
//                                     ref={searchInputRef}
//                                     type="text"
//                                     id="search"
//                                     value={searchTerm}
//                                     className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-5 text-sm text-gray-900 hover:bg-gray-100 focus:border-none focus:ring-blue-500"
//                                     placeholder="검색어를 입력하세요"
//                                     onChange={(e) => {
//                                         setSearchTerm(e.target.value)
//                                         parentSetSearchTerm(e.target.value)
//                                     }}
//                                     onClick={handleInputClick}
//                                     required
//                                 />
//                                 {searchTerm.length > 0 && (
//                                     <button
//                                         onClick={() => {
//                                             setSearchTerm('')
//                                             parentSetSearchTerm('')
//                                             setShowResults(false)
//                                         }}
//                                         type="button"
//                                         className="absolute inset-y-0 end-0 flex items-center pe-3"
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             strokeWidth="2"
//                                             stroke="#6A7280"
//                                             className="pointer-events-none h-5 w-5"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                             />
//                                         </svg>
//                                     </button>
//                                 )}
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="ms-2 inline-flex items-center rounded-lg border border-blue-700 bg-blue-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
//                             >
//                                 <svg className="me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//                                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
//                                 </svg>
//                                 Search
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </form>

//             {searchResult.length > 0 && showResults && <SearchResult searchResult={searchResult} searchTerm={searchTerm} searchType={searchType} />}
//         </div>
//     )
// }

// export default SearchInput 