import React, { useEffect, useState, createContext, useContext, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

// 컴포넌트 임포트
import { Loader } from '../../components/clib/Loader'
import Layout from '../../components/layoutDemo'
import DashboardFooter from '../../components/ui/Pagination'

// 유틸리티
import { getRegExp } from 'korean-regexp'
import _ from 'lodash'

// 스타일 및 UI 라이브러리
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'

// API 함수 임포트
import { getClibDataset, getClauseCategoryList } from '../../api/clib'

// 타입 정의
interface ClauseItem {
    _id: string
    clause_category: string
    title_ko: string
    title_en: string
    title?: string
    clause_title?: string
    content_ko: string
    content_en: string
    content?: string
    note?: string
    source?: string
    idx: number
    disabled?: boolean
    color?: string
}

interface CategoryItem {
    _id: string
    title: string
    title_en: string
    color: string
    idx: number
    assets?: ClauseItem[]
}

interface ToastDetail {
    id: string
    action: string
}

// 컨텍스트 생성
interface CategoryContextType {
    categoryList: CategoryItem[]
    currentCategory: any
    updateCategory: (e: MouseEvent) => void
    clickedCategory: string[]
}

interface ClipContextType {
    clippedItem: string[]
}

interface ArticleContextType {
    articleData: any[]
    clauseList: ClauseItem[]
}

interface SessionContextType {
    clippedClause: string[]
    onClipClick: (e: MouseEvent) => void
    toastDetail: ToastDetail
    toastState: boolean
    setToastState: React.Dispatch<React.SetStateAction<boolean>>
}

// 컨텍스트 초기화
const CategoryContext = createContext<CategoryContextType>({
    categoryList: [],
    currentCategory: [],
    updateCategory: () => { },
    clickedCategory: []
})

const ClipContext = createContext<ClipContextType>({
    clippedItem: []
})

const ArticleContext = createContext<ArticleContextType>({
    articleData: [],
    clauseList: []
})

const SessionContext = createContext<SessionContextType>({
    clippedClause: [],
    onClipClick: () => { },
    toastDetail: { id: '', action: '' },
    toastState: false,
    setToastState: () => { }
})

const Clause = () => {
    const [contractList, setContractList] = useState<ClauseItem[]>([])
    const [clauseList, setClauseList] = useState<ClauseItem[]>([])
    const [categoryList, setCategoryList] = useState<CategoryItem[]>([])
    const [categoryHolder, setCategoryHolder] = useState<CategoryItem[]>([])
    const [clickedCategory, setClickedCategory] = useState<string[]>([])
    const [currentCategory, setCurrentCategory] = useState<any>([])

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    // 클립 관련 상태
    const [clippedClause, setClippedClause] = useState<string[]>([])
    const [toastDetail, setToastDetail] = useState<ToastDetail>({ id: '', action: '' })
    const [toastState, setToastState] = useState<boolean>(false)

    // 페이지 제목 설정
    useEffect(() => {
        document.title = '클립 | 공유자산'
    }, [])

    // 세션 컨텍스트 값 설정
    const sessionContextValue: SessionContextType = {
        clippedClause,
        onClipClick: (e: MouseEvent) => {
            const clipId = (e.currentTarget as HTMLElement).id
            const actionType = clippedClause.includes(clipId) ? '삭제' : '추가'

            if (clippedClause.includes(clipId)) {
                setClippedClause(prev => prev.filter(id => id !== clipId))
            } else {
                setClippedClause(prev => [...prev, clipId])
            }

            // 토스트 표시
            setToastDetail({
                id: clipId,
                action: actionType
            })
            setToastState(true)

            // 토스트 자동 닫기
            setTimeout(() => {
                setToastState(false)
            }, 2000)
        },
        toastDetail,
        toastState,
        setToastState
    }

    useEffect(() => {
        async function getPageData() {
            try {
                setLoading(true);

                // 실제 API 호출로 변경
                console.log("[Clause] API 호출 시작...");
                const clip_clause = await getClibDataset();
                const clause_category = await getClauseCategoryList();

                console.log('clip_clause', clip_clause);
                console.log('clause_category', clause_category);

                // 데이터 확인 및 오류 처리
                if (!clip_clause || clip_clause.length === 0) {
                    console.warn("[Clause] 조항 데이터가 비어있습니다");
                }

                if (!clause_category || clause_category.length === 0) {
                    console.warn("[Clause] 카테고리 데이터가 비어있습니다");
                }

                // 데이터 처리
                const sortedClauseList = _.orderBy(
                    Array.isArray(clip_clause)
                        ? clip_clause.filter((x: any) => x.disabled !== true)
                        : [],
                    ['clause_category', 'idx'],
                    ['asc', 'asc']
                ) as ClauseItem[];

                setContractList(sortedClauseList);
                setClauseList(sortedClauseList);

                // 카테고리 데이터 설정
                if (Array.isArray(clause_category) && clause_category.length > 0) {
                    setCategoryHolder(clause_category);
                    setCurrentCategory(clause_category[0]);
                } else {
                    // 기본 카테고리 설정
                    const defaultCategory = [{
                        _id: 'default',
                        title: '기본 카테고리',
                        title_en: 'Default',
                        color: 'blue',
                        idx: 1
                    }];
                    setCategoryHolder(defaultCategory);
                    setCurrentCategory(defaultCategory[0]);
                }

                setLoading(false);
            } catch (err: any) {
                console.error('데이터 로딩 오류:', err);
                setError(err);
                setLoading(false);
            }
        }
        getPageData();
    }, []);

    useEffect(() => {
        if (clauseList.length > 0 && categoryHolder.length > 0) {
            let updatedCategoryList = [...categoryHolder]

            // 각 카테고리에 해당하는 조항 리스트 할당
            for (let i = 0; i < updatedCategoryList.length; i++) {
                const categoryItems = clauseList.filter(x => x.clause_category === updatedCategoryList[i]._id)
                updatedCategoryList[i].assets = categoryItems
                updatedCategoryList[i].color = updatedCategoryList[i].color || 'blue'
            }

            // '전체' 카테고리 추가
            const allCategory: CategoryItem = {
                assets: clauseList,
                title: '전체',
                color: 'blue',
                title_en: 'All',
                idx: 0,
                _id: 'allClauses'
            }

            if (updatedCategoryList[0]?._id !== 'allClauses') {
                updatedCategoryList.unshift(allCategory)
            }

            setCategoryList(updatedCategoryList)

            // 초기 선택된 카테고리 설정
            if (clickedCategory.length === 0) {
                setClickedCategory(['allClauses'])
            }
        }
    }, [clauseList, categoryHolder, clickedCategory.length])

    useEffect(() => {
        if (clauseList.length > 0) {
            if (clickedCategory.includes('clippedList')) {
                // 클립된 항목만 표시
                setContractList(clauseList.filter(x => clippedClause.includes(x._id)))
                setCurrentCategory('clippedList')
            } else if (clickedCategory.length < 1) {
                // 선택된 카테고리가 없으면 자동으로 전체 선택
                setClickedCategory(['allClauses'])
            } else if (clickedCategory.includes('allClauses')) {
                // 전체 카테고리 선택 시 모든 항목 표시
                setContractList(clauseList)
                setCurrentCategory(categoryList.filter(x => x._id === 'allClauses'))
            } else {
                // 선택된 카테고리에 해당하는 항목만 표시
                const newClauseList = clauseList.filter(x => clickedCategory.includes(x.clause_category))
                const newCategory = categoryList.filter(x => clickedCategory.includes(x._id))

                setContractList(newClauseList)
                setCurrentCategory(newCategory)
            }
        }
    }, [clickedCategory, clippedClause, clauseList, categoryList])

    const updateCategory = (e: MouseEvent) => {
        const clickedId = (e.target as HTMLElement).id
        const type = (e.target as HTMLElement).getAttribute('name')

        if (clickedId === 'clippedList') {
            if (currentCategory === 'clippedList') {
                setClickedCategory(prev => prev.filter(x => x === 'allClauses'))
            } else {
                setClickedCategory(['clippedList'])
            }
        } else {
            if (type === 'search') {
                if (!clickedCategory.includes('clippedList')) {
                    setClickedCategory([clickedId])
                }
            } else {
                // 1. 선택되지 않은 카테고리 클릭 시
                if (!clickedCategory.includes(clickedId)) {
                    // "전체선택이 눌려있는 상태"에서 다른 카테고리 선택
                    if (clickedCategory.includes('allClauses')) {
                        setClickedCategory(prev => [...prev.filter(x => x !== 'allClauses'), clickedId])
                    }
                    // "클립리스트가 눌려있는 상태"에서 다른 카테고리 선택
                    else if (clickedCategory.includes('clippedList')) {
                        setClickedCategory(prev => [...prev.filter(x => x !== 'clippedList'), clickedId])
                    }
                    // 일반 선택
                    else {
                        if (clickedId === 'allClauses') {
                            // "전체선택"이 눌린 경우 다른 선택 해제
                            setClickedCategory(['allClauses'])
                        } else {
                            // 다중 선택 추가
                            setClickedCategory(prev => [...prev, clickedId])
                        }
                    }
                }
                // 2. 이미 선택된 카테고리 클릭 시 (선택 해제)
                else {
                    setClickedCategory(prev => prev.filter(x => x !== clickedId))
                }
            }
        }
    }

    if (loading) return <Loader />
    if (error) return <div>오류가 발생했습니다: {error.message}</div>

    return (
        <Layout>
            <CategoryContext.Provider value={{ categoryList, currentCategory, updateCategory, clickedCategory }}>
                <ClipContext.Provider value={{ clippedItem: clippedClause }}>
                    <ArticleContext.Provider value={{ articleData: [], clauseList }}>
                        <SessionContext.Provider value={sessionContextValue}>
                            <MainLayout contractList={contractList} />
                        </SessionContext.Provider>
                    </ArticleContext.Provider>
                </ClipContext.Provider>
            </CategoryContext.Provider>
        </Layout>
    )
}

interface MainLayoutProps {
    contractList: ClauseItem[]
}

const MainLayout: React.FC<MainLayoutProps> = ({ contractList }) => {
    const [searchType, setSearchType] = useState<string>('contract')
    const [data, setData] = useState<any>([])
    const [articleGroup, setArticleGroup] = useState<any[]>([])

    // 페이지네이션 상태
    const [contractGroup, setContractGroup] = useState<ClauseItem[][]>([])
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [maxIndex, setMaxIndex] = useState<number>(0)

    useEffect(() => {
        if (searchType === 'contract') {
            setMaxIndex(contractGroup.length - 1)
        } else if (searchType === 'article') {
            setMaxIndex(articleGroup.length - 1)
        }
    }, [searchType, contractGroup.length, articleGroup.length])

    useEffect(() => {
        setCurrentIndex(0)
        setContractGroup(_.chunk(contractList, 5))
        setMaxIndex(_.chunk(contractList, 5).length - 1)
    }, [contractList])

    if (searchType === 'contract') {
        return (
            <>
                {contractGroup.map((elem, index) => {
                    if (currentIndex === index) {
                        return (
                            <div key={index} className="flex min-h-[calc(100vh-120px)] flex-col bg-white">
                                <SearchWrapper
                                    contractList={contractList}
                                    searchType={searchType}
                                    setSearchType={setSearchType}
                                    setData={setData}
                                />
                                <ContractList
                                    contractList={elem}
                                    setCurrentIndex={setCurrentIndex}
                                    currentIndex={currentIndex}
                                    maxIndex={maxIndex}
                                    data={data}
                                    setData={setData}
                                />
                            </div>
                        )
                    }
                    return null
                })}
            </>
        )
    } else if (searchType === 'article') {
        return (
            <div className="bg-white">
                <SearchWrapper
                    contractList={contractList}
                    searchType={searchType}
                    setSearchType={setSearchType}
                    setData={setData}
                />
                <ArticleList
                    contractList={contractList}
                    articleGroup={articleGroup}
                    setCurrentIndex={setCurrentIndex}
                    currentIndex={currentIndex}
                    maxIndex={maxIndex}
                    setData={setData}
                />
            </div>
        )
    }

    return null
}

interface ContractListProps {
    contractList: ClauseItem[]
    currentIndex: number
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
    maxIndex: number
    data: any
    setData: React.Dispatch<React.SetStateAction<any>>
}

const ContractList: React.FC<ContractListProps> = ({
    contractList,
    currentIndex,
    setCurrentIndex,
    maxIndex,
    data,
    setData
}) => {
    const { clippedClause, onClipClick, toastDetail, toastState } = useContext(SessionContext)
    const [clickedItem, setClickedItem] = useState<any[]>([])
    const { categoryList, currentCategory, updateCategory, clickedCategory } = useContext(CategoryContext)
    const { clauseList } = useContext(ArticleContext)

    const paginationOnClick = (e: React.MouseEvent<HTMLElement>) => {
        const btnId = (e.target as HTMLElement).id
        const type = (e.target as HTMLElement).getAttribute('name')

        if (btnId && type === 'paginationBtn') {
            if (btnId === 'btnNext' && currentIndex < maxIndex) {
                setCurrentIndex(currentIndex + 1)
            } else if (btnId === 'btnPrevious' && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1)
            }
        }

        if (btnId && type === 'paginationNum') {
            setCurrentIndex(parseInt(btnId))
        }
    }

    return (
        <>
            <main className="mx-auto flex w-[1100px] px-[5vw] py-6">
                {/* 카테고리 사이드바 */}
                <div className="mr-6 mt-4 flex h-fit w-[260px] flex-shrink-0 flex-col items-center rounded border border-dotted py-2">
                    <div className="mx-auto w-full space-y-2 px-2">
                        <div className="mb-1 px-1 text-sm font-medium text-gray-700">전체 조항 ({clauseList.length})</div>
                        {categoryList.map((elem, index) => (
                            <div
                                onClick={(e) => updateCategory(e)}
                                id={elem._id}
                                className={`mr-1.5 flex w-full cursor-pointer items-center rounded px-3 py-1 hover:bg-fuchsia-100/50 ${clickedCategory.includes(elem._id) ? 'bg-gray-100' : ''}`}
                                key={index}
                            >
                                <input
                                    readOnly
                                    type="checkbox"
                                    className="pointer-events-none mr-4 h-4 w-4 rounded border-gray-300 bg-gray-100 text-fuchsia-500"
                                    checked={clickedCategory.includes(elem._id)}
                                />
                                <p className={`pointer-events-none text-[13px] ${clickedCategory.includes(elem._id) ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                                    {elem.title} 조항 ({elem.assets?.length || 0})
                                </p>
                            </div>
                        ))}
                        <div
                            onClick={(e) => updateCategory(e)}
                            id="clippedList"
                            className={`mr-1.5 flex w-full cursor-pointer items-center rounded px-3 py-1 hover:bg-fuchsia-100/50 ${currentCategory === 'clippedList' ? 'bg-gray-100' : ''}`}
                        >
                            <input
                                readOnly
                                type="checkbox"
                                className="pointer-events-none mr-4 h-4 w-4 rounded border-gray-300 bg-gray-100 text-fuchsia-500"
                                checked={currentCategory === 'clippedList'}
                            />
                            <p className={`pointer-events-none text-[13px] ${currentCategory === 'clippedList' ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                                클립한 조항 ({clippedClause.length})
                            </p>
                        </div>
                    </div>
                </div>

                {/* 조항 리스트 */}
                <div className="flex flex-1 flex-col">
                    {_.orderBy(contractList, ['clause_category', 'idx'], ['asc', 'asc']).map((item, index) => {
                        const category = categoryList.find(x => x._id === item.clause_category)
                        const categoryColor = category?.color || 'blue'

                        // 색상 값을 가져오는 부분은 백엔드와 동기화가 필요합니다
                        // 임시로 하드코딩된 색상 값 사용
                        const bgColor = categoryColor === 'blue'
                            ? 'rgb(219, 234, 254)' // blue-100 색상
                            : categoryColor === 'purple'
                                ? 'rgb(243, 232, 255)' // purple-100 색상
                                : 'rgb(243, 244, 246)' // gray-100 기본값

                        return (
                            <div key={index} className="mt-5 flex w-full border-b pb-5">
                                <div className="h-auto w-5 flex-none grow border-l-4 border-gray-500"></div>
                                <div className="flex w-full grow flex-col text-sm">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between pb-1">
                                            <div style={{ backgroundColor: bgColor }} className={`rounded px-2 py-0.5 text-xs font-medium text-gray-700`}>
                                                {category?.title_en || ''} · {category?.title || ''} 조항
                                            </div>

                                            <button
                                                id={item._id}
                                                name="clause"
                                                onClick={(e) => onClipClick(e)}
                                                className="group mt-1 transform cursor-pointer outline-none transition-transform active:scale-75"
                                                title={clippedClause.includes(item._id) ? "즐겨찾기에서 삭제" : "즐겨찾기에 추가"}
                                            >
                                                {!clippedClause.includes(item._id) ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none h-5 w-5 fill-gray-400 group-hover:fill-[#BB22E2]">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none h-5 w-5 fill-[#BB22E2]">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </button>

                                            {/* 토스트 알림 (조건부 렌더링) */}
                                            {toastDetail.id === item._id && toastState && (
                                                <div className="absolute right-12 z-50 rounded bg-white p-2 shadow-md">
                                                    {toastDetail.action === '추가' ? (
                                                        <div className="flex h-full w-full items-center space-x-2 px-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-green-600">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                                                />
                                                            </svg>
                                                            <div className="text-xs font-semibold">조항 클립완료!</div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-full w-full items-center space-x-3 px-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-red-400">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                                                />
                                                            </svg>
                                                            <div className="text-xs font-semibold">즐겨찾기에서 삭제하였습니다!</div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col pt-2 text-[13px] leading-relaxed">
                                            {/* 노트 부분 추가 (원본 코드에 있었음) */}
                                            {item.note && (
                                                <div className="note flex items-start space-x-1.5 pb-4 pt-2 text-xs font-semibold tracking-wide">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="mt-0 h-4 w-4 stroke-yellow-400">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                                                        />
                                                    </svg>
                                                    <div dangerouslySetInnerHTML={{ __html: item.note }} className=""></div>
                                                </div>
                                            )}
                                            <div className="flex w-full gap-8">
                                                <div className="flex basis-1/2 flex-col">
                                                    <h2 className="mb-1 text-[15px] font-bold">{item.title_ko || item.clause_title || item.title}</h2>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: item.content_ko || item.content || "" }}
                                                        className="clause-css tracking-wide text-gray-800"
                                                    ></div>
                                                </div>
                                                <div className="flex basis-1/2 flex-col">
                                                    <h2 className="mb-1 text-[15px] font-bold">{item.title_en || item.title || ""}</h2>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: item.content_en || item.content || "" }}
                                                        className="clause-css text-xs tracking-wide text-gray-800"
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
            <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
        </>
    )
}

interface ArticleListProps {
    contractList: ClauseItem[]
    articleGroup: any[]
    currentIndex: number
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
    maxIndex: number
    setData: React.Dispatch<React.SetStateAction<any>>
}

const ArticleList: React.FC<ArticleListProps> = ({
    contractList,
    articleGroup,
    currentIndex,
    setCurrentIndex,
    maxIndex,
    setData
}) => {
    const [clickedItem, setClickedItem] = useState<any[]>([])

    const paginationOnClick = (e: React.MouseEvent<HTMLElement>) => {
        const btnId = (e.target as HTMLElement).id
        const type = (e.target as HTMLElement).getAttribute('name')

        if (btnId && type === 'paginationBtn') {
            if (btnId === 'btnNext' && currentIndex < maxIndex) {
                setCurrentIndex(currentIndex + 1)
            } else if (btnId === 'btnPrevious' && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1)
            }
        }

        if (btnId && type === 'paginationNum') {
            setCurrentIndex(parseInt(btnId))
        }
    }

    const setDetailData = (item: any, parent: any) => {
        setClickedItem(item)
        setData(parent[0])
    }

    // 컨텐츠가 없을 때 표시할 메시지
    if (!articleGroup || articleGroup.length === 0 || !articleGroup[currentIndex]) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center">
                <p className="text-gray-500">선택된 카테고리에 조항이 없습니다.</p>
                <p className="mt-2 text-sm text-gray-400">다른 카테고리를 선택하거나 검색해보세요.</p>
            </div>
        )
    }

    return (
        <main className="mx-auto flex w-[920px] flex-col justify-between px-[10vw] py-6">
            {articleGroup[currentIndex].map((item: any, index: number) => (
                <div key={item._id || index} className="mt-4 flex w-full border-b pb-4">
                    <div className="h-auto w-5 flex-none grow border-l-4 border-gray-500"></div>
                    <div className="flex w-full grow flex-col text-sm">
                        <div className="flex flex-col">
                            <div onClick={() => setDetailData(item.article, item)} className="group flex cursor-pointer items-center justify-between pb-4">
                                <div className="mr-1 grow text-base font-bold tracking-wide text-black group-hover:text-gray-700 group-hover:underline">
                                    {item.article?.text || item.clause_title || item.title}
                                </div>
                                <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">
                                    {item.title || item.contract_title || item.source} ({item.source})
                                </div>
                            </div>
                            <div className="flex flex-col text-[13px] leading-relaxed">
                                <p className="w-fit font-medium text-gray-500">본문 내용</p>
                                {item.paragraph ? (
                                    item.paragraph.map((elem: any, idx: number) => {
                                        if (elem.tag === 'p') {
                                            return (
                                                <p key={idx} className="line-clamp-3 text-gray-900">
                                                    {elem.text}
                                                </p>
                                            )
                                        } else if (elem.tag === 'ol') {
                                            return (
                                                <div
                                                    key={idx}
                                                    dangerouslySetInnerHTML={{ __html: elem.html }}
                                                    className="preview-doc line-clamp-3 text-gray-900"
                                                ></div>
                                            )
                                        }
                                        return null
                                    })
                                ) : (
                                    <p className="line-clamp-3 text-gray-900">{item.content || "내용 없음"}</p>
                                )}
                            </div>
                        </div>
                        <div className="my-4 w-full border-b-2 border-dotted"></div>
                        <div className="flex justify-between text-[13px]">
                            <div className="flex flex-col">
                                <p className="text-gray-500">계약 당사자(갑)</p>
                                <p className="text-gray-800">{item.partyA || "정보 없음"}</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500">계약 당사자(을)</p>
                                <p className="text-gray-800">{item.partyB || "정보 없음"}</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500">산업</p>
                                <p className="text-gray-800">{item.industry || "정보 없음"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
        </main>
    )
}

interface SearchWrapperProps {
    contractList: ClauseItem[]
    searchType: string
    setSearchType: React.Dispatch<React.SetStateAction<string>>
    setData: React.Dispatch<React.SetStateAction<any>>
    showSidebar?: boolean
}

const SearchWrapper: React.FC<SearchWrapperProps> = ({
    contractList,
    searchType,
    setSearchType,
    setData
}) => {
    return (
        <section className="mt-6 flex flex-col px-[10vw] py-4">
            <aside className="mx-auto flex w-fit items-center gap-x-2 text-2xl">
                <h2 className="text-xl font-semibold">
                    {searchType === 'contract' ? '클립이 제공하는 조항 라이브러리입니다' : '계약서 조항을 검색하세요!'}
                </h2>
            </aside>
            <SearchInput
                contractList={contractList}
                searchType={searchType}
                setSearchType={setSearchType}
                setData={setData}
            />
        </section>
    )
}

interface SearchInputProps {
    contractList: ClauseItem[]
    searchType: string
    setSearchType: React.Dispatch<React.SetStateAction<string>>
    setData: React.Dispatch<React.SetStateAction<any>>
}

const SearchInput: React.FC<SearchInputProps> = ({
    searchType,
    setSearchType,
    setData,
    contractList
}) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const { clauseList } = useContext(ArticleContext)

    // runSearch 함수를 컴포넌트 내에서 한 번만 정의
    const runSearch = () => {
        if (!searchTerm) return

        setSearchLoading(true)
        try {
            // 한글 정규식 패턴 적용
            const results = clauseList.filter((item: ClauseItem) => {
                const titleMatch =
                    (item.title_ko && item.title_ko.match(getRegExp(searchTerm)) !== null) ||
                    (item.clause_title && item.clause_title.match(getRegExp(searchTerm)) !== null) ||
                    (item.title && item.title.match(getRegExp(searchTerm)) !== null)

                // 콘텐츠 검색
                let contentMatch = false
                if (item.content_ko) {
                    contentMatch = item.content_ko.match(getRegExp(searchTerm)) !== null
                } else if (item.content_en) {
                    contentMatch = item.content_en.match(getRegExp(searchTerm)) !== null
                } else if (item.content) {
                    contentMatch = item.content.match(getRegExp(searchTerm)) !== null
                }
                // 필요한 경우 content_array 검색 로직을 여기에 추가

                return titleMatch || contentMatch
            })

            console.log('검색 결과:', results)
            setSearchResults(results)
        } catch (error) {
            console.error('검색 오류:', error)
        } finally {
            setSearchLoading(false)
        }
    }

    useEffect(() => {
        if (!searchTerm.length) {
            setSearchResults([])
            return
        }

        // 디바운스 처리
        const timeoutId = setTimeout(runSearch, 300)
        return () => clearTimeout(timeoutId)
    }, [searchTerm, clauseList])

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            runSearch()
        }
    }

    const resetSearch = (newType: string) => {
        setSearchTerm('')
        setSearchResults([])
        setSearchType(newType)
    }

    return (
        <div className="mx-auto mt-4 flex w-[540px] flex-col">
            <div className="flex w-full">
                <div className="relative w-full">
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        className="block w-full rounded-lg border border-fuchsia-100 bg-fuchsia-50/30 p-2.5 ps-5 text-sm text-gray-900 hover:border-fuchsia-200 hover:bg-white focus:border-fuchsia-300 focus:ring-blue-200"
                        placeholder="필요한 조항을 검색해보세요!"
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
                    className="ms-2 flex items-center rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800/90 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                    <svg className="me-2 h-4 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                    <span className="w-full">검색</span>
                </button>
            </div>

            {searchResults.length > 0 && (
                <SearchResult
                    setSearchTerm={setSearchTerm}
                    searchResult={searchResults}
                    searchTerm={searchTerm}
                    searchType={searchType}
                    setData={setData}
                />
            )}
        </div>
    )
}

interface SearchResultProps {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    searchResult: any[]
    searchTerm: string
    searchType: string
    setData: React.Dispatch<React.SetStateAction<any>>
}

const SearchResult: React.FC<SearchResultProps> = ({
    setSearchTerm,
    searchResult,
    searchTerm,
    searchType,
    setData
}) => {
    const { categoryList, updateCategory } = useContext(CategoryContext)

    const setSidebarData = (item: any) => {
        const clauseTitle = item.clause_title || item.title_ko || item.title || ''
        const title = item.contract_title || item.title || ''

        // 사이드패널에 표시할 데이터 구성
        const sidebarData = {
            ...item,
            title: title,
            clauseArray: [{
                idx: 0,
                text: clauseTitle
            }],
            contentArray: [[
                { tag: 'h2', idx: 0, text: clauseTitle, html: `<h2>${clauseTitle}</h2>` },
                {
                    tag: 'p',
                    idx: 0,
                    text: item.content_ko || item.content || '',
                    html: `<p>${item.content_ko || item.content || ''}</p>`
                }
            ]]
        }

        setData(sidebarData)
        setSearchTerm('')
    }

    if (searchResult.length > 0) {
        return (
            <div className="flex w-[458px] flex-col rounded rounded-b-lg bg-white shadow">
                {searchResult.map((resultObj, index) => {
                    const category = categoryList.find((x) => x._id === resultObj.clause_category)

                    let matchingTerm, additionalInfo
                    // 1. 계약서 제목 검색
                    if (category && searchType === 'contract') {
                        const titleText = resultObj.title_ko || resultObj.clause_title || resultObj.title || ''
                        matchingTerm = titleText.replace(
                            searchTerm,
                            `<span class="font-bold text-purple-800">${searchTerm}</span>`
                        )
                        additionalInfo = `<p>${resultObj.source || ''}</p>`

                        return (
                            <div
                                key={index}
                                id={category._id}
                                onClick={(e) => {
                                    updateCategory(e)
                                    setSearchTerm('')
                                }}
                                className="flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className="pointer-events-none"></p>
                                <div className="ml-4 flex items-center space-x-2 text-xs">
                                    <div key={category._id} className="rounded px-1.5 py-0.5 text-gray-700">
                                        {category?.title_en || ''}
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (searchType === 'article') {
                        const titleText = resultObj.article?.text || resultObj.clause_title || resultObj.title || ''
                        matchingTerm = titleText.replace(
                            searchTerm,
                            `<span class="font-bold text-purple-800">${searchTerm}</span>`
                        )
                        additionalInfo = `<p>${resultObj.title || resultObj.contract_title || ''} (${resultObj.source || ''})</p>`

                        return (
                            <div
                                key={index}
                                onClick={() => setSidebarData(resultObj)}
                                className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
                            >
                                <p dangerouslySetInnerHTML={{ __html: matchingTerm }}></p>
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
        )
    }
    return null
}

export default Clause
