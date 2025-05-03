import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 계약서 목록 컴포넌트
 */
interface ContractListProps {
    contractList: any[]
}

const ContractList: FC<ContractListProps> = ({ contractList }) => {
    const navigate = useNavigate()

    const handleClick = (id: string, title: string) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('item_key', id)
            navigate('/clause')
        }
    }

    return (
        <main className="mx-auto w-[920px] px-[10vw] py-6">
            {contractList.map((item, idx) => (
                <div
                    className="mb-5 cursor-pointer border border-transparent bg-[#F5F5F5] px-5 py-3 hover:border-[#F24E1E]"
                    key={idx}
                    onClick={() => handleClick(item.id, item.title)}
                >
                    <div className="flex gap-x-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-gradient-to-r from-[#F78358] to-[#AF6EE8] text-sm font-bold text-white">
                            {item.partyA?.substring(0, 1)}
                            {item.partyB?.substring(0, 1)}
                        </div>
                        <div className="mt-0.5 flex flex-col">
                            <div className="flex-1">
                                <div className="font-bold">{item.title}</div>
                            </div>
                            <div className="flex gap-x-1 text-xs text-gray-500">
                                {item.industry && <span>{item.industry}</span>}
                                {item.partyA && (
                                    <span>
                                        {item.partyA} - {item.partyB}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    )
}

export default ContractList 