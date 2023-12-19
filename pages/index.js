import Link from 'next/link'
import Head from 'next/head'
import Layout from '/components/layout'

import useSWR from 'swr'
import React, { useEffect, useState, Fragment, createContext, useContext } from 'react'
import { Spinner } from '/components/clib/Spinner.js'

import { getRegExp } from 'korean-regexp'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import SidePanel from '/components/clib/Sidepanel'
import { getContractList, getCategoryList, getContractItem } from '/pages/api/clib'
import { NoBackpackSharp } from '@mui/icons-material'

import { SessionContext } from './_app'

// const fetcher = (url) => fetch('https://conan.ai/_functions/clibContractList').then((response) => response.json())
const fetcher = (url) => fetch(url).then((response) => response.json())
// function useData() {
//   const { data, error, isLoading } = useSWR(`https://conan.ai/_functions/clibContractList`, fetcher)

//   return {
//     category: data,
//     isLoading,
//     isError: error
//   }
// }
// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// const fetcher = (...args) => fetch(...args).then((res) => res.json())
const CategoryContext = createContext()
// const ContractContext = createContext()

// const ContractContext = createContext()

const Search = () => {
  const { userApproved, onInputChange } = useContext(SessionContext)

  const [authModalOpen, setAuthModalOpen] = useState(false)

  // const { data } = useSWR('aaa', fetcher)
  // const test = useData()
  // if (test) console.log('test', test)
  const [assetList, setAssetList] = useState([])
  const [contractList, setContractList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [currentCategory, setCurrentCategory] = useState([])

  const [loaded, setLoaded] = useState(false)
  // const [userApproved, setUserApproved] = useState(false)

  // const AppProvider = ({ contexts, children }) =>
  //   contexts.reduce(
  //     (prev, context) =>
  //       React.createElement(context, {
  //         children: prev
  //       }),
  //     children
  //   )

  // const { data, error } = useSWR('https://conan.ai/_functions/clibContractList', fetcher)
  // const { categories } = useSWR('https://conan.ai/_functions/clibCategoryList', fetcher)

  // console.log('contracts', contracts)
  // console.log('categories', categories)

  // if (data) console.log('data : ', data)
  // if (categories) console.log('categories : ', categories)

  // setContractList(data.items)

  useEffect(() => {
    async function getPageData() {
      // localStorage.theme = 'light'
      //   location.assign('/')
      // if (sessionStorage.getItem('item_key')) sessionStorage.removeItem('item_key') // remove contract key session

      // let auth_status = sessionStorage.getItem('auth_status')
      // if (auth_status === 'true') setUserApproved(true)

      if (loaded !== true) {
        // const contracts = await getContractList()
        const categories = await getCategoryList()
        // console.log('contracts', contracts)
        console.log('categories[0].assets(contracts)', categories[0].assets)
        console.log('categories', categories)
        // setContractList(contracts)
        // setOriginalList(contracts)
        setContractList(categories[0].assets)
        setAssetList(categories[0].assets)
        setCategoryList(categories)
        setCurrentCategory(categories[0])
        setLoaded(true)
      }
    }
    getPageData()
  }, [])

  const updateCategory = (e) => {
    console.log('clicked id', e.target.id)
    const newCategory = categoryList.filter((x) => x._id === e.target.id)[0]
    // let newContractList = [...contractList]
    // newContractList = newCategory.assets
    console.log('newCategory', newCategory)

    setContractList(newCategory.assets)
    setCurrentCategory(newCategory)
    // alert(`Add ${newItem}`)
  }

  useEffect(() => {
    console.log('contractList', contractList)
    console.log('contractList2', currentCategory)
  }, [contractList, currentCategory])

  // // 전역 로딩 상태
  // if (!user) return <Spinner/>

  // return <div>
  //   <Navbar user={user} />
  //   <Content user={user} />
  // </div>

  // const onInputChange = (e) => {
  //   if (e.target.value === '1234') {
  //     setUserApproved(true)
  //     sessionStorage.setItem('auth_status', true)
  //   }
  // }

  return (
    <Layout>
      <Head>
        <title>클립</title>
        <meta name="description" content="Clib My Asset" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {userApproved !== true ? (
        <main className="center justify flex min-h-[calc(100vh-120px)] flex-col items-center bg-white">
          <div className="my-auto flex w-fit">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Type Access Code"
              onChange={(e) => onInputChange(e)}
              className="block w-[320px] rounded-md border-gray-400 bg-gray-50 p-2.5 py-1.5 text-center text-sm text-gray-700 placeholder:text-slate-500 hover:border-purple-400 focus:border-none focus:placeholder-transparent focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
              required=""
            />
          </div>
        </main>
      ) : (
        <CategoryContext.Provider value={{ assetList, categoryList, currentCategory, updateCategory }}>{contractList?.length > 0 ? <MainLayout contractList={contractList} /> : <Spinner />}</CategoryContext.Provider>
      )} */}
      <CategoryContext.Provider value={{ assetList, categoryList, currentCategory, updateCategory }}>{contractList?.length > 0 ? <MainLayout contractList={contractList} /> : <Spinner />}</CategoryContext.Provider>
    </Layout>
  )
  // } else {
  //   return (
  //     <Layout>
  //       <Head>
  //         <title>클립</title>
  //         <meta name="description" content="Clib My Asset" />
  //         <link rel="icon" href="/favicon.ico" />
  //       </Head>
  //       {/* <AppProvider contexts={[HeaderProvider, UserProvider]}> */}
  //       {/* </AppProvider> */}
  //     </Layout>
  //   )
  // }
}

