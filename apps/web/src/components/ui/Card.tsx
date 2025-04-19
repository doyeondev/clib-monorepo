import React, { ReactNode } from 'react';

// Card 컴포넌트의 props 타입 정의
interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean; // 호버 효과 적용 여부
    bordered?: boolean; // 테두리 적용 여부
}

// CardHeader 컴포넌트의 props 타입 정의
interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

// CardBody 컴포넌트의 props 타입 정의
interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

// CardFooter 컴포넌트의 props 타입 정의
interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

// Card 컴포넌트: 재사용 가능한 카드 UI
export const Card: React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Body: React.FC<CardBodyProps>;
    Footer: React.FC<CardFooterProps>;
} = ({
    children,
    className = '',
    onClick,
    hoverable = false,
    bordered = true
}) => {
        return (
            <div
                className={`
        bg-white 
        rounded-lg 
        shadow-sm
        overflow-hidden
        ${bordered ? 'border border-gray-200' : ''}
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
                onClick={onClick}
            >
                {children}
            </div>
        );
    };

// CardHeader 컴포넌트: 카드의 헤더 영역
Card.Header = ({ children, className = '' }) => {
    return (
        <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

// CardBody 컴포넌트: 카드의 본문 영역
Card.Body = ({ children, className = '' }) => {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
};

// CardFooter 컴포넌트: 카드의 푸터 영역
Card.Footer = ({ children, className = '' }) => {
    return (
        <div className={`px-4 py-3 border-t border-gray-200 bg-gray-50 ${className}`}>
            {children}
        </div>
    );
};

export default Card; 