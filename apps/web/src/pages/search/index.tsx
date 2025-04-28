import React, { FC, useEffect, useState, createContext, useContext, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getRegExp } from 'korean-regexp'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { SessionContext } from '../../App'
import Layout from '../../components/layoutDemo'
import Spinner from '../../components/clib/Spinner'
import SidePanel from '../../components/clib/Sidepanel'
import { getClauseAssets } from '../../api/clib'

// 아티클(조항) 타입 정의
interface ArticleTypes {
    docId: string;
    contract_name?: string;
    clause_title?: string;
    clause_content?: string;
    cIdx?: number;
    party_a?: string;
    party_b?: string;
    industry_name?: string;
    purpose?: string;
    fileURL?: string;
}

// 타입 정의
interface ContractDetailType {
    url: string;
    clauseArray: { idx: number; text: string }[];
    contentArray: { tag: string; idx: number; text: string; html: string }[][];
}

// Context 타입 정의
interface ClauseItem {
    id: string;
    clause_title: string;
    contract_title?: string;
    contract_asset?: string;
    partyA?: string;
    partyB?: string;
    industry?: string;
    content_array: Array<{ html: string }>;
}

type ArticleContextType = {
    articleData: any[];
    clauseList: ClauseItem[];
};

// 에셋 컨텍스트 타입 정의
interface AssetContextType {
    data: any;
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    clickedItem: any;
    setClickedItem: (item: any) => void;
    itemData: any;
    setItemData: (data: any) => void;
    setSidebarData: (item: any) => void;
}

// Context 생성
const ArticleContext = createContext<ArticleContextType>({
    articleData: [],
    clauseList: [],
});

const AssetContext = createContext<AssetContextType>({
    data: null,
    showSidebar: false,
    setShowSidebar: () => { },
    clickedItem: null,
    setClickedItem: () => { },
    itemData: null,
    setItemData: () => { },
    setSidebarData: () => { },
});

/**
 * 데이터 가져오기 함수 - 계약서 조항 데이터
 * @deprecated 대신 getClauseAssets 함수 사용
 */
const fetchClauseAsset = async () => {
    try {
        const response = await axios.get('https://conan.ai/_functions/clibClauseAsset')
        console.log('계약서 조항 API 응답:', response.data)
        return response.data
    } catch (error) {
        console.error('계약서 조항 데이터를 가져오는 중 오류 발생:', error)
        throw error
    }
}

/**
 * 데이터 가져오기 함수 - 계약서 목록
 */
const fetchContractList = async () => {
    try {
        const response = await axios.get('https://conan.ai/_functions/clibContractList');
        console.log('계약서 목록 API 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('계약서 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
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

                // 기존 API 엔드포인트 사용 (주석 처리)
                // const clauseAssetData = await fetchClauseAsset()

                // 새로운 API 엔드포인트 사용
                const clauseAssetData = await getClauseAssets()

                console.log('[Search] API에서 받은 계약서 조항 데이터:', clauseAssetData.items)

                if (clauseAssetData) {
                    setData(clauseAssetData.items)

                    // 여기서 contractAsset에도 데이터 설정 필요
                    // 참고: SessionContext의 contractAsset은 useState로 관리되므로 직접 접근 불가
                    // setContractAsset 함수가 있다면 사용할 수 있지만, 현재 코드에서는 접근할 수 없음
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
    )
}

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
    // let { items: clauseAsset } = data || {}
    // console.log('data', data)
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
            <div className="bg-white">
                {contractGroup.map((elem, index) => {
                    if (currentIndex === index) {
                        return (
                            <div key={index}>
                                <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
                                <ContractList contractList={elem} />
                                <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
                            </div>
                        )
                    }
                    return null
                })}
            </div>
        )
    } else if (searchType === 'article') {
        return (
            <ArticleContext.Provider value={{ articleData, clauseList }}>
                <div className="bg-white">
                    <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
                    <ArticleList
                        contractList={contractList}
                        articleGroup={articleGroup}
                        setCurrentIndex={setCurrentIndex}
                        currentIndex={currentIndex}
                        maxIndex={maxIndex}
                    />
                </div>
            </ArticleContext.Provider>
        )
    }

    return null
}

