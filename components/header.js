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
      <header className="flex h-[60px] w-full items-center border border-b-fuchsia-200 px-[15vw] text-xs font-medium sm:px-[10vw]">
        <div className="mx-auto flex h-full w-full">
          <Link href="/" className="title-font flex space-x-1.5 font-medium text-gray-900">
            <Image alt="클립" src="/icon/clib-icon.svg" width={0} height={0} sizes="100vw" className="h-auto w-[30px] justify-center" />
            <Image alt="클립" src="/icon/clib-text-3d.svg" width={0} height={0} sizes="100vw" className="mt-[1px] h-auto w-[44px] justify-center" />
          </Link>
          <div className="ml-auto flex h-full w-fit space-x-4">
            <Link className="flex cursor-pointer items-center" href="/search">
              <div className="three-d mx-auto flex w-[120px] items-center justify-center gap-x-2 py-1.5">
                {/* <Image alt="문서 업로드" src="/icon/upload.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" /> */}
                <p className="text-[13px] text-white">테스트 페이지</p>
              </div>
            </Link>
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
