'use client'

import React, { FC, ReactNode, useState } from 'react'
import { cn } from '../../lib/utils'

/**
 * 툴팁 컴포넌트 타입 정의
 */
interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * 간단한 툴팁 컴포넌트
 * 마우스 오버 시 툴팁을 표시합니다.
 */
export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-md',
            positionClasses[position],
            className
          )}
        >
          {content}
          <div
            className={cn(
              'absolute h-2 w-2 rotate-45 bg-gray-800',
              position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
              position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
