import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from './SearchInput';
import { MemoryRouter } from 'react-router-dom';

/**
 * SearchInput 컴포넌트 테스트
 * 
 * 검색 입력 필드와 타입 전환 기능 테스트
 */
describe('SearchInput 컴포넌트', () => {
    // 기본 렌더링 테스트
    it('검색 입력 필드가 렌더링되는지 확인', () => {
        const setSearchTerm = vi.fn();
        const setSearchType = vi.fn();

        render(
            <MemoryRouter>
                <SearchInput
                    searchTerm=""
                    setSearchTerm={setSearchTerm}
                    searchType="contract"
                    setSearchType={setSearchType}
                />
            </MemoryRouter>
        );

        // 검색 입력 필드가 존재하는지 확인
        const searchInput = screen.getByPlaceholderText(/검색어를 입력해주세요/i);
        expect(searchInput).toBeInTheDocument();

        // 콘솔에 로그 출력
        console.log('검색 입력 필드 렌더링 확인 완료');
    });

    // 검색어 입력 테스트
    it('검색어 입력 시 setSearchTerm이 호출되는지 확인', () => {
        const setSearchTerm = vi.fn();
        const setSearchType = vi.fn();

        render(
            <MemoryRouter>
                <SearchInput
                    searchTerm=""
                    setSearchTerm={setSearchTerm}
                    searchType="contract"
                    setSearchType={setSearchType}
                />
            </MemoryRouter>
        );

        // 검색 입력 필드를 찾아 입력 이벤트 발생
        const searchInput = screen.getByPlaceholderText(/검색어를 입력해주세요/i);
        fireEvent.change(searchInput, { target: { value: '임대차 계약서' } });

        // setSearchTerm이 호출되었는지 확인
        expect(setSearchTerm).toHaveBeenCalled();

        // 콘솔에 로그 출력
        console.log('검색어 입력 이벤트 처리 확인 완료');
    });

    // 검색 타입 전환 테스트
    it('검색 타입 전환 버튼이 작동하는지 확인', () => {
        const setSearchTerm = vi.fn();
        const setSearchType = vi.fn();

        render(
            <MemoryRouter>
                <SearchInput
                    searchTerm=""
                    setSearchTerm={setSearchTerm}
                    searchType="contract"
                    setSearchType={setSearchType}
                />
            </MemoryRouter>
        );

        // 조항 검색으로 전환 버튼 찾기
        const clauseButton = screen.getByText(/조항 검색/i);
        fireEvent.click(clauseButton);

        // setSearchType이 'clause'로 호출되었는지 확인
        expect(setSearchType).toHaveBeenCalledWith('clause');

        // 콘솔에 로그 출력
        console.log('검색 타입 전환 기능 확인 완료');
    });
}); 