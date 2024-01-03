import Header from './headerDemo'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <div className="bg-primary">
      <Header />
      {/* <div className="min-h-[calc(100vh-144px)]">{children}</div> */}
      <div>{children}</div>
      <Footer />
    </div>
  )
}
