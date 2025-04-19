import { useState, useEffect, createContext, useContext } from 'react';

// 사용자 타입 정의
interface User {
	id: string;
	email: string;
	name: string;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	signup: (email: string, password: string, name: string) => Promise<void>;
}

// 기본 컨텍스트 값 생성
export const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: false,
	error: null,
	login: async () => {},
	logout: () => {},
	signup: async () => {},
});

// AuthProvider 컴포넌트 정의 (앱 최상위에서 사용)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// 초기 로딩 시 로컬 스토리지에서 사용자 정보 확인
	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				console.error('Failed to parse user from localStorage:', e);
				localStorage.removeItem('user');
			}
		}
		setLoading(false);
	}, []);

	// 로그인 함수
	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);

		try {
			// 실제 API 호출은 여기에 구현
			// const response = await apiClient.post('/auth/login', { email, password });

			// 임시로 모킹된 사용자 데이터
			const mockUser: User = {
				id: '1',
				email,
				name: 'Test User',
			};

			setUser(mockUser);
			localStorage.setItem('user', JSON.stringify(mockUser));
			console.log('로그인 성공:', mockUser);
		} catch (err) {
			console.error('로그인 실패:', err);
			setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 로그아웃 함수
	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
		console.log('로그아웃 완료');
	};

	// 회원가입 함수
	const signup = async (email: string, password: string, name: string) => {
		setLoading(true);
		setError(null);

		try {
			// 실제 API 호출은 여기에 구현
			// const response = await apiClient.post('/auth/signup', { email, password, name });

			// 임시로 모킹된 사용자 데이터
			const mockUser: User = {
				id: '1',
				email,
				name,
			};

			setUser(mockUser);
			localStorage.setItem('user', JSON.stringify(mockUser));
			console.log('회원가입 성공:', mockUser);
		} catch (err) {
			console.error('회원가입 실패:', err);
			setError('회원가입에 실패했습니다. 다시 시도해주세요.');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// createContext 대신 일반 객체를 사용하여 반환
	const contextValue: AuthContextType = {
		user,
		loading,
		error,
		login,
		logout,
		signup,
	};

	// 자식 컴포넌트와 함께 반환
	return (
		// @ts-ignore - JSX 대신 일반 JavaScript로 처리
		AuthContext.Provider({ value: contextValue, children })
	);
};

// 커스텀 훅: 컴포넌트에서 인증 정보에 접근할 수 있게 함
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
	}
	return context;
};
