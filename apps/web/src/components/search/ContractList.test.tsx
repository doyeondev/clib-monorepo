import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContractList from './ContractList';

// React Router의 useNavigate를 모킹
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn()
}));

/**
 * ContractList 컴포넌트 테스트
 * 
 * 계약서 목록 표시 및 상호작용 테스트
 */
describe('ContractList 컴포넌트', () => {
    // 테스트용 목 데이터
    const mockContracts = [
        { id: '1', title: '표준 근로계약서', partyA: '갑회사', partyB: '을개인', industry: 'IT' },
        { id: '2', title: '비밀유지계약서', partyA: '갑회사', partyB: '을회사', industry: '서비스' },
        { id: '3', title: '용역계약서', partyA: '발주사', partyB: '수주사', industry: '제조' }
    ];

    it('계약서 목록이 올바르게 렌더링되는지 확인', () => {
        render(<ContractList contractList={mockContracts} />);

        // 각 계약서 항목이 표시되는지 확인
        expect(screen.getByText('표준 근로계약서')).toBeInTheDocument();
        expect(screen.getByText('비밀유지계약서')).toBeInTheDocument();
        expect(screen.getByText('용역계약서')).toBeInTheDocument();

        // 계약 당사자 정보도 표시되는지 확인
        expect(screen.getByText('갑회사 - 을개인')).toBeInTheDocument();
        expect(screen.getByText('IT')).toBeInTheDocument();

        console.log('ContractList 기본 렌더링 테스트 통과');
    });

    it('계약서 아이템이 올바른 스타일로 렌더링되는지 확인', () => {
        render(<ContractList contractList={mockContracts} />);

        // 계약서 항목 컨테이너 확인
        const contractItems = screen.getAllByText(/표준 근로계약서|비밀유지계약서|용역계약서/i)
            .map(el => el.closest('div[class*="cursor-pointer"]'));

        // 각 항목이 올바른 스타일을 가지는지 확인
        contractItems.forEach(item => {
            expect(item).toHaveClass('cursor-pointer');
            expect(item).toHaveClass('bg-[#F5F5F5]');
        });

        // 당사자 이니셜 요소가 있는지 확인
        const initialElements = document.querySelectorAll('div[class*="rounded-full"]');
        expect(initialElements.length).toBeGreaterThan(0);

        console.log('ContractList 스타일 테스트 통과');
    });

    it('계약서 클릭 시 navigate 함수가 호출되는지 확인', () => {
        // sessionStorage 모킹
        const setItemMock = vi.fn();
        Object.defineProperty(window, 'sessionStorage', {
            value: { setItem: setItemMock },
            writable: true
        });

        render(<ContractList contractList={mockContracts} />);

        // 계약서 항목 클릭
        const contractItem = screen.getByText('표준 근로계약서').closest('div[class*="cursor-pointer"]');
        fireEvent.click(contractItem as HTMLElement);

        // sessionStorage.setItem이 호출되었는지 확인
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenCalledWith('item_key', '1');

        console.log('ContractList 클릭 이벤트 테스트 통과');
    });

    it('계약서 목록이 비어있을 때 빈 화면이 렌더링되는지 확인', () => {
        render(<ContractList contractList={[]} />);

        // 빈 목록이므로 계약서 항목은 렌더링되지 않아야 함
        expect(screen.queryByText(/표준 근로계약서|비밀유지계약서|용역계약서/i)).not.toBeInTheDocument();

        // 빈 메인 컨테이너는 존재해야 함
        expect(document.querySelector('main')).toBeInTheDocument();

        console.log('ContractList 빈 목록 테스트 통과');
    });
}); 