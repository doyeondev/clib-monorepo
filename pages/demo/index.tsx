import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/layoutDemo'
// import Image from 'next/image'
// import useSWR from 'swr'
// import Spinner from '@/components/clib/Spinner'
// import { v4 as uuidv4 } from 'uuid'
// import React, { useEffect, useState, Fragment, createContext, useContext } from 'react'
import React, { FC, useState, useEffect, useContext, createContext, MouseEvent, ReactNode } from 'react'

import { getRegExp } from 'korean-regexp'
import _ from 'lodash'

import SidePanel from '@/components/clib/Sidepanel'
import { getCategoryList } from '@/pages/api/clib'
import { SessionContext } from '@/pages/_app'

import 'react-tippy/dist/tippy.css'
// import { Tooltip } from 'react-tippy'
// import DashboardFooter from '@/components/ui/Pagination'
import DashboardFooter from '@/components/ui/Pagination'
import { SkeletonContract } from '@/components/ui/skeleton/contract-item'

const CategoryContext = createContext<any>([])

declare module 'react-tippy' {
  interface ToolTip {
    children: ReactNode
  }
}

interface ContractAsset {
  _id: string
  // Add other properties here
}

interface Category {
  _id: string
  assets: ContractAsset[]
  // Add other properties here
}

interface SessionContext {
  clippedContract: string[]
  contractAsset: any[]
  // Add other properties here
}

interface CategoryContext {
  categoryList: any[]
  currentCategory: any[]
  updateCategory: (e: MouseEvent) => void
}

const Contract: FC = () => {
  const [contractList, setContractList] = useState<any[]>([])
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [currentCategory, setCurrentCategory] = useState<any[] | string>([])

  const [loaded, setLoaded] = useState<boolean>(false)
  const { clippedContract, contractAsset } = useContext(SessionContext)
  useEffect(() => {
    async function getPageData() {
      if (loaded !== true) {
        const categories = await getCategoryList()
        console.log('categories[0].assets(contracts)', categories[0].assets)
        console.log('categories', categories)
        setContractList(categories[0].assets)
        setCategoryList(categories)
        setCurrentCategory(categories[0])
        setLoaded(true)
      }
    }
    getPageData()
  }, [])

  const updateCategory = (e: MouseEvent) => {
    if (e.currentTarget.id === 'clippedList') {
      //
      setContractList(contractAsset.filter((x: any) => clippedContract.includes(x._id)))
      setCurrentCategory('clippedList')
      console.log('clippedContract', clippedContract)
    } else {
      console.log('clicked id', e.currentTarget.id)
      const newCategory = categoryList.filter((x) => x._id === e.currentTarget.id)[0]
      console.log('newCategory', newCategory)
      setContractList(newCategory.assets)
      setCurrentCategory(newCategory)
    }
  }

  useEffect(() => {
    console.log('contractList', contractList)
  }, [contractList, currentCategory, categoryList])

  return (
    <Layout>
      <Head>
        <title>클립 | 계약서검색</title>
        <meta name="description" content="Clib My Asset" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <CategoryContext.Provider value={{ categoryList, currentCategory, updateCategory }}>{contractList?.length > 0 ? <MainLayout contractList={contractList} /> : <Spinner />}</CategoryContext.Provider> */}
      {/* <CategoryContext.Provider value={{ categoryList, currentCategory, updateCategory }}> */}
      <MainLayout contractList={contractList} categoryList={categoryList} currentCategory={currentCategory} updateCategory={updateCategory} />
      {/* </CategoryContext.Provider> */}
    </Layout>
  )
}

interface MainLayoutProps {
  contractList: any[]
  categoryList: any[]
  currentCategory: any[] | string
  updateCategory: (e: MouseEvent) => void
}

