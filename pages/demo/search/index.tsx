import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/layoutDemo'

import useSWR from 'swr'
import React, { useEffect, useState, createContext, useContext, FC } from 'react'
import Spinner from '@/components/clib/Spinner'

import { getRegExp } from 'korean-regexp'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { SessionContext } from '@/pages/_app'

import SidePanel from '@/components/clib/Sidepanel'
// import { AssetContext } from 'path/to/AssetContext';

const fetcher = () => fetch('https://conan.ai/_functions/clibClauseAsset').then((response) => response.json())

const ArticleContext = createContext<any | undefined>(undefined) // Context 밖에서 사용하면 null일 수 있다.
const AssetContext = createContext<any | undefined>(undefined) // Context 밖에서 사용하면 null일 수 있다.
// const ClauseContext = createContext()

interface SearchProps {}
const Search: FC<SearchProps> = () => {
  const { data } = useSWR('search', fetcher)
  if (data) console.log('data', data)
  let { contractAsset } = useContext(SessionContext)

  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [clickedItem, setClickedItem] = useState<any[]>([])
  const [itemData, setItemData] = useState<any[]>([])

  function setSidebarData(item: any) {
    setClickedItem(item)
    console.log('item', item)
    console.log('contractAsset!', contractAsset)
    let match = contractAsset?.filter((x: any) => x._id === item.contract_asset)
    console.log('match', match)
    setItemData(match[0])
    setShowSidebar(!showSidebar)
    // let match = contractList.filter((x) => x.id === item_id)
  }

  useEffect(() => {
    async function getPageData() {
      if (sessionStorage.getItem('item_key')) sessionStorage.removeItem('item_key') // remove contract key session
    }
    getPageData()
  }, [])

  return (
    <Layout>
      <Head>
        <title>클립 | 조항검색</title>
        <meta name="description" content="Clib My Asset" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data ? (
        <AssetContext.Provider value={{ data, showSidebar, setShowSidebar, clickedItem, setClickedItem, itemData, setItemData, setSidebarData }}>
          <MainLayout contractList={data.items} />
        </AssetContext.Provider>
      ) : (
        <Spinner />
      )}
    </Layout>
  )
}

interface MainLayoutProps {
  contractList: any[]
}
const MainLayout: FC<MainLayoutProps> = ({ contractList }) => {
  // const MainLayout = ({ contractList }: { contractList: any[] }): JSX.Element => {
  const { data, showSidebar, setShowSidebar, clickedItem, setClickedItem, itemData, setItemData, setSidebarData } = useContext(AssetContext)
  const { items: clauseAsset } = data
  console.log('clauseAsset', clauseAsset)
  const [clauseList, setClauseList] = useState<any[]>([])

  const [searchType, setSearchType] = useState<string>('contract')
  const [currentData, setCurrentData] = useState<any[]>([])
  const [articleData, setArticleData] = useState<any[]>([])
  const [articleGroup, setArticleGroup] = useState<any[]>([])
  const [contractGroup, setContractGroup] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [maxIndex, setMaxIndex] = useState<number>(0)

  // let cleanedClauseArray: any[] = []
  // let match: any, fullData: any

  useEffect(() => {
    if (searchType === 'contract') {
      setCurrentData(contractGroup)
      setMaxIndex(contractGroup.length - 1)
    } else if (searchType === 'article') {
      setCurrentData(articleGroup)
      setMaxIndex(articleGroup.length - 1)
    }
  }, [searchType])

  useEffect(() => {
    setCurrentIndex(0)
    setClauseList(clauseAsset ? clauseAsset : [])
    setSearchType('article')
    let chunkData
    if (searchType === 'contract') chunkData = _.chunk(contractList, 5)
    setContractGroup(_.chunk(contractList, 5))
    setArticleGroup(_.chunk(clauseAsset, 5))
    setCurrentData(_.chunk(clauseAsset, 5))
    setMaxIndex(_.chunk(clauseAsset, 5).length - 1)
  }, [])

  function shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5)
  }

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const btnId = e.currentTarget.id
    const type = e.currentTarget.name

    if (btnId && type === 'paginationBtn') {
      if (btnId === 'btnNext' && currentIndex < maxIndex) {
        setCurrentIndex(currentIndex + 1)
      } else if (btnId === 'btnPrevious' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    }

    if (btnId && type === 'paginationNum') {
      setCurrentIndex(parseInt(btnId))
    }
  }

  if (searchType === 'contract') {
    return (
      <div className="bg-white">
        {contractGroup.map((elem, index) => {
          if (currentIndex === index) {
            return (
              <div key={index}>
                <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
                <ContractList contractList={elem} />
                <DashboardFooter onClickHandler={onClickHandler} currentIndex={currentIndex} maxIndex={maxIndex} />
              </div>
            )
          }
        })}
      </div>
    )
  } else if (searchType === 'article') {
    return (
      <ArticleContext.Provider value={{ articleData, clauseList }}>
        <div className="bg-white">
          <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
          <ArticleList contractList={contractList} articleGroup={articleGroup} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} maxIndex={maxIndex} />
        </div>
      </ArticleContext.Provider>
    )
  } else {
    return null
  }
}

