import { useEffect, useState } from 'react'
import Layout from 'components/layoutDemo'
import Head from 'next/head'
import _ from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Spinner } from '/components/clib/Spinner.js'

export default function Result({ data }) {
  const [selectedClauses, setSelectedClauses] = useState([]) // 선택된 메모의 인덱스. 디폴트는 첫번째 메모로 지정함.
  console.log('data', data)

  const router = useRouter()
  const passedData = router.query
  console.log('passedData', passedData)

  useEffect(() => {
    async function getPageData() {
      if (passedData) {
        const updatedClauses = [...selectedClauses, parseInt(passedData.idx)]
        setSelectedClauses(updatedClauses)
        console.log('updatedClauses', updatedClauses)
      }
    }
    getPageData()
  }, [])

  useEffect(() => {
    console.log('updated selectedClauses : ', selectedClauses)
  }, [selectedClauses])
  // grid-cols-[240px_1fr_1.2fr]
  function clauseClickHandler(e) {
    // console.log('id', e.target.id)
    let selectedIdx = parseInt(e.target.id)

    // 이미 클릭되었었던 경우 => 빼준다
    if (selectedClauses.includes(selectedIdx)) {
      let updatedClauses = selectedClauses.filter((clause) => clause !== selectedIdx)
      setSelectedClauses(updatedClauses)
    }
    // 이전에 선택 안되었었던 조항의 경우 => 추가해준다
    else if (!selectedClauses.includes(selectedIdx)) {
      const updatedClauses = [...selectedClauses, selectedIdx]
      setSelectedClauses(updatedClauses)
    }
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{`클립 | ${data.title}`}</title>
          <meta name="description" content="Clib My Asset" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="bg-white">
          {/* 메뉴상단은 Layout.js에 있음 */}
          {/* 계약 상세정보 + 원문보기 */}
          <main className="mx-auto w-[960px] px-[10vw] py-6">
            <div className="flex justify-between px-8">
              <Link href="/" className="flex items-center rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none mr-2 h-4 w-4">
                  <path
                    fillRule="evenodd"
                    d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>뒤로가기</p>
              </Link>
              {/* <button className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">뒤로가기</button> */}
              {/* <button className="rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white">원문보기</button> */}
              <button onClick={() => setShowPreview(!showPreview)} className="ml-auto rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600">
                계약서 원문보기
              </button>
            </div>
            <div className="flex w-full flex-col border-b border-black px-8 py-6 text-sm">
              <div className="flex items-center py-2">
                <div className="text-lg font-bold">{data.title}</div>
                <div className="ml-4 rounded bg-gray-200/50 px-1 py-0.5 text-xs text-gray-600 shadow-sm">{data.source}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="flex flex-col">
                  <p className="text-gray-500">계약 당사자 (갑)</p>
                  <p className="mt-1 text-gray-700">{data.partyA}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500">계약 당사자 (을)</p>
                  <p className="mt-1 text-gray-700">{data.partyB}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500">산업</p>
                  <p className="mt-1 text-gray-700">{data.industry}</p>
                </div>
              </div>
              <div className="my-2 h-[1px] w-full bg-slate-300"></div>
              <div className="flex flex-col py-2">
                <p className="text-gray-500">계약의 목적</p>
                <p className="mt-1 text-gray-700">{data.purpose}</p>
              </div>
            </div>
          </main>
          <div className="mx-auto w-[960px] px-[10vw] py-6">
            <div className="flex flex-wrap place-content-center gap-4 px-8">
              {data['clauseArray']?.map((clause) => {
                // console.log('clause.idx', clause.idx, selectedClauses)
                // console.log('selectedClauses.includes(clause.idx)', selectedClauses.includes(clause.idx))
                return (
                  <div
                    onClick={function (e) {
                      clauseClickHandler(e)
                    }}
                    id={clause.idx}
                    key={clause.idx}
                    className={`cursor-pointer rounded border border-slate-600 px-3 py-1 text-xs font-medium ${selectedClauses.includes(clause.idx) === true ? 'bg-gray-800 text-white shadow-sm' : 'bg-white'}`}
                  >
                    제{clause.idx}조 {clause.text}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mx-auto w-[960px] px-[10vw] py-6">
            {data['contentArray']?.map((clause, idx) => {
              if (selectedClauses.includes(idx) === true) {
                console.log('clause', clause)
                // let clauseTitle = sampleData[idx].filter((data) => data.tag === 'h2').text
                // const selectedItem =
                const article = clause.filter((x) => x.tag === 'h2')[0] // 첫 번째 h2여서 '0'
                const contentList = clause.filter((x) => x.tag !== 'h2')
                let CONTENT_HTML = ''
                for (let i = 0; i < contentList.length; i++) {
                  CONTENT_HTML = CONTENT_HTML.concat(contentList[i].html)
                }
                console.log('article', article)
                console.log('CONTENT_HTML', CONTENT_HTML)
                return (
                  <>
                    <div className="clauseCard mb-8 flex flex-col px-8">
                      <h3 className="mb-1 font-bold">
                        제{article.idx}조 {article.text}
                      </h3>
                      <div style={{ color: 'black' }} className="text-xs leading-5" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}></div>
                    </div>
                  </>
                )
              }
            })}
          </div>
        </div>
      </Layout>
    </>
  )
}

// export const getServerSideProps = async ({ query }) => {
//   console.log('query', query)
//   const { type } = query

//   // const response = await fetch(`https://api.spacexdata.com/v4/contracts/${cId}`)
//   // const data = await response.json()
//   const apiUrlEndpoint = `https://conan.ai/_functions/getTemplateInfo/${type}`
//   const response = await fetch(apiUrlEndpoint)
//   const res = await response.json()
//   const data = res.items
//   // console.log('data', data)

//   return { props: { contract: data } }
// }

// export async function getStaticPaths() {
//   // const fetcher = url => fetch(url).then(res => res.json())
//   // const { data, error, isLoading } = useSWR('https://conan.ai/_functions/getAllTemplateInfo', fetcher)
//   // console.log('data', data)

//   const response = await fetch('https://conan.ai/_functions/clibContractList')
//   const res = await response.json()
//   const data = res.items
//   console.log('data2', data)
//   const paths = data.map((item) => ({
//     params: { type: item._id.toString() }
//   }))

//   return { paths, fallback: false }
// }

// export async function getStaticProps({ params }) {
//   // const { type } = query
//   const response = await fetch(`https://conan.ai/_functions/clibContractItem/${params.type}`)
//   const res = await response.json()
//   const data = res.items
//   console.log('data', data)
//   // const fetcher = url => fetch(url).then(res => res.json())
//   // const { data, error, isLoading } = useSWR(`https://conan.ai/_functions/getTemplateInfo/${params.type}`, fetcher)

//   return { props: { data: data } }
// }

export const getServerSideProps = async ({ query }) => {
  console.log('query', query)
  const { _id } = query

  // const response = await fetch(`https://api.spacexdata.com/v4/contracts/${cId}`)
  // const data = await response.json()
  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractItem/${_id}`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const data = res.items
  console.log('data', data)

  return { props: { data: data[0] } }
}
