import React, { FC } from 'react'

/**
 * 푸터 컴포넌트
 */
interface DashboardFooterProps {
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
    currentIndex: number
    maxIndex: number
}

const DashboardFooter: FC<DashboardFooterProps> = ({ onClickHandler, currentIndex, maxIndex }) => {
    return (
        <div className="mx-auto flex w-auto justify-center">
            <div className="my-1 flex items-center justify-center gap-x-1 font-medium text-[#67798D]">
                <button
                    data-name="paginationBtn"
                    className="disabled:text-gray-300"
                    id="btnPrevious"
                    onClick={onClickHandler}
                    disabled={currentIndex === 0}
                >
                    {'<'}
                </button>
                <FooterPagination currentIndex={currentIndex} maxIndex={maxIndex} onClickHandler={onClickHandler} />
                <button
                    data-name="paginationBtn"
                    className="disabled:text-gray-300"
                    id="btnNext"
                    onClick={onClickHandler}
                    disabled={currentIndex === maxIndex}
                >
                    {'>'}
                </button>
            </div>
        </div>
    )
}

/**
 * 푸터 페이지네이션 컴포넌트
 */
interface FooterPaginationProps {
    currentIndex: number
    maxIndex: number
    onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
}

const FooterPagination: FC<FooterPaginationProps> = ({ currentIndex, maxIndex, onClickHandler }) => {
    const array = Array.from({ length: maxIndex + 1 }, (_, i) => i)
    return (
        <div className="flex gap-x-2">
            {array.map((el) => {
                return (
                    <button
                        key={el}
                        id={`${el}`}
                        className={`h-6 w-6 rounded-full text-sm ${currentIndex === el ? 'bg-[#1E2A69] text-white' : 'hover:bg-gray-200'}`}
                        onClick={onClickHandler}
                        data-name="paginationNum"
                    >
                        {el + 1}
                    </button>
                )
            })}
        </div>
    )
}

export { FooterPagination }
export default DashboardFooter 