import '../styles/globals.css'
// import Script from 'next/script'
// import Head from 'next/head'
import React, { useEffect, useState, createContext } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import { ThemeProvider } from '@material-tailwind/react'
import { ThemeProvider } from 'next-themes'
import { getContractList, getClibDataset, updateClippedData } from './api/clib'

export const SessionContext = createContext<{ [key: string]: any } | null | any>(null) // changeAny

interface AppProps {
  Component: React.FC
  pageProps: any
}

export default function App({ Component, pageProps }: AppProps) {
  // const { data, error, isLoading } = useSWR(`https://conan.ai/_functions/clibContractList`, fetcher)
  // console.log('data???', data)

  // type stateobject = {name: string, age: number}
  // const [state, setState] = useState<null | stateobject>(null)
  const [userApproved, setUserApproved] = useState<boolean | null>(false)
  const [demoApproved, setDemoApproved] = useState<boolean | null>(false)
  const [contractAsset, setContractAsset] = useState<any[]>([])

  const authUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'mlt_dykim1') {
      setUserApproved(true)
      sessionStorage.setItem('auth_status', 'true')
    }
  }

  // const loginDemo = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.value === 'demo') {
  //     setDemoApproved(true)
  //     sessionStorage.setItem('demo_status', "true")
  //   }
  // }

  const [clippedContract, setClippedContract] = useState<string[]>([])
  const [clippedClause, setClippedClause] = useState<string[]>([])
  const [toastState, setToastState] = useState<boolean | null>(null)
  const [toastDetail, setToastDetail] = useState<{ type: string; action: string; id: string }>({ type: '', action: '', id: '' })
  const [userClippedData, setUserClippedData] = useState<any[]>([])

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

  const onClipClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const clipType = e.currentTarget.name
    const clippedItem = e.currentTarget.id

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
      console.log('user_clippedData', user_clippedData[0])
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
        <SessionContext.Provider value={{ demoApproved, setDemoApproved, userApproved, authUser, contractAsset, clippedContract, clippedClause, onClipClick, toastDetail, toastState, setToastState }}>
          <Component {...pageProps} />
        </SessionContext.Provider>
      </ThemeProvider>
    </>
  )
}
