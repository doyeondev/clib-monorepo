import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

// 컴포넌트 임포트
import Spinner from '../../components/feedback/Spinner'
import Layout from '../../components/layout/Layout'
import Pagination from '../../components/ui/Pagination'
import CategorySidebar from '../../components/clause/CategorySidebar'
import { ClauseSearchWrapper } from '../../components/clause/ClauseSearch'
import Toast from '../../components/feedback/Toast'

// 유틸리티
import { chunkArray } from '../../utils/paginationUtil'
import { orderBy } from '../../utils/arrayUtils'

// 컨텍스트 및 타입
import {
  ClauseItem, CategoryItem, ToastDetail,
  ClauseContextProvider, useCategoryContext, useClipContext,
  useArticleContext, useSessionContext
} from '../../contexts/ClauseContext'

// API 함수 임포트
import { getClibDataset, getClauseCategoryList } from '../../api/clib'

// QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 'fresh'하게 유지
      gcTime: 10 * 60 * 1000, // 10분 동안 미사용 데이터 캐시 유지 (이전의 cacheTime)
      retry: 1, // 실패 시 1번 재시도
      refetchOnWindowFocus: false, // 창 포커스 시 자동 리페치 비활성화
    },
  },
});

// 루트 컴포넌트 - QueryClient Provider로 감싸기
const ClauseWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Clause />
    </QueryClientProvider>
  );
};

