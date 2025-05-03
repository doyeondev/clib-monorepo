import React from 'react';

interface ToastProps {
    type: 'success' | 'error' | 'warning' | 'info';  // 토스트 유형
    message: string;                                  // 표시할 메시지
    icon?: React.ReactNode;                           // 사용자 정의 아이콘
    isVisible: boolean;                               // 표시 여부
    onClose?: () => void;                             // 닫기 핸들러 (옵션)
    autoClose?: boolean;                              // 자동 닫기 여부
    autoCloseTime?: number;                           // 자동 닫기 시간(ms)
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'; // 위치
}

/**
 * 재사용 가능한 토스트 알림 컴포넌트
 */
const Toast: React.FC<ToastProps> = ({
    type,
    message,
    icon,
    isVisible,
    onClose,
    autoClose = true,
    autoCloseTime = 3000,
    position = 'top-right'
}) => {
    // 자동 닫기 효과
    React.useEffect(() => {
        if (isVisible && autoClose && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseTime);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoClose, autoCloseTime, onClose]);

    if (!isVisible) return null;

    // 위치에 따른 클래스 설정
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };

    // 타입에 따른 스타일 설정
    const typeStyles = {
        'success': 'bg-green-50 border-green-400 text-green-700',
        'error': 'bg-red-50 border-red-400 text-red-700',
        'warning': 'bg-yellow-50 border-yellow-400 text-yellow-700',
        'info': 'bg-blue-50 border-blue-400 text-blue-700'
    };

    // 기본 아이콘 설정
    const defaultIcons = {
        'success': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        'error': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        'warning': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-yellow-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        'info': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 stroke-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
        )
    };

    return (
        <div className={`fixed z-50 ${positionClasses[position]}`}>
            <div className={`rounded-md border px-4 py-3 shadow-md ${typeStyles[type]}`}>
                <div className="flex items-center">
                    {icon || defaultIcons[type]}
                    <div className="ml-3 text-sm font-medium">{message}</div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 focus:ring-2 focus:ring-gray-300 inline-flex items-center justify-center h-8 w-8"
                            aria-label="닫기"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Toast; 