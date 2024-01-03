import Link from 'next/link'
import Head from 'next/head'
import Layout from '/components/layoutDemo'
import Image from 'next/image'

import useSWR from 'swr'
import React, { useEffect, useState, Fragment, createContext, useContext } from 'react'
import { Spinner } from '/components/clib/Spinner.js'

import { getRegExp } from 'korean-regexp'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import SidePanel from '/components/clib/Sidepanel'
import { getContractList, getCategoryList, getContractItem, getClibDataset, getClauseCategoryList } from '/pages/api/clib'
import { NoBackpackSharp } from '@mui/icons-material'

import { SessionContext } from '/pages/_app'

// 추가
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import { colors, fontFamily, fontSize } from 'tailwindcss/defaultTheme'

const CategoryContext = createContext()
const ClipContext = createContext()

const Clause = () => {
  const [contractList, setContractList] = useState([])
  const [clauseList, setClauseList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [clickedCategory, setClickedCategory] = useState([])

  const [currentCategory, setCurrentCategory] = useState([])

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function getPageData() {
      if (loaded !== true) {
        const clip_clause = await getClibDataset('clib_clause', '')
        const clause_category = await getClauseCategoryList()
        console.log('clip_clause', clip_clause)
        console.log('clause_category', clause_category)
        setContractList(_.orderBy(clip_clause, ['clause_category', 'idx'], ['asc', 'asc']))
        setClauseList(_.orderBy(clip_clause, ['clause_category', 'idx'], ['asc', 'asc']))
        setCategoryList(clause_category)
        setCurrentCategory(clause_category[0])
        setLoaded(true)
      }
    }
    getPageData()
  }, [])

  useEffect(() => {
    if (loaded === true && clauseList.length > 0) {
      let updatedCategoryList = [...categoryList]

      for (let i = 0; i < categoryList.length; i++) {
        const clauseHolder = clauseList.filter((x) => x.clause_category === categoryList[i]._id)
        updatedCategoryList[i].assets = clauseHolder
      }
      let data = { assets: clauseList, title: '전체', color: 'zinc', title_en: 'All', idx: 0, _id: 'allClauses' } // 전체 계약서 모음
      updatedCategoryList[0]._id !== 'allClauses' && updatedCategoryList.unshift(data)

      setCategoryList(updatedCategoryList)
    }
  }, [loaded, clauseList])

  const updateCategory = (e) => {
    console.log('clicked id', e.target.id)
    const clickedItem = e.target.id
    const type = e.target.getAttribute('name')
    console.log('e.target.name', type)
    console.log('currentCategory???', currentCategory)
    if (clickedItem === 'clippedList') {
      if (currentCategory === 'clippedList') {
        setClickedCategory((current) => [...current.filter((x) => x === 'allClauses')]) // '전체'눌렀으면 다른거는 다 꺼주고 '전체'만 눌러줌
      } else {
        setClickedCategory(['clippedList'])
      }
    } else {
      if (type === 'search') {
        if (clickedCategory.includes('clippedList')) {
          console.log('진입!')
        } else {
          setClickedCategory([clickedItem]) // '전체'눌렀으면 다른거는 다 꺼주고 '전체'만 눌러줌
        }
        console.log('search눌림')
      } else {
        // 1. 넣어주고
        if (!clickedCategory.includes(clickedItem)) {
          console.log('click case 1')
          // "전체선택이 눌려있는 상태"
          if (clickedCategory.includes('allClauses')) {
            setClickedCategory((current) => [...current.filter((x) => x !== 'allClauses'), clickedItem]) // 전체는 빼주고 클릭된거 넣어줌
          } else if (clickedCategory.includes('clippedList')) {
            setClickedCategory((current) => [...current.filter((x) => x !== 'clippedList'), clickedItem]) // '전체'눌렀으면 다른거는 다 꺼주고 '전체'만 눌러줌
          }
          // "전체선택이 안 눌려있는 상태"
          else {
            if (clickedItem === 'allClauses') {
              // "전체선택이 눌린 상황"
              setClickedCategory((current) => [...current.filter((x) => x === 'allClauses')]) // '전체'눌렀으면 다른거는 다 꺼주고 '전체'만 눌러줌
            } else {
              // "전체선택 이외의 버튼이 눌린 상황"
              setClickedCategory((current) => [...current, clickedItem])
            }
          }
        }
        // 2. 빼주고
        else {
          console.log('click case 4')
          setClickedCategory((current) => [...current.filter((x) => x !== clickedItem)])
        }
      }
    }
  }

  const { clippedClause } = useContext(SessionContext)

  useEffect(() => {
    console.log('clickedCategory', clickedCategory)
    if (clickedCategory.includes('clippedList')) {
      setContractList(clauseList.filter((x) => clippedClause.includes(x._id)))
      setCurrentCategory('clippedList')
    } else {
      if (clickedCategory.length < 1) {
        setClickedCategory((current) => [...current, 'allClauses']) // 하나도 안눌리면 자동으로 전체 보여줌
      } else if (clickedCategory.includes('allClauses')) {
        setContractList(clauseList) // 전체 클릭하면 모든 리스트
        setCurrentCategory(categoryList.filter((x) => x._id === 'allClauses'))
      } else {
        const newClauseList = clauseList.filter((x) => clickedCategory.includes(x.clause_category))
        const newCategory = categoryList.filter((x) => clickedCategory.includes(x._id))
        // let newContractList = [...contractList]
        // newContractList = newCategory.assets
        console.log('newClauseList', newClauseList)
        console.log('newCategory', newCategory)

        setContractList(newClauseList)
        setCurrentCategory(newCategory)
      }
    }
  }, [clickedCategory])

  return (
    <Layout>
      <Head>
        <title>클립 | 공유자산</title>
        <meta name="description" content="Clib My Asset" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CategoryContext.Provider value={{ contractList, clauseList, categoryList, currentCategory, updateCategory, clickedCategory }}>
        {contractList?.length > 0 ? <MainLayout contractList={contractList} /> : <Spinner />}
      </CategoryContext.Provider>
    </Layout>
  )
}

