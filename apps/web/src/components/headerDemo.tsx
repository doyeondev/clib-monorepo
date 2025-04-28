// import Link from 'next/link'
// import DarkModeToggleButton from './dark-mode-toggle-button'
// import Image from 'next/image'
// import React, { useEffect, useState } from 'react'
// import tippy from 'tippy.js'
// import 'tippy.js/dist/tippy.css' // optional for styling

// export default function Nav() {
//   const [currentMember, setCurrentMember] = useState('')

//   return (
//     <>
//       <header className="flex h-[60px] w-full items-center border border-b-fuchsia-200 px-[15vw] text-xs font-medium sm:px-[10vw]">
//         <div className="mx-auto flex h-full w-full">
//           <Link href="/demo" className="title-font flex space-x-1.5 font-medium text-gray-900">
//             <Image alt="클립" src="/icon/clib-icon.svg" width={0} height={0} sizes="100vw" className="h-auto w-[30px] justify-center" />
//             <Image alt="클립" src="/icon/clib-text-3d.svg" width={0} height={0} sizes="100vw" className="mt-[1px] h-auto w-[44px] justify-center" />
//           </Link>
//           <div className="ml-auto flex h-full w-fit space-x-4">
//             <Link className="flex cursor-pointer items-center" href="/demo/clause">
//               <div className="three-d mx-auto flex w-[130px] items-center justify-center gap-x-2 py-1.5">
//                 <Image alt="클립" src="/icon/clib-icon.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-5 w-5" />
//                 <p className="text-[13px] text-white">Clib Asset</p>
//               </div>
//             </Link>
//             <Link className="flex cursor-pointer items-center" href="/demo">
//               <div className="three-d mx-auto flex w-[130px] items-center justify-center gap-x-2 py-1.5">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 stroke-white">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
//                   />
//                 </svg>
//                 <p className="text-[13px] text-white">내 계약 데이터</p>
//               </div>
//             </Link>
//             <Link className="flex cursor-pointer items-center" href="/demo/search">
//               <div className="three-d mx-auto flex w-[130px] items-center justify-center gap-x-2 py-1.5">
//                 {/* <Image alt="문서 업로드" src="/icon/pen.svg" width={0} height={0} sizes="100vw" className="pointer-events-none h-4 w-4" /> */}
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#eeeeee" data-slot="icon" className="pointer-events-none h-4 w-4">
//                   <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-[13px] text-white">내 조항 데이터</p>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </header>
//     </>
//   )
// }

import React, { FC } from 'react'
import { Link } from 'react-router-dom'
// import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';

// 이미지 임포트
import clibIcon from '../assets/icon/clib-icon.svg'
import clibText from '../assets/icon/clib-text-3d.svg'

interface NavProps { }

const Nav: FC<NavProps> = () => {
  // const [currentMember, setCurrentMember] = useState<string>('')

  return (
    <>
      <header className="border-b border-b-fuchsia-100 bg-white">
        <div className="mx-auto flex h-[60px] w-full max-w-[1400px] items-center px-8 text-xs font-medium">
          <Link to="/" className="title-font flex space-x-1.5 font-medium text-gray-900">
            <img alt="클립" src={clibIcon} className="h-8 w-8 justify-center" />
            <span className="text-2xl font-bold text-purple-600">Clib</span>
          </Link>
          <div className="ml-auto flex h-full items-center space-x-4 py-2">
            <Link className="flex cursor-pointer items-center" to="/clause">
              <div className="three-d mx-auto flex w-[130px] items-center justify-center gap-x-2 rounded-md py-2">
                <img alt="클립" src={clibIcon} className="pointer-events-none h-5 w-5" />
                <p className="text-[13px] font-medium text-white">Clib Asset</p>
              </div>
            </Link>
            <Link className="flex cursor-pointer items-center" to="/search">
              <div className="three-d mx-auto flex w-[130px] items-center justify-center gap-x-2 rounded-md py-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#eeeeee" data-slot="icon" className="pointer-events-none h-4 w-4">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <p className="text-[13px] font-medium text-white">내 조항 데이터</p>
              </div>
            </Link>
            <Link className="flex cursor-pointer items-center" to="/upload">
              <div className="three-d mx-auto flex w-[130px] items-center justify-center gap-x-2 rounded-md py-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 stroke-white">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <p className="text-[13px] font-medium text-white">계약서 업로드</p>
              </div>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Nav
