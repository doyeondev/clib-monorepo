import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

/**
 * 페이지네이션 푸터 컴포넌트 타입 정의
 */
interface DashboardFooterProps {
  onClickHandler: (e: React.MouseEvent<HTMLElement>) => void
  currentIndex: number
  maxIndex: number
}

/**
 * 페이지네이션 푸터 컴포넌트
 * 페이지 탐색 버튼과 숫자 목록을 표시합니다.
 */
const DashboardFooter: React.FC<DashboardFooterProps> = ({ onClickHandler, currentIndex, maxIndex }) => {
  return (
    <>
      {/* mx-auto w-[920px] px-[10vw]  */}
      <div className="mx-auto flex items-center justify-between py-6">
        {/* <div className="absolute bottom-0 left-0 right-0 mx-auto mb-auto mt-4 flex w-[920px] items-center justify-between px-[10vw] py-6"> */}
        <button
          id="btnPrevious"
          name="paginationBtn"
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
          name="paginationBtn"
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

/**
 * 페이지 번호 컴포넌트
 * 현재 페이지와 전체 페이지를 표시합니다.
 * 너무 많은 페이지가 있을 경우 일부는 ...로 표시합니다.
 */
const FooterPagination: React.FC<{ currentIndex: number; maxIndex: number; onClickHandler: any }> = ({ currentIndex, maxIndex, onClickHandler }) => {
  const pagination = [];
  const MAX_VISIBLE_PAGES = 5; // 한 번에 보여줄 최대 페이지 수

  // 항상 표시할 특정 페이지 계산
  const firstPage = 0;
  const lastPage = maxIndex;
  const showEllipsisStart = currentIndex > 2;
  const showEllipsisEnd = currentIndex < maxIndex - 2;

  // 표시할 페이지 범위 계산
  let startPage = Math.max(0, currentIndex - Math.floor(MAX_VISIBLE_PAGES / 2));
  let endPage = Math.min(maxIndex, startPage + MAX_VISIBLE_PAGES - 1);

  // startPage 재조정
  if (endPage === maxIndex) {
    startPage = Math.max(0, maxIndex - MAX_VISIBLE_PAGES + 1);
  }

  // 첫 페이지 추가
  if (firstPage < startPage) {
    pagination.push(
      <button
        key={uuidv4()}
        id="0"
        onClick={onClickHandler}
        name="paginationNum"
        className={`rounded-md px-2 py-1 text-sm ${currentIndex === 0 ? 'bg-blue-100/60 text-blue-500 dark:bg-gray-800' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        1
      </button>
    );

    // 첫 페이지와 시작 페이지 사이에 간격이 있으면 ... 추가
    if (showEllipsisStart && startPage > 1) {
      pagination.push(
        <span key="ellipsis-start" className="px-1 py-1 text-sm text-gray-500">...</span>
      );
    }
  }

  // 중간 페이지들 추가
  for (let i = startPage; i <= endPage; i++) {
    // 첫 페이지와 마지막 페이지는 이미 처리했거나 처리할 예정이므로 건너뛰기
    if ((i === firstPage && firstPage < startPage) || (i === lastPage && lastPage > endPage)) continue;

    pagination.push(
      <button
        key={uuidv4()}
        id={i.toString()}
        onClick={onClickHandler}
        name="paginationNum"
        className={`rounded-md px-2 py-1 text-sm ${i === currentIndex ? 'bg-blue-100/60 text-blue-500 dark:bg-gray-800' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        {i + 1}
      </button>
    );
  }

  // 마지막 페이지 추가
  if (lastPage > endPage) {
    // 마지막 페이지와 끝 페이지 사이에 간격이 있으면 ... 추가
    if (showEllipsisEnd && endPage < maxIndex - 1) {
      pagination.push(
        <span key="ellipsis-end" className="px-1 py-1 text-sm text-gray-500">...</span>
      );
    }

    pagination.push(
      <button
        key={uuidv4()}
        id={lastPage.toString()}
        onClick={onClickHandler}
        name="paginationNum"
        className={`rounded-md px-2 py-1 text-sm ${currentIndex === lastPage ? 'bg-blue-100/60 text-blue-500 dark:bg-gray-800' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        {lastPage + 1}
      </button>
    );
  }

  return <>{pagination}</>;
}

export default DashboardFooter
