import React from 'react';
import { handlePaginationClick } from '../../utils/paginationUtil';

interface PaginationProps {
    currentIndex: number;   // 현재 페이지 인덱스
    maxIndex: number;       // 최대 페이지 인덱스
    onClickHandler?: (e: React.MouseEvent<HTMLElement>) => void; // 커스텀 클릭 핸들러 (옵션)
    setCurrentIndex?: (index: number) => void;  // 직접 인덱스 설정 함수 (옵션)
    className?: string;     // 추가 CSS 클래스
    showPageNumbers?: boolean; // 페이지 번호 표시 여부
    maxButtons?: number;    // 표시할 최대 버튼 수
}

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 */
const Pagination: React.FC<PaginationProps> = ({
    currentIndex,
    maxIndex,
    onClickHandler,
    setCurrentIndex,
    className = '',
    showPageNumbers = true,
    maxButtons = 5
}) => {
    // 기본 클릭 핸들러
    const defaultClickHandler = (e: React.MouseEvent<HTMLElement>) => {
        if (setCurrentIndex) {
            handlePaginationClick(e, currentIndex, maxIndex, setCurrentIndex);
        }
    };

    // 사용할 클릭 핸들러 결정
    const clickHandler = onClickHandler || defaultClickHandler;

    // 표시할 페이지 번호 계산
    const getPageNumbers = () => {
        if (maxIndex <= maxButtons) {
            return Array.from({ length: maxIndex + 1 }, (_, i) => i);
        }

        const halfButtons = Math.floor(maxButtons / 2);
        let startPage = Math.max(0, currentIndex - halfButtons);
        let endPage = Math.min(maxIndex, currentIndex + halfButtons);

        if (startPage === 0) {
            endPage = Math.min(maxButtons - 1, maxIndex);
        } else if (endPage === maxIndex) {
            startPage = Math.max(maxIndex - maxButtons + 1, 0);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    return (
        <div className={`flex items-center justify-center space-x-1 py-4 ${className}`}>
            <button
                id="btnPrevious"
                name="paginationBtn"
                onClick={clickHandler}
                disabled={currentIndex === 0}
                className={`flex h-8 w-8 items-center justify-center rounded ${currentIndex === 0
                    ? 'cursor-not-allowed text-gray-400'
                    : 'cursor-pointer text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {showPageNumbers && getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    id={pageNum.toString()}
                    name="paginationNum"
                    onClick={clickHandler}
                    className={`flex h-8 w-8 items-center justify-center rounded ${pageNum === currentIndex
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {pageNum + 1}
                </button>
            ))}

            <button
                id="btnNext"
                name="paginationBtn"
                onClick={clickHandler}
                disabled={currentIndex >= maxIndex}
                className={`flex h-8 w-8 items-center justify-center rounded ${currentIndex >= maxIndex
                    ? 'cursor-not-allowed text-gray-400'
                    : 'cursor-pointer text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Pagination; 