const MainLayout = ({ contractList }) => {
  const [searchType, setSearchType] = useState('contract')
  const [showSidebar, setShowSidebar] = useState(false)
  const [data, setData] = useState([])
  const [articleGroup, setArticleGroup] = useState([])

  // pagination

  const [contractGroup, setContractGroup] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)

  useEffect(() => {
    console.log('searchType', searchType)
    if (searchType === 'contract') {
      setMaxIndex(contractGroup.length - 1)
    } else if (searchType === 'article') {
      setMaxIndex(articleGroup.length - 1)
    }
  }, [searchType])

  useEffect(() => {
    setCurrentIndex(0)
    let index = 0
    // setContractGroup(_.chunk(_.orderBy(contractList, ['idx'], ['asc']), 5))
    setContractGroup(_.chunk(contractList, 5))
    setMaxIndex(_.chunk(contractList, 5).length - 1)
    // console.log('_.chunk(contractList, 5)', _.chunk(contractList, 5))
  }, [contractList])

  if (searchType === 'contract') {
    return (
      // <div className="h-full bg-white">
      <>
        {contractGroup.map((elem, index) => {
          if (currentIndex === index) {
            return (
              <div key={index} className="flex min-h-[calc(100vh-120px)] flex-col bg-white">
                <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
                <ContractList contractList={elem} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} maxIndex={maxIndex} data={data} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
              </div>
            )
          }
        })}
      </>
      // </div>
    )
  } else if (searchType === 'article') {
    return (
      <div className="bg-white">
        <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} />
        <ArticleList contractList={contractList} articleGroup={articleGroup} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} maxIndex={maxIndex} />
      </div>
    )
  }
}

