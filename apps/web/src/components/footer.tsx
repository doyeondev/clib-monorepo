// import Link from 'next/link'
// import Image from 'next/image'

// export default function Footer() {
//   return (
//     <>
//       <footer className="body-font flex h-[60px] w-full px-[15vw] text-xs sm:px-[10vw]">
//         <div className="flex w-full items-center justify-between">
//           <div className="flex items-center space-x-1">
//             <p className="mt-4 text-gray-500 sm:mt-0">© 2023 clib</p>
//             <p className="mt-4 text-gray-500 sm:mt-0">·</p>
//             <p className="mt-4 text-gray-500 sm:mt-0">주식회사 마이리걸팀</p>
//             <p className="mt-4 text-gray-500 sm:mt-0">·</p>
//             <p className="mt-4  text-gray-500 sm:mt-0">대표 김도연(dykim@mylegalteam.io)</p>
//           </div>
//           <Link href="/" className="title-font flex space-x-1.5 font-medium text-gray-900">
//             <Image alt="클립" src="/icon/clib-icon.svg" width={0} height={0} sizes="100vw" className="h-auto w-[30px] justify-center" />
//             <Image alt="클립" src="/icon/clib-text-3d.svg" width={0} height={0} sizes="100vw" className="mt-[1px] h-auto w-[44px] justify-center" />
//           </Link>
//         </div>
//       </footer>
//     </>
//   )
// }

import React, { FC } from 'react'
import { Link } from 'react-router-dom'

// 이미지 임포트
import clibIcon from '../assets/icon/clib-icon.svg'
import clibText from '../assets/icon/clib-text-3d.svg'

const Footer: FC = () => {
  return (
    <>
      <footer className="body-font flex h-[60px] w-full px-[15vw] text-xs sm:px-[10vw]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-1">
            <p className="mt-4 text-gray-500 sm:mt-0">© 2023 clib</p>
            <p className="mt-4 text-gray-500 sm:mt-0">·</p>
            <p className="mt-4 text-gray-500 sm:mt-0">주식회사 마이리걸팀</p>
            <p className="mt-4 text-gray-500 sm:mt-0">·</p>
            <p className="mt-4 text-gray-500 sm:mt-0">대표 김도연(dykim@mylegalteam.io)</p>
          </div>
          <Link to="/" className="title-font flex space-x-1.5 font-medium text-gray-900">
            <img alt="클립" src={clibIcon} className="h-auto w-[30px] justify-center" />
            <img alt="클립" src={clibText} className="mt-[1px] h-auto w-[44px] justify-center" />
          </Link>
        </div>
      </footer>
    </>
  )
}

export default Footer