interface ContractListProps {
  contractList: Contract[]
}
interface Contract {
  _id: string
  title: string
  contract_title: string
  partyA: string
  partyB: string
  industry: string
  purpose: string
}
const ContractList: FC<ContractListProps> = ({ contractList }) => {
  return (
    <main className="mx-auto w-[920px] px-[10vw] py-6">
      {contractList.map((item: Contract) => {
        console.log('item', item)
        return (
          <div key={item._id} className="mt-4 flex w-full border-b pb-4">
            <div className="h-auto w-5 flex-none grow border-l-4 border-[#0f4a86]"></div>
            <div className="flex w-full grow flex-col space-y-4 border-gray-300 text-sm">
              <Link href={`/search/${item._id}`} className="group flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grow text-base font-bold tracking-wide text-[#0675ac] hover:text-[#0675ac] group-hover:underline">{item.title}</div>
                  <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">{item.contract_title}</div>
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
                    <p className="text-gray-800">{item.industry}</p>
                  </div>
                </div>
              </Link>
              <div className="flex flex-col text-[13px]">
                <p className="text-gray-500">계약의 목적</p>
                <p className="line-clamp-2 text-gray-800">{item.purpose}</p>
              </div>
            </div>
          </div>
        )
      })}
    </main>
  )
}

interface ArticleListProps {
  contractList: any[]
  articleGroup: any[]
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  maxIndex: number
}

