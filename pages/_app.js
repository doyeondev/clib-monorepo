import '../styles/globals.css'
import Script from 'next/script'
import Head from 'next/head'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import { ThemeProvider } from '@material-tailwind/react'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }) {
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
          `,
          }}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )

  // return (
  //   <>
  //     <Component {...pageProps} />
  //   </>
  // )
}
