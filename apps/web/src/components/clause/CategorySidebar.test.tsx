import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategorySidebar from './CategorySidebar';

/**
 * CategorySidebar 컴포넌트 테스트
 * 
 * 카테고리 목록 렌더링 및 선택 기능 테스트
 */
describe('CategorySidebar 컴포넌트', () => {
    // 테스트용 카테고리 데이터
    const categories = [
        { id: 'nda', title: 'NDA', assets: [{}, {}] },
        { id: 'employment', title: '근로계약', assets: [{}] },
        { id: 'etc', title: '기타', assets: [] }
    ];

    it('카테고리 목록이 올바르게 렌더링되는지 확인', () => {
        render(
            <CategorySidebar
                categories={categories}
                selectedCategories={['nda']}
                onCategoryClick={() => { }}
                totalItemsCount={10}
            />
        );

        // 전체 항목 표시 확인
        expect(screen.getByText('전체 조항 (10)')).toBeInTheDocument();

        // 각 카테고리 항목 확인
        expect(screen.getByText('NDA 조항 (2)')).toBeInTheDocument();
        expect(screen.getByText('근로계약 조항 (1)')).toBeInTheDocument();
        expect(screen.getByText('기타 조항 (0)')).toBeInTheDocument();

        // 클립한 조항 카테고리 확인 (기본값으로 표시됨)
        expect(screen.getByText(/클립한 조항/)).toBeInTheDocument();

        console.log('CategorySidebar 기본 렌더링 테스트 통과');
    });

    it('선택된 카테고리가 강조 표시되는지 확인', () => {
        render(
            <CategorySidebar
                categories={categories}
                selectedCategories={['employment']}
                onCategoryClick={() => { }}
                totalItemsCount={10}
            />
        );

        // 선택된 카테고리 확인
        const employmentText = screen.getByText('근로계약 조항 (1)');
        expect(employmentText).toBeInTheDocument();

        // 선택된 카테고리의 라디오 버튼이 체크되어 있는지 확인
        const radioButtons = screen.getAllByRole('radio');
        const employmentRadio = radioButtons[1]; // 두 번째 라디오 버튼 (근로계약)
        expect(employmentRadio).toBeChecked();

        // 선택된 카테고리의 텍스트가 강조되어 있는지 확인
        const employmentLabel = employmentText.closest('p');
        expect(employmentLabel).toHaveClass('font-bold');
        expect(employmentLabel).toHaveClass('text-gray-700');

        console.log('CategorySidebar 선택 카테고리 강조 테스트 통과');
    });

    it('카테고리 클릭 시 onCategoryClick 콜백이 호출되는지 확인', () => {
        const onCategoryClickMock = vi.fn();
        render(
            <CategorySidebar
                categories={categories}
                selectedCategories={['nda']}
                onCategoryClick={onCategoryClickMock}
                totalItemsCount={10}
            />
        );

        // 다른 카테고리 클릭
        const employmentCategory = screen.getByText('근로계약 조항 (1)').closest('div');
        if (employmentCategory) {
            fireEvent.click(employmentCategory);
        }

        // onCategoryClick 콜백이 호출되었는지 확인
        expect(onCategoryClickMock).toHaveBeenCalledTimes(1);

        console.log('CategorySidebar 카테고리 클릭 테스트 통과');
    });

    it('클립 카테고리가 숨겨지는지 확인', () => {
        render(
            <CategorySidebar
                categories={categories}
                selectedCategories={['nda']}
                onCategoryClick={() => { }}
                totalItemsCount={10}
                showClippedCategory={false}
            />
        );

        // 클립 카테고리가 표시되지 않는지 확인
        const clippedCategory = screen.queryByText(/클립한 조항/);
        expect(clippedCategory).not.toBeInTheDocument();

        console.log('CategorySidebar 클립 카테고리 숨김 테스트 통과');
    });

    it('클립 항목 수가 올바르게 표시되는지 확인', () => {
        render(
            <CategorySidebar
                categories={categories}
                selectedCategories={['nda']}
                onCategoryClick={() => { }}
                totalItemsCount={10}
                clippedItemsCount={5}
            />
        );

        // 클립 항목 수가 올바르게 표시되는지 확인
        expect(screen.getByText('클립한 조항 (5)')).toBeInTheDocument();

        console.log('CategorySidebar 클립 항목 수 테스트 통과');
    });

    it('클립 카테고리가 선택되었을 때 스타일이 적용되는지 확인', () => {
        render(
            <CategorySidebar
                categories={categories}
                selectedCategories={['clippedList']}
                onCategoryClick={() => { }}
                totalItemsCount={10}
            />
        );

        // 클립 카테고리 찾기
        const clippedCategory = screen.getByText(/클립한 조항/).closest('div');

        // 선택된 스타일이 적용되었는지 확인
        expect(clippedCategory).toHaveClass('bg-gray-100');

        // 선택된 라디오 버튼 확인
        const clippedRadio = screen.getAllByRole('radio').pop(); // 마지막 라디오 버튼
        expect(clippedRadio).toBeChecked();

        console.log('CategorySidebar 클립 카테고리 선택 스타일 테스트 통과');
    });
}); 