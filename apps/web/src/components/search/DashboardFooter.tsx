import React from 'react'
import { v4 as uuidv4 } from 'uuid'

interface DashboardFooterProps {
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
    currentIndex: number
    maxIndex: number
}

/**
 * 대시보드 푸터 컴포넌트
 * - 페이지네이션 컨트롤 제공
 * - 이전/다음 페이지 이동 버튼
 * - 페이지 번호 표시
 */
const DashboardFooter: React.FC<DashboardFooterProps> = ({ onClickHandler, currentIndex, maxIndex }) => {
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

interface FooterPaginationProps {
    currentIndex: number
    maxIndex: number
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
}

/**
 * 푸터 페이지네이션 컴포넌트
 * - 페이지 번호 버튼 생성
 * - 현재 페이지 하이라이트 처리
 */
const FooterPagination: React.FC<FooterPaginationProps> = ({ currentIndex, maxIndex, onClickHandler }) => {
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

export default DashboardFooter 