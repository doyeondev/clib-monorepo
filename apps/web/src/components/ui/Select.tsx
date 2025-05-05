import React, { useState, useId } from 'react';

/**
 * 선택 가능한 옵션의 타입 정의
 */
export interface SelectOption {
    value: string;
    label: string;
}

/**
 * Select 컴포넌트 Props 타입 정의
 */
export interface SelectProps {
    options: SelectOption[]; // 선택 가능한 옵션 목록
    value: string; // 현재 선택된 값
    onChange: (value: string) => void; // 값 변경 핸들러
    label?: string; // 라벨 텍스트
    helperText?: string; // 도움말 텍스트
    error?: boolean; // 에러 상태
    errorText?: string; // 에러 메시지
    required?: boolean; // 필수 항목 여부
    disabled?: boolean; // 비활성화 여부
    className?: string; // 추가 클래스명
    id?: string; // ID 속성
    name?: string; // name 속성
    placeholder?: string; // 선택되지 않았을 때 표시할 텍스트
}

/**
 * 드롭다운 선택 컴포넌트
 * 
 * 옵션 목록에서 항목을 선택할 수 있는 UI 컴포넌트입니다.
 * 라벨, 도움말 텍스트, 에러 상태 등을 지원합니다.
 */
const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    label,
    helperText,
    error = false,
    errorText,
    required = false,
    disabled = false,
    className = '',
    id: externalId,
    name,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const internalId = useId();
    const id = externalId || internalId;

    // 현재 선택된 옵션 찾기
    const selectedOption = options.find(option => option.value === value);

    // 옵션 선택 핸들러
    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    // 드롭다운 토글 핸들러
    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    id={id}
                    name={name}
                    className={`w-full rounded-lg bg-white text-sm font-semibold shadow flex cursor-pointer items-center justify-between px-4 py-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={toggleDropdown}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="block truncate">
                        {selectedOption ? selectedOption.label : placeholder || '선택하세요'}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#91A5BE"
                        className={`h-4 w-4 duration-150 ${isOpen ? 'rotate-90' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 border-t border-[#E5E8EC] bg-white shadow-lg rounded-b-md">
                        <ul
                            className="py-1"
                            role="listbox"
                            aria-labelledby={id}
                        >
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    className={`p-2 hover:cursor-pointer hover:bg-gray-200 ${option.value === value ? 'bg-gray-100' : ''}`}
                                    role="option"
                                    aria-selected={option.value === value}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span className={`text-fuchsia-500 opacity-0 ${option.value === value && 'opacity-100'}`}>• </span>
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {(helperText || (error && errorText)) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {error ? errorText : helperText}
                </p>
            )}
        </div>
    );
};

export default Select; 