const ContractList = ({ contractList, currentIndex, setCurrentIndex, maxIndex, data, setData, setShowSidebar, showSidebar }) => {
  const { clippedClause, onClipClick, toastDetail, toastState, setToastState } = useContext(SessionContext)
  // const {  } = useContext(SessionContext)
  //   console.log('clippedContract', clippedContract)

  const [clickedItem, setClickedItem] = useState([])

  let { categoryList, currentCategory, updateCategory, clickedCategory } = useContext(CategoryContext)
  // console.log('clickedCategory', clickedCategory)

  const paginationOnClick = (e) => {
    console.log('clicked - onClickHandler')
    const btnId = e.target.id
    const type = e.target.name
    console.log('btnId : ', e.target.id)
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
      // console.log('clicked', btnId)
      setCurrentIndex(parseInt(btnId))
    }
  }
  // onClickHandler={onClickHandler} currentIndex={currentIndex} maxIndex={maxIndex}

  function setSidebarData(item, parent) {
    setClickedItem(item)
    console.log('item', item)
    console.log('parent', parent)

    let match = contractList.filter((x) => x._id === parent._id)
    console.log('match', match[0])
    setData(match[0])

    setShowSidebar(!showSidebar)
    // toggleSlideover()
    // let match = contractList.filter((x) => x.id === item_id)
  }

  return (
    <>
      <main className="mx-auto flex px-[10vw] py-6">
        <div className="mr-8 mt-4 flex h-fit flex-col items-center rounded border border-dotted py-2">
          {/* {categoryList.map((elem, index) => {
            // console.log('elem', elem)
            return (
              <div onClick={(e) => updateCategory(e)} id={elem._id} className={`mb-2.5 mr-1.5 cursor-pointer rounded px-2 py-1 shadow-sm ${elem._id === currentCategory._id ? 'bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'}`} key={index}>
                <p className={`pointer-events-none text-[13px] ${elem._id === currentCategory._id ? 'text-white' : 'text-gray-500'}`}>{elem.title}</p>
              </div>
            )
          })} */}
          <div className="mx-auto w-[220px] space-y-2 px-2">
            {categoryList.map((elem, index) => {
              // console.log('elem', elem)
              return (
                <div onClick={(e) => updateCategory(e)} id={elem._id} className={`mr-1.5 flex w-full cursor-pointer items-center rounded px-3 py-1 hover:bg-fuchsia-100/50 ${clickedCategory.includes(elem._id) && ''}`} key={index}>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-3 h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg> */}
                  <input readOnly type="checkbox" className={`pointer-events-none mr-4 h-4 w-4 rounded border-gray-300 bg-gray-100 text-fuchsia-500`} checked={clickedCategory.includes(elem._id) && true} />
                  <p className={`pointer-events-none text-[13px] ${clickedCategory.includes(elem._id) ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                    {elem.title} 조항 ({elem.assets?.length})
                  </p>
                </div>
              )
            })}
            <div onClick={(e) => updateCategory(e)} id="clippedList" className={`mr-1.5 flex w-full cursor-pointer items-center rounded px-3 py-1 hover:bg-fuchsia-100/50`}>
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-3 h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg> */}
              <input readOnly type="checkbox" className={`pointer-events-none mr-4 h-4 w-4 rounded border-gray-300 bg-gray-100 text-fuchsia-500`} checked={currentCategory === 'clippedList' && true} />
              <p className={`pointer-events-none text-[13px] ${currentCategory === 'clippedList' ? 'font-bold text-gray-700' : 'text-gray-500'}`}>클립한 조항 ({clippedClause.length})</p>
            </div>
          </div>
        </div>
        <div className="flex w-[820px] flex-col">
          {/* _.orderBy(contractList, ['clause_category', 'idx'], ['asc', 'asc']); */}
          {_.orderBy(contractList, ['clause_category', 'idx'], ['asc', 'asc']).map((item, index) => {
            const category = categoryList.filter((x) => x._id === item.clause_category)[0]
            console.log('category', _.orderBy(contractList, ['clause_category', 'idx'], ['asc', 'asc']))
            const colors = require('tailwindcss/colors')
            return (
              <div key={index} className="mt-5 flex w-full border-b pb-5">
                <div className="h-auto w-5 flex-none grow border-l-4 border-gray-500"></div>
                <div className="flex w-full grow flex-col text-sm">
                  <div className="flex flex-col">
                    {/* <div onClick={(e) => setSidebarData(item.article, item)} className="group flex cursor-pointer items-center justify-between pb-4"> */}
                    <div className="flex items-center justify-between pb-1">
                      {/* <div className="mr-1 grow text-base font-bold tracking-wide text-black">
                        {category.title} ({category.title_en})
                      </div> */}
                      {/* <div style={{ backgroundColor: colors[`${category?.color ? category.color : 'zinc'}`]['100'] }} className={`rounded px-2 py-0.5 text-xs font-semibold text-gray-700 group-hover:visible`}> */}
                      <div style={{ backgroundColor: colors[`${category?.color}`]['100'] }} className={`rounded px-2 py-0.5 text-xs font-semibold text-gray-700 group-hover:visible`}>
                        {/* <div className={`rounded px-2 py-0.5 text-xs font-semibold text-gray-700 group-hover:visible`}> */}
                        {/* <div className={`rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-gray-700 group-hover:visible`}> */}
                        {category.title_en} · {category.title} 조항
                      </div>
                      <Tooltip
                        html={
                          toastDetail.action === '추가' ? (
                            // 추가
                            <div className="flex h-full w-full items-center space-x-2 px-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="h-5 w-5 stroke-green-600">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                />
                              </svg>
                              <div className="text-xs font-semibold">조항 클립완료!</div>
                            </div>
                          ) : (
                            // 추가
                            <div className="flex h-full w-full items-center space-x-3 px-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="h-5 w-5 stroke-red-400">
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
                        inertia="true"
                        position="top"
                        trigger="click"
                        open={toastDetail.id === item._id ? toastState : false}
                        theme="light"
                      >
                        <button id={item._id} name="clause" onClick={(e) => onClipClick(e)} className="group mt-1 transform cursor-pointer outline-none transition-transform active:scale-75">
                          {!clippedClause.includes(item._id) ? (
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
                      </Tooltip>
                    </div>
                    {/* <div className="my-1 w-full border-b-2 border-dotted"></div> */}
                    <div className="flex flex-col pt-2 text-[13px] leading-relaxed">
                      {/* <p className="w-fit font-medium text-gray-600">개요</p> */}
                      {item.note && (
                        <div className="note flex items-start space-x-1.5 pb-4 pt-2 text-xs font-semibold tracking-wide">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="mt-0 h-3.5 w-3.5 stroke-yellow-400">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                            />
                          </svg>

                          <div dangerouslySetInnerHTML={{ __html: item.note }} className=""></div>
                        </div>
                      )}
                      {/* <p className="w-fit pt-4 font-medium text-gray-600">본문 내용</p> */}
                      <div className="flex w-full space-x-8">
                        <div className="flex w-[50%] flex-col">
                          <h2 className="mb-1 text-[15px] font-bold">{item.title_ko}</h2>
                          <div key={item._id} dangerouslySetInnerHTML={{ __html: item.content_ko }} className="clause-css tracking-wide text-gray-800"></div>
                        </div>
                        <div className="flex w-[50%] flex-col">
                          <h2 className="mb-1 text-[15px] font-bold">{item.title_en}</h2>
                          <div key={item._id} dangerouslySetInnerHTML={{ __html: item.content_en }} className="clause-css text-xs tracking-wide text-gray-800"></div>
                        </div>
                      </div>
                      {/* {item.paragraph.map((elem) => {
                      if (elem.tag === 'p') {
                        return (
                          <p key={elem._id} className="line-clamp-5 text-gray-900">
                            {elem.text}
                          </p>
                        )
                      } else if (elem.tag === 'ol') {
                        return <div key={elem._id} dangerouslySetInnerHTML={{ __html: elem.html }} className="preview-doc line-clamp-5 text-gray-900"></div>
                      }
                    })} */}
                    </div>
                  </div>
                  {/* <div className="flex justify-between text-[13px]">
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
                </div> */}
                </div>
              </div>
            )
          })}
        </div>
        {showSidebar === true && <SidePanel clickedItem={clickedItem} data={data} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
      </main>
      <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
    </>
  )
}

const ArticleList = ({ contractList, articleGroup, currentIndex, setCurrentIndex, maxIndex }) => {
  // console.log('articleGroup props', articleGroup)
  const [showSidebar, setShowSidebar] = useState(false)
  const [clickedItem, setClickedItem] = useState([])
  const [data, setData] = useState([])

  const paginationOnClick = (e) => {
    console.log('clicked - onClickHandler')
    const btnId = e.target.id
    const type = e.target.name
    console.log('btnId : ', e.target.id)
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
      // console.log('clicked', btnId)
      setCurrentIndex(parseInt(btnId))
    }
  }
  // onClickHandler={onClickHandler} currentIndex={currentIndex} maxIndex={maxIndex}

  function setSidebarData(item, parent) {
    setClickedItem(item)
    // console.log('item', item)
    // console.log('parent', parent)

    // let match = contractList.filter((x) => x._id === parent._id)
    // console.log('match', match[0])
    setData(parent[0])

    setShowSidebar(!showSidebar)
    // toggleSlideover()
    // let match = contractList.filter((x) => x.id === item_id)
  }

  useEffect(() => {
    if (data.length > 0 && clickedItem.length > 0) {
      console.log('data?', data)
      console.log('clickedItem?', clickedItem)
    }
  }, [data, clickedItem])

  // function toggleSlideover() {
  //   document.getElementById('slideover-container').classList.toggle('invisible')
  //   document.getElementById('slideover-bg').classList.toggle('opacity-0')
  //   document.getElementById('slideover-bg').classList.toggle('opacity-50')
  //   document.getElementById('slideover').classList.toggle('translate-x-full')
  // }

  return (
    <main className="mx-auto flex w-[920px] flex-col justify-between px-[10vw] py-6">
      {articleGroup[currentIndex].map((item, index) => {
        // console.log('item', item)
        return (
          <div key={item._id} className="mt-4 flex w-full border-b pb-4">
            <div className="h-auto w-5 flex-none grow border-l-4 border-gray-500"></div>
            <div className="flex w-full grow flex-col text-sm">
              <div className="flex flex-col">
                {/* <Link onClick={(e) => setClickedItem(item.article)} href={{ pathname: `/clib/search/${item._id}`, query: item.article }} className="group flex items-center justify-between pb-4">
                  <div className="mr-1 grow text-base font-bold tracking-wide text-black group-hover:text-gray-700 group-hover:underline">{item.article.text}</div>
                  <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">
                    {item.title} ({item.source})
                  </div>
                </Link> */}
                <div onClick={(e) => setSidebarData(item.article, item)} className="group flex cursor-pointer items-center justify-between pb-4">
                  <div className="mr-1 grow text-base font-bold tracking-wide text-black group-hover:text-gray-700 group-hover:underline">{item.article.text}</div>
                  <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">
                    {item.title} ({item.source})
                  </div>
                </div>
                <div className="flex flex-col text-[13px] leading-relaxed">
                  <p className="w-fit font-medium text-gray-500">본문 내용</p>
                  {item.paragraph.map((elem, index) => {
                    if (elem.tag === 'p') {
                      return (
                        <p key={index} className="line-clamp-3 text-gray-900">
                          {elem.text}
                        </p>
                      )
                    } else if (elem.tag === 'ol') {
                      return <div key={index} dangerouslySetInnerHTML={{ __html: elem.html }} className="preview-doc line-clamp-3 text-gray-900"></div>
                    }
                  })}
                </div>
              </div>
              <div className="my-4 w-full border-b-2 border-dotted"></div>
              <div className="flex justify-between text-[13px] ">
                {/* <div className="flex flex-col text-[13px]">
                  <p className="text-gray-500">계약서</p>
                  <p className="text-gray-800">{item.title}</p>
                </div> */}
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
      {/* {showSidebar === true && <SidePanel clickedItem={clickedItem} data={data} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />} */}
      {showSidebar === true && <SidePanel clickedItem={clickedItem} data={data} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
      <DashboardFooter onClickHandler={paginationOnClick} currentIndex={currentIndex} maxIndex={maxIndex} />
    </main>
  )
}

const SearchWrapper = ({ contractList, searchType, setSearchType, setData, setShowSidebar, showSidebar }) => {
  return (
    <section className="mt-6 flex flex-col px-[10vw] py-4">
      <aside className="mx-auto flex w-fit items-center gap-x-2 text-2xl">
        {/* {searchType === 'contract' ? (
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
        )} */}
        <h2 className="text-xl font-semibold">{searchType === 'contract' ? '클립이 제공하는 조항 라이브러리입니다' : '계약서 조항을 검색하세요!'}</h2>
      </aside>
      <SearchInput contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
    </section>
  )
}

const SearchInput = ({ searchType, setSearchType, setData, setShowSidebar, showSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])
  let { contractList, clauseList, currentCategory, updateCategory, clickedCategory } = useContext(CategoryContext)
  console.log('clauseList!!!', clauseList)
  useEffect(() => {
    let filteredList
    if (!searchTerm.length > 0) {
      setSearchResult([])
      // return
    } else {
      console.log('searchTerm', searchTerm)
      // let filteredList = runSearch(searchTerm)
      filteredList = runSearch(searchTerm)
      // filteredList = runClauseSearch(searchTerm)

      console.log('filteredList', filteredList)
      setTimeout(() => {
        if (filteredList.length > 0) setSearchResult(filteredList)
        else setSearchResult([])
      }, 500)
    }
  }, [searchTerm])

  function resetSearch(newType) {
    // console.log('e.target.name', e.target.name)
    // setSearchType(e.target.name)
    console.log('newType', newType)
    setSearchType(newType)

    setSearchResult([])
  }
  // 계약서 제목만 검색함
  function runSearch(term) {
    let match = clauseList.filter((x) => x.title_ko?.match(getRegExp(term)) !== null)
    console.log('match?', match)
    return match
  }
  function runClauseSearch(term) {
    // let clauses = 여기 부분!!
    let mergedClauseArray = []
    let matchArray = []
    for (let i = 0; i < clauseList.length; i++) {
      console.log('clauseList[i].clauseArray', clauseList[i])
      let match = clauseList[i].title_ko.map((x) => x.title_ko?.match(getRegExp(term)) !== null)
      console.log('match', match)
      if (match.length > 0) {
        for (let j = 0; j < match.length; j++) {
          match[j].source = clauseList[i]
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
        <div className="flex w-full flex-col">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="flex w-full">
            <div className="relative w-full">
              <div className="hidden space-x-4 py-3 text-xs font-semibold">
                <div onClick={(e) => resetSearch(e.target.id)} id="contract" className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'contract' ? 'bg-gray-200/70 ' : 'bg-white'}`} href="/clib/search">
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
                <div onClick={(e) => resetSearch(e.target.id)} id="article" className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'article' ? 'bg-gray-200/70 ' : 'bg-white'}`} href="/clib/clause">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="pointer-events-none h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="pointer-events-none">조항검색</p>
                </div>
                <div onClick={(e) => resetSearch(e.target.id)} id="definition" className={`flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 ${searchType === 'definition' ? 'bg-gray-200/70 ' : 'bg-white'}`}>
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
                    placeholder="필요한 조항을 검색해보세요!"
                    onChange={async (e) => setSearchTerm(e.target.value)}
                    required
                  />
                  {searchTerm.length > 0 && (
                    <button onClick={(e) => setSearchTerm('')} type="button" className="group absolute inset-y-0 end-0 flex items-center pe-3">
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
        </div>

        {searchResult.length > 0 && <SearchResult setSearchTerm={setSearchTerm} searchResult={searchResult} searchTerm={searchTerm} searchType={searchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />}
      </div>
    </>
  )
}

const SearchResult = ({ setSearchTerm, searchResult, searchTerm, searchType, setData, setShowSidebar, showSidebar }) => {
  let { categoryList, updateCategory } = useContext(CategoryContext)
  const colors = require('tailwindcss/colors')

  function setSidebarData(item) {
    // setClickedItem(item)
    console.log('item', item)
    // console.log('parent', parent)

    // let match = contractList.filter((x) => x._id === parent._id)
    // console.log('match', match[0])
    setData(item)
    setShowSidebar(!showSidebar)
  }

  console.log('searchResult', searchResult)
  if (searchResult.length > 0) {
    return (
      <div className="flex w-[458px] flex-col rounded rounded-b-lg bg-white shadow">
        {searchResult.map((resultObj, index) => {
          console.log('resultObj', resultObj)
          let category = categoryList.filter((x) => x._id === resultObj.clause_category)[0]
          console.log('category!!', category)

          let matchingTerm, additionalInfo
          // 1. 계약서 제목 검색
          if (category && searchType === 'contract') {
            matchingTerm = resultObj.title_ko.replace(searchTerm, `<span class="font-bold text-purple-800">${searchTerm}</span>`)
            additionalInfo = `<p>${resultObj.source}</p>`
            return (
              <div
                key={index}
                id={category._id}
                name="search"
                onClick={(e) => {
                  updateCategory(e)
                  setSearchTerm('')
                }}
                className="flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className="pointer-events-none"></p>
                <div className="ml-4 flex items-center space-x-2 text-xs">
                  {/* <div style={{ backgroundColor: colors[`${category?.color}`]['100'] }} key={category._id} className={`rounded px-1.5 py-0.5 text-gray-700`}> */}
                  <div key={category._id} className={`rounded px-1.5 py-0.5 text-gray-700`}>
                    {/* <div key={category._id} className={`rounded bg-stone-100 px-1.5 py-0.5 text-gray-700`}> */}
                    {category?.title_en}
                  </div>
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
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div>
              </Link>
            )
          }
        })}
      </div>
    )
  }
}
const DashboardFooter = ({ onClickHandler, currentIndex, maxIndex }) => {
  return (
    <>
      {/* mx-auto w-[920px] px-[10vw]  */}
      <div className="mx-auto mt-auto flex min-w-[1080px] items-center justify-between self-end px-[calc(10vw+32px)] py-6 pl-[400px]">
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
        <div className="mx-4 flex items-center gap-x-3">
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

const FooterPagination = ({ currentIndex, maxIndex, onClickHandler }) => {
  let paginationGroup = _.chunk(maxIndex, 8)
  // console.log('maxIndex', maxIndex)
  // console.log('currentIndex123', currentIndex)

  const pagination = []
  for (let i = 0; i <= maxIndex; i++) {
    if (i === currentIndex) {
      pagination.push(
        <Link href="#" id={i} name="paginationNum" onClick={onClickHandler} className="rounded-md bg-purple-100/60 px-2 py-1 text-sm text-purple-500 dark:bg-gray-800" key={uuidv4()}>
          {i + 1}
        </Link>
      )
    } else {
      pagination.push(
        <Link href="#" id={i} name="paginationNum" onClick={onClickHandler} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" key={uuidv4()}>
          {i + 1}
        </Link>
      )
    }
  }
  return <>{pagination}</>
}

export default Clause

const ExSlider = ({ toggleSlideover }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div onClick={(e) => toggleSlideover()} className="cursor-pointer rounded border border-gray-300 px-5 py-2 text-sm text-gray-500 hover:bg-gray-100">
        Toggle Slide-over
      </div>
      <div id="slideover-container" className="invisible fixed inset-0 h-full w-full">
        <div onClick={(e) => toggleSlideover()} id="slideover-bg" className="absolute inset-0 h-full w-full bg-gray-900 opacity-0 transition-all duration-500 ease-out"></div>
        <div id="slideover" className="absolute right-0 h-full w-96 translate-x-full bg-white transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 mr-5 mt-5 flex h-8 w-8 cursor-pointer items-center justify-center text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