/**
 * 계약서 목록 컴포넌트
 */
interface ContractListProps {
    contractList: any[]
}

const ContractList: FC<ContractListProps> = ({ contractList }) => {
    return (
        <main className="mx-auto w-[920px] px-[10vw] py-6">
            {contractList.map((item) => (
                <div key={item.id} className="mt-4 flex w-full border-b pb-4">
                    <div className="h-auto w-5 flex-none grow border-l-4 border-[#0f4a86]"></div>
                    <div className="flex w-full grow flex-col space-y-4 border-gray-300 text-sm">
                        <Link to={`/search/${item.id}`} className="group flex flex-col">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="grow text-base font-bold tracking-wide text-[#0675ac] hover:text-[#0675ac] group-hover:underline">{item.title}</div>
                                <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">{item.contract_title}</div>
                            </div>
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
                        </Link>
                        <div className="flex flex-col text-[13px]">
                            <p className="text-gray-500">계약의 목적</p>
                            <p className="line-clamp-2 text-gray-800">{item.purpose}</p>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    )
}

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
    const { showSidebar, setShowSidebar, setClickedItem, setItemData } = useContext(AssetContext)
    const { clauseList } = useContext(ArticleContext)
    const { contractAsset } = useContext(SessionContext)

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
    const handleClauseClick = (item: any) => {
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
            <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
        </main>
    )
}

/**
 * 페이지네이션 푸터 컴포넌트
 */
interface DashboardFooterProps {
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
    currentIndex: number
    maxIndex: number
}

const DashboardFooter: FC<DashboardFooterProps> = ({ onClickHandler, currentIndex, maxIndex }) => {
    return (
        <>
            <div className="mx-auto flex items-center justify-between py-6">
                <button
                    id="btnPrevious"
                    data-name="paginationBtn"
                    onClick={onClickHandler}
                    className="flex w-[130px] cursor-pointer place-content-center gap-x-2 rounded-md border bg-white py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none h-5 w-5 rtl:-scale-x-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>
                    이전
                </button>
                <div className="items-center gap-x-3 lg:flex">
                    <FooterPagination currentIndex={currentIndex} maxIndex={maxIndex} onClickHandler={onClickHandler} />
                </div>

                <button
                    id="btnNext"
                    data-name="paginationBtn"
                    onClick={onClickHandler}
                    className="flex w-[130px] cursor-pointer place-content-center gap-x-2 rounded-md border bg-white py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    다음
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none h-5 w-5 rtl:-scale-x-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                </button>
            </div>
        </>
    )
}

/**
 * 푸터 페이지네이션 컴포넌트
 */
interface FooterPaginationProps {
    currentIndex: number
    maxIndex: number
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
}

const FooterPagination: FC<FooterPaginationProps> = ({ currentIndex, maxIndex, onClickHandler }) => {
    const pagination = []

    for (let i = 0; i <= maxIndex; i++) {
        if (i === currentIndex) {
            pagination.push(
                <button
                    id={i.toString()}
                    onClick={onClickHandler}
                    className="rounded-md bg-blue-100/60 px-2 py-1 text-sm text-blue-500 dark:bg-gray-800"
                    key={uuidv4()}
                    data-name="paginationNum"
                >
                    {i + 1}
                </button>
            )
        } else {
            pagination.push(
                <button
                    id={i.toString()}
                    onClick={onClickHandler}
                    className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    key={uuidv4()}
                    data-name="paginationNum"
                >
                    {i + 1}
                </button>
            )
        }
    }

    return <>{pagination}</>
}

/**
 * 검색 래퍼 컴포넌트
 */
interface SearchWrapperProps {
    contractList: any[]
    searchType: string
    setSearchType: React.Dispatch<React.SetStateAction<string>>
}

const SearchWrapper: FC<SearchWrapperProps> = ({ contractList, searchType, setSearchType }) => {
    return (
        <section className="mt-6 flex flex-col px-[10vw] py-6">
            <aside className="mx-auto flex w-fit items-center gap-x-2 text-xl">
                {searchType === 'contract' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F53" className="mr-1 h-6 w-6">
                        <path
                            fillRule="evenodd"
                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                            clipRule="evenodd"
                        />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="mr-1 h-6 w-6">
                        <path
                            fillRule="evenodd"
                            d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
                <h2 className="font-semibold">{searchType === 'contract' ? '어떤 계약서 양식이 필요하신가요?' : '계약서 조항을 검색하세요!'}</h2>
            </aside>
            <SearchInput searchTerm={''} setSearchTerm={() => { }} searchType={searchType} setSearchType={setSearchType} />
        </section>
    )
}

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
    const { setSidebarData } = useContext(AssetContext)

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
            return clauseList.filter(clause =>
                regex.test(clause.clause_title) ||
                regex.test(clause.content_array?.[0]?.html || '')
            )
        } catch (e) {
            console.error('조항 검색 오류:', e)
            return []
        }
    }

    return (
        <>
            <div ref={searchContainerRef} className="mx-auto mt-6 flex w-[560px] flex-col relative">
                <form className="flex w-full flex-col" onSubmit={handleSubmit}>
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <div className="flex w-full">
                        <div className="relative w-full">
                            <div className="flex space-x-4 py-3 text-xs font-semibold">
                                <div
                                    onClick={() => resetSearch('contract')}
                                    className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'contract' ? 'bg-gray-200/70' : 'bg-white'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F53" className="pointer-events-none h-5 w-5">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                                            clipRule="evenodd"
                                        />
                                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                    </svg>
                                    <p className="pointer-events-none">제목검색</p>
                                </div>
                                <div
                                    onClick={() => resetSearch('article')}
                                    className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'article' ? 'bg-gray-200/70' : 'bg-white'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="pointer-events-none h-5 w-5">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="pointer-events-none">조항검색</p>
                                </div>
                            </div>
                            <div className="mt-4 flex">
                                <div className="relative w-full">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        id="search"
                                        value={searchTerm}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-5 text-sm text-gray-900 hover:bg-gray-100 focus:border-none focus:ring-blue-500"
                                        placeholder="검색어를 입력하세요"
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            parentSetSearchTerm(e.target.value)
                                        }}
                                        onClick={handleInputClick}
                                        required
                                    />
                                    {searchTerm.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('')
                                                parentSetSearchTerm('')
                                                setShowResults(false)
                                            }}
                                            type="button"
                                            className="absolute inset-y-0 end-0 flex items-center pe-3"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="#6A7280"
                                                className="pointer-events-none h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="ms-2 inline-flex items-center rounded-lg border border-blue-700 bg-blue-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    <svg className="me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {searchResult.length > 0 && showResults && <SearchResult searchResult={searchResult} searchTerm={searchTerm} searchType={searchType} />}
            </div>
        </>
    )
}

