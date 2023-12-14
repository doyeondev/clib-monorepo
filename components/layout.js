import Header from './header'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <div className="bg-primary">
      <Header />
      {/* <div className="h-auto">{children}</div> */}
      <div className="min-h-[calc(100vh-144px)]">{children}</div>
      <Footer />
    </div>
  )
}
