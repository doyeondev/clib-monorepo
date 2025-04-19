import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AssetContext } from '../../App'

interface SearchResultProps {
    searchResult: any[]
    searchTerm: string
    searchType: string
}

/**
 * 검색 결과 컴포넌트
 * - 검색 결과 목록 표시
 * - 계약서/조항 검색 결과 구분하여 표시
 * - 검색어 하이라이트 처리
 */
const SearchResult: React.FC<SearchResultProps> = ({ searchResult, searchTerm, searchType }) => {
    const { setSidebarData } = useContext(AssetContext)

    console.log('searchResult:', searchResult)

    // 검색 결과 항목 클릭 핸들러
    const handleSearchItemClick = (resultObj: any) => {
        console.log('[SearchResult] 클릭된 검색 결과 항목:', JSON.stringify(resultObj))
        console.log('[SearchResult] 데이터 구조:', {
            '_id': resultObj._id,
            'id': resultObj.id,
            'contract_asset': resultObj.contract_asset,
            'clause_title': resultObj.clause_title,
            'contract_title': resultObj.contract_title
        })
        setSidebarData(resultObj)
    }

    if (searchResult.length > 0) {
        return (
            <div className="absolute z-50 w-full flex flex-col rounded bg-gray-100 shadow-sm top-[120px]">
                {/* 스크롤 가능한 결과 컨테이너 */}
                <div className="max-h-[400px] overflow-y-auto">
                    {searchResult.map((resultObj, index) => {
                        let matchingTerm, additionalInfo

                        // 1. 계약서 제목 검색
                        if (searchType === 'contract') {
                            matchingTerm = resultObj.title.replace(
                                searchTerm,
                                `<span class="font-bold text-blue-800">${searchTerm}</span>`
                            )
                            additionalInfo = `<p>${resultObj.source || resultObj.contract_title || '표준계약서'}</p>`
                            return (
                                <Link
                                    key={index}
                                    to={`/search/${resultObj._id}`}
                                    className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
                                >
                                    <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: additionalInfo }}
                                        className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"
                                    ></div>
                                </Link>
                            )
                        } else if (searchType === 'article') {
                            matchingTerm = resultObj.clause_title.replace(
                                searchTerm,
                                `<span class="font-bold text-blue-800">${searchTerm}</span>`
                            )
                            additionalInfo = `<p>${resultObj.contract_title || '표준계약서'}</p>`
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSearchItemClick(resultObj)}
                                    className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
                                >
                                    <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: additionalInfo }}
                                        className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"
                                    ></div>
                                </div>
                            )
                        }
                        return null
                    })}
                </div>

                {/* 결과 개수 표시 */}
                <div className="border-t border-gray-200 bg-white py-2 text-center text-xs text-gray-500">
                    총 {searchResult.length}개 검색 결과
                </div>
            </div>
        )
    }
    return null
}

export default SearchResult 