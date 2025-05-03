import { ReactNode, FC } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-primary">
      <Header />
      {/* <div className="min-h-[calc(100vh-144px)]">{children}</div> */}
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
