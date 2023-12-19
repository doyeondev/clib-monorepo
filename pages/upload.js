import { useEffect, useState, useRef } from 'react'
import Layout from 'components/layout'
import Head from 'next/head'
import { formatDate } from 'utils/dateUtils.js'

// import { renderToString } from 'react-dom/server'
import { DragAndDrop } from 'components/clib/DragAndDrop.js'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { search } from 'hangul-js'
// import LoginModal from 'components/modals/loginModal'
import { sample, sample2, sample3, sample4 } from 'utils/dlData'

import { insert_contractData } from '/pages/api/clib/post'
import { set } from 'lodash'

// const filteredQuestionData = questionData.filter(x => x.value && x.value.length > 0)
// let saveLog = { ...activityLog, ...{ endTime: timestamp(), duration: timeDiffSec(activityLog.startTime, timestamp()), durationMin: timeDiffMin(activityLog.startTime, timestamp()) } }
let DATA_NEW = {
  title: '',
  partyA: '',
  partyB: '',
  purpose: '',
  clauseArray: [],
  contentArray: [],
  industry: '',
  language: '국문',
  source: '',
  creator: '김도연'
  // contentArray: {
  //     questionGroup_array: questionGroupData,
  //   },
}

const now = new Date()

export default function Upload() {
  // const [isOpen, setOpen] = useState(false)
  // const [items, setItem] = useState(data)
  // const [selectedItem, setSelectedItem] = useState(null)

  // const toggleDropdown = () => setOpen(!isOpen)

  // const handleItemClick = (id) => {
  //   selectedItem == id ? setSelectedItem(null) : setSelectedItem(id)
  // }

  const [selectedItem, setSelectedItem] = useState(null)
  const [input, setInput] = useState({
    source: '',
    industry: '',
    language: '',
    creator: ''
  })
  const [metaData, setMetaData] = useState({ purpose: '', partyA: '', partyB: '' })
  const [disabled, setDisabled] = useState(false)

  const [currentMemoIdx, setCurrentMemoIdx] = useState(0) // 선택된 메모의 인덱스. 디폴트는 첫번째 메모로 지정함.
  const [currentMemo, setCurrentMemo] = useState({ content: '', title: '' }) // 타이핑이 발생할때 업데이트 해줌. ==> 업데이트 된 메모 정보를 담는 역할을 수행한다.
  const [memoData, setMemoData] = useState(dummyMemo) // 메모장 데이터
  const [toggleDate, setToggleDate] = useState(false) // 메모장 본문의 날짜를 클릭했는지, 안 했는지 트래킹 한다.

  const [searchInput, setSearchInput] = useState('') // 검색인풋에 입력한 값
  const [filteredMemoData, setFilteredMemoData] = useState(dummyMemo) // 검색을 토대로 필터링 된 메모 리스트

  const [toggleSearch, setToggleSearch] = useState(false) // 검색 버튼 클릭 됐는지 안 됐는지 트랙킹 한다.
  const [toggleDropzone, setToggleDropzone] = useState(false) // 검색 버튼 클릭 됐는지 안 됐는지 트랙킹 한다.

  const [dataHolder, setDataHolder] = useState(dummyMemo) // 수정된 데이터 등 저장
  const [currentMember, setCurrentMember] = useState('') // 로그인 시, 현재 로그인된 맴버 저장

  const [signupState, setSignupState] = useState(false) // 회원가입버튼

  const [deleteState, setDeleteState] = useState(false) // 삭제버튼
  const [contentArray, setContentArray] = useState([])
  const [highlightedText, setHighlightedText] = useState([])

  const [selectedText, setSelectedText] = useState('')
  const [finalData, setFinalData] = useState([])
  const [groupedArray, setGroupedArray] = useState([])

  const [newData, setNewData] = useState({})

  useEffect(() => {
    // console.log('signupState', signupState)
  }, [currentMemoIdx, memoData, currentMemo, filteredMemoData, currentMember, signupState])

  // Step1
  useEffect(() => {
    prepareMemoData()
  }, [toggleSearch, searchInput])
  useEffect(() => {
    console.log('metaData', metaData)
  }, [metaData])
  // Step2
  function prepareMemoData() {
    if (toggleSearch === false) {
      setDataHolder(memoData)
    } else {
      setDataHolder(memoData.filter((memo) => memo.content.includes(searchInput)))
    }
  }

  // Step3
  useEffect(() => {
    setDataHolder(memoData)
    // console.log('memoData', memoData)
  }, [memoData])

  const onInputChange = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmit = () => {
    // console.log('들어옴')
    // console.log(input)
    // setDisabled(true)
    let DATA_TO_SAVE = { ...newData, ...{ source: input.source, industry: input.industry, creator: input.creator, language: input.language } }
    console.log('DATA_TO_SAVE', DATA_TO_SAVE)
    insert_contractData(DATA_TO_SAVE)
    // let loginInfo = { email: input.userEmail, password: input.password }
    // loginAccount(loginInfo)
  }
  useEffect(() => {
    // setDataHolder(memoData)
    if (!contentArray.length > 0) return
    console.log('[useEffect] contentArray', contentArray)
    console.log('[useEffect] groupedArray', groupedArray)
    const articles = contentArray.filter((x) => x.tag && x.tag === 'h2')
    const contractTitle = contentArray.filter((x) => x.tag && x.tag === 'h1')[0].text
    const purpose = metaData?.purpose
    const partyA = metaData?.partyA
    const partyB = metaData?.partyB

    // const purpose = contentArray.filter((x) => x.tag && x.tag === 'h4')[0] ? contentArray.filter((x) => x.tag && x.tag === 'h4')[0].text : ''
    // const partyA = contentArray.filter((x) => x.tag && x.tag === 'h5')[0] ? contentArray.filter((x) => x.tag && x.tag === 'h5')[0].text : ''
    // const partyB = contentArray.filter((x) => x.tag && x.tag === 'h6')[0] ? contentArray.filter((x) => x.tag && x.tag === 'h6')[0].text : ''
    DATA_NEW = { ...DATA_NEW, ...{ title: contractTitle, partyA: partyA, partyB: partyB, purpose: purpose, clauseArray: articles, contentArray: groupedArray } }
    console.log('DATA_NEW', DATA_NEW)
    // setNewData({ ...newData, ...{ title: title, partyA: partyA, partyB: partyB, purpose: purpose, clauseArray: articles, contentArray: groupedArray } })
    setNewData(DATA_NEW)

    // const title = filterArticle(contentArray)
    // console.log('계약서 명칭 : ', contractTitle)
    // console.log('계약의 목적 : ', purpose)
    // console.log('갑 : ', partyA)
    // console.log('을 : ', partyB)
    // console.log('조항제목 : ', articles)
  }, [contentArray, groupedArray, metaData])

  useEffect(() => {
    // setDataHolder(memoData)
    // if (!newData.length > 0) return
    console.log('[useEffect] newData', newData)
    console.log('[useEffect] newData clauseArray', newData.clauseArray)
  }, [newData])

  let inputElement

  useEffect(() => {
    if (toggleDropzone === true) {
      inputElement = document.getElementById(`fileInput`) // declare once

      document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
        const dropZoneElement = inputElement.closest('.drop-zone')

        dropZoneElement.addEventListener('dragover', (e) => {
          e.preventDefault()
          dropZoneElement.classList.add('drop-zone--over')
        })
        ;['dragleave', 'dragend'].forEach((type) => {
          dropZoneElement.addEventListener(type, (e) => {
            e.preventDefault()
            dropZoneElement.classList.remove('drop-zone--over')
          })
        })
      })

      // 프리뷰 삭제
      document.getElementById('thumbnails').addEventListener('click', function (e) {
        let $target = e.target
        console.log('[iFrame] 삭제 $target', $target)
        // console.log('[iFrame] 삭제 $target.parent', $target.parentNode)

        let idx = $target.getAttribute('data-idx')
        console.log('selected idx', idx)

        uploadFiles[idx].file.upload = 'disable' // 삭제된 항목은 업로드하지 않기 위해 플래그 생성
        $target.parentNode.remove() // 프리뷰 삭제

        console.log(`[iFrame] ${idx} 번째 첨부파일 삭제`)
        console.log('[iFrame] 처리 후 uploadFiles : ', uploadFiles)
        // let updatedUploadFiles = uploadFiles
        // window.parent.postMessage({ action: 'fileDeleted', data: updatedUploadFiles }, 'https://www.haesungcorp.co.kr')

        // renderFiles(uploadFiles)
      })
    }
    // console.log('memoData', memoData)
  }, [toggleDropzone])
  // // 상단 삭제 버튼 클릭으로 삭제할 시
  // useEffect(() => {
  //   setDataHolder(memoData)
  //   console.log('memoData', memoData)
  // }, [memoData])
  useEffect(() => {
    //     console.log('sample', sample)
    // let htmlSample = `<div> \
    //     ${sample4} \
    //   </div>`
    // let addedItems = new Array()
    let htmlSample = new DOMParser().parseFromString(sample4, 'text/html')
    // console.log('htmlSample', htmlSample)
    let matches = htmlSample.querySelectorAll('span')
    let listMatches = htmlSample.querySelectorAll('li')
    // matches = matches.concat(listMatches)
    // console.log('matches', matches)

    for (let i = 0; i < matches.length; i++) {
      //   console.log('style : ', matches[i].style)
      let blue = []
      let red = []
      let element = matches[i]
      let elementStyle = matches[i].getAttribute('style')
      if (Object.values(matches[i].style).includes('color')) {
        // console.log('match : ', matches[i])
        // console.log('style : ', matches[i].getAttribute('style').toString())
        if (elementStyle.toString().includes('#0070c0')) {
          // blue.push({text: element.innerHTML})
          spans.push({ text: element.innerText, color: 'blue' })
        } else if (elementStyle.toString().includes('#ff0000')) {
          // red.push({text: element.innerHTML})
          spans.push({ text: element.innerText, color: 'red' })
        } else if (elementStyle.toString().includes('#7030a0')) {
          // red.push({text: element.innerHTML})
          spans.push({ text: element.innerText, color: 'purple' })
        }
      }
    }
    for (let i = 0; i < listMatches.length; i++) {
      //   console.log('style : ', matches[i].style)
      let blue = []
      let red = []
      let element = listMatches[i]
      let elementStyle = listMatches[i].getAttribute('style')
      if (Object.values(listMatches[i].style).includes('color')) {
        // console.log('match : ', listMatches[i])
        // console.log('style : ', matches[i].getAttribute('style').toString())
        if (elementStyle.toString().includes('#0070c0')) {
          // blue.push({text: element.innerHTML})
          spans.push({ text: element.innerText, color: 'blue' })
        } else if (elementStyle.toString().includes('#ff0000')) {
          // red.push({text: element.innerHTML})
          spans.push({ text: element.innerText, color: 'red' })
        } else if (elementStyle.toString().includes('#7030a0')) {
          // red.push({text: element.innerHTML})
          spans.push({ text: element.innerText, color: 'purple' })
        }
      }
    }

    console.log('spans array : ', spans)
    setHighlightedText(spans)
  }, [])

  // 메모 수정할 때
  const onContentChange = () => {
    setTimeout(() => {
      const newContent = document.getElementById(`memo${currentMemoIdx}`).innerHTML
      const newTitle = document.getElementById(`memo${currentMemoIdx}`).firstChild.innerHTML
      setCurrentMemo({ content: newContent, title: newTitle })
    }, 500)
    prepareMemoData()
  }

  // 메모 수정 이후 다른 메모 선택하면 업데이트 해줌
  const updateMemoData = () => {
    const updatedMemoData = [...memoData].map((obj) => {
      if (obj.idx === currentMemoIdx) {
        return { ...obj, ...{ content: currentMemo.content, title: currentMemo.title } }
      }
      return obj
    })
    setMemoData(updatedMemoData)
    setCurrentMemo({ content: '', title: '' }) // 수정된 내용은 없음으로 다시 리셋
  }

  // 메모 삭제 버튼 클릭
  const deleteMemoItem = (index) => {
    const updatedMemoData = [...memoData].map((obj) => {
      if (obj.idx === index) {
        return { ...obj, ...{ deleted: true } }
      }
      return obj
    })
    setMemoData(updatedMemoData)
    setDeleteState(false) // 상단 삭제 버튼 원래대로 RESET
  }

  const handleClick = (e) => {
    inputElement.click()
    // e.currentTarget.click()
    e.target.value = null
  }
  const handleChange = (e) => {
    let files = inputElement.files // e.dataTransfer.files

    console.log('files', files)
    for (let i = 0; i < files.length; i++) {
      let size = uploadFiles.push({ file: files[i], uploadURL: '', buffer: '', _id: String(Number(Math.floor(Math.random() * 10000000000))) })
      preview(files[i], size - 1)
    }
    renderFiles(uploadFiles)
    console.log('1. ', uploadFiles)
    // if (inputElement.files.length) {
    //   updateThumbnail(dropZoneElement, inputElement.files[0])
    // }
  }

  async function handleDrop(e) {
    e.preventDefault()
    const dropZoneElement = inputElement.closest('.drop-zone')

    let files = e.dataTransfer.files // e.dataTransfer.files

    for (let i = 0; i < files.length; i++) {
      let size = uploadFiles.push({ file: files[i], uploadURL: '', buffer: '', _id: String(Number(Math.floor(Math.random() * 10000000000))) })
      preview(files[i], size - 1)

      console.log(`[iFrame] 업로드된 파일 ${i} : `, files[i])
    }
    console.log('[iFrame] uploadFiles', uploadFiles)
    renderFiles(uploadFiles)

    dropZoneElement.classList.remove('drop-zone--over')
  }

  let uploadFiles = []
  let spans = []

  function renderHtml(spansArray, clauseArray) {
    console.log('inside renderHtml')
    console.log('spansArray', spansArray)
    console.log('clauseArray', clauseArray)
    for (let i = 0; i < clauseArray.length; i++) {
      console.log('clauseArray[i]', clauseArray[i].text)
      // if(clauseArray[i].text !== undefined) {

      // }
      for (let j = 0; j < spansArray.length; j++) {
        // console.log('spansArray[j]', spansArray[j].text)

        // console.log('inside.....')
        if (clauseArray[i].tag === 'ol' || clauseArray[i].tag === 'ul') {
          console.log('ol')
          for (let k = 0; k < clauseArray[i].text.length; k++) {
            if (clauseArray[i].text[k].text && clauseArray[i].text[k].text.includes(spansArray[j].text)) {
              // subHtml = subHtml.concat('', `<li id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${contractData[i].text[k].text}</li>`)
              console.log('spansArray[j].text', spansArray[j].text)
              console.log('clauseArray[i].text[k].text', clauseArray[i].text[k].text)

              clauseArray[i].text[k].text = clauseArray[i].text[k].text.replace(spansArray[j].text, `<span class=${spansArray[j].color} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${spansArray[j].text}</span>`)
            }
          }
        } else if (clauseArray[i].tag !== 'ol' && clauseArray[i].tag !== 'ul' && clauseArray[i].text && clauseArray[i].text.includes(spansArray[j].text)) {
          //   console.log('text before : ', contractData[i].text)
          clauseArray[i].text = clauseArray[i].text.replace(spansArray[j].text, `<span class=${spansArray[j].color} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${spansArray[j].text}</span>`)
          console.log('text after : ', clauseArray[i].text)
        }
      }
      //   make html
      if (clauseArray[i].tag === 'br') {
        if (clauseArray[i + 1]?.tag !== 'br') {
          clauseArray[i].html = '<br/>' // <br/>이 연속해서 나오는 않는 경우에만 넣어줌 (테이블 때문에)
        } else {
          clauseArray[i].html = ''
        }
      } else if (clauseArray[i].tag === 'ol' || clauseArray[i].tag === 'ul') {
        console.log('inside list!')
        let subHtml = ''
        for (let k = 0; k < clauseArray[i].text.length; k++) {
          //   clauseArray[i].text[k].text = `<${clauseArray[i].text[k].tag} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].text}</${clauseArray[i].text[k].tag}>`
          subHtml = subHtml.concat('', `<${clauseArray[i].text[k].tag} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].text}</${clauseArray[i].text[k].tag}>`)
        }
        console.log('subHtml', subHtml)

        clauseArray[i].html = `<${clauseArray[i].tag} id=${clauseArray[i]._id}>${subHtml}</${clauseArray[i].tag}>`
      } else {
        clauseArray[i].html = `<${clauseArray[i].tag}>${clauseArray[i].text}</${clauseArray[i].tag}>`
      }
    }

    console.log('new clauseArray', clauseArray)
    console.log('contractData', contractData)
    setContentArray(clauseArray)
    setFinalData(contractData)
    console.log('finalData', contractData.length)
  }

  function addHighlight(str) {
    if (str.length > 0) {
      console.log('선택됨')
      setSelectedText(str)
    } else {
      setSelectedText('')
    }
  }

  function renderFiles(_uploadFiles) {
    console.log('[iFrame] renderFiles() 진입')
    console.log('[iFrame] _uploadFiles', _uploadFiles)

    let array = []

    _uploadFiles.forEach(function (uploadFile, i) {
      if (uploadFile.file.upload !== 'disable') {
        let msg = { name: '', type: '', buffer: '', size: '' }
        let _file = uploadFile.file
        const reader = new FileReader()

        reader.readAsArrayBuffer(_file)
        reader.onloadend = function sendmsg() {
          let buffer = reader.result
          console.log('[iFrame] Buffer: ', buffer)
          msg.name = _file.name
          msg.buffer = buffer
          msg.type = _file.type
          msg.size = _file.size

          uploadFiles[i].buffer = msg
          console.log('[iFrame] uploadFiles[i].buffer', uploadFiles[i])

          // 여기
          reRenderFile(uploadFiles[i].buffer)
          //   window.parent.postMessage({ action: 'renderCompleted', data: uploadFiles }, 'https://www.haesungcorp.co.kr')
        }
      }
    })
  }
  async function uploadFile(data) {
    console.log('[iFrame] Data', data)
    for (let i = 0; i < data.length; i++) {
      if (data[i].uploadURL !== '') {
        // let uploadURL = event.data
        let formData = await new FormData()
        let request = await new XMLHttpRequest()

        formData.append('file', data[i].file)

        request.open('POST', data[i].uploadURL)
        request.send(formData)

        console.log(`[iFrame] ${data[i].file.name} 업로드 완료!`)
      }
    }
  }
  //   let divToAdd = `<div class="thumb"> \
  //   <div class="close" id="close" data-idx=${idx}>X</div> \
  //   <p>${f.name}</p> \
  // </div>`
  function preview(file, idx) {
    const reader = new FileReader()
    reader.onload = (function (f, idx) {
      return function (e) {
        let div = document.getElementById('thumbnails')
        let divToAdd = `<div class="thumb"> \
            <img src="/icon/close.svg" class="close" id="close" data-idx=${idx}> \
          <p>${f.name}</p> \
        </div>`
        div.innerHTML = div.innerHTML + divToAdd
      }
    })(file, idx)
    reader.readAsDataURL(file)
  }

  function reRenderFile(_file) {
    // const fs = require('fs')

    console.log('render render')
    //   let docx = fs.writeFile('filename.docx', _buffer)

    let docxFile = new File([_file.buffer], _file.name, { type: _file.buffer.type })
    console.log('docxFile', docxFile)
    //   const blobFile = new File([blob], 'document', { type: blob.type })
    //   console.log('docx', docx)
    parseWordDocxFile(docxFile)
  }

  async function parseWordDocxFile(doc) {
    var mammoth = require('mammoth')

    const reader = new FileReader()

    let result1 = document.getElementById('result1')

    console.time()
    let options
    reader.onloadend = function (event) {
      var arrayBuffer = reader.result
      // debugger
      if (selectedItem === '엘지') {
        console.log('엘지')
        options = {
          //   styleMap: ["h1[style-name='제목 1'] => h1:fresh", "h2[style-name='제목 2'] => h3:fresh", "p[style-name='표준'] => h4:fresh", "p[style-name='list'] => ol > li > p:fresh"],
          styleMap: [
            //   "p[style-name='heading1'] => h1.title:fresh",
            "p[style-name='TITLE'] => h1.title:fresh",
            // "p[style-name='제목 1'] => h1.title:fresh",
            // "p[style-name='제목 2'] => h2:fresh",

            "p[style-name='제1조'] => h2.title:fresh",
            "p[style-name='목적'] => h4.title:fresh",
            "p[style-name='당사자1'] => h5.title:fresh",
            "p[style-name='당사자2'] => h6.title:fresh",

            //   "p[style-name='제1.1조'] => h3.title:fresh",
            "p[style-name='제1.1조'] => ol.level-one > li.level-one-item:fresh",

            "p[style-name='(가)'] => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item:fresh",

            //   "p[style-name='highlight'] => h3.heading-side:fresh",
            //   'p.highlight => h3.heading-side:fresh',
            'p.highlight => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > span.mark-up:fresh',
            'comment-reference => sup',
            "p[style-name='표준'] => h4.heading-side:fresh",
            //   'p.highlight => h3.heading-side:fresh',
            //   "p[style-name='제목 2'] => h3:fresh",
            //   "p[style-name='heading3'] => h3:fresh",
            //   'p.제목 2 => h3:fresh'
            //   "p[style-name='제목 1'] => h1.heading-one:fresh",
            //   'p.Heading2 => h2:fresh',
            //   'p.Heading3 => h3:fresh',
            'p.levelone => ol.level-one > li.level-one-item:fresh',
            'p.leveltwo => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item:fresh'
            //   'p.highlight => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > p.mark-up:fresh'

            //   'p.levelthree => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > ol.level-three > li.level-three-item:fresh',
            //   'p.levelfour => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > ol.level-three > li.level-three-item > ol.level-four > li.level-four-item:fresh',
            //   'p.levelfive => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > ol.level-three > li.level-three-item > ol.level-four > li.level-four-item > ol.level-five > li.level-five-item:fresh',
            //   'p.levelsix => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > ol.level-three > li.level-three-item > ol.level-four > li.level-four-item > ol.level-five > li.level-five-item > ol.level-six > li.level-six-item:fresh',
            //   'p.levelseven => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > ol.level-three > li.level-three-item > ol.level-four > li.level-four-item > ol.level-five > li.level-five-item > ol.level-six > li.level-six-item > ol.level-seven > li.level-seven-item:fresh'
          ],
          // includeDefaultStyleMap: false,
          ignoreEmptyParagraphs: false
        }
      } else if (selectedItem === '리걸인사이트') {
        console.log('리걸인사이트')
        options = {
          // styleMap: ["h1[style-name='제목 1'] => h1:fresh", "p[style-name='제목 2'] => h3.title:fresh", "p[style-name='표준'] => h4:fresh", "p[style-name='list'] => ol > li > p:fresh"],
          styleMap: [
            // "p[style-name='체결일'] => h6.title:fresh",
            "p[style-name='체결일'] => span.date:fresh",
            "p[style-name='목적'] => span.purpose:fresh",
            "p[style-name='당사자1'] => span.party1:fresh",
            "p[style-name='당사자2'] => span.party2:fresh",
            "p[style-name='서문'] => p.opening:fresh",

            "p[style-name='제목1'] => h6.title:fresh",
            "p[style-name='제목 2'] => h3.title:fresh",
            "p[style-name='표준'] => h4:fresh",
            "p[style-name='list'] => ol > li > p:fresh"
          ],

          // includeDefaultStyleMap: false,
          ignoreEmptyParagraphs: false
        }
      }

      mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, options).then(function (resultObject) {
        // let res = str.replace(/blue/g, "red");
        const regex = /<p><\/p>/gi
        // const htmlString = resultObject.value.replaceAll(regex, '<br />')
        const htmlString = resultObject.value.replaceAll(regex, '')

        console.log('resultObject', resultObject)
        console.log('resultObject.value', resultObject.value)
        console.log('resultObject.value regex', htmlString)

        result1.innerHTML = htmlString
        readHtml(htmlString)
        //   console.log(resultObject.value)
      })
    }
    reader.readAsArrayBuffer(doc)
  }

  let contractData = []
  function readHtml(htmlString) {
    console.log('readHTML')
    let divToAdd = `<div> \
        ${htmlString} \
      </div>`
    let addedItems = new Array()
    let div = new DOMParser().parseFromString(divToAdd, 'text/xml')

    let divs = []
    let noTags = ['table', 'tbody', 'tr', 'td', 'strong']
    // let items = html.body.getElementsByTagName('*')
    let blockIdx = 0
    let clauseIdx = 0
    let items = div.getElementsByTagName('*')
    // items.shift()

    // console.log('items', items)

    // start from 1 to remove div wrapper
    for (let i = 1; i < items.length; i++) {
      divs.push(items[i].outerHTML)
    }
    divs = divs.reverse()
    // console.log('divs html', divs)
    let lastTag
    let list = []
    let table = []
    let row = []
    for (let i = 0; i < divs.length; i++) {
      let nextDoc, nextText, nextTagName
      let doc = new DOMParser().parseFromString(divs[i], 'text/xml')
      let text = doc.firstChild.textContent
      let tagName = doc.firstChild.tagName
      let className = doc.firstChild.className
      console.log('className', className && className)
      if (i + 1 < divs.length) {
        nextDoc = new DOMParser().parseFromString(divs[i + 1], 'text/xml')
        nextText = nextDoc.firstChild.textContent
        nextTagName = nextDoc.firstChild.tagName
      }
      /*     console.log("doc", doc.firstChild.textContent); */
      var hastext = text.length != 0
      // if (hastext && !noTags.includes(tagName) && addedItems.indexOf(text.trim()) == -1) {
      if (hastext && addedItems.indexOf(text.trim()) == -1) {
        if (tagName === 'li') {
          list.push({
            tag: tagName,
            text: text
          })
          //   console.log('list in li', list)
        } else if (tagName === 'ol') {
          addedItems.push({
            idx: '',
            tag: tagName,
            text: [...list].reverse()
          })
          //   console.log('list in ol', list)
          //   console.log('list in ol reversed', [...list].reverse())
          list = []
        } else if (tagName === 'span') {
          // 계약서에서 뺄 본문은 span으로 넣었고 데이터는 넣기 위해서 setMetaData 해주고
          // 데이터 post 이전에 이 값을 업로드하는 데이터에 넣어 준다.
          console.log('span 안에 들어옴', tagName, className)
          if (className === 'party1') {
            setMetaData((prev) => ({ ...prev, ['partyA']: text }))
            // setMetaData({ ...metaData, partyA: text })
          } else if (className === 'party2') {
            setMetaData((prev) => ({ ...prev, ['partyB']: text }))
            // setMetaData({ ...metaData, partyB: text })
          } else if (className === 'purpose') {
            setMetaData((prev) => ({ ...prev, ['purpose']: text }))
            // setMetaData({ ...metaData, purpose: text })
          } else {
            addedItems.push({
              idx: '',
              tag: tagName,
              type: className,
              text: text
            })
          }
          // addedItems.push({
          //   idx: '',
          //   tag: tagName,
          //   type: className,
          //   text: text
          // })
        } else if (tagName === 'h2') {
          if (selectedItem === '리걸인사이트') {
            const cleanedText = text.substring(text.indexOf('[') + 1, text.lastIndexOf(']'))
            addedItems.push({
              idx: '',
              tag: tagName,
              text: cleanedText
            })
          } else {
            addedItems.push({
              idx: '',
              tag: tagName,
              text: text
            })
          }
        } else {
          if (nextTagName === 'td') {
            row.push({
              tag: tagName,
              text: text
            })
          } else if (nextTagName === 'tr') {
            table.push([...row].reverse())
            row = []
          } else if (tagName === 'table') {
            // addedItems.push({
            //   idx: '',
            //   tag: tagName,
            //   text: [...table].reverse()
            // })
            table = []
          } else if (!noTags.includes(tagName)) {
            // h1, h2, span 등등
            console.log('tagName', tagName)

            addedItems.push({
              idx: '',
              tag: tagName,
              text: text
            })

            if (selectedItem === '리걸인사이트' && className === 'opening') {
              // h3는 서문이기 때문에 앞에 띄워쓰기 하나 추가
              addedItems.push({
                idx: 0,
                tag: 'br',
                _id: String(Number(Math.floor(Math.random() * 10000000000))),
                html: '<br/>'
              })
            }
          }
          console.log('table', table)
        }
        //   else if (tagName === 'ol') {
        //     addedItems.push({
        //       idx: '',
        //       tag: tagName,
        //       text: [...list].reverse(),
        //     })
        //     console.log('list in ol', list)
        //     console.log('list in ol reversed', [...list].reverse())
        //     list = []
        //   }

        /*       console.log('type: ' + tagName + ' text: ' + text.trim())
         */
      } else {
        if (tagName === 'br' && tagName !== nextTagName) {
          //   console.log('doc html', doc)
          // 이부분은 지울지

          addedItems.push({
            idx: '',
            tag: tagName
          })
        }
      }
      // lastTag = tagName
      // console.log('tagName / nextTagName', tagName, nextTagName)
    }
    console.log('addedItems!', addedItems.reverse())
    // let randomId = String(Number(Math.floor(Math.random() * 10000000000)))

    contractData = addedItems
    let idx = 0
    for (let i = 0; i < contractData.length; i++) {
      // if (contractData[i].tag === 'h1') {
      //   idx = idx + 1
      // } else if (contractData[i].tag === 'h2') {
      //   idx = idx + 1
      // }
      contractData[i]._id = String(Number(Math.floor(Math.random() * 10000000000)))
      if (contractData[i].tag === 'h2') {
        idx = idx + 1
      }
      contractData[i].idx = idx
    }
    console.log('contractData', contractData)
    if (contractData.length > 0) {
      renderHtml(highlightedText, addedItems)
    }
    // const clauseArray = []
    let clauseHolder = []
    // let clauseNum = 1
    // contractData.map((clause) => {
    //   if (clause.tag === h1) {
    //     clauseArray.push({ _id: randomId, type: 'contractTitle', tag: clause.tag, text: clause.text })
    //   } else if (clause.tag === p && clauseNum === 0) {
    //     clauseArray.push({ _id: randomId, type: 'preamble', tag: clause.tag, text: clause.text })
    //   } else if (clause.tag === 'h2' && clause.idx === clauseNum) {
    //     clauseHolder.push({ _id: randomId, type: 'clauseTitle', tag: clause.tag, text: clause.text })
    //   } else if (clause.tag === 'p' && clause.idx === clauseNum) {
    //     clauseHolder.push({ _id: randomId, type: 'clauseContent', tag: clause.tag, text: clause.text })
    //   }
    // })
    // console.log('clauses', clauses)

    let currentIdx = 0
    let contractList = []
    let contractItem = []
    for (let i = 0; i < contractData.length; i++) {
      // console.log('contractData[i]', contractData[i])
      //   if (contractData[i].tag === 'h1' && contractData[i].idx === 0) {
      //     contractList.push({ _id: randomId, type: 'contractTitle', tag: contractData[i].tag, text: contractData[i].text })
      //   } else if (contractData[i].tag === p && contractData[i].idx === 0) {
      //     contractList.push({ _id: randomId, type: 'preamble', tag: contractData[i].tag, text: contractData[i].text })
      //   } else if (contractData[i].idx !== 0 && contractData[i].idx === currentIdx) {
      //     contractItem.push(contractData[i])
      //   } else if (contractData[i].idx !== 0 && contractData[i].idx !== currentIdx) {
      //     //   console.log('contractItem', contractItem)
      //     contractList.push(contractItem)
      //     contractItem = []
      //     contractItem.push(contractData[i]) // 다음 idx의 첫번째꺼를 push
      //     currentIdx = currentIdx + 1
      //   }
      //   if (i === contractData.length - 1) {
      //     contractList.push(contractItem)
      //   }
      if (contractData[i].idx === currentIdx) {
        contractItem.push(contractData[i])
      } else if (contractData[i].idx !== currentIdx) {
        //   console.log('contractItem', contractItem)
        contractList.push(contractItem)
        contractItem = []
        contractItem.push(contractData[i]) // 다음 idx의 첫번째꺼를 push
        currentIdx = currentIdx + 1
      }
      if (i === contractData.length - 1) {
        contractList.push(contractItem)
      }
    }
    console.log('contractList : ', contractList)
    setGroupedArray(contractList)
  }

  return (
    <Layout>
      <Head>
        <title>클립 | 계약 업로드</title>
        <meta name="description" content="클립 계약서 업로드 페이지" />
        <meta property="og:title" content="클립 계약서 업로드 페이지" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`flex h-[calc(100vh-68px)] bg-[#F7F9FD] px-8`}>
        <div className="mx-auto grid h-full w-[1440px] grid-cols-5 pt-16">
          <aside className="col-span-1 grid h-full">
            <div className="flex h-full flex-col px-4">
              <Dropdown selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

              <div className="flex">
                {/* <button
                  className="h-12 w-12 rounded-sm border border-gray-300 bg-white hover:bg-gray-100"
                  onClick={() => {
                    const newMemoList = [...memoData]
                    newMemoList.push({ idx: memoData.length, createdDate: now, title: '새로운 메모', content: '<p><br></p>' })
                    setMemoData(newMemoList)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mx-auto h-5 w-5">
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </button> */}
                <button className="h-12 w-12 rounded-sm border border-gray-300 bg-white hover:bg-gray-100" onClick={() => setToggleDropzone(!toggleDropzone)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="h-12 w-12 rounded-sm border border-gray-300 bg-white hover:bg-gray-100" onClick={() => setToggleSearch(!toggleSearch)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mx-auto h-5 w-5">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="h-12 w-12 rounded-sm border border-gray-300 bg-white hover:bg-gray-100"
                  onClick={() => {
                    setDeleteState(!deleteState)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mx-auto h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {toggleSearch === true && (
                <>
                  <div className="dark:highlight-white/5 relative mt-4 flex h-fit items-center rounded-md text-sm leading-6 text-slate-400 shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 ">
                    <svg width="24" height="24" fill="none" ariaHidden="true" className="absolute ml-2 flex-none">
                      <path d="m19 19-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
                    </svg>
                    <input
                      type="text"
                      id="searchInput"
                      placeholder="Quick search..."
                      value={searchInput}
                      onChange={function (e) {
                        setSearchInput(e.target.value)
                      }}
                      className="block w-full rounded-md border border-transparent bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-transparent focus:ring-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:text-sm"
                    />
                    {searchInput.length > 0 && (
                      <svg onClick={() => setSearchInput('')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute right-3 h-5 w-5 cursor-pointer">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </>
              )}
              {/* <div className="bg-whtie w-full rounded-lg shadow">
                <div className="flex cursor-pointer items-center justify-between p-4" onClick={toggleDropdown}>
                  {selectedItem ? items.find((item) => item.id == selectedItem).label : 'Select your destination'}
                  <i className={`fa fa-chevron-right text-sm text-[#91A5BE] ${isOpen && 'block'}`}></i>
                </div>
                <div className={`hidden border-t border-[#E5E8EC] p-1 ${isOpen && 'open'}`}>
                  {items.map((item) => (
                    <div className="p-2 hover:cursor-pointer" onClick={(e) => handleItemClick(e.target.id)} id={item.id}>
                      <span className={`text-[#91A5BE] opacity-0 ${item.id == selectedItem && 'opacity-100'}`}>• </span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div> */}
              {toggleDropzone === true ? (
                <div className="drop-zone-wrapper">
                  <div className="flex flex-col gap-x-8">
                    <div onClick={(e) => handleClick(e)} onDrop={(e) => handleDrop(e)} className="drop-zone">
                      {/* <div className="drop-zone"> */}
                      <span className="drop-zone__prompt">Drop file here or click to upload</span>
                      <input onChange={(e) => handleChange(e)} id="fileInput" type="file" name="myFile" className="drop-zone__input" />
                    </div>
                    <div className="check" id="thumbnails"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-1 pt-4">
                  {dataHolder.map((memo, idx) => {
                    if (memo.deleted !== true) {
                      return (
                        <div
                          className={`group flex h-fit cursor-pointer items-center justify-between rounded-md px-2 py-1 ${currentMemoIdx === memo.idx ? 'bg-fuchsia-300' : 'bg-fuchsia-50 hover:bg-fuchsia-100'}`}
                          onClick={() => {
                            currentMemo.content !== '' && updateMemoData() // 메모 수정사항이 있으면 updateMemoData()
                            setCurrentMemoIdx(memo.idx) // updateMemoData() 해주고 나서 currentMemoIdx도 업데이트 ==> 현재 클릭된 메모 idx 업뎃하기 전에, 이전에 클릭된 메모 정보를 위에서 먼저 업데이트
                            setToggleDate(false)
                            setDeleteState(false) // 상단 삭제 버튼 원래대로 RESET
                          }}
                          id={memo.idx}
                          key={memo.idx}
                        >
                          {/* <div className="flex w-40 flex-col py-1 pl-4 md:w-44 lg:w-52 xl:w-60"> */}
                          <div className="flex w-full flex-col py-1 pl-4 ">
                            {currentMemoIdx === idx && currentMemo.content !== '' ? (
                              <p dangerouslySetInnerHTML={{ __html: currentMemo.title }} className="truncate text-sm font-semibold"></p>
                            ) : (
                              <p dangerouslySetInnerHTML={{ __html: memo.title }} className="truncate text-sm font-semibold"></p>
                            )}
                            <p className="text-xs text-gray-600">{formatDate(now, 'short')}</p>
                          </div>

                          {/* <div className={currentMemoIdx === idx && toggleDelete === true ? '' : 'hidden'}> */}
                          <div onClick={() => deleteMemoItem(memo.idx)} className={`invisible rounded-md p-1.5 ${currentMemoIdx === memo.idx && deleteState === true ? '!visible bg-red-700' : 'hover:bg-gray-700 group-hover:visible'} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D9D9D9" className="pointer-events-none h-5 w-5">
                              <path
                                fillRule="evenodd"
                                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              )}
            </div>
          </aside>
          {/* 여기! */}
          <div className="col-span-2 grid space-y-6 overflow-scroll p-8 shadow-lg">
            {finalData.length > 0 ? (
              <>
                {newData.clauseArray !== [] && (
                  <>
                    <div className="flex items-center text-xs font-bold">
                      <p className=" text-slate-800">계약서 명칭</p>
                      <p className="ml-3 font-semibold">{newData.title}</p>
                    </div>
                    <div className="flex items-center text-xs font-bold">
                      <p className=" text-slate-800">계약 당사자 (갑)</p>
                      <p className="ml-3 font-semibold">{newData.partyA}</p>
                    </div>
                    <div className="flex items-center text-xs font-bold">
                      <p className=" text-slate-800">계약 당사자 (을)</p>
                      <p className="ml-3 font-semibold">{newData.partyB}</p>
                    </div>
                    <div className="text-xs font-bold">
                      <p className="text-slate-800">계약 목적과 거래 요약</p>
                      <p className="font-semibold">{newData.purpose}</p>
                    </div>
                    <div className="text-xs font-bold">
                      <p className="text-sm text-orange-600">조항목차</p>
                      {newData.clauseArray?.map((clause, i) => {
                        if (clause.tag === 'h2') {
                          return (
                            <p className="font-semibold" key={i}>
                              {clause.text}
                            </p>
                          )
                        }
                      })}
                    </div>
                    <form className="space-y-8" action="#">
                      <div>
                        <label htmlFor="language" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          언어
                        </label>
                        <input
                          type="text"
                          name="language"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-purple-600 focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:text-sm"
                          placeholder="영문 or 국문"
                          value={input.language}
                          onChange={function (event) {
                            onInputChange(event)
                            // setDisabled(false)
                          }}
                          //   onKeyDown={press}
                          required=""
                        />
                      </div>
                      <div>
                        <label htmlFor="source" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          고객사 이름
                        </label>
                        <input
                          type="text"
                          name="source"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-purple-600 focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:text-sm"
                          placeholder="LG화학"
                          value={input.source}
                          onChange={function (event) {
                            onInputChange(event)
                            // setDisabled(false)
                          }}
                          //   onKeyDown={press}
                          required=""
                        />
                      </div>
                      <div>
                        <label htmlFor="industry" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          산업
                        </label>
                        <input
                          type="text"
                          name="industry"
                          placeholder="화학, 제조판매"
                          value={input.industry}
                          onChange={function (event) {
                            onInputChange(event)
                            // setDisabled(false)
                          }}
                          //   onKeyDown={press}
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-purple-600 focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:text-sm"
                          required=""
                        />
                      </div>
                      <div>
                        <label htmlFor="creator" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          업로드한 담당자
                        </label>
                        <input
                          type="text"
                          name="creator"
                          placeholder="김도연"
                          value={input.creator}
                          onChange={function (event) {
                            onInputChange(event)
                            // setDisabled(false)
                          }}
                          //   onKeyDown={press}
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-purple-600 focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:text-sm"
                          required=""
                        />
                      </div>
                      {/* <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label for="remember" className="text-gray-500 dark:text-gray-300">
                      이메일 기억하기
                    </label>
                  </div>
                </div>
                <a href="/findpassword" className="text-sm font-medium text-purple-600 hover:underline dark:text-purple-500">
                  비밀번호를 잊으셨나요?
                </a>
              </div> */}
                      <button
                        id="loginBtn"
                        type="button"
                        onClick={onSubmit}
                        disabled={disabled}
                        className="flex w-full cursor-pointer place-content-center rounded-lg bg-purple-500 py-2.5 text-sm font-medium text-white hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:cursor-progress disabled:bg-purple-200 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                      >
                        업로드
                      </button>
                    </form>
                    {/* <div className="space-y-0.5 text-xs font-bold ">
                      <p className="text-sm text-red-600">정의된 용어</p>
                      <ol>
                        {highlightedText.map((highlight, i) => {
                          if (highlight.color === 'red') {
                            return (
                              <li className="list-inside list-decimal font-medium" key={i}>
                                {highlight.text}
                              </li>
                            )
                          }
                        })}
                      </ol>
                    </div>
                    <div className="space-y-0.5 text-xs font-bold">
                      <p className="text-sm text-blue-600">계약 고유 콘텐츠</p>
                      <ol>
                        {highlightedText.map((highlight, i) => {
                          if (highlight.color === 'blue') {
                            return (
                              <li className="list-inside list-decimal font-medium" key={i}>
                                "{highlight.text}"
                              </li>
                            )
                          }
                        })}
                      </ol>
                    </div>
                    <div className="space-y-0.5 text-xs font-bold">
                      <p className="text-sm text-purple-600">계약 목적과 거래 요약</p>
                      <ol>
                        {highlightedText.map((highlight, i) => {
                          if (highlight.color === 'purple') {
                            return (
                              <li className="list-inside list-decimal font-medium" key={i}>
                                "{highlight.text}"
                              </li>
                            )
                          }
                        })}
                      </ol>
                    </div> */}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="preview-doc px-16 py-8 text-xs" id="result1"></div>
              </>
            )}
          </div>
          <div className="col-span-2 overflow-scroll p-8">
            <div className="preview-doc" id="result2">
              {contentArray !== [] && (
                <div className="text-xs">
                  {finalData === [] ? (
                    <>
                      {contentArray.map((clause, i) => {
                        return <p key={i}>{clause.text}</p>
                      })}
                    </>
                  ) : (
                    <>
                      {finalData.map((data, i) => {
                        return (
                          // let htmlSample = new DOMParser().parseFromString(sample4, 'text/html')

                          <div key={i} style={{ color: 'black' }} className="" dangerouslySetInnerHTML={{ __html: data.html }}></div>
                        )
                      })}
                    </>
                  )}
                </div>
              )}
              <div className="flex flex-col text-sm font-bold">{selectedText.length > 0 && <div className="text-red-600">red</div>}</div>
            </div>
            {/* {currentMember === '' ? (
              <div className="flex flex-col px-4">
                <button onClick={() => setSignupState(!signupState)} className="btn-headless mb-4 rounded-md bg-gray-100 px-2 py-3 text-sm font-bold shadow-md hover:bg-gray-200">
                  {signupState === true ? 'I already have an account' : 'I am a new user'}
                </button>
                <Login setCurrentMember={setCurrentMember} signupState={signupState} setSignupState={setSignupState} />
              </div>
            ) : (
              <>
                <div className="flex flex-col justify-between px-4">
                  <p className="mt-4 px-2 text-xl font-semibold">
                    안녕하세요 {currentMember.name}님, <br />
                    오늘도 좋은 하루 보내세요!
                  </p>
                  <button onClick={() => setCurrentMember('')} className="btn-purple-headless px-3 py-2">
                    로그아웃
                  </button>
                </div>
              </>
            )} */}
          </div>
        </div>
      </main>
    </Layout>
  )
}

// dropZoneElement.addEventListener('click', (e) => {
//     // e.preventDefault()
//     inputElement.click()
//   })

const Login = ({ setCurrentMember, signupState, setSignupState }) => {
  const [input, setInput] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState(false)
  const [disabled, setDisabled] = useState(false)
  function press(e) {
    if (e.keyCode == 13) {
      onSubmit() //javascript에서는 13이 enter키를 의미함
    }
  }
  const onInputChange = (e) => {
    const { name, value } = e.target
    setLoginError(false)
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmit = () => {
    setDisabled(true)

    if (signupState === true) {
      let registrationInfo = { name: input.name, email: input.email, password: input.password }
      registerAccount(registrationInfo)
    } else {
      let loginInfo = { email: input.email, password: input.password }
      loginAccount(loginInfo)
    }
  }

  useEffect(() => {
    // console.log('input', input)
  }, [input])

  async function loginAccount(userInfo) {
    const { email, password } = userInfo

    let index = dummyUser.findIndex((item) => item['email'] === email)

    if (index > -1) {
      if (dummyUser[index].password === password) {
        setCurrentMember(dummyUser[index])
        console.log('memberInfo', dummyUser[index])
        setDisabled(false)
      } else {
        console.log('login FAILED!')
        setLoginError(true)
        setDisabled(false)
      }
    } else {
      console.log('login FAILED!')
      setLoginError(true)
      setDisabled(false)
    }
  }

  async function registerAccount(userInfo) {
    dummyUser.push(userInfo)
    console.log('Updated dummyUser : ', dummyUser)
    setDisabled(false)
    setSignupState(false)
  }
  return (
    <form className="space-y-2" action="#">
      {signupState === true && (
        <div>
          <input
            type="text"
            name="name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 hover:border-gray-400 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
            placeholder="Name"
            value={input.name}
            onChange={function (event) {
              onInputChange(event)
            }}
            onKeyDown={press}
          />
        </div>
      )}

      <div>
        <input
          type="email"
          name="email"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 hover:border-gray-400 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
          placeholder="Email"
          value={input.email}
          onChange={function (event) {
            onInputChange(event)
            setLoginError(false)
          }}
          onKeyDown={press}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={input.password}
          onChange={function (event) {
            onInputChange(event)
            setLoginError(false)
            // setDisabled(false)
          }}
          onKeyDown={press}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 hover:border-gray-400 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
        />
      </div>
      {signupState === true ? (
        <button
          id="loginBtn"
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="flex w-full cursor-pointer place-content-center rounded-lg bg-purple-500 py-2.5 text-sm font-medium text-white hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:cursor-progress disabled:bg-purple-200 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
        >
          Sign Up
        </button>
      ) : (
        <button
          id="loginBtn"
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="flex w-full cursor-pointer place-content-center rounded-lg bg-purple-500 py-2.5 text-sm font-medium text-white hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:cursor-progress disabled:bg-purple-200 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
        >
          Login
        </button>
      )}
      {loginError === true && <p className="text-center text-sm font-semibold text-red-400">아이디 또는 비밀번호가 일치하지 않습니다.</p>}
    </form>
  )
}

// let newMemo = { idx: dummyMemo.length + 1, createdDate: now, title: '', content: '' }
let dummyMemo = [
  {
    idx: 0,
    createdDate: '',
    title: '메모1',
    content: '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>'
  },
  {
    idx: 1,
    createdDate: '',
    title: '메모2',
    content: '<p>Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>'
  },
  {
    idx: 2,
    createdDate: '',
    title: '메모3',
    content: '<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>'
  }
]

let dummyUser = [
  { email: 'qazopl123@naver.com', password: 'qmfkqh135', name: '김도연' },
  { email: 'team@typelegal.io', password: 'mlt_dykim1', name: '타입리걸' }
]

// const today = new Date()
// const rndInt = Math.floor(Math.random() * 4) + 1 // random integer from 1 to 4
// const randomDate = today.setDate(today.getDate() - (index + 1) * rndInt); // generate random date in the past
// const date = new Date(randomDate)

/*
  h-[calc(100vh-68px)]
  bg-[#F7F9FD]
*/
const data = [
  { id: '엘지', label: '엘지' },
  { id: '리걸인사이트', label: '리걸인사이트' }
]

const Dropdown = ({ selectedItem, setSelectedItem }) => {
  const [isOpen, setOpen] = useState(false)
  const [items, setItem] = useState(data)

  const toggleDropdown = () => {
    console.log('clicked')
    setOpen(!isOpen)
  }

  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id)
    console.log('id', id)
    setOpen(!isOpen)
  }

  return (
    <div className="mb-4 w-full rounded-lg bg-white text-sm font-semibold shadow">
      <div className="flex cursor-pointer items-center justify-between px-4 py-3" onClick={(e) => toggleDropdown()}>
        {selectedItem ? items.find((item) => item.id == selectedItem).label : '계약서 타입 선택'}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#91A5BE" className={`h-4 w-4 duration-150 ${isOpen === true && 'rotate-90'}`}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>

        {/* <i className={`fa fa-chevron-right text-sm text-[#91A5BE] ${isOpen === true && 'block'}`}></i> */}
      </div>
      <div className={`border-t border-[#E5E8EC] ${isOpen !== true && 'hidden'}`}>
        {items.map((item) => (
          <div className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={(e) => handleItemClick(e.target.id)} id={item.id}>
            <span className={`text-fuchsia-500 opacity-0 ${item.id == selectedItem && 'opacity-100'}`}>• </span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
