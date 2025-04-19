import React, { FC, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Skeleton: FC<SkeletonProps> = ({ className, ...props }: SkeletonProps) => {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />
}

export { Skeleton }