const MainLayout: FC<MainLayoutProps> = ({ contractList, categoryList, currentCategory, updateCategory }) => {
  const [searchType, setSearchType] = useState<string>('contract')

  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])

  // pagination
  const [contractGroup, setContractGroup] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [maxIndex, setMaxIndex] = useState<number>(0)

  useEffect(() => {
    console.log('searchType', searchType)
    if (searchType === 'contract') {
      setMaxIndex(contractGroup.length - 1)
    } else if (searchType === 'article') {
      // setMaxIndex(articleGroup.length - 1)
    }
  }, [searchType])

  useEffect(() => {
    setCurrentIndex(0)
    setContractGroup(_.chunk(contractList, 5))
    setMaxIndex(_.chunk(contractList, 5).length - 1)
    console.log('_.chunk(contractList, 5)', _.chunk(contractList, 5))
  }, [contractList])

  if (contractGroup.length > 0) {
    return (
      <>
        <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
        {contractGroup.map((elem, index) => {
          if (currentIndex === index) {
            return (
              <div key={index} className="flex min-h-[calc(100vh-120px)] flex-col bg-white">
                <CategoryContext.Provider value={{ categoryList, currentCategory, updateCategory }}>
                  <ContractList contractList={elem} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} maxIndex={maxIndex} data={data} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
                </CategoryContext.Provider>
              </div>
            )
          }
        })}
      </>
    )
  } else {
    return (
      <>
        <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
        <main className="mx-auto w-[920px] px-[10vw] py-8">
          <SkeletonContract />
          <SkeletonContract />
          <SkeletonContract />
          <SkeletonContract />
          <SkeletonContract />
        </main>
      </>
    )
  }
}

interface ContractListProps {
  contractList: any[]
  currentIndex: number
  // setCurrentIndex: (index: number) => void;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  maxIndex: number
  data: any
  // setData: (data: any) => void;
  setData: React.Dispatch<React.SetStateAction<any>>
  // setShowSidebar: (show: boolean) => void;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  showSidebar: boolean
}

interface Contract {
  _id: string
  article: any
  title: string
  categories: Category[]
  partyA: string
  partyB: string
  industry?: string
  purpose: string
}

interface Category {
  _id: string
  [x: string]: any
  [x: number]: any
}
{
  /* html, position, trigger, open:booleon, onShown, theme */
}

// interface Tooltip {
//   html: any
//   position: any
//   trigger: any
//   open: boolean
//   onShown: any
//   theme: any
// }