const ArticleList: FC<ArticleListProps> = ({ contractList, articleGroup, currentIndex, setCurrentIndex, maxIndex }) => {
  let { data, showSidebar, setShowSidebar, clickedItem, setClickedItem, itemData, setItemData, setSidebarData } = useContext(AssetContext)

  let { clauseList, articleData } = useContext(ArticleContext)
  let { contractAsset } = useContext(SessionContext)

  console.log('contractAsset', contractAsset)

  console.log('clauseList', clauseList)

  const paginationOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked - onClickHandler')
    const btnId = e.currentTarget.id
    const type = e.currentTarget.name
    console.log('btnId : ', e.currentTarget.id)
    console.log('currentIndex', currentIndex)
    console.log('maxIndex', maxIndex)

    if (btnId && type === 'paginationBtn') {
      if (btnId === 'btnNext' && currentIndex < maxIndex) {
        console.log('entered case 1')
        setCurrentIndex(currentIndex + 1)
      } else if (btnId === 'btnPrevious' && currentIndex > 0) {
        console.log('entered case 2')
        setCurrentIndex(currentIndex - 1)
      }
    }

    if (btnId && type === 'paginationNum') {
      setCurrentIndex(parseInt(btnId))
    }
  }

  useEffect(() => {
    if (data.length > 0 && clickedItem.length > 0) {
      console.log('data?', data)
      console.log('clickedItem?', clickedItem)
    }
  }, [data, clickedItem])

  return (
    <main className="mx-auto w-[920px] px-[10vw] py-6">
      {clauseList.map((item: any, index: number) => {
        console.log('item', item)
        let CONTENT_HTML = ''
        for (let i = 0; i < item.content_array.length; i++) {
          console.log('contentList[i].html', item.content_array[i])
          CONTENT_HTML = CONTENT_HTML.concat(item.content_array[i].html)
        }
        return (
          <div key={index} className="mt-4 flex w-full border-b pb-4">
            <div className="h-auto w-5 flex-none grow border-l-4 border-gray-500"></div>
            <div className="flex w-full grow flex-col text-sm">
              <div className="flex flex-col">
                <div onClick={(e) => setSidebarData(item)} className="group flex cursor-pointer items-center justify-between pb-4">
                  <div className="mr-1 grow text-base font-bold tracking-wide text-black group-hover:text-gray-700 group-hover:underline">{item.clause_title}</div>
                  <div className="rounded bg-slate-100 px-2 py-0.5 text-xs text-gray-500 group-hover:visible">From: {item.contract_title}</div>
                </div>
                <div className="flex flex-col text-[13px] leading-relaxed">
                  <p className="w-fit font-medium text-gray-500">본문 내용</p>
                  <div key={item._id} dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} className="text-gray-900"></div>
                </div>
              </div>
              <div className="my-4 w-full border-b-2 border-dotted"></div>
              <div className="flex justify-between text-[13px] ">
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
                  <p className="text-gray-800">{item.industry}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      {showSidebar === true && <SidePanel clickedItem={clickedItem} data={itemData} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
      <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
    </main>
  )
}

interface SearchWrapperProps {
  contractList: any
  searchType: string
  setSearchType: React.Dispatch<React.SetStateAction<string>>
}

const SearchWrapper: FC<SearchWrapperProps> = ({ contractList, searchType, setSearchType }) => {
  return (
    <section className="mt-6 flex flex-col px-[10vw] py-6">
      <aside className="mx-auto flex w-fit items-center gap-x-2 text-xl">
        {searchType === 'contract' ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F53" className="mr-1 h-6 w-6">
            <path
              fillRule="evenodd"
              d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
              clipRule="evenodd"
            />
            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="mr-1 h-6 w-6">
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <h2 className="font-semibold">{searchType === 'contract' ? '어떤 계약서 양식이 필요하신가요?' : '계약서 조항을 검색하세요!'}</h2>
      </aside>
      <SearchInput contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
    </section>
  )
}

interface SearchInputProps {
  contractList: any[]
  searchType: string
  setSearchType: React.Dispatch<React.SetStateAction<string>>
}

const SearchInput: FC<SearchInputProps> = ({ searchType, setSearchType }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResult, setSearchResult] = useState<any[]>([])
  const { clauseList, articleData } = useContext(ArticleContext)

  useEffect(() => {
    let filteredList: any[] | undefined = undefined
    if (searchTerm !== '') {
      setSearchResult([])
    } else {
      console.log('searchTerm', searchTerm)
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
    console.log('newType', newType)
    setSearchType(newType)
    setSearchResult([])
  }

  function runSearch(term: string) {
    let match = clauseList.filter((x: any) => x.title.match(getRegExp(term)) !== null)
    console.log('match', match)
    return match
  }

  function runClauseSearch(term: string) {
    // let mergedClauseArray: any[] = [];
    let matchArray: any[] = []
    let match = clauseList.filter((x: any) => x.clause_title.match(getRegExp(term)) !== null)
    console.log('match', match)
    console.log('matchArray', _.flatten(matchArray))
    return match
  }

  return (
    <>
      <div className="mx-auto mt-6 flex w-[560px] flex-col ">
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
              <div className="mt-4 flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-5 text-sm text-gray-900 hover:bg-gray-100 focus:border-none focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="검색어를 입력하세요"
                    onChange={async (e) => setSearchTerm(e.currentTarget.value)}
                    required
                  />
                  {searchTerm.length > 0 && (
                    <button onClick={() => setSearchTerm('')} type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#6A7280" className="pointer-events-none h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="ms-2 inline-flex items-center rounded-lg border border-blue-700 bg-blue-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg className="me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>

        {searchResult.length > 0 && <SearchResult searchResult={searchResult} searchTerm={searchTerm} searchType={searchType} />}
      </div>
    </>
  )
}

interface SearchResultProps {
  // searchResult: Array<any>;
  searchResult: any[]
  searchTerm: string
  searchType: string
}

const SearchResult: FC<SearchResultProps> = ({ searchResult, searchTerm, searchType }) => {
  const { setSidebarData } = useContext(AssetContext)

  console.log('searchResult', searchResult)
  if (searchTerm.length > 0 && searchResult.length > 0) {
    // if (searchResult.length > 0) {
    return (
      <div className="flex flex-col rounded bg-gray-100 shadow-sm">
        {searchResult.map((resultObj, index) => {
          let matchingTerm: string, additionalInfo: string

          // 1. 계약서 제목 검색
          if (searchType === 'contract') {
            matchingTerm = resultObj.title.replace(searchTerm, `<span class="font-bold text-blue-800">${searchTerm}</span>`)
            additionalInfo = `<p>${resultObj.source}</p>`
            return (
              <Link key={index} href={`/search/${resultObj._id}`} className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50">
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div>
              </Link>
            )
          } else if (searchType === 'article') {
            // console.log('resultObj', resultObj)
            matchingTerm = resultObj.clause_title.replace(searchTerm, `<span class="font-bold text-blue-800">${searchTerm}</span>`)
            additionalInfo = `<p>${resultObj.contract_title}</p>`
            return (
              // <div onClick={(e) => setSidebarData(item)} className="group flex cursor-pointer items-center justify-between pb-4">
              <div key={index} onClick={() => setSidebarData(resultObj)} className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50">
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div>
              </div>
            )
          }
        })}
      </div>
    )
  } else {
    return null
  }
}

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
        <Link href="#" id={i.toString()} onClick={onClickHandler} className="rounded-md bg-purple-100/60 px-2 py-1 text-sm text-purple-500 dark:bg-gray-800" key={uuidv4()}>
          {i + 1}
        </Link>
      )
    } else {
      pagination.push(
        <Link href="#" id={i.toString()} onClick={onClickHandler} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" key={uuidv4()}>
          {i + 1}
        </Link>
      )
    }
  }
  return <>{pagination}</>
}

export default Search
