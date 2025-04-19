import React, { TextareaHTMLAttributes, forwardRef } from 'react';

// Textarea 컴포넌트의 props 타입 정의
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
    fullWidth?: boolean;
}

// Textarea 컴포넌트: 재사용 가능한 텍스트 영역 UI
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className = '',
            label,
            helperText,
            error = false,
            fullWidth = false,
            id,
            disabled,
            required,
            ...props
        },
        ref
    ) => {
        // 고유 ID 생성 (label과 textarea 연결용)
        const uniqueId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

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
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
      ${className}
    `;

        return (
            <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
                {label && (
                    <label
                        htmlFor={uniqueId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={uniqueId}
                    className={baseClasses}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
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

Textarea.displayName = 'Textarea';

export default Textarea; 