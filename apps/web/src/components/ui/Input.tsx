import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

// Input 컴포넌트의 props 타입 정의
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
    fullWidth?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    containerClassName?: string;
}

// Input 컴포넌트: 재사용 가능한 입력 필드 UI
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = '',
            label,
            helperText,
            error = false,
            fullWidth = false,
            startIcon,
            endIcon,
            type = 'text',
            id,
            disabled,
            required,
            containerClassName = '',
            ...props
        },
        ref
    ) => {
        // 고유 ID 생성 (label과 input 연결용)
        const uniqueId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        // 기본 스타일 클래스
        const baseClasses = `
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-blue-500 
          focus:ring-blue-500
          disabled:opacity-50
          disabled:bg-gray-100
          ${startIcon ? 'pl-10' : ''}
          ${endIcon ? 'pr-10' : ''}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `;

        return (
            <div className={`${fullWidth ? 'w-full' : ''} mb-4 ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={uniqueId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {startIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {startIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={uniqueId}
                        type={type}
                        className={baseClasses}
                        disabled={disabled}
                        required={required}
                        {...props}
                    />
                    {endIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {endIcon}
                        </div>
                    )}
                </div>
                {helperText && (
                    <p
                        className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'
                            }`}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input; 