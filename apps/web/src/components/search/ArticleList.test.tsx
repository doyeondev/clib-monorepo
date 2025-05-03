import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleList from './ArticleList';
import { AssetContext, ArticleContext } from './context';
import { SessionContext } from '../../App';

/**
 * ArticleList 컴포넌트 테스트
 * 
 * 조항 목록 출력 및 클릭 이벤트 기능 확인
 */
describe('ArticleList 컴포넌트', () => {
    // 모킹된 컨텍스트 값
    const mockSetShowSidebar = vi.fn();
    const mockSetClickedItem = vi.fn();
    const mockSetItemData = vi.fn();
    const mockSetSidebarData = vi.fn();
    const mockSetCurrentIndex = vi.fn();

    // 테스트용 조항 데이터
    const mockClauseList = [
        {
            clause_title: '제1조 총칙',
            contract_title: '테스트 계약서',
            content_array: [
                { html: '<h2>제1조 총칙</h2>' },
                { html: '<p>본 계약은 다음과 같다.</p>' }
            ],
            partyA: '갑회사',
            partyB: '을회사',
            industry: 'IT',
            contract_asset: 'contract-1',
            id: 'clause-1',
            docId: 'doc-1'
        },
        {
            clause_title: '제2조 계약금액',
            contract_title: '테스트 계약서',
            content_array: [
                { html: '<h2>제2조 계약금액</h2>' },
                { html: '<p>계약금액은 1억원으로 한다.</p>' }
            ],
            partyA: '갑회사',
            partyB: '을회사',
            industry: 'IT',
            contract_asset: 'contract-1',
            id: 'clause-2',
            docId: 'doc-1'
        }
    ];

    // 테스트용 계약서 데이터
    const mockContractAsset = [
        {
            id: 'contract-1',
            title: '테스트 계약서',
            partyA: '갑회사',
            partyB: '을회사',
            industry: 'IT',
            clause_array: [
                { idx: 1, text: '총칙' },
                { idx: 2, text: '계약금액' }
            ]
        }
    ];

    const renderComponent = () => {
        return render(
            <SessionContext.Provider value={{
                contractAsset: mockContractAsset,
                clippedClause: []
            }}>
                <AssetContext.Provider value={{
                    data: null,
                    showSidebar: false,
                    setShowSidebar: mockSetShowSidebar,
                    clickedItem: null,
                    setClickedItem: mockSetClickedItem,
                    itemData: null,
                    setItemData: mockSetItemData,
                    setSidebarData: mockSetSidebarData
                }}>
                    <ArticleContext.Provider value={{
                        articleData: [],
                        clauseList: mockClauseList
                    }}>
                        <ArticleList
                            contractList={[]}
                            articleGroup={[]}
                            currentIndex={0}
                            setCurrentIndex={mockSetCurrentIndex}
                            maxIndex={3}
                        />
                    </ArticleContext.Provider>
                </AssetContext.Provider>
            </SessionContext.Provider>
        );
    };

    it('조항 목록이 올바르게 렌더링되는지 확인', () => {
        const { container } = renderComponent();

        // 조항 제목 확인 (div 요소 내의 텍스트 확인)
        const clauseTitle1 = container.querySelector('.group div[class*="mr-1"]');
        const clauseTitle2 = container.querySelectorAll('.group div[class*="mr-1"]')[1];

        expect(clauseTitle1).not.toBeNull();
        expect(clauseTitle2).not.toBeNull();

        expect(clauseTitle1).toHaveTextContent('제1조 총칙');
        expect(clauseTitle2).toHaveTextContent('제2조 계약금액');

        // 계약서 제목 확인
        expect(screen.getAllByText('From: 테스트 계약서').length).toBe(2);

        // 본문 내용 확인
        expect(screen.getByText('본 계약은 다음과 같다.')).toBeInTheDocument();
        expect(screen.getByText('계약금액은 1억원으로 한다.')).toBeInTheDocument();

        // 계약 당사자 정보 확인
        expect(screen.getAllByText('갑회사').length).toBe(2);
        expect(screen.getAllByText('을회사').length).toBe(2);
        expect(screen.getAllByText('IT').length).toBe(2);

        console.log('ArticleList 조항 목록 렌더링 테스트 통과');
    });

    it('조항 클릭 시 사이드바가 표시되는지 확인', () => {
        const { container } = renderComponent();

        // 첫 번째 조항 클릭 (div 요소 선택)
        const clauseElement = container.querySelector('.group div[class*="mr-1"]');
        expect(clauseElement).not.toBeNull();

        if (clauseElement) {
            fireEvent.click(clauseElement);
        }

        // 사이드바 표시 함수 호출 확인
        expect(mockSetShowSidebar).toHaveBeenCalledWith(true);

        // 클릭된 조항 설정 함수 호출 확인
        expect(mockSetClickedItem).toHaveBeenCalled();

        // 조항 데이터 설정 함수 호출 확인
        expect(mockSetItemData).toHaveBeenCalled();

        console.log('ArticleList 조항 클릭 이벤트 테스트 통과');
    });

    it('조항 클릭 시 올바른 인덱스가 추출되는지 확인', () => {
        const { container } = renderComponent();

        // 두 번째 조항 클릭 (div 요소 선택)
        const clauseElements = container.querySelectorAll('.group div[class*="mr-1"]');
        expect(clauseElements.length).toBeGreaterThan(1);

        const clauseElement = clauseElements[1];
        fireEvent.click(clauseElement);

        // 클릭된 조항 설정 함수의 인자 확인
        expect(mockSetClickedItem).toHaveBeenCalledWith(expect.objectContaining({
            clause_title: '제2조 계약금액',
            clause_index: 2,
            cIdx: 2
        }));

        // 계약서 데이터 설정 함수의 인자 확인
        expect(mockSetItemData).toHaveBeenCalledWith(expect.objectContaining({
            id: 'contract-1',
            clause_index: 2,
            cIdx: 2
        }));

        console.log('ArticleList 조항 인덱스 추출 테스트 통과');
    });
}); 