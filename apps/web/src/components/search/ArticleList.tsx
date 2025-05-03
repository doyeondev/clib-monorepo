import React, { FC, useContext } from 'react'
import { AssetContext, ArticleContext, ClauseItem } from './context'
import { SessionContext } from '../../App'

/**
 * 조항 목록 컴포넌트
 */
interface ArticleListProps {
    contractList: any[]
    articleGroup: any[][]
    currentIndex: number
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
    maxIndex: number
}

const ArticleList: FC<ArticleListProps> = ({ contractList, articleGroup, currentIndex, setCurrentIndex, maxIndex }) => {
    const { showSidebar, setShowSidebar, setClickedItem, setItemData, setSidebarData } = useContext(AssetContext);
    const { clauseList } = useContext(ArticleContext);
    const { contractAsset } = useContext(SessionContext);

    // 페이지네이션 클릭 처리
    const paginationOnClick = (e: React.MouseEvent<HTMLElement>) => {
        console.log('clicked - onClickHandler')
        const target = e.target as HTMLElement
        const btnId = target.id
        const type = target.getAttribute('data-name')

        console.log('btnId : ', btnId)
        console.log('currentIndex', currentIndex)
        console.log('maxIndex', maxIndex)

        if (btnId && type === 'paginationBtn') {
            if (btnId === 'btnNext' && currentIndex < maxIndex) {
                console.log('entered case 1')
                setCurrentIndex(currentIndex + 1)
            } else if (btnId === 'btnPrevious' && currentIndex > 0) {
                console.log('entered case 2')
                setCurrentIndex(currentIndex - 1)
            }
        }

        if (btnId && type === 'paginationNum') {
            setCurrentIndex(parseInt(btnId))
        }
    }

    // 조항 클릭 핸들러
    const handleClauseClick = (item: ClauseItem) => {
        console.log('조항 클릭됨 (전체 데이터):', item);

        // 조항 제목에서 인덱스 추출 (예: "제3조 계약제품의 거래" -> 3)
        let clauseIndex = -1;
        if (item.clause_title) {
            const match = item.clause_title.match(/제(\d+)조/);
            if (match && match[1]) {
                clauseIndex = parseInt(match[1]);
                console.log(`조항 제목에서 추출한 인덱스: ${clauseIndex}`);

                // 인덱스 정보 추가 (명시적으로 할당)
                item.cIdx = clauseIndex;
                item.clause_index = clauseIndex;
            }
        }

        console.log('조항 데이터 구조 (업데이트 후):', {
            'contract_asset': item.contract_asset,
            'id': item.id,
            'docId': item.docId,
            'cIdx': item.cIdx,
            'clause_index': item.clause_index,
            'clause_title': item.clause_title
        });

        // 1. 클릭된 아이템 상태 업데이트
        setClickedItem(item);

        // 2. contractAsset에서 계약서 찾기
        if (contractAsset && contractAsset.length > 0) {
            // 레거시 방식과 정확히 동일하게 구현: contract_asset으로 계약서 찾기
            const match = contractAsset.filter((x: any) => x.id === item.contract_asset);
            console.log('[Legacy Style] 일치하는 계약서:', match);

            // 3. 계약서를 찾은 경우, 원본 계약서 데이터를 그대로 사용
            if (match && match.length > 0) {
                // 중요: 원본 계약서 데이터를 사용하면서, 클릭한 조항의 인덱스를 설정
                const updatedMatch = { ...match[0] };

                // 추출한 인덱스 명시적으로 설정 (중요)
                if (clauseIndex >= 1) { // 1 이상만 유효하게 처리
                    updatedMatch.cIdx = clauseIndex;
                    updatedMatch.clause_index = clauseIndex;
                    console.log(`[Legacy Style] 설정된 조항 인덱스: ${clauseIndex}`);
                }

                // 레거시 방식과 동일: 업데이트된 계약서 데이터를 사용
                setItemData(updatedMatch);
            }
        }

        // 6. 사이드바 표시
        setShowSidebar(true);
    }

    return (
        <main className="mx-auto w-[920px] px-[10vw] py-6">
            {clauseList.map((item, index) => {
                // console.log('item', item)
                let CONTENT_HTML = ''
                for (let i = 0; i < item.content_array.length; i++) {
                    // console.log('contentList[i].html', item.content_array[i])
                    CONTENT_HTML = CONTENT_HTML.concat(item.content_array[i].html)
                }
                return (
                    <div key={index} className="mt-4 flex w-full border-b pb-4">
                        <div className="h-auto w-5 flex-none grow border-l-4 border-gray-500"></div>
                        <div className="flex w-full grow flex-col text-sm">
                            <div className="flex flex-col">
                                <div onClick={() => handleClauseClick(item)} className="group flex cursor-pointer items-center justify-between pb-4">
                                    <div className="mr-1 grow text-base font-bold tracking-wide text-black group-hover:text-gray-700 group-hover:underline">{item.clause_title}</div>
                                    <div className="rounded bg-slate-100 px-2 py-0.5 text-xs text-gray-500 group-hover:visible">From: {item.contract_title}</div>
                                </div>
                                <div className="flex flex-col text-[13px] leading-relaxed">
                                    <p className="w-fit font-medium text-gray-500">본문 내용</p>
                                    <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} className="text-gray-900"></div>
                                </div>
                            </div>
                            <div className="my-4 w-full border-b-2 border-dotted"></div>
                            <div className="flex justify-between text-[13px]">
                                <div className="flex flex-col">
                                    <p className="text-gray-500">계약 당사자(갑)</p>
                                    <p className="text-gray-800">{item.partyA}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-500">계약 당사자(을)</p>
                                    <p className="text-gray-800">{item.partyB}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-500">산업</p>
                                    <p className="text-gray-800">{item.industry}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </main>
    )
}

export default ArticleList 