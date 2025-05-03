import React, { createContext, useContext, useState, useEffect, MouseEvent } from 'react';

// 타입 정의
export interface ClauseItem {
    id: string;
    clause_category: string;
    title_ko: string;
    title_en: string;
    title?: string;
    clause_title?: string;
    content_ko: string;
    content_en: string;
    content?: string;
    note?: string;
    source?: string;
    idx: number;
    disabled?: boolean;
    color?: string;
}

export interface CategoryItem {
    id: string;
    title: string;
    title_en: string;
    color: string;
    idx: number;
    assets?: ClauseItem[];
}

export interface ToastDetail {
    id: string;
    action: string;
}

// 컨텍스트 타입 정의
interface CategoryContextType {
    categoryList: CategoryItem[];
    currentCategory: CategoryItem | CategoryItem[];
    updateCategory: (e: MouseEvent) => void;
    clickedCategory: string[];
}

interface ClipContextType {
    clippedItem: string[];
}

interface ArticleContextType {
    clauseList: ClauseItem[];
}

interface SessionContextType {
    clippedClause: string[];
    onClipClick: (e: MouseEvent) => void;
    toastDetail: ToastDetail;
    toastState: boolean;
    setToastState: React.Dispatch<React.SetStateAction<boolean>>;
}

// 기본값으로 컨텍스트 생성
const CategoryContext = createContext<CategoryContextType>({
    categoryList: [],
    currentCategory: [],
    updateCategory: () => { },
    clickedCategory: []
});

const ClipContext = createContext<ClipContextType>({
    clippedItem: []
});

const ArticleContext = createContext<ArticleContextType>({
    clauseList: []
});

const SessionContext = createContext<SessionContextType>({
    clippedClause: [],
    onClipClick: () => { },
    toastDetail: { id: '', action: '' },
    toastState: false,
    setToastState: () => { }
});

// 컨텍스트 제공자 컴포넌트
interface ClauseContextProviderProps {
    children: React.ReactNode;
    initialData?: {
        clauses?: ClauseItem[];
        categories?: CategoryItem[];
    };
}

export const ClauseContextProvider: React.FC<ClauseContextProviderProps> = ({
    children,
    initialData = {}
}) => {
    // 카테고리 관련 상태
    const [categoryList, setCategoryList] = useState<CategoryItem[]>(initialData.categories || []);
    const [clickedCategory, setClickedCategory] = useState<string[]>(['allClauses']);
    const [currentCategory, setCurrentCategory] = useState<CategoryItem | CategoryItem[]>([]);

    // 조항 관련 상태
    const [clauseList, setClauseList] = useState<ClauseItem[]>(initialData.clauses || []);

    // 클립 관련 상태
    const [clippedClause, setClippedClause] = useState<string[]>([]);
    const [toastDetail, setToastDetail] = useState<ToastDetail>({ id: '', action: '' });
    const [toastState, setToastState] = useState<boolean>(false);

    // 카테고리 업데이트 함수
    const updateCategory = (e: MouseEvent) => {
        const clickedId = (e.target as HTMLElement).id;
        const type = (e.target as HTMLElement).getAttribute('name');

        // 클립된 항목 카테고리 선택
        if (clickedId === 'clippedList') {
            if (clickedCategory.includes('clippedList')) {
                // 이미 클립 카테고리가 선택된 상태에서 다시 클릭하면 '전체' 카테고리로 변경
                setClickedCategory(['allClauses']);
            } else {
                setClickedCategory(['clippedList']);
            }
            return;
        }

        // 다른 카테고리 선택
        if (type === 'search') {
            // 검색 결과로 카테고리 선택 시
            setClickedCategory([clickedId]);
        } else {
            // 일반 카테고리 선택 시
            if (clickedCategory.includes(clickedId)) {
                // 현재 선택된 카테고리를 다시 클릭하면 '전체' 카테고리로 변경
                setClickedCategory(['allClauses']);
            } else {
                // 다른 카테고리 선택 시 이전 선택 초기화하고 새 카테고리만 선택
                setClickedCategory([clickedId]);
            }
        }
    };

    // 클립 클릭 핸들러
    const onClipClick = (e: MouseEvent) => {
        const clipId = (e.currentTarget as HTMLElement).id;
        const actionType = clippedClause.includes(clipId) ? '삭제' : '추가';

        if (clippedClause.includes(clipId)) {
            setClippedClause(prev => prev.filter(id => id !== clipId));
        } else {
            setClippedClause(prev => [...prev, clipId]);
        }

        // 토스트 표시
        setToastDetail({
            id: clipId,
            action: actionType
        });
        setToastState(true);

        // 토스트 자동 닫기
        setTimeout(() => {
            setToastState(false);
        }, 2000);
    };

    // 컨텍스트 값 설정
    const categoryContextValue: CategoryContextType = {
        categoryList,
        currentCategory,
        updateCategory,
        clickedCategory
    };

    const clipContextValue: ClipContextType = {
        clippedItem: clippedClause
    };

    const articleContextValue: ArticleContextType = {
        clauseList
    };

    const sessionContextValue: SessionContextType = {
        clippedClause,
        onClipClick,
        toastDetail,
        toastState,
        setToastState
    };

    return (
        <CategoryContext.Provider value={categoryContextValue}>
            <ClipContext.Provider value={clipContextValue}>
                <ArticleContext.Provider value={articleContextValue}>
                    <SessionContext.Provider value={sessionContextValue}>
                        {children}
                    </SessionContext.Provider>
                </ArticleContext.Provider>
            </ClipContext.Provider>
        </CategoryContext.Provider>
    );
};

// 컨텍스트 훅 내보내기
export const useCategoryContext = () => useContext(CategoryContext);
export const useClipContext = () => useContext(ClipContext);
export const useArticleContext = () => useContext(ArticleContext);
export const useSessionContext = () => useContext(SessionContext);

// 모든 컨텍스트를 한 번에 사용하는 훅
export const useClauseContext = () => {
    return {
        ...useCategoryContext(),
        ...useClipContext(),
        ...useArticleContext(),
        ...useSessionContext()
    };
}; 