const ContractList: FC<ContractListProps> = ({ contractList, currentIndex, setCurrentIndex, maxIndex, data, setData, setShowSidebar, showSidebar }) => {
  const { clippedContract } = useContext(SessionContext)
  const [clickedItem, setClickedItem] = useState<any[]>([])

  let { categoryList, currentCategory, updateCategory } = useContext(CategoryContext)
  // let { currentCategry, updateCategory } = useContext(CategoryContext)

  console.log('currentCategory', currentCategory)

  const paginationOnClick = (e: any) => {
    console.log('clicked - onClickHandler')
    const btnId = e.currentTarget.id
    const type = e.currentTarget.name
    console.log('btnId : ', e.currentTarget.id)
    console.log('currentIndex', currentIndex)
    console.log('maxIndex', maxIndex)

    // if (btnId && type === 'paginationBtn') {
    if (type === 'paginationBtn') {
      if (btnId === 'btnNext' && currentIndex < maxIndex) {
        console.log('entered case 1')
        console.log({ currentIndex: currentIndex, 'currentIndex + 1': currentIndex + 1 })
        // console.log('currentIndex + 1', currentIndex + 1)

        setCurrentIndex(currentIndex + 1)
      } else if (btnId === 'btnPrevious' && currentIndex > 0) {
        console.log('entered case 2')
        setCurrentIndex(currentIndex - 1)
      }
    } else if (type === 'paginationNum') {
      console.log('paginationNum clicked!', btnId)
      setCurrentIndex(parseInt(btnId))
    }
  }

  function setSidebarData(item: any, parent: any) {
    setClickedItem(item)
    console.log('item', item)
    console.log('parent', parent)

    let match = contractList.filter((x) => x._id === parent._id)
    console.log('match', match[0])
    setData(match[0])

    setShowSidebar(!showSidebar)
  }

  return (
    <>
      <main className="mx-auto w-[920px] px-[10vw] py-6">
        <div className="flex w-fit flex-wrap items-center px-8 after:flex-auto">
          {categoryList.map((elem: any, index: number) => {
            // console.log('elem', elem)
            return (
              <div onClick={(e) => updateCategory(e)} id={elem._id} className={`mb-2.5 mr-1.5 cursor-pointer rounded px-2 py-1 shadow-sm ${elem._id === currentCategory._id ? 'bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'}`} key={index}>
                <p className={`pointer-events-none text-[13px] ${elem._id === currentCategory._id ? 'text-white' : 'text-gray-500'}`}>
                  {elem.title} ({elem.assets.length})
                </p>
              </div>
            )
          })}
          <div onClick={(e) => updateCategory(e)} id="clippedList" className={`mb-2.5 mr-1.5 cursor-pointer rounded  px-2 py-1 shadow-sm ${currentCategory === 'clippedList' ? 'bg-fuchsia-500' : 'bg-fuchsia-100 hover:bg-fuchsia-200'}`}>
            <p className={`pointer-events-none text-[13px] ${currentCategory === 'clippedList' ? 'text-white' : 'text-gray-500'}  `}>클립한 자료 ({clippedContract.length})</p>
          </div>
        </div>
        {contractList.map((item) => {
          // console.log('item', item)
          return (
            <div key={item._id} className="mt-4 flex w-full border-t border-dotted border-gray-400 px-8 pt-4">
              <div className="flex w-full grow flex-col space-y-4 border-gray-300 text-sm">
                <div className="flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div onClick={() => setSidebarData(item.article, item)} className="group flex w-full cursor-pointer items-center justify-between">
                      <div className="flex">
                        <div className="grow text-base font-bold tracking-wide text-gray-700 group-hover:text-gray-800 group-hover:underline">{item.title}</div>
                        <div className="ml-4 flex items-center space-x-2 text-xs">
                          {item.categories.length > 0 && (
                            <>
                              {item.categories.map((category: any) => {
                                const colors = require('tailwindcss/colors')

                                return (
                                  <div style={{ backgroundColor: colors[`${category.color}`]['100'] }} key={category._id} className={`rounded px-1.5 py-0.5 text-gray-700`}>
                                    {category.title}
                                  </div>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* <Tooltip
                      html={
                        toastDetail.action === '추가' ? (
                          // 추가
                          <div className="flex h-full w-full items-center space-x-2 px-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-green-600">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                              />
                            </svg>
                            <div className="text-xs font-semibold">계약서 클립완료!</div>
                          </div>
                        ) : (
                          // 추가
                          <div className="flex h-full w-full items-center space-x-3 px-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-red-400">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                              />
                            </svg>
                            <div className="text-xs font-semibold">즐겨찾기에서 삭제하였습니다!</div>
                          </div>
                        )
                      }
                      // inertia="true" // comeback
                      position="top"
                      trigger="click"
                      open={toastDetail.id === item._id ? toastState : false}
                      // shown={() => {
                      //   console.log('call')
                      // }}
                      theme="light"
                    >
                      <button id={item._id} name="contract" onClick={(e) => onClipClick(e)} className="group mt-1 transform cursor-pointer outline-none transition-transform active:scale-75">
                        {!clippedContract.includes(item._id) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none h-5 w-5 fill-gray-400 group-hover:fill-[#BB22E2]">
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none h-5 w-5 fill-[#BB22E2]">
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </Tooltip> */}
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <div className="flex flex-col">
                      <p className="text-gray-500">계약 당사자(갑)</p>
                      <p className="text-gray-800">{item.partyA}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">계약 당사자(을)</p>
                      <p className="text-gray-800">{item.partyB}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">산업</p>
                      <p className="text-gray-800">{`${item.industry ? item.industry : 'N/A'}`}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-[13px]">
                  <p className="text-gray-500">계약의 목적</p>
                  <p dangerouslySetInnerHTML={{ __html: item.purpose }} className="line-clamp-2 text-gray-800"></p>
                </div>
              </div>
            </div>
          )
        })}
        {showSidebar === true && <SidePanel clickedItem={clickedItem} data={data} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
      </main>
      <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
    </>
  )
}

// interface SearchWrapperProps {
//   contractList: string[]
//   searchType: string
//   setSearchType: (type: string) => void
//   setData: (data: any) => void
//   setShowSidebar: (showSidebar: boolean) => void
//   showSidebar: boolean
// }
const SearchWrapper = ({
  contractList,
  searchType,
  setSearchType,
  setData,
  setShowSidebar,
  showSidebar
}: {
  contractList: any[]
  searchType: string
  setSearchType: React.Dispatch<React.SetStateAction<string>>
  setData: (data: any) => void
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  showSidebar: boolean
}) => {
  // const SearchWrapper: FC<SearchWrapperProps> = ({ contractList, searchType, setSearchType, setData, setShowSidebar, showSidebar }) => {
  return (
    <section className="mt-6 flex flex-col px-[10vw] py-4">
      <aside className="mx-auto flex w-fit items-center gap-x-2 text-2xl">
        <h2 className="text-xl font-semibold">어떤 계약서 양식이 필요하신가요?</h2>
      </aside>
      <SearchInput contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
    </section>
  )
}

// interface Contract {
//   title: string;
//   clauseArray: Clause[];
// }

// interface Clause {
//   text: string;
//   source: Contract;
// }

// interface SearchResultProps {
//   searchResult: any[];
//   searchTerm: string;
//   searchType: string;
//   setData: (data: any) => void;
//   setShowSidebar: (showSidebar: boolean) => void;
//   showSidebar: boolean;
// }

// interface SearchInputProps {
//   contractList: any[];
//   searchType: string;
//   setSearchType: (searchType: string) => void;
//   setData: (data: any[]) => void;
//   setShowSidebar: (showSidebar: boolean) => void;
//   showSidebar: boolean;
// }

// const SearchInput = ({ contractList, searchType, setSearchType, setData, setShowSidebar, showSidebar }) => {
const SearchInput: React.FC<{
  contractList: any[]
  searchType: string
  setSearchType: React.Dispatch<React.SetStateAction<string>>
  setData: React.Dispatch<React.SetStateAction<any>>
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  showSidebar: boolean
}> = ({ contractList, searchType, setSearchType, setData, setShowSidebar, showSidebar }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResult, setSearchResult] = useState<any[]>([])

  useEffect(() => {
    // let filteredList: any[]
    let filteredList: any[] | undefined = undefined
    if (searchTerm === '') {
      setSearchResult([])
    } else {
      console.log('searchTerm', searchTerm)
      // let filteredList = runSearch(searchTerm)
      if (searchType === 'contract') filteredList = runSearch(searchTerm)
      if (searchType === 'article') filteredList = runClauseSearch(searchTerm)

      console.log('filteredList', filteredList)
      setTimeout(() => {
        if (filteredList && filteredList.length > 0) setSearchResult(filteredList)
        else setSearchResult([])
      }, 500)
    }
  }, [searchTerm])

  function resetSearch(newType: string) {
    // console.log('e.target.name', e.target.name)
    // setSearchType(e.target.name)
    console.log('newType', newType)
    setSearchType(newType)

    setSearchResult([])
  }
  // 계약서 제목만 검색함
  function runSearch(term: string) {
    let match = contractList.filter((x) => x.title.match(getRegExp(term)) !== null)
    console.log('match', match)
    return match
  }
  function runClauseSearch(term: string) {
    // let clauses = 여기 부분!!
    // let mergedClauseArray = []
    let matchArray: any[] = []
    for (let i = 0; i < contractList.length; i++) {
      console.log('contractList[i].clauseArray', contractList[i])
      let match = contractList[i].clauseArray.filter((x: any) => x.text.match(getRegExp(term)) !== null)
      console.log('match', match)
      if (match.length > 0) {
        for (let j = 0; j < match.length; j++) {
          match[j].source = contractList[i]
        }
        matchArray.push(match)
      }
    }
    console.log('matchArray', _.flatten(matchArray))
    return _.flatten(matchArray)
  }

  return (
    <>
      <div className="mx-auto mt-6 flex w-[540px] flex-col">
        <form className="flex w-full flex-col">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="flex w-full">
            <div className="relative w-full">
              <div className="hidden space-x-4 py-3 text-xs font-semibold">
                <div onClick={(e) => resetSearch(e.currentTarget.id)} id="contract" className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'contract' ? 'bg-gray-200/70 ' : 'bg-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F53" className="pointer-events-none h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                      clipRule="evenodd"
                    />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                  </svg>
                  <p className="pointer-events-none">제목검색</p>
                </div>
                <div onClick={(e) => resetSearch(e.currentTarget.id)} id="article" className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'article' ? 'bg-gray-200/70 ' : 'bg-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="pointer-events-none h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="pointer-events-none">조항검색</p>
                </div>
                <div onClick={(e) => resetSearch(e.currentTarget.id)} id="definition" className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'definition' ? 'bg-gray-200/70 ' : 'bg-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DF1F5D" className="pointer-events-none h-5 w-5">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                  <p className="pointer-events-none">정의검색</p>
                </div>
              </div>
              <div className="flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    className="block w-full rounded-lg border border-fuchsia-100 bg-fuchsia-50/30 p-2.5 ps-5 text-sm text-gray-900 hover:border-fuchsia-200 hover:bg-white focus:border-fuchsia-300 focus:bg-white focus:ring-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                    placeholder="계약서를 검색해보세요!"
                    onChange={async (e) => setSearchTerm(e.currentTarget.value)}
                    required
                  />
                  {searchTerm.length > 0 && (
                    <button onClick={() => setSearchTerm('')} type="button" className="group absolute inset-y-0 end-0 flex items-center pe-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none h-5 w-5 fill-gray-400 group-hover:fill-gray-800">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  // className="ms-2 flex items-center rounded-lg border border-purple-700 bg-purple-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                  className="three-d-gray ms-2 flex items-center rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm font-medium text-white hover:bg-gray-800/90 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                >
                  <svg className="me-2 h-4 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                  <span className="w-full">검색</span>
                </button>
              </div>
            </div>
          </div>
        </form>
        {searchResult.length > 0 && <SearchResult searchResult={searchResult} searchTerm={searchTerm} searchType={searchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />}
      </div>
    </>
  )
}

// interface SearchResultProps {
//   searchResult: SearchResultItem[];
//   searchTerm: string;
//   searchType: string;
//   setData: (item: SearchResultItem) => void;
//   setShowSidebar: (show: boolean) => void;
//   showSidebar: boolean;
// }
// const SearchResult: FC<SearchResultProps> = ({ searchResult, searchTerm, searchType, setData, setShowSidebar, showSidebar }) => {

// setSearchType: React.Dispatch<React.SetStateAction<string>>
// setData: React.Dispatch<React.SetStateAction<any>>
// setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>

const SearchResult = ({
  searchResult,
  searchTerm,
  searchType,
  setData,
  setShowSidebar,
  showSidebar
}: {
  searchResult: any[]
  searchTerm: string
  searchType: string
  setData: (data: any[]) => void
  // setData: React.Dispatch<React.SetStateAction<any>>

  setShowSidebar: (showSidebar: boolean) => void
  // setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>

  showSidebar: boolean
}) => {
  function setSidebarData(item: any) {
    // setClickedItem(item)
    console.log('item', item)
    setData(item)
    setShowSidebar(!showSidebar)
  }

  console.log('searchResult', searchResult)
  // if (searchResult.length > 0) {
  return (
    <>
      <div className="flex w-[458px] flex-col rounded rounded-b-lg bg-white shadow">
        {searchResult.map((resultObj, index) => {
          let matchingTerm, additionalInfo
          // 1. 계약서 제목 검색
          if (searchType === 'contract') {
            matchingTerm = resultObj.title.replace(searchTerm, `<span class="font-bold text-purple-800">${searchTerm}</span>`)
            additionalInfo = `<p>${resultObj.source}</p>`
            const colors = require('tailwindcss/colors')

            return (
              <div key={index} id={resultObj._id} onClick={() => setSidebarData(resultObj)} className="flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                <div className="ml-4 flex items-center space-x-2 text-xs">
                  {resultObj.categories.length > 0 && (
                    <>
                      {/* <p className="text-gray-900">관련분야</p> */}
                      {resultObj.categories.map((category: any) => {
                        return (
                          <div key={category._id} style={{ backgroundColor: colors[`${category.color}`]['100'] }} className={`rounded px-1.5 py-0.5 text-gray-700`}>
                            {category.title}
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
                {/* <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div> */}
              </div>
            )
          } else if (searchType === 'article') {
            console.log('resultObj', resultObj)
            matchingTerm = resultObj.text.replace(searchTerm, `<span class="font-bold text-purple-800">${searchTerm}</span>`)
            additionalInfo = `<p>${resultObj.source.title} (${resultObj.source.source})</p>`
            return (
              <Link
                key={index}
                href={{
                  pathname: `/clib/search/${resultObj.source._id}`,
                  query: resultObj // the data
                }}
                className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50"
              >
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }}></p>
                <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div>
              </Link>
            )
          }
        })}
      </div>
    </>
  )
  // } else {
  //   return null
  // }
}

export default Contract
