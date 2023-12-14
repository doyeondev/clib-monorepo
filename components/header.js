import Link from 'next/link'
import DarkModeToggleButton from './dark-mode-toggle-button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling

export default function Nav() {
  const [currentMember, setCurrentMember] = useState('')

  // useEffect(() => {
  //   async function getPageData() {
  //     localStorage.theme = 'light'

  //     if (sessionStorage.getItem('member_key')) {
  //       let member_value = JSON.parse(sessionStorage.getItem('member_key'))
  //       setCurrentMember(member_value)
  //       // console.log('member_value', member_value)
  //     }
  //     tippy('#loginBtn', {
  //       content: '엑세스를 제공 받으신 분만 사용 가능합니다.'
  //     })
  //   }
  //   getPageData()
  // }, [])

  // function logOutUser() {
  //   sessionStorage.removeItem('member_key')
  //   refreshPage()
  // }

  // function refreshPage() {
  //   window.location.reload()
  // }
  return (
    <>
      <header className="flex h-[60px] w-full items-center border border-b-fuchsia-200 px-[20vw] text-xs font-medium">
        <div className="mx-auto flex h-full w-full">
          <Link href="/" className="title-font flex space-x-1.5 font-medium text-gray-900">
            <Image alt="클립" src="/icon/clib-icon.svg" width={0} height={0} sizes="100vw" className="h-auto w-[30px] justify-center" />
            <Image alt="클립" src="/icon/clib-text-3d.svg" width={0} height={0} sizes="100vw" className="mt-[1px] h-auto w-[44px] justify-center" />
          </Link>
          <div className="ml-auto flex h-full w-fit space-x-4">
            {/* <Link className="flex cursor-pointer items-center gap-x-2" href="/clib/search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F53" className="pointer-events-none h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                  clipRule="evenodd"
                />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>
              <p>제목검색</p>
            </Link>
            <Link className="flex cursor-pointer items-center gap-x-2" href="/clib/clause">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5766CB" className="pointer-events-none h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p>조항검색</p>
            </Link>
            <div className="flex cursor-pointer items-center gap-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DF1F5D" className="pointer-events-none h-5 w-5">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <p>정의검색</p>
            </div> */}
            <Link target="_blank" className="flex cursor-pointer items-center" href="https://www.lawinsider.com">
              <div className="three-d mx-auto flex w-[120px] items-center justify-center gap-x-2 py-1.5">
                <Image alt="로인사이더" src="/icon/lawinsider.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" />
                <p className="text-[13px] text-white">Law Insider</p>
              </div>
            </Link>
            <Link className="flex cursor-pointer items-center" href="/upload">
              <div className="three-d mx-auto flex w-[120px] items-center justify-center gap-x-2 py-1.5">
                <Image alt="문서 업로드" src="/icon/upload.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" />
                <p className="text-[13px] text-white">문서 업로드</p>
              </div>
            </Link>
            {/* <Link className="flex cursor-pointer items-center " href="/upload">
              <div className="mx-auto flex w-[120px] items-center justify-center gap-x-2 rounded bg-fuchsia-600 py-1.5 shadow-md hover:bg-fuchsia-700">
                <Image alt="문서 업로드" src="/icon/upload.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" />
                <p className="text-[13px] text-white">문서 업로드</p>
              </div>
            </Link> */}
          </div>
        </div>
      </header>
    </>
  )
}

{
  /* <Link target="_blank" className="flex cursor-pointer items-center gap-x-2" href="https://www.lawinsider.com">
<div className="flex w-[120px] items-center justify-center gap-x-2 rounded bg-fuchsia-800 py-1.5 shadow hover:bg-gray-200 ">
  <Image alt="로인사이더" src="/icon/lawinsider.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" />
  <p className="text-[13px] text-white">Law Insider</p>
</div>
</Link>
<Link className="flex cursor-pointer items-center " href="/upload">
<div className="mx-auto flex w-[120px] items-center justify-center gap-x-2 rounded bg-gray-100 py-1.5 shadow hover:bg-gray-200">
  <Image alt="문서 업로드" src="/icon/upload.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" />
  <p className="text-[13px] text-gray-700">문서 업로드</p>
</div>
</Link> */
}
