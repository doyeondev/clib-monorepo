import React, { FC } from 'react'
import { Skeleton } from '../Skeleton'

/**
 * 계약서 항목 로딩 시 스켈레톤 UI
 */
export const SkeletonContract: FC = () => {
  return (
    <div className="mt-4 flex w-full border-b pb-4">
      <div className="h-auto w-5 flex-none grow border-l-4 border-gray-200"></div>
      <div className="flex w-full grow flex-col space-y-4 border-gray-300 text-sm">
        <div className="group flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between text-[13px]">
            <div className="flex flex-col">
              <Skeleton className="mb-1 h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="mb-1 h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="mb-1 h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="my-4 flex gap-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonContract
