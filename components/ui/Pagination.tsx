import React, { FC } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

interface DashboardFooterProps {
  onClickHandler: any
  currentIndex: number
  maxIndex: number
}

const DashboardFooter: FC<DashboardFooterProps> = ({ onClickHandler, currentIndex, maxIndex }) => {
  return (
    <>
      {/* mx-auto w-[920px] px-[10vw]  */}
      <div className="mx-auto mt-auto flex w-[920px] items-center justify-between self-end px-[calc(10vw+32px)] py-6">
        {/* <div className="absolute bottom-0 left-0 right-0 mx-auto mb-auto mt-4 flex w-[920px] items-center justify-between px-[10vw] py-6"> */}
        <button
          id="btnPrevious"
          name="paginationBtn"
          onClick={onClickHandler}
          className="flex w-[90px] cursor-pointer place-content-center gap-x-2 rounded-md border bg-white py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none h-5 w-5 rtl:-scale-x-100">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
          이전
        </button>
        <div className="flex items-center gap-x-3">
          <FooterPagination currentIndex={currentIndex} maxIndex={maxIndex} onClickHandler={onClickHandler} />
        </div>

        <button
          id="btnNext"
          name="paginationBtn"
          onClick={onClickHandler}
          className="flex w-[90px] cursor-pointer place-content-center gap-x-2 rounded-md border bg-white py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
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

// interface FooterPaginationProps {
//   currentIndex: number
//   maxIndex: number
//   onClickHandler: () => void
// }

const FooterPagination: React.FC<{ currentIndex: number; maxIndex: number; onClickHandler: () => void }> = ({ currentIndex, maxIndex, onClickHandler }) => {
  // const FooterPagination: FC<FooterPaginationProps> = ({ currentIndex, maxIndex, onClickHandler }) => {
  // let filteredList: any[] | undefined = undefined

  let paginationGroup: number[][] = _.chunk([maxIndex], 8)
  // console.log('maxIndex', maxIndex)
  // console.log('currentIndex123', currentIndex)

  const pagination: JSX.Element[] = []

  for (let i = 0; i <= maxIndex; i++) {
    if (i === currentIndex) {
      pagination.push(
        // <Link href="#" id={i} name="paginationNum" onClick={onClickHandler} className="rounded-md bg-purple-100/60 px-2 py-1 text-sm text-purple-500 dark:bg-gray-800" key={uuidv4()}>
        <button id={i.toString()} name="paginationNum" onClick={onClickHandler} className="rounded-md bg-purple-100/60 px-2 py-1 text-sm text-purple-500 dark:bg-gray-800" key={uuidv4()}>
          {i + 1}
        </button>
      )
    } else {
      pagination.push(
        <button id={i.toString()} name="paginationNum" onClick={onClickHandler} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" key={uuidv4()}>
          {i + 1}
        </button>
      )
    }
  }
  return <>{pagination}</>
}

export default DashboardFooter