// 메인 조항 컴포넌트
const Clause = () => {
  // 상태 관리
  const [contractList, setContractList] = useState<ClauseItem[]>([])
  const [clauseList, setClauseList] = useState<ClauseItem[]>([])
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([])
  const [categoryHolder, setCategoryHolder] = useState<CategoryItem[]>([])
  const [clickedCategory, setClickedCategory] = useState<string[]>(['allClauses'])
  const [currentCategory, setCurrentCategory] = useState<any>([])

  const [error, setError] = useState<Error | null>(null)

  // 클립 관련 상태
  const [clippedClause, setClippedClause] = useState<string[]>([])
  const [toastDetail, setToastDetail] = useState<ToastDetail>({ id: '', action: '' })
  const [toastState, setToastState] = useState<boolean>(false)

  // TanStack Query를 사용한 데이터 페칭
  const { data: clausesData, isLoading: clausesLoading } = useQuery({
    queryKey: ['clauses'],
    queryFn: async () => {
      console.log("[Clause] TanStack Query로 조항 데이터 로드 중...");
      const data = await getClibDataset();
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("[Clause] 조항 데이터가 비어있습니다");
      }
      return data || [];
    }
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log("[Clause] TanStack Query로 카테고리 데이터 로드 중...");
      const data = await getClauseCategoryList();
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("[Clause] 카테고리 데이터가 비어있습니다");
      }
      return data || [];
    }
  });

  // 로딩 상태 계산
  const loading = clausesLoading || categoriesLoading;

  // 페이지 제목 설정
  useEffect(() => {
    document.title = '클립 | 공유자산'
  }, [])

  // 조항 데이터 처리 - TanStack Query 결과가 변경될 때만 실행
  useEffect(() => {
    if (clausesData && Array.isArray(clausesData)) {
      console.log("[Clause] TanStack Query에서 조항 데이터 처리 중...");
      const sortedClauseList = orderBy(
        clausesData.filter((x: any) => x.disabled !== true),
        ['clause_category', 'idx'],
        ['asc', 'asc']
      ) as ClauseItem[];

      setContractList(sortedClauseList);
      setClauseList(sortedClauseList);
    }
  }, [clausesData]);

  // 카테고리 데이터 처리
  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      console.log("[Clause] TanStack Query에서 카테고리 데이터 처리 중...");
      setCategoryHolder(categoriesData);
      setCurrentCategory(categoriesData[0]);
    } else if (!categoriesLoading && (!categoriesData || !Array.isArray(categoriesData) || categoriesData.length === 0)) {
      // 기본 카테고리 설정 (데이터가 없을 경우)
      const defaultCategory = [{
        id: 'default',
        title: '기본 카테고리',
        title_en: 'Default',
        color: 'blue',
        idx: 1
      }];
      setCategoryHolder(defaultCategory);
      setCurrentCategory(defaultCategory[0]);
    }
  }, [categoriesData, categoriesLoading]);

  // 클립 클릭 핸들러
  const onClipClick = (e: React.MouseEvent) => {
    const clipId = (e.currentTarget as HTMLElement).id
    const actionType = clippedClause.includes(clipId) ? '삭제' : '추가'

    // 클립된 조항 목록 업데이트
    if (clippedClause.includes(clipId)) {
      setClippedClause(prev => prev.filter(id => id !== clipId))
    } else {
      setClippedClause(prev => [...prev, clipId])
    }

    // 토스트 알림 표시
    setToastDetail({
      id: clipId,
      action: actionType
    });
    setToastState(true);

    // 토스트 자동 닫기 (2초 후)
    setTimeout(() => {
      setToastState(false);
    }, 2000);
  };

  // 카테고리 목록 업데이트
  useEffect(() => {
    if (clauseList.length > 0 && categoryHolder.length > 0) {
      let updatedCategoryList = [...categoryHolder]

      // 각 카테고리에 해당하는 조항 리스트 할당
      for (let i = 0; i < updatedCategoryList.length; i++) {
        const categoryItems = clauseList.filter(x => x.clause_category === updatedCategoryList[i].id)
        updatedCategoryList[i].assets = categoryItems
        updatedCategoryList[i].color = updatedCategoryList[i].color || 'blue'
      }

      // 항목이 0개인 카테고리 필터링 (allClauses 제외)
      updatedCategoryList = updatedCategoryList.filter(category =>
        (category.assets && category.assets.length > 0) || category.id === 'allClauses'
      )

      // '전체' 카테고리 추가
      const allCategory: CategoryItem = {
        assets: clauseList,
        title: '전체',
        color: 'blue',
        title_en: 'All',
        idx: 0,
        id: 'allClauses'
      }

      // '전체' 카테고리가 첫 번째가 아니면 추가
      if (updatedCategoryList[0]?.id !== 'allClauses') {
        updatedCategoryList.unshift(allCategory)
      }

      setCategoryList(updatedCategoryList)

      // 초기 선택된 카테고리 설정
      if (clickedCategory.length === 0) {
        setClickedCategory(['allClauses'])
      }
    }
  }, [clauseList, categoryHolder, clickedCategory.length])

  // 선택된 카테고리에 따라 표시할 조항 목록 필터링
  useEffect(() => {
    if (clauseList.length > 0) {
      if (clickedCategory.includes('clippedList')) {
        // 클립된 항목만 표시
        setContractList(clauseList.filter(x => clippedClause.includes(x.id)))
        setCurrentCategory('clippedList')
      } else if (clickedCategory.length < 1) {
        // 선택된 카테고리가 없으면 자동으로 전체 선택
        setClickedCategory(['allClauses'])
      } else if (clickedCategory.includes('allClauses')) {
        // 전체 카테고리 선택 시 모든 항목 표시
        setContractList(clauseList)
        setCurrentCategory(categoryList.filter(x => x.id === 'allClauses'))
      } else {
        // 선택된 카테고리에 해당하는 항목만 표시
        const categoryId = clickedCategory[0]; // 단일 선택이므로 첫 번째 항목만 사용
        const newClauseList = clauseList.filter(x => x.clause_category === categoryId)
        const newCategory = categoryList.filter(x => x.id === categoryId)

        setContractList(newClauseList)
        setCurrentCategory(newCategory)
      }
    }
  }, [clickedCategory, clippedClause, clauseList, categoryList])

  // 카테고리 업데이트 함수
  const updateCategory = (e: React.MouseEvent) => {
    const clickedId = (e.target as HTMLElement).id
    const type = (e.target as HTMLElement).getAttribute('name')

    // 클립된 항목 카테고리 선택
    if (clickedId === 'clippedList') {
      if (clickedCategory.includes('clippedList')) {
        // 이미 클립 카테고리가 선택된 상태에서 다시 클릭하면 '전체' 카테고리로 변경
        setClickedCategory(['allClauses'])
      } else {
        setClickedCategory(['clippedList'])
      }
      return;
    }

    // 다른 카테고리 선택
    if (type === 'search') {
      // 검색 결과로 카테고리 선택 시
      setClickedCategory([clickedId])
    } else {
      // 일반 카테고리 선택 시
      if (clickedCategory.includes(clickedId)) {
        // 현재 선택된 카테고리를 다시 클릭하면 '전체' 카테고리로 변경
        setClickedCategory(['allClauses'])
      } else {
        // 다른 카테고리 선택 시 이전 선택 초기화하고 새 카테고리만 선택
        setClickedCategory([clickedId])
      }
    }
  }

  // 세션 컨텍스트 값 설정
  const sessionContextValue = {
    clippedClause,
    onClipClick,
    toastDetail,
    toastState,
    setToastState
  };

  // 로딩 중이면 스피너 표시
  if (loading) return <Spinner />

  // 오류가 있으면 오류 메시지 표시
  if (error) return <div>오류가 발생했습니다: {error.message}</div>

  return (
    <Layout>
      <ClauseContextProvider
        initialData={{
          clauses: clauseList,
          categories: categoryList
        }}
      >
        <MainLayout
          contractList={contractList}
          clippedClause={clippedClause}
          onClipClick={onClipClick}
          toastDetail={toastDetail}
          toastState={toastState}
          categoryList={categoryList}
          currentCategory={currentCategory}
          updateCategory={updateCategory}
          clickedCategory={clickedCategory}
        />
      </ClauseContextProvider>
    </Layout>
  )
}

