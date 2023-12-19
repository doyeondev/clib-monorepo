import '../styles/globals.css'
import Script from 'next/script'
import Head from 'next/head'
import React, { useEffect, useState, Fragment, createContext, useContext } from 'react'

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import { ThemeProvider } from '@material-tailwind/react'
import { ThemeProvider } from 'next-themes'

export const SessionContext = createContext()

export default function App({ Component, pageProps }) {
  const [userApproved, setUserApproved] = useState(false)

  const onInputChange = (e) => {
    if (e.target.value === '1234') {
      setUserApproved(true)
      sessionStorage.setItem('auth_status', true)
    }
  }

  useEffect(() => {
    async function getPageData() {
      let auth_status = sessionStorage.getItem('auth_status')
      if (auth_status === 'true') setUserApproved(true)
    }
    getPageData()
  }, [])

  return (
    <>
      <ThemeProvider attribute="class">
        {/* <ThemeProvider> */}
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-MS8Z3MX3ZN`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MS8Z3MX3ZN', {
              page_path: window.location.pathname,
            });
          `
          }}
        />
        {userApproved !== true ? (
          <>
            <Head>
              <title>클립</title>
              <meta name="description" content="Clib My Asset" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="center justify flex h-screen flex-col items-center bg-white">
              <div className="my-auto flex w-fit pb-8">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Type Access Code"
                  onChange={(e) => onInputChange(e)}
                  className="block w-[320px] rounded-md border-gray-400 bg-gray-50 p-2.5 py-1.5 text-center text-sm text-gray-700 placeholder:text-slate-500 hover:border-purple-400 focus:border-none focus:placeholder-transparent focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                  required=""
                />
              </div>
            </main>
          </>
        ) : (
          <SessionContext.Provider value={{ userApproved, onInputChange }}>
            <Component {...pageProps} />
          </SessionContext.Provider>
        )}
      </ThemeProvider>
    </>
  )

  // return (
  //   <>
  //     <Component {...pageProps} />
  //   </>
  // )
}
