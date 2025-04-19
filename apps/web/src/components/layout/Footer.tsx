import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="body-font flex h-[60px] w-full bg-gray-50 px-[15vw] text-xs sm:px-[10vw]">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center space-x-1">
                    <p className="text-gray-500">© {new Date().getFullYear()} Clib</p>
                    <p className="text-gray-500">·</p>
                    <p className="text-gray-500">주식회사 마이리걸팀</p>
                    <p className="text-gray-500">·</p>
                    <p className="text-gray-500">대표 김도연(dykim@mylegalteam.io)</p>
                </div>
                <Link to="/" className="title-font flex items-center space-x-1 font-medium text-gray-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" className="h-5 w-5">
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                    </div>
                </Link>
            </div>
        </footer>
    );
};

export default Footer; 