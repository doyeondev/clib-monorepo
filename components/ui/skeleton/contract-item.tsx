import React, { FC } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const SkeletonContract: FC = () => {
  return (
    <div className="flex w-full flex-col items-center space-y-6 border-t border-dotted border-gray-200 px-8 py-6">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="mr-auto h-5 w-[240px]" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div className="flex w-full flex-col space-y-2">
        <Skeleton className="h-2 w-1/4" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="mt-4 flex w-full flex-col justify-between space-y-2">
        <Skeleton className="h-2 w-1/4" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  )
}
