import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { getContractList } from './api/clib';

// 레이아웃 및 공통 컴포넌트
import Layout from './components/layout/Layout';
import { Loader } from './components/clib/Loader';

// 코드 스플리팅을 위한 지연 로딩 사용
const Search = lazy(() => import('./pages/search'));
const Clause = lazy(() => import('./pages/clause'));
const Upload = lazy(() => import('./pages/upload'));

// 세션 컨텍스트 정의
interface SessionContextType {
  contractAsset: any[];
  clippedContract: string[];
  clippedClause: string[];
  userApproved: boolean;
  authUser: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClipClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  toastDetail?: Record<string, any>;
  toastState?: boolean;
  setToastState?: (state: boolean) => void;
}

interface SessionProviderProps {
  children: ReactNode;
}

// 세션 컨텍스트 생성
export const SessionContext = createContext<SessionContextType>({
  contractAsset: [],
  clippedContract: [],
  clippedClause: [],
  userApproved: true,
  authUser: () => { },
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
  const [clippedContract, setClippedContract] = useState<string[]>([]);
  const [clippedClause, setClippedClause] = useState<string[]>([]);
  const [userApproved, setUserApproved] = useState<boolean>(true);
  const [toastState, setToastState] = useState<boolean>(false);
  const [toastDetail, setToastDetail] = useState<Record<string, any>>({});

  // 앱 시작 시 계약서 데이터 가져오기
  useEffect(() => {
    // 계약서 데이터 가져오기 함수
    async function fetchContractData() {
      try {
        console.log('[App] 계약서 데이터 로딩 시작...');

        // API에서 계약서 목록 가져오기 (기존 코드)
        // const response = await fetch('https://conan.ai/_functions/clibContractList');
        // const data = await response.json();

        // 새로운 API 엔드포인트 사용 코드 (주석 처리됨)
        const data = await getContractList();

        console.log('[App] 계약서 데이터 로드 완료:', data);

        // 기존 코드 (현재 활성화)
        // if (data && data.items && Array.isArray(data.items)) {
        //   setContractAsset(data.items);
        //   console.log('[App] contractAsset 설정 완료, 항목 수:', data.items.length);
        // } else {

        // 새로운 API 응답 구조 처리 코드 (주석 처리됨)
        if (data && Array.isArray(data)) {
          // setContractAsset(data[1]);
          setContractAsset(data);

          console.log('[App] contractAsset 설정 완료, 항목 수:', data.length);
        } else {
          console.log('[App] 계약서 데이터 형식이 예상과 다릅니다:', data);
        }
      } catch (error) {
        console.error('[App] 계약서 데이터 로딩 중 오류 발생:', error);

        console.log('[App] 오류 발생');
      }
    }

    fetchContractData();
  }, []);

  // 사용자 인증 함수
  const authUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'clib') {
      setUserApproved(true);
    }
  };

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
    clippedContract,
    clippedClause,
    userApproved,
    authUser,
    onClipClick,
    toastDetail,
    toastState,
    setToastState
  };

  return (
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
  );
}

export default App;
