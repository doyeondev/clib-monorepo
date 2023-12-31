import '../styles/globals.css'
import Script from 'next/script'
import Head from 'next/head'
import React, { useEffect, useState, Fragment, createContext, useContext } from 'react'
import Image from 'next/image'

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import { ThemeProvider } from '@material-tailwind/react'
import { ThemeProvider } from 'next-themes'
import { getContractList, getClibDataset } from '/pages/api/clib'
import useSWR from 'swr'

export const SessionContext = createContext()
// export const ContractContext = createContext()

// const fetcher = (url) => fetch(url).then((response) => response.json())

export default function App({ Component, pageProps }) {
  // const { data, error, isLoading } = useSWR(`https://conan.ai/_functions/clibContractList`, fetcher)
  // console.log('data???', data)

  const [userApproved, setUserApproved] = useState(false)
  const [contractAsset, setContractAsset] = useState([])

  // setMetaData((prev) => ({ ...prev, ['partyB']: text }))
  // setAppendix([...appendix, ...annex.reverse()]) // 배열에 추가

  const onInputChange = (e) => {
    if (e.target.value === 'mlt_dykim1') {
      setUserApproved(true)
      sessionStorage.setItem('auth_status', true)
    }
  }

  // 즐겨찾기 기능

  const [clippedContract, setClippedContract] = useState([])
  const [clippedClause, setClippedClause] = useState([])

  useEffect(() => {
    console.log('clippedContract', clippedContract)
  }, [clippedContract])

  const onClipClick = (e) => {
    const clipType = e.target.name
    const clippedItem = e.target.id

    console.log('clipType: ', clipType)
    console.log('clippedItem: ', clippedItem)
    let newData

    if (clipType === 'contract') {
      newData = [...clippedContract]

      if (!clippedContract.includes(clippedItem)) {
        setClippedContract((current) => [...current, clippedItem])
      } else {
        setClippedContract((current) => [...current.filter((x) => x !== clippedItem)])
      }
    } else if (clipType === 'clause') {
      newData = [...clippedClause]

      if (!clippedClause.includes(clippedItem)) {
        console.log('clip type 3', newData.push(clippedItem))
        setClippedClause([...clippedClause, ...newData.push(clippedItem)])
      } else {
        console.log(
          'clip type 4',
          clippedClause.filter((x) => x !== clippedItem)
        )
        setClippedClause([...clippedClause, ...clippedClause.filter((x) => x !== clippedItem)])
      }
    }
  }

  useEffect(() => {
    async function getPageData() {
      let auth_status = sessionStorage.getItem('auth_status')
      console.log('auth_status', auth_status)
      if (auth_status === 'true') setUserApproved(true)

      const contracts = await getContractList()
      const user = await getClibDataset('demo_member', 'primer')

      setContractAsset(contracts)
      if (user[0].contract_clipped) setClippedContract(user[0].contract_clipped)
      if (user[0].clause_clipped) setClippedClause(user[0].clause_clipped)
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
        {userApproved !== true ? (
          <>
            <Head>
              <title>클립</title>
              <meta name="description" content="Clib My Asset" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="center justify flex h-screen flex-col items-center bg-white">
              <div className="my-auto flex w-fit flex-col space-y-10 pb-8">
                <div className="title-font mx-auto flex space-x-1.5 font-medium text-gray-900">
                  <Image alt="클립" src="/icon/clib-icon.svg" width={0} height={0} sizes="100vw" className="h-auto w-[30px] justify-center" />
                  <Image alt="클립" src="/icon/clib-text-3d.svg" width={0} height={0} sizes="100vw" className="mt-[1px] h-auto w-[44px] justify-center" />
                </div>
                <div className="mx-auto flex flex-col space-y-2 text-center text-[13px] font-semibold text-gray-600">
                  <p className="">안녕하세요 클립 운영진입니다!</p>
                  <p>
                    서비스 <span className="font-semibold">데모기능</span> 구현을 위한 리뉴얼이 진행 중입니다 (-1/1)
                  </p>
                  <p>액세스 코드를 발급 받으셨던 분들은 코드 입력 후 정상 이용 가능합니다 😀</p>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Type Access Code"
                  onChange={(e) => onInputChange(e)}
                  className="mx-auto block w-[320px] rounded-md border-gray-400 bg-gray-50 p-2.5 py-1.5 text-center text-sm text-gray-700 placeholder:text-slate-500 hover:border-purple-400 focus:border-none focus:placeholder-transparent focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                  required=""
                />
              </div>
            </main>
          </>
        ) : (
          <SessionContext.Provider value={{ userApproved, onInputChange, contractAsset, clippedContract, clippedClause, onClipClick }}>
            <Component {...pageProps} />
          </SessionContext.Provider>
        )}
      </ThemeProvider>
    </>
  )

  // return (
  //   <>
  //     <Component {...pageProps} />
  //   </>
  // )
}
