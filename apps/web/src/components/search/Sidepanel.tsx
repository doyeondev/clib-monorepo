import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { Loader } from '../feedback/Loader'

// 사이드패널에 전달되는 데이터 타입 정의를 확장
interface ContractData {
  id: string;
  url: string;
  title: string;
  partyA: string;
  partyB: string;
  industry: string;
  purpose: string;
  clause_array: { idx: number; text: string }[];
  content_array: { tag: string; idx: number; text: string; html: string }[][];
  contract_title: string;
}

interface SidePanelProps {
  data: ContractData | null;
  clickedItem: any;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
}

export default function SidePanel({ data, clickedItem, showSidebar, setShowSidebar }: SidePanelProps) {
  // 선택된 조항 인덱스 배열 (여러 개 선택 가능)
  const [selectedClauses, setSelectedClauses] = useState<number[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [fileLoadCompleted, setFileLoadCompleted] = useState(false)

  console.log('SidePanel data:', data)
  console.log('SidePanel clickedItem:', clickedItem)

  useEffect(() => {
    if (clickedItem) {
      const updatedClauses = [...selectedClauses, clickedItem.cidx]
      console.log('updatedClauses', updatedClauses)

      setSelectedClauses(updatedClauses)
      console.log('clickedItem', clickedItem)
      console.log('data', data)
    }
  }, [])

  // selectedClauses 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('선택된 조항 목록 변경됨:', selectedClauses);
  }, [selectedClauses]);

  // showPreview 상태가 변경될 때 실행
  useEffect(() => {
    console.log('미리보기 상태 변경됨:', showPreview);
    const docsFile = document.getElementById('googleDocs');

    if (docsFile) {
      docsFile.onload = function () {
        setFileLoadCompleted(true);
      };
    }
  }, [showPreview]);

  // 조항 클릭 처리 함수 - 레거시 코드와 동일하게 구현
  function clauseClickHandler(e: React.MouseEvent<HTMLDivElement>) {
    const selectedIdx = parseInt(e.currentTarget.id);
    // console.log('[SidePanel] 조항 버튼 클릭:', selectedIdx);
    // console.log(`[SidePanel] 해당 조항 존재 여부: ${!!safeData.clauseArray?.find(c => c.idx === selectedIdx)}`);

    // 이미 클릭되었던 경우 => 빼준다 (레거시 방식: 마지막 조항도 제거 가능)
    if (selectedClauses.includes(selectedIdx)) {
      const updatedClauses = selectedClauses.filter((clause) => clause !== selectedIdx);
      console.log('[SidePanel] 조항 선택 해제:', selectedIdx, '남은 조항:', updatedClauses);
      setSelectedClauses(updatedClauses);
    }
    // 이전에 선택 안되었던 조항의 경우 => 추가해준다
    else if (!selectedClauses.includes(selectedIdx)) {
      const updatedClauses = [...selectedClauses, selectedIdx];
      console.log('[SidePanel] 조항 선택 추가:', selectedIdx, '전체 선택 조항:', updatedClauses);
      setSelectedClauses(updatedClauses);
    }
  }

  return (
    <div className="">
      {!showSidebar && (
        <div onClick={() => setShowSidebar(!showSidebar)} className="fixed right-0 top-1/3 z-30 flex h-16 w-5 cursor-pointer items-center rounded-l-sm border border-gray-400 bg-gray-100/50 delay-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className={`-pl-20 fixed right-0 top-0 z-40 grid h-full w-full grid-cols-[1fr_auto] duration-300 ease-in-out ${showSidebar === true ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`h-full w-full bg-black opacity-100 ${showPreview === true ? 'opacity-100' : 'opacity-50'}`}>
          {showPreview === true && (
            <div className="h-full w-full">
              {fileLoadCompleted === false && <Loader />}
              {/* <iframe id="googleDocs" className="h-full w-full" src="https://docs.google.com/document/d/1PwNpbPDyDmcHfhMELD2uXWnuNMqXJZQm/edit?usp=drive_link&ouid=117883175460632990179&rtpof=true&sd=true"></iframe> */}
              <iframe id="googleDocs" className="h-full w-full" src={data?.url}></iframe>
            </div>
          )}
        </div>

        {/* panel start */}
        <div className="ml-auto flex w-[640px] flex-col overflow-scroll bg-gray-600 px-12 py-8 shadow">
          {/* <div onClick={() => setShowSidebar(!showSidebar)} className="h-[32px] w-full"></div> */}
          <Heading showSidebar={showSidebar} setShowSidebar={setShowSidebar} showPreview={showPreview} setShowPreview={setShowPreview} />
          {/* <div className="mb-24 flex h-full place-content-center items-center p-4 text-gray-400">아직 답변한 질문이 없어요</div> */}
          <div className="overflow-scroll scroll-smooth	 bg-white">
            {/* <main className="mx-auto w-[960px] py-6"> */}
            <main className="mx-auto w-full">
              <div className="flex w-full flex-col border-b border-dotted border-gray-300 px-8 py-6 text-sm">
                <div className="flex items-center justify-between py-2">
                  <div className="text-lg font-bold">{data?.title}</div>
                  {/* <div className="ml-4 rounded bg-gray-200/50 px-1 py-0.5 text-xs text-gray-600 shadow-sm">{data.clientName}</div> */}
                </div>
                <div className="flex justify-between py-2">
                  <div className="flex flex-col">
                    <p className="text-gray-500">계약 당사자 (갑)</p>
                    <p className="mt-1 text-gray-700">{data?.partyA}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500">계약 당사자 (을)</p>
                    <p className="mt-1 text-gray-700">{data?.partyB}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500">산업</p>
                    <p className="mt-1 text-gray-700">{data?.industry}</p>
                  </div>
                </div>
                <div className="my-2 h-[1px] w-full bg-slate-300"></div>
                <div className="flex flex-col py-2">
                  <p className="text-gray-500">계약의 목적</p>
                  <p className="mt-1 text-gray-700">{data?.purpose}</p>
                </div>
              </div>
            </main>
            <div className="mx-auto w-full py-6">
              <div className="flex flex-wrap place-content-center gap-2 px-8">
                {data?.clause_array?.map((clause) => {
                  // console.log('clause.idx', clause.idx, selectedClauses)
                  // console.log('selectedClauses.includes(clause.idx)', selectedClauses.includes(clause.idx))
                  return (
                    <div
                      onClick={function (e) {
                        clauseClickHandler(e)
                      }}
                      id={String(clause.idx)}
                      key={clause.idx}
                      className={`cursor-pointer rounded border border-slate-600 px-2 py-1 text-xs font-medium ${selectedClauses.includes(clause.idx) === true ? 'bg-gray-800 text-white shadow-sm' : 'bg-white'}`}
                    >
                      제{clause.idx}조 {clause.text}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mx-auto w-full py-6">
              {data?.content_array?.map((clause, idx) => {
                if (selectedClauses.includes(idx) === true) {
                  console.log('clause', clause)
                  // let clauseTitle = sampleData[idx].filter((data) => data.tag === 'h2').text
                  // const selectedItem =
                  const article = clause.filter((x) => x.tag === 'h2')[0] // 첫 번째 h2여서 '0'
                  const contentList = clause.filter((x) => x.tag !== 'h2')
                  let CONTENT_HTML = ''
                  for (let i = 0; i < contentList.length; i++) {
                    console.log('contentList[i].html', contentList[i])
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
        </div>
      </div>
    </div>
  )
}

interface HeadingProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

const Heading = ({ showSidebar, setShowSidebar, showPreview, setShowPreview }: HeadingProps) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-200"
      >
        닫기
      </button>
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="ml-auto rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
      >
        계약서 원문보기
      </button>
    </div>
  )
}