/**
 * 검색 결과 컴포넌트
 */
interface SearchResultProps {
    searchResult: any[]
    searchTerm: string
    searchType: string
}

const SearchResult: FC<SearchResultProps> = ({ searchResult, searchTerm, searchType }) => {
    const { setSidebarData } = useContext(AssetContext);

    console.log('searchResult:', searchResult);

    // Search result 항목 클릭 시 조항 데이터 구조 로깅을 위한 함수
    const handleSearchItemClick = (resultObj: any) => {
        console.log('[SearchResult] 클릭된 검색 결과 항목:', resultObj);
        console.log('[SearchResult] 데이터 구조:', {
            'id': resultObj.id,
            'contract_asset': resultObj.contract_asset,
            'clause_title': resultObj.clause_title,
            'contract_title': resultObj.contract_title
        });
        setSidebarData(resultObj);
    };

    if (searchResult.length > 0) {
        return (
            <div className="absolute z-50 w-full flex flex-col rounded bg-gray-100 shadow-sm top-[120px]">
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
                                <Link
                                    key={index}
                                    to={`/search/${resultObj.id}`}
                                    className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
                                >
                                    <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: additionalInfo }}
                                        className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"
                                    ></div>
                                </Link>
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
                                    onClick={() => handleSearchItemClick(resultObj)}
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
        );
    }
    return null;
}

export default Search 