// const MainLayout = ({ contractList, categoryList }) => {
const MainLayout = ({ contractList }) => {
  // const { items } = useContext(AppContext)
  // let { categoryList } = useContext(CategoryContext)

  const [searchType, setSearchType] = useState('contract')

  // const [clickedResult, setClickedResult] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [data, setData] = useState([])

  const [currentData, setCurrentData] = useState([])

  const [articleData, setArticleData] = useState([])
  const [articleGroup, setArticleGroup] = useState([])

  // pagination

  const [contractGroup, setContractGroup] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)

  let cleanedClauseArray = []
  let match, fullData

  // function toggleSlideover() {
  //   document.getElementById('slideover-container').classList.toggle('invisible')
  //   document.getElementById('slideover-bg').classList.toggle('opacity-0')
  //   document.getElementById('slideover-bg').classList.toggle('opacity-50')
  //   document.getElementById('slideover').classList.toggle('translate-x-full')
  // }

  useEffect(() => {
    console.log('searchType', searchType)
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
    let index = 0
    for (let i = 0; i < contractList.length; i++) {
      for (let j = 0; j < contractList[i].contentArray.length; j++) {
        // console.log('contractList[i].contentArray[j]', contractList[i].contentArray[j])
        let arr = contractList[i].contentArray[j]

        if (j !== contractList[i].contentArray.length - 1) {
          match = arr.filter((x) => x.tag.includes('h2') || !x.tag.includes('br')) // 1. "h2" 태그를 갖는 배열 필터링
        } else {
          match = arr.slice(0, 2) // 2. 맨 마지막 조항의 불필요한 정보 삭제
          // console.log('arr.slice(0, 2)', arr.slice(0, 2))
        }

        // 3. "h1" (계약서 제목) 태그를 갖는 배열 Delete
        let titleLength = match.filter((x) => x.tag.includes('h1')).length // h1은 빼준다

        if (match.length > 0 && titleLength === 0) {
          // console.log('match', match)
          fullData = {
            article: match[0],
            paragraph: match.slice(1),
            _id: contractList[i]._id,
            title: contractList[i].title,
            industry: contractList[i].industry,
            source: contractList[i]?.source,
            partyA: contractList[i].partyA,
            partyB: contractList[i].partyB,
            purpose: contractList[i].purpose,
            idx: index
          }
          index = index + 1
          cleanedClauseArray.push(fullData)
        }
      }
    }
    let finalData = cleanedClauseArray
    cleanedClauseArray = []
    console.log('finalData', finalData)
    // console.log('cleanedClauseArray', cleanedClauseArray)

    setArticleData(finalData)
    // setClibData(finalData)
    let chunkData
    if (searchType === 'contract') chunkData = _.chunk(contractList, 5)
    else chunkData = _.chunk(finalData, 5)
    setContractGroup(_.chunk(contractList, 5))
    setArticleGroup(_.chunk(finalData, 5))
    setCurrentData(_.chunk(contractList, 5))
    setMaxIndex(_.chunk(contractList, 5).length - 1)
    console.log('_.chunk(contractList, 5)', _.chunk(contractList, 5))
  }, [contractList])

  const onClickHandler = (e) => {
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

  if (searchType === 'contract') {
    return (
      // <div className="h-full bg-white">
      <>
        {contractGroup.map((elem, index) => {
          if (currentIndex === index) {
            // return <DashboardWrapper dataList={elem} currentIndex={currentIndex} maxIndex={maxIndex} onClickHandler={onClickHandler} deleteItemHandler={deleteItemHandler} key={uuidv4()} />
            return (
              <div key={index} className="flex min-h-[calc(100vh-120px)] flex-col bg-white">
                <SearchWrapper contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
                {/* <ExSlider toggleSlideover={toggleSlideover} /> */}
                <ContractList contractList={elem} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} maxIndex={maxIndex} data={data} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
                {/* <DashboardFooter onClickHandler={onClickHandler} currentIndex={currentIndex} maxIndex={maxIndex} /> */}
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
  const [clickedItem, setClickedItem] = useState([])

  let { categoryList, currentCategory, updateCategory } = useContext(CategoryContext)
  console.log('currentCategory', currentCategory)

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
      <main className="mx-auto w-[920px] px-[10vw] py-6">
        <div className="flex w-fit flex-wrap items-center space-x-3 px-8">
          {categoryList.map((elem, index) => {
            return (
              <div onClick={(e) => updateCategory(e)} id={elem._id} className={`cursor-pointer rounded px-2 py-1 shadow-sm ${elem._id === currentCategory._id ? 'bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'}`} key={index}>
                <p className={`pointer-events-none text-[13px] ${elem._id === currentCategory._id ? 'text-white' : 'text-gray-500'}`}>{elem.title}</p>
              </div>
            )
          })}
        </div>
        {contractList.map((item, index) => {
          // console.log('item', item)
          return (
            <div key={item._id} className="mt-4 flex w-full border-t border-dotted border-gray-400 px-8 pt-4">
              {/* <div key={item._id} className="mt-4 flex w-full border-b pb-4"> */}
              {/* <div className="h-auto w-5 flex-none grow border-l-4 border-gray-600"></div> */}
              <div className="flex w-full grow flex-col space-y-4 border-gray-300 text-sm">
                {/* <Link href={`/clib/search/${item._id}`} className="group flex flex-col"> */}
                <div onClick={(e) => setSidebarData(item.article, item)} className="group flex cursor-pointer flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex">
                      <div className="grow text-base font-bold tracking-wide text-gray-700 hover:text-gray-800 group-hover:underline">{item.title}</div>
                      <div className="ml-4 flex items-center space-x-2 text-xs">
                        {item.categories.length > 0 && (
                          <>
                            <p className="text-gray-900">관련분야</p>
                            {item.categories.map((category) => {
                              // console.log('item', item)
                              return (
                                <div key={category._id} className="rounded bg-fuchsia-100 px-1.5 py-0.5 text-gray-700">
                                  {category.title}
                                </div>
                              )
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    {/* <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">{item.source}</div> */}
                    <div className="rounded bg-slate-100 px-1 py-0.5 text-xs text-gray-500 group-hover:visible">출처: {item.source}</div>
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
                    {/* {item.industry && (
                      
                    )} */}

                    {/* <div className="flex flex-col">
                      <p className="text-gray-500">출처</p>
                      <p className="text-gray-800">{item.source}</p>
                    </div> */}
                  </div>
                  {/* </Link> */}
                </div>
                <div className="flex flex-col text-[13px]">
                  <p className="text-gray-500">계약의 목적</p>
                  <p className="line-clamp-2 text-gray-800">{item.purpose}</p>
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
        <h2 className="text-xl font-semibold">{searchType === 'contract' ? '어떤 계약서 양식이 필요하신가요?' : '계약서 조항을 검색하세요!'}</h2>
      </aside>
      <SearchInput contractList={contractList} searchType={searchType} setSearchType={setSearchType} setData={setData} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
    </section>
  )
}

const SearchInput = ({ contractList, searchType, setSearchType, setData, setShowSidebar, showSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])
  let { assetList } = useContext(CategoryContext)

  useEffect(() => {
    let filteredList
    if (!searchTerm.length > 0) {
      setSearchResult([])
      // return
    } else {
      console.log('searchTerm', searchTerm)
      // let filteredList = runSearch(searchTerm)
      if (searchType === 'contract') filteredList = runSearch(searchTerm)
      if (searchType === 'article') filteredList = runClauseSearch(searchTerm)

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
    let match = assetList.filter((x) => x.title.match(getRegExp(term)) !== null)
    console.log('match', match)
    return match
  }
  function runClauseSearch(term) {
    // let clauses = 여기 부분!!
    let mergedClauseArray = []
    let matchArray = []
    for (let i = 0; i < assetList.length; i++) {
      console.log('assetList[i].clauseArray', assetList[i])
      let match = assetList[i].clauseArray.filter((x) => x.text.match(getRegExp(term)) !== null)
      console.log('match', match)
      if (match.length > 0) {
        for (let j = 0; j < match.length; j++) {
          match[j].source = assetList[i]
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
                    placeholder="계약서를 검색해보세요!"
                    onChange={async (e) => setSearchTerm(e.target.value)}
                    required
                  />
                  {searchTerm.length > 0 && (
                    <button onClick={(e) => setSearchTerm('')} type="button" className="group absolute inset-y-0 end-0 flex items-center pe-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="pointer-events-none h-5 w-5 fill-gray-400 group-hover:fill-gray-800">
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

const SearchResult = ({ searchResult, searchTerm, searchType, setData, setShowSidebar, showSidebar }) => {
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
      <div className="flex flex-col rounded rounded-b-lg bg-white shadow">
        {searchResult.map((resultObj, index) => {
          let matchingTerm, additionalInfo
          // 1. 계약서 제목 검색
          if (searchType === 'contract') {
            matchingTerm = resultObj.title.replace(searchTerm, `<span class="font-bold text-purple-800">${searchTerm}</span>`)
            additionalInfo = `<p>${resultObj.source}</p>`
            return (
              // <Link key={index} href={`/clib/search/${resultObj._id}`} className="flex cursor-pointer items-center justify-between border-b bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50/50">
              // <Link onClick={setSearchedItem} key={index} href={`/clib/search/${resultObj._id}`} className="flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
              //   <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
              //   <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div>
              // </Link>
              <div key={index} id={resultObj._id} onClick={(e) => setSidebarData(resultObj)} className="flex cursor-pointer items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                <p dangerouslySetInnerHTML={{ __html: matchingTerm }} className=""></p>
                <div dangerouslySetInnerHTML={{ __html: additionalInfo }} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-gray-600 shadow-sm"></div>
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
{
  /* <main className="mx-auto w-[920px] px-[10vw] py-6"> */
}

const DashboardFooter = ({ onClickHandler, currentIndex, maxIndex }) => {
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

export default Search

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

// ;<div class="flex h-screen w-screen items-center justify-center">
//   <div onclick="toggleSlideover()" class="cursor-pointer rounded border border-gray-300 px-5 py-2 text-sm text-gray-500 hover:bg-gray-100">
//     Toggle Slide-over
//   </div>
//   <div id="slideover-container" class="invisible fixed inset-0 h-full w-full">
//     <div onclick="toggleSlideover()" id="slideover-bg" class="absolute inset-0 h-full w-full bg-gray-900 opacity-0 transition-all duration-500 ease-out"></div>
//     <div onclick="toggleSlideover()" id="slideover" class="absolute right-0 h-full w-96 translate-x-full bg-white transition-all duration-300 ease-out">
//       <div class="absolute right-0 top-0 mr-5 mt-5 flex h-8 w-8 cursor-pointer items-center justify-center text-gray-600">
//         <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//         </svg>
//       </div>
//     </div>
//   </div>
// </div>
