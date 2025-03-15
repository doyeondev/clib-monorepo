// // in other pages
// // import { notFound } from "next/navigation"
// // if() notFound()

// export default function NotFount() {
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h2>Page Not Found</h2>
//       <p>Could not find requested resource</p>
//     </div>
//   )
// }
// import { SkeletonDemo } from '@/components/skeletonDemo'
// import { SkeletonContract } from '@/components/ui/skeleton/contract-item'

import React, { FC } from 'react'

const NotFound: FC = () => {
  return (
    <div className="my-auto flex h-screen flex-col items-center justify-center text-sm font-bold text-gray-500">
      {/* <SkeletonContract /> */}
      <h2>Page Not Found</h2>
      {/* <p>Could not find requested resource</p> */}
    </div>
  )
}

export default NotFound
