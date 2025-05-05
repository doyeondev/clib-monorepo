import { FC } from 'react'
import { Link } from 'react-router-dom'

// 이미지 임포트
import clibIcon from '../../assets/icon/clib-icon.svg'
import clibText from '../../assets/icon/clib-text-3d.svg'

const Footer: FC = () => {
  return (
    <>
      <footer className="body-font flex h-[60px] w-full px-[15vw] text-xs sm:px-[10vw]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-1">
            <p className="mt-4 text-gray-500 sm:mt-0">© 2023-2025 clib</p>
          </div>
          <Link to="/" className="title-font flex space-x-1.5 font-medium text-gray-900">
            <img alt="클립" src={clibIcon} className="h-auto w-[30px] justify-center" />
            <img alt="클립" src={clibText} className="mt-[1px] h-auto w-[44px] justify-center" />
          </Link>
        </div>
      </footer>
    </>
  )
}

export default Footer
