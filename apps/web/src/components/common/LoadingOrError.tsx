import React from 'react';
import Spinner from '../clib/Spinner'; // 기존 Spinner 사용

/**
 * 로딩 상태와 에러 처리를 담당하는 공통 컴포넌트
 * loading이 true면 Spinner 표시
 * error가 있으면 에러 메시지 표시
 * 그 외에는 children을 렌더링
 */
interface Props {
    loading: boolean;
    error: Error | null;
    children: React.ReactNode;
}

const LoadingOrError: React.FC<Props> = ({ loading, error, children }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center m-8">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                데이터를 불러오는 중 오류가 발생했습니다: {error.message}
            </div>
        );
    }

    return <>{children}</>;
};

export default LoadingOrError; 