import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getContractList } from './api/clib';
import { queryClient } from './pages/search';
import { Loader } from './components/clib/Loader';

// 코드 스플리팅을 위한 지연 로딩 사용
const Search = lazy(() => import('./pages/search'));
const Clause = lazy(() => import('./pages/clause'));
const Upload = lazy(() => import('./pages/upload'));

/**
 * 세션 컨텍스트 정의
 * 여러 페이지에서 공유하는 상태를 관리
 */
interface SessionContextType {
  contractAsset: any[];               // 계약서 자산 데이터
  clippedClause: string[];            // 선택된 조항 ID 목록
  onClipClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 조항 선택 이벤트
  toastDetail?: Record<string, any>;  // 토스트 메시지 세부 정보
  toastState?: boolean;               // 토스트 메시지 표시 상태
  setToastState?: (state: boolean) => void; // 토스트 상태 변경 함수
}

// 세션 컨텍스트 생성 - 기본값 설정
export const SessionContext = createContext<SessionContextType>({
  contractAsset: [],
  clippedClause: [],
  onClipClick: () => { },
  toastDetail: {},
  toastState: false,
  setToastState: () => { }
});

/**
 * 루트 앱 컴포넌트
 */
function App() {
  // SessionContext에 제공할 상태와 함수 생성
  const [contractAsset, setContractAsset] = useState<any[]>([]);
  const [clippedClause, setClippedClause] = useState<string[]>([]);
  const [toastState, setToastState] = useState<boolean>(false);
  const [toastDetail, setToastDetail] = useState<Record<string, any>>({});

  // 앱 시작 시 계약서 데이터 가져오기
  useEffect(() => {
    async function fetchContractData() {
      try {
        console.log('[App] 계약서 데이터 로딩 시작...');
        const data = await getContractList();

        if (data && Array.isArray(data)) {
          setContractAsset(data);
          console.log('[App] contractAsset 설정 완료, 항목 수:', data.length);
        } else {
          console.log('[App] 계약서 데이터 형식이 예상과 다릅니다:', data);
        }
      } catch (error) {
        console.error('[App] 계약서 데이터 로딩 중 오류 발생:', error);
      }
    }

    fetchContractData();
  }, []);

  // 클립 기능 처리
  const onClipClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.id;
    const type = e.currentTarget.name;

    console.log('클립 기능 호출:', id, type);

    // 클립 로직 (예시)
    if (type === 'clause') {
      if (clippedClause.includes(id)) {
        setClippedClause(clippedClause.filter(item => item !== id));
        setToastDetail({ id, action: '삭제' });
      } else {
        setClippedClause([...clippedClause, id]);
        setToastDetail({ id, action: '추가' });
      }
      setToastState(true);

      // 토스트 메시지 자동 제거
      setTimeout(() => {
        setToastState(false);
      }, 2000);
    }
  };

  // SessionContext에 전달할 값
  const sessionContextValue = {
    contractAsset,
    clippedClause,
    onClipClick,
    toastDetail,
    toastState,
    setToastState
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={sessionContextValue}>
        <Router>
          <Routes>
            {/* 홈 페이지는 Search 컴포넌트로 리디렉션 */}
            <Route path="/" element={<Navigate to="/search" replace />} />

            {/* 주요 페이지 라우트 */}
            <Route path="/search/*" element={
              <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader /></div>}>
                <Search />
              </Suspense>
            } />
            <Route path="/clause/*" element={
              <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader /></div>}>
                <Clause />
              </Suspense>
            } />
            <Route path="/upload/*" element={
              <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader /></div>}>
                <Upload />
              </Suspense>
            } />

            {/* 404 페이지 - 모든 경로에 매치되지 않을 경우 */}
            <Route path="*" element={
              <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="mt-2 text-xl">페이지를 찾을 수 없습니다</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-6 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  홈으로 돌아가기
                </button>
              </div>
            } />
          </Routes>
        </Router>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
