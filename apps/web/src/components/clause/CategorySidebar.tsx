import React from 'react';

interface CategoryItem {
    id: string;
    title: string;
    title_en?: string;
    color?: string;
    idx?: number;
    assets?: any[];
}

interface CategorySidebarProps {
    categories: CategoryItem[];            // 카테고리 목록
    selectedCategories: string[];          // 선택된 카테고리 ID 배열
    onCategoryClick: (e: React.MouseEvent) => void; // 카테고리 클릭 핸들러
    totalItemsCount: number;               // 전체 항목 수
    clippedItemsCount?: number;            // 클립된 항목 수
    showClippedCategory?: boolean;         // 클립 카테고리 표시 여부
}

/**
 * 카테고리 사이드바 컴포넌트
 */
const CategorySidebar: React.FC<CategorySidebarProps> = ({
    categories,
    selectedCategories,
    onCategoryClick,
    totalItemsCount,
    clippedItemsCount = 0,
    showClippedCategory = true
}) => {
    return (
        <div className="mr-6 mt-4 flex h-fit w-[260px] flex-shrink-0 flex-col items-center rounded border border-dotted py-2">
            <div className="mx-auto w-full space-y-2 px-2">
                <div className="mb-1 px-1 text-sm font-medium text-gray-700">전체 조항 ({totalItemsCount})</div>

                {/* 카테고리 목록 */}
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        onClick={onCategoryClick}
                        id={category.id}
                        className={`mr-1.5 flex w-full cursor-pointer items-center rounded px-3 py-1 hover:bg-fuchsia-100/50 ${selectedCategories.includes(category.id) ? 'bg-gray-100' : ''
                            }`}
                    >
                        <input
                            readOnly
                            type="radio"
                            name="category"
                            className="pointer-events-none mr-4 h-4 w-4 rounded-full border-gray-300 bg-gray-100 text-fuchsia-500"
                            checked={selectedCategories.includes(category.id)}
                        />
                        <p
                            className={`pointer-events-none text-[13px] ${selectedCategories.includes(category.id)
                                ? 'font-bold text-gray-700'
                                : 'text-gray-500'
                                }`}
                        >
                            {category.title} 조항 ({category.assets?.length || 0})
                        </p>
                    </div>
                ))}

                {/* 클립 카테고리 */}
                {showClippedCategory && (
                    <div
                        onClick={onCategoryClick}
                        id="clippedList"
                        className={`mr-1.5 flex w-full cursor-pointer items-center rounded px-3 py-1 hover:bg-fuchsia-100/50 ${selectedCategories.includes('clippedList') ? 'bg-gray-100' : ''
                            }`}
                    >
                        <input
                            readOnly
                            type="radio"
                            name="category"
                            className="pointer-events-none mr-4 h-4 w-4 rounded-full border-gray-300 bg-gray-100 text-fuchsia-500"
                            checked={selectedCategories.includes('clippedList')}
                        />
                        <p
                            className={`pointer-events-none text-[13px] ${selectedCategories.includes('clippedList')
                                ? 'font-bold text-gray-700'
                                : 'text-gray-500'
                                }`}
                        >
                            클립한 조항 ({clippedItemsCount})
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySidebar; 