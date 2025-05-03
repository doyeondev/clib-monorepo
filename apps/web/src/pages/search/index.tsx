import React, { FC, useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import axios from 'axios'
import { SessionContext } from '../../App'
import Layout from '../../components/layout/Layout'
import Spinner from '../../components/feedback/Spinner'
import SidePanel from '../../components/search/Sidepanel'
import ArticleList from '../../components/search/ArticleList'
import ContractList from '../../components/search/ContractList'
import SearchContainerWrapper from '../../components/search/SearchContainerWrapper'
import DashboardFooter from '../../components/search/DashboardFooter'
import { getClauseAssets } from '../../api/clib'
import LoadingOrError from '../../components/feedback/LoadingOrError'
import { queryClient } from '../../lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { ArticleContext, AssetContext, ClauseItem } from '../../components/search/context'

// 루트 컴포넌트
const QueryWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Search />
        </QueryClientProvider>
    );
};

/**
 * 조항 검색 페이지 컴포넌트
 */
const Search: FC = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const { contractAsset } = useContext(SessionContext)

    // SidePanel 관련 상태
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [clickedItem, setClickedItem] = useState<any>([])
    const [itemData, setItemData] = useState<any>([])

    // 컴포넌트 마운트 시 contractAsset 확인
    useEffect(() => {
        console.log('[Search] SessionContext의 contractAsset:', contractAsset);
        console.log('[Search] contractAsset 길이:', contractAsset?.length || 0);
        if (contractAsset && contractAsset.length > 0) {
            console.log('[Search] contractAsset 첫 번째 항목:', {
                id: contractAsset[0].id,
                title: contractAsset[0].title
            });
        } else {
            console.log('[Search] contractAsset이 비어있거나 초기화되지 않았습니다.');
        }
    }, [contractAsset]);

    // 데이터 가져오기
    useEffect(() => {
        async function fetchData() {
            try {
                console.log('[Search] 데이터 로딩 시작...')

                // 새로운 API 엔드포인트 사용
                const clauseAssetData = await getClauseAssets()

                console.log('[Search] API에서 받은 계약서 조항 데이터:', clauseAssetData.items)

                if (clauseAssetData) {
                    setData(clauseAssetData.items)
                    console.log('[Search] contractAsset에 데이터 설정 로직 필요');
                }

                setLoading(false)
            } catch (err) {
                console.error('[Search] 데이터를 가져오는 중 오류 발생:', err)
                setError(err as Error)
                setLoading(false)
            }
        }

        fetchData()

        // 세션 스토리지 아이템 삭제
        if (typeof window !== 'undefined' && sessionStorage.getItem('item_key')) {
            sessionStorage.removeItem('item_key') // 계약 키 세션 삭제
        }
    }, [])

    return (
        <Layout>
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-auto">
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center m-8">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="m-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            데이터를 불러오는 중 오류가 발생했습니다: {error.message}
                        </div>
                    ) : (
                        <AssetContext.Provider
                            value={{
                                data,
                                showSidebar,
                                setShowSidebar,
                                clickedItem,
                                setClickedItem,
                                itemData,
                                setItemData,
                                setSidebarData: (item: any) => {
                                    console.log('검색 결과 항목 클릭됨:', JSON.stringify(item));

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

                                    // 클릭된 아이템 상태 업데이트
                                    setClickedItem(item);

                                    // contractAsset에서 계약서 찾기
                                    if (contractAsset && contractAsset.length > 0) {
                                        // 계약서 찾기
                                        const match = contractAsset.filter((x: any) => x.id === item.contract_asset);
                                        console.log('일치하는 계약서:', match);

                                        if (match && match.length > 0) {
                                            // 원본 계약서 데이터를 사용하면서, 클릭한 조항의 인덱스를 설정
                                            const updatedMatch = { ...match[0] };

                                            // 추출한 인덱스 명시적으로 설정
                                            if (clauseIndex >= 1) {
                                                updatedMatch.cIdx = clauseIndex;
                                                updatedMatch.clause_index = clauseIndex;
                                            }

                                            setItemData(updatedMatch);
                                        }
                                    }

                                    // 사이드바 표시
                                    setShowSidebar(true);
                                }
                            }}
                        >
                            <MainLayout contractList={data?.items || []} />
                            {showSidebar && (
                                <SidePanel
                                    data={itemData}
                                    clickedItem={clickedItem}
                                    showSidebar={showSidebar}
                                    setShowSidebar={setShowSidebar}
                                />
                            )}
                        </AssetContext.Provider>
                    )}
                </div>
            </div>
        </Layout>
    );
};

interface MainLayoutProps {
    contractList: any[]
}

/**
 * 메인 레이아웃 컴포넌트
 * @param {MainLayoutProps} props - 계약서 목록
 * @returns {JSX.Element} 레이아웃 컴포넌트
 */
const MainLayout: FC<MainLayoutProps> = ({ contractList }) => {
    let { data, showSidebar, setShowSidebar, clickedItem, setClickedItem, itemData, setItemData } = useContext(AssetContext)
    let clauseAsset = data
    const [clauseList, setClauseList] = useState<ClauseItem[]>([])

    const [searchType, setSearchType] = useState('contract')
    const [currentData, setCurrentData] = useState<any[]>([])

    const [articleData, setArticleData] = useState<any[]>([])
    const [articleGroup, setArticleGroup] = useState<any[][]>([])

    // 페이지네이션 관련
    const [contractGroup, setContractGroup] = useState<any[][]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [maxIndex, setMaxIndex] = useState(0)

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

    // 검색 타입에 따른 데이터 설정
    useEffect(() => {
        console.log('searchType', searchType)
        if (searchType === 'contract') {
            setCurrentData(contractGroup)
            setMaxIndex(contractGroup.length - 1)
        } else if (searchType === 'article') {
            setCurrentData(articleGroup)
            setMaxIndex(articleGroup.length - 1)
        }
    }, [searchType, contractGroup, articleGroup])

    // 컴포넌트 마운트 시 데이터 초기화
    useEffect(() => {
        setCurrentIndex(0)
        console.log('from useEffect', clauseAsset)
        setClauseList(clauseAsset ?? [])
        setSearchType('article')

        // 데이터 청크 생성
        setContractGroup(_.chunk(contractList, 5))
        setArticleGroup(_.chunk(clauseAsset, 5))
        setCurrentData(_.chunk(clauseAsset, 5))
        setMaxIndex(_.chunk(clauseAsset, 5).length - 1)
        console.log('_.chunk(clauseAsset, 5)', _.chunk(clauseAsset, 5))
    }, [contractList, clauseAsset])

    // 검색 타입에 따른 렌더링
    if (searchType === 'contract') {
        return (
            contractGroup.map((elem, index) => {
                if (currentIndex === index) {
                    return (
                        <div key={index}>
                            <SearchContainerWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
                            <ContractList contractList={elem} />
                            <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
                        </div>
                    )
                }
            })
        )
    } else if (searchType === 'article') {
        return (
            <ArticleContext.Provider value={{ articleData, clauseList }}>
                <div className="bg-white">
                    <SearchContainerWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
                    <ArticleList
                        contractList={contractList}
                        articleGroup={articleGroup}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        maxIndex={maxIndex}
                    />
                </div>
            </ArticleContext.Provider>
        )
    }

    return null;
}

export default Search; 