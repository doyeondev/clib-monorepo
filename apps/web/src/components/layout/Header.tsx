import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="body-font sticky top-0 z-50 shadow-sm bg-white">
            <div className="mx-auto flex h-16 flex-row items-center justify-between px-[15vw] sm:px-[10vw]">
                <Link
                    to="/"
                    className="title-font flex items-center space-x-1 font-medium text-gray-900"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500 p-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#ffffff"
                            className="h-5 w-5"
                        >
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                    </div>
                    <span className="font-bold text-2xl">Clib</span>
                </Link>
                <nav className="ml-auto hidden flex-wrap items-center justify-center text-base md:flex lg:flex">
                    <Link
                        to="/search"
                        className={`mr-5 hover:text-gray-900 ${pathname === '/search' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                            }`}
                    >
                        서식검색
                    </Link>
                    <Link
                        to="/explore"
                        className={`mr-5 hover:text-gray-900 ${pathname === '/explore' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                            }`}
                    >
                        둘러보기
                    </Link>
                    <Link
                        to="/upload"
                        className={`mr-5 hover:text-gray-900 ${pathname === '/upload' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                            }`}
                    >
                        업로드
                    </Link>
                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                className={`mr-5 hover:text-gray-900 ${pathname === '/profile' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                                    }`}
                            >
                                내 프로필
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center rounded border-0 px-3 py-1 text-base text-gray-500 hover:text-gray-900 focus:outline-none"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center rounded px-3 py-1 text-base text-fuchsia-500 hover:bg-gray-100 focus:outline-none"
                        >
                            로그인
                        </Link>
                    )}
                </nav>
                <button
                    className="inline-flex rounded p-2 text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden lg:hidden"
                    onClick={toggleMenu}
                >
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            {isMenuOpen && (
                <div className="absolute w-full bg-white py-2 shadow-md md:hidden lg:hidden">
                    <div className="flex flex-col px-[15vw] sm:px-[10vw]">
                        <Link
                            to="/search"
                            className={`py-2 ${pathname === '/search' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                                }`}
                        >
                            서식검색
                        </Link>
                        <Link
                            to="/explore"
                            className={`py-2 ${pathname === '/explore' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                                }`}
                        >
                            둘러보기
                        </Link>
                        <Link
                            to="/upload"
                            className={`py-2 ${pathname === '/upload' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                                }`}
                        >
                            업로드
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`py-2 ${pathname === '/profile' ? 'text-fuchsia-500 font-bold' : 'text-gray-500'
                                        }`}
                                >
                                    내 프로필
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="py-2 text-left text-gray-500"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="py-2 text-fuchsia-500"
                            >
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 