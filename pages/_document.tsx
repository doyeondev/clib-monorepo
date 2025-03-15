// import { Html, Head, Main, NextScript } from 'next/document'
// import Script from 'next/script'

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head>
//         <meta charSet="utf-8" />
//         {/* <Script id="google-tag-manager" strategy="afterInteractive">
//           {`
//     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//     })(window,document,'script','dataLayer', 'GTM-KM93WS9');`}
//         </Script> */}
//       </Head>
//       <body>
//         <Main />
//         <NextScript />
//         {/* <noscript
//           dangerouslySetInnerHTML={{
//             __html: `
//             <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KM93WS9"
//             height="0" width="0" style="display:none;visibility:hidden"></iframe>
//             `,
//           }}
//         /> */}
//       </body>
//     </Html>
//   )
// }

import React, { FC } from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
// import Script from 'next/script'

const Document: FC = () => {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* <Script id="google-tag-manager" strategy="afterInteractive">
          {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', 'GTM-KM93WS9');`}
        </Script> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KM93WS9"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        /> */}
      </body>
    </Html>
  )
}

export default Document