// MainLayout 컴포넌트 Props 타입
interface MainLayoutProps {
  contractList: ClauseItem[];
  clippedClause: string[];
  onClipClick: (e: React.MouseEvent) => void;
  toastDetail: ToastDetail;
  toastState: boolean;
  categoryList: CategoryItem[];
  currentCategory: any;
  updateCategory: (e: React.MouseEvent) => void;
  clickedCategory: string[];
}

/**
 * 메인 레이아웃 컴포넌트
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  contractList,
  clippedClause,
  onClipClick,
  toastDetail,
  toastState,
  categoryList,
  currentCategory,
  updateCategory,
  clickedCategory
}) => {
  const [data, setData] = useState<any>([])

  // 페이지네이션 상태
  const [contractGroup, setContractGroup] = useState<ClauseItem[][]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [maxIndex, setMaxIndex] = useState<number>(0)

  // 계약 목록이 변경될 때마다 페이지네이션 업데이트
  useEffect(() => {
    setCurrentIndex(0)
    const groupedContracts = chunkArray(contractList, 5)
    setContractGroup(groupedContracts)
    setMaxIndex(groupedContracts.length - 1)
  }, [contractList])

  // 페이지네이션 클릭 핸들러
  const paginationOnClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const btnId = target.id;
    const type = target.getAttribute('name');

    if (btnId && type === 'paginationBtn') {
      if (btnId === 'btnNext' && currentIndex < maxIndex) {
        setCurrentIndex(currentIndex + 1);
      } else if (btnId === 'btnPrevious' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    if (btnId && type === 'paginationNum') {
      setCurrentIndex(parseInt(btnId));
    }
  };

  return (
    <>
      {contractGroup.map((elem, index) => {
        if (currentIndex === index) {
          return (
            <div key={index} className="flex min-h-[calc(100vh-120px)] flex-col bg-white">
              <ClauseSearchWrapper
                contractList={contractList}
                setData={setData}
              />
              <main className="mx-auto flex w-[1100px] px-[5vw] py-6">
                {/* 카테고리 사이드바 */}
                <CategorySidebar
                  categories={categoryList}
                  selectedCategories={clickedCategory}
                  onCategoryClick={updateCategory}
                  totalItemsCount={contractList.length}
                  clippedItemsCount={clippedClause.length}
                  showClippedCategory={true}
                />

                {/* 조항 리스트 */}
                <div className="flex flex-1 flex-col">
                  {orderBy(elem, ['clause_category', 'idx'], ['asc', 'asc']).map((item, index) => {
                    const category = categoryList.find(x => x.id === item.clause_category)
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
                                id={item.id}
                                name="clause"
                                onClick={onClipClick}
                                className="group mt-1 transform cursor-pointer outline-none transition-transform active:scale-75"
                                title={clippedClause.includes(item.id) ? "즐겨찾기에서 삭제" : "즐겨찾기에 추가"}
                              >
                                {!clippedClause.includes(item.id) ? (
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

                              {/* 토스트 알림 표시 */}
                              {toastDetail.id === item.id && toastState && (
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
            </div>
          )
        }
        return null
      })}

      {/* 페이지네이션 컴포넌트 사용 */}
      <Pagination
        currentIndex={currentIndex}
        maxIndex={maxIndex}
        onClickHandler={paginationOnClick}
      />
    </>
  )
}

export default ClauseWrapper
