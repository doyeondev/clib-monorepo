import '../styles/globals.css'
import Script from 'next/script'
import Head from 'next/head'
import React, { useEffect, useState, Fragment, createContext, useContext } from 'react'
import Image from 'next/image'

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import { ThemeProvider } from '@material-tailwind/react'
import { ThemeProvider } from 'next-themes'
import { getContractList, getClibDataset, updateClippedData } from '/pages/api/clib'
import useSWR from 'swr'

export const SessionContext = createContext()
// export const ContractContext = createContext()

// const fetcher = (url) => fetch(url).then((response) => response.json())

export default function App({ Component, pageProps }) {
  // const { data, error, isLoading } = useSWR(`https://conan.ai/_functions/clibContractList`, fetcher)
  // console.log('data???', data)

  const [userApproved, setUserApproved] = useState(false)
  const [demoApproved, setDemoApproved] = useState(false)
  const [contractAsset, setContractAsset] = useState([])

  // setMetaData((prev) => ({ ...prev, ['partyB']: text }))
  // setAppendix([...appendix, ...annex.reverse()]) // 배열에 추가

  const authUser = (e) => {
    if (e.target.value === 'mlt_dykim1') {
      setUserApproved(true)
      sessionStorage.setItem('auth_status', true)
    }
  }
  const loginDemo = (e) => {
    if (e.target.value === 'demo') {
      setDemoApproved(true)
      sessionStorage.setItem('demo_status', true)
    }
  }
  // 즐겨찾기 기능

  const [clippedContract, setClippedContract] = useState([])
  const [clippedClause, setClippedClause] = useState([])
  const [toastState, setToastState] = useState(null)
  const [toastDetail, setToastDetail] = useState({ type: '', action: '', id: '' })
  const [userClippedData, setUserClippedData] = useState([])

  // toastDetail, toastState toastStateHandler

  const toastStateHandler = () => {
    setToastState(true)
    setTimeout(() => {
      setToastState(false)
    }, 1000)
  }

  useEffect(() => {
    console.log('clippedContract', clippedContract)
    if (toastState === true || toastState === false) {
      let updatedClippedData = [...userClippedData]
      console.log('updatedClippedData', updatedClippedData)

      updatedClippedData[0].contract_clipped = clippedContract
      console.log('updatedClippedData', updatedClippedData)

      updateClippedData(updatedClippedData[0])
    }
  }, [clippedContract])

  useEffect(() => {
    console.log('clippedClause', clippedClause)
    if (toastState === true || toastState === false) {
      let updatedClippedData = [...userClippedData]
      console.log('updatedClippedData', updatedClippedData)

      updatedClippedData[0].clause_clipped = clippedClause
      console.log('updatedClippedData', updatedClippedData)

      updateClippedData(updatedClippedData[0])
    }
  }, [clippedClause])

  const onClipClick = (e) => {
    const clipType = e.target.name
    const clippedItem = e.target.id

    console.log('clipType: ', clipType)
    console.log('clippedItem: ', clippedItem)

    if (clipType === 'contract') {
      if (!clippedContract.includes(clippedItem)) {
        // OOO 계약서가 클립되었습니다.
        setClippedContract((current) => [...current, clippedItem])
        setToastDetail({ type: 'contract', action: '추가', id: clippedItem })
        toastStateHandler()
      } else {
        // OOO 계약서가 클립해제되었습니다.
        setClippedContract((current) => [...current.filter((x) => x !== clippedItem)])
        setToastDetail({ type: 'contract', action: '삭제', id: clippedItem })
        toastStateHandler()
      }
    } else if (clipType === 'clause') {
      if (!clippedClause.includes(clippedItem)) {
        // OOO 조항이 클립되었습니다.
        setClippedClause((current) => [...current, clippedItem])
        setToastDetail({ type: 'clause', action: '추가', id: clippedItem })
        toastStateHandler()
      } else {
        // OOO 조항이 클립해제되었습니다.
        setClippedClause((current) => [...current.filter((x) => x !== clippedItem)])
        setToastDetail({ type: 'clause', action: '삭제', id: clippedItem })
        toastStateHandler()
      }
    }
  }

  useEffect(() => {
    async function getPageData() {
      let auth_status = sessionStorage.getItem('auth_status')
      // console.log('auth_status', auth_status)
      if (auth_status === 'true') setUserApproved(true)

      let demo_status = sessionStorage.getItem('demo_status')
      // console.log('demo_status', demo_status)
      if (demo_status === 'true') setDemoApproved(true)

      const contracts = await getContractList()
      const user_clippedData = await getClibDataset('demo_member', 'primer')
      setContractAsset(contracts)
      if (user_clippedData[0].contract_clipped) setClippedContract(user_clippedData[0].contract_clipped)
      // if (user_clippedData[0].clause_clipped) setClippedClause(user_clippedData[0].clause_clipped)
      user_clippedData[0].clause_clipped ? setClippedClause(user_clippedData[0].clause_clipped) : setClippedClause([])

      setUserClippedData(user_clippedData)
    }
    getPageData()
  }, [])

  return (
    <>
      <ThemeProvider attribute="class">
        {/* <ThemeProvider> */}
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-MS8Z3MX3ZN`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MS8Z3MX3ZN', {
              page_path: window.location.pathname,
            });
          `
          }}
        />
        {demoApproved !== true ? (
          <>
            <Head>
              <title>클립</title>
              <meta name="description" content="Clib My Asset" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="center justify flex h-screen flex-col items-center bg-white">
              <div className="my-auto flex w-fit flex-col space-y-10 pb-8">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Type Access Code"
                  onChange={(e) => loginDemo(e)}
                  className="mx-auto block w-[320px] rounded-md border-gray-400 bg-gray-50 p-2.5 py-1.5 text-center text-sm text-gray-700 placeholder:text-slate-500 hover:border-purple-400 focus:border-none focus:placeholder-transparent focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                  required=""
                />
              </div>
            </main>
          </>
        ) : (
          <SessionContext.Provider value={{ demoApproved, setDemoApproved, userApproved, authUser, contractAsset, clippedContract, clippedClause, onClipClick, toastDetail, toastState, setToastState }}>
            <Component {...pageProps} />
          </SessionContext.Provider>
        )}
      </ThemeProvider>
    </>
  )
}
