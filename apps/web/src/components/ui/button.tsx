import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * 버튼 스타일 변형 타입 정의
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * 버튼 컴포넌트 Props 타입 정의
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * 버튼 스타일 클래스 매핑
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs py-1 px-2',
  sm: 'text-sm py-1.5 px-3',
  md: 'text-base py-2 px-4',
  lg: 'text-lg py-2.5 px-5',
};

/**
 * 버튼 컴포넌트
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 기본 스타일 조합
    const baseClasses = `
      inline-flex
      items-center
      justify-center
      font-medium
      rounded-md
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      disabled:opacity-50
      disabled:pointer-events-none
      ${fullWidth ? 'w-full' : ''}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {startIcon && !isLoading && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
