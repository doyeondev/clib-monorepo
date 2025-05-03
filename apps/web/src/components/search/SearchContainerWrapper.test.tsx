import { render, screen } from '@testing-library/react'
import SearchContainerWrapper from './SearchContainerWrapper'
import { describe, it, expect, vi } from 'vitest'

describe('SearchContainerWrapper', () => {
    it('계약서 검색 제목이 잘 보이는지 확인', () => {
        // 검색 타입 상태값 (contract) 셋업
        const searchType = 'contract'
        const setSearchType = vi.fn()

        render(
            <SearchContainerWrapper
                contractList={[]}
                searchType={searchType}
                setSearchType={setSearchType}
            />
        )

        // "어떤 계약서 양식이 필요하신가요?" 텍스트가 존재하는지 확인
        const title = screen.getByText(/어떤 계약서 양식이 필요하신가요/i)
        expect(title).toBeInTheDocument()
    })

    it('조항 검색일 경우 제목 변경 확인', () => {
        const searchType = 'clause'
        const setSearchType = vi.fn()

        render(
            <SearchContainerWrapper
                contractList={[]}
                searchType={searchType}
                setSearchType={setSearchType}
            />
        )

        const title = screen.getByText(/계약서 조항을 검색하세요/i)
        expect(title).toBeInTheDocument()
    })
})
