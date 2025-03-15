import { useEffect, useState, useRef } from 'react'
import Layout from 'components/layout'
import Head from 'next/head'

import { sample, sample2, sample3, sample4 } from 'utils/dlData'

import { insert_contractData } from '/pages/api/clib/post'
import { cleanAssetArray } from 'components/module/asset.js'
// import { SessionContext } from '/pages/_app'

let DATA_NEW = {
  title: '',
  partyA: '',
  partyB: '',
  purpose: '',
  clauseArray: [],
  contentArray: [],
  industry: '',
  language: '',
  source: '',
  creator: ''
}

const now = new Date()

export default function Upload() {
  const [selectedItem, setSelectedItem] = useState('리걸인사이트')
  const [input, setInput] = useState({
    source: '리걸인사이트',
    industry: '',
    language: '국문',
    creator: '김도연'
  })
  const [metaData, setMetaData] = useState({ purpose: '', partyA: '', partyB: '' })
  const [appendix, setAppendix] = useState([])
  const [disabled, setDisabled] = useState(false)

  const [contentArray, setContentArray] = useState([])
  const [highlightedText, setHighlightedText] = useState([])

  const [selectedText, setSelectedText] = useState('')
  const [finalData, setFinalData] = useState([])
  const [groupedArray, setGroupedArray] = useState([])

  const [newData, setNewData] = useState({})

  const [contractAsset, setContractAsset] = useState({})

  useEffect(() => {
    // async function getPageData() {
    if (window.document) {
      // setToggleDropzone(true)
      const inputElement = document.getElementById(`fileInput`) // declare once

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

    // }
    // getPageData()
  }, [])

  useEffect(() => {
    console.log('metaData', metaData)
  }, [metaData])

  useEffect(() => {
    console.log('appendix', appendix)
  }, [appendix])

  const onInputChange = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    if (!contentArray.length > 0) return
    console.log('[useEffect] contentArray', contentArray)
    console.log('[useEffect] groupedArray', groupedArray)
    const articles = contentArray.filter((x) => x.tag && x.tag === 'h2')
    const contractTitle = contentArray.filter((x) => x.tag && x.tag === 'h1')[0].text
    const purpose = metaData?.purpose
    const partyA = metaData?.partyA
    const partyB = metaData?.partyB

    DATA_NEW = { ...DATA_NEW, ...{ title: contractTitle, partyA: partyA, partyB: partyB, purpose: purpose, clauseArray: articles, contentArray: groupedArray, appendix: appendix.length > 0 ? appendix : null } }
    console.log('DATA_NEW', DATA_NEW)
    // setNewData({ ...newData, ...{ title: title, partyA: partyA, partyB: partyB, purpose: purpose, clauseArray: articles, contentArray: groupedArray } })
    setNewData(DATA_NEW)

    // const title = filterArticle(contentArray)
    // console.log('계약서 명칭 : ', contractTitle)
    // console.log('계약의 목적 : ', purpose)
    // console.log('갑 : ', partyA)
    // console.log('을 : ', partyB)
    // console.log('조항제목 : ', articles)
  }, [contentArray, groupedArray, metaData, appendix])

  useEffect(() => {
    console.log('[useEffect] newData', newData)
    console.log('[useEffect] newData clauseArray', newData.clauseArray)
    const refinedData = cleanAssetArray(newData)
    console.log('refinedData', refinedData)
    // console.log('refinedData', refinedData)
    setContractAsset(refinedData)
  }, [newData])

  useEffect(() => {
    console.log('contractAsset', contractAsset)
  }, [contractAsset])

  const onSubmit = () => {
    // setDisabled(true)
    let DATA_TO_SAVE = { ...contractAsset, ...{ source: input.source, industry: input.industry, creator: input.creator, language: input.language } }
    console.log('DATA_TO_SAVE', DATA_TO_SAVE)
    insert_contractData(DATA_TO_SAVE)
    // let loginInfo = { email: input.userEmail, password: input.password }
    // loginAccount(loginInfo)
  }

  // useEffect(() => {
  //   let htmlSample = new DOMParser().parseFromString(sample4, 'text/html')
  //   let matches = htmlSample.querySelectorAll('span')
  //   let listMatches = htmlSample.querySelectorAll('li')
  //   // console.log('htmlSample', htmlSample)
  //   // matches = matches.concat(listMatches)
  //   // console.log('matches', matches)

  //   for (let i = 0; i < matches.length; i++) {
  //     //   console.log('style : ', matches[i].style)
  //     let blue = []
  //     let red = []
  //     let element = matches[i]
  //     let elementStyle = matches[i].getAttribute('style')
  //     if (Object.values(matches[i].style).includes('color')) {
  //       // console.log('match : ', matches[i])
  //       // console.log('style : ', matches[i].getAttribute('style').toString())
  //       if (elementStyle.toString().includes('#0070c0')) {
  //         // blue.push({text: element.innerHTML})
  //         spans.push({ text: element.innerText, color: 'blue' })
  //       } else if (elementStyle.toString().includes('#ff0000')) {
  //         // red.push({text: element.innerHTML})
  //         spans.push({ text: element.innerText, color: 'red' })
  //       } else if (elementStyle.toString().includes('#7030a0')) {
  //         // red.push({text: element.innerHTML})
  //         spans.push({ text: element.innerText, color: 'purple' })
  //       }
  //     }
  //   }
  //   for (let i = 0; i < listMatches.length; i++) {
  //     //   console.log('style : ', matches[i].style)
  //     let blue = []
  //     let red = []
  //     let element = listMatches[i]
  //     let elementStyle = listMatches[i].getAttribute('style')
  //     if (Object.values(listMatches[i].style).includes('color')) {
  //       // console.log('match : ', listMatches[i])
  //       // console.log('style : ', matches[i].getAttribute('style').toString())
  //       if (elementStyle.toString().includes('#0070c0')) {
  //         // blue.push({text: element.innerHTML})
  //         spans.push({ text: element.innerText, color: 'blue' })
  //       } else if (elementStyle.toString().includes('#ff0000')) {
  //         // red.push({text: element.innerHTML})
  //         spans.push({ text: element.innerText, color: 'red' })
  //       } else if (elementStyle.toString().includes('#7030a0')) {
  //         // red.push({text: element.innerHTML})
  //         spans.push({ text: element.innerText, color: 'purple' })
  //       }
  //     }
  //   }

  //   console.log('spans array : ', spans)
  //   setHighlightedText(spans)
  // }, [])

  const handleChange = (e) => {
    const inputElement = document.getElementById(`fileInput`) // declare once

    let files = inputElement.files // e.dataTransfer.files

    console.log('files', files)
    for (let i = 0; i < files.length; i++) {
      let size = uploadFiles.push({ file: files[i], uploadURL: '', buffer: '', _id: String(Number(Math.floor(Math.random() * 10000000000))) })
      preview(files[i], size - 1)
    }
    renderFiles(uploadFiles)
    console.log('1. ', uploadFiles)
  }

  const handleClick = (e) => {
    const inputElement = document.getElementById(`fileInput`) // declare once

    inputElement.click()
    e.target.value = null
  }

  async function handleDrop(e) {
    e.preventDefault()

    const inputElement = document.getElementById(`fileInput`) // declare once
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
          // clauseArray[i].html = '<br/>' // <br/>이 연속해서 나오는 않는 경우에만 넣어줌 (테이블 때문에)
          clauseArray[i].html = '<br/>' // <br/>이 연속해서 나오는 않는 경우에만 넣어줌 (테이블 때문에)
        } else {
          clauseArray[i].html = ''
        }
      }
      // 리스트 html 렌더링에 중요한 부분...
      else if (clauseArray[i].tag === 'ol' || clauseArray[i].tag === 'ul') {
        console.log('inside list!')
        let listHtml = ''
        let sublistHtml = ''
        for (let k = 0; k < clauseArray[i].text.length; k++) {
          //   clauseArray[i].text[k].text = `<${clauseArray[i].text[k].tag} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].text}</${clauseArray[i].text[k].tag}>`
          if (clauseArray[i].text[k].subText.length > 0) {
            for (let x = 0; x < clauseArray[i].text[k].subText.length; x++) {
              sublistHtml = sublistHtml.concat(
                '',
                `<${clauseArray[i].text[k].subText[x].tag} name='level-two-item' class='level-two-item' id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].subText[x].text}</${
                  clauseArray[i].text[k].subText[x].tag
                }>`
              )
              console.log('sublistHtml', sublistHtml)
            }
            sublistHtml = `<ol name='level-two-list' class='level-two-list list-[upper-roman]'>${sublistHtml}</ol>`
            // listHtml = listHtml.concat(`<${clauseArray[i].text[k].tag} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].text}</${clauseArray[i].text[k].tag}>`, sublistHtml)
            listHtml = listHtml.concat(
              '',
              `<${clauseArray[i].text[k].tag} name='level-one-item' class='level-one-item' id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].text}${sublistHtml}</${clauseArray[i].text[k].tag}>`
            )
            sublistHtml = ''
            // listHtml = listHtml.concat(sublistHtml, `<${clauseArray[i].text[x].tag} id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[x].text}</${clauseArray[i].text[x].tag}>`)
          } else {
            listHtml = listHtml.concat(
              '',
              `<${clauseArray[i].text[k].tag} name='level-one-item' class='level-one-item' id=${String(Number(Math.floor(Math.random() * 10000000000)))}>${clauseArray[i].text[k].text}</${clauseArray[i].text[k].tag}>`
            )
          }
        }

        clauseArray[i].html = `<${clauseArray[i].tag} name='level-one-list' class='level-one-list' id=${clauseArray[i]._id}>${listHtml}</${clauseArray[i].tag}>`
      }
      // else if (clauseArray[i].tag === 'span') {
      //   console.log('span!', clauseArray[i])
      //   clauseArray[i].html = `<${clauseArray[i].tag}>${clauseArray[i].text}</${clauseArray[i].tag}>`
      // }
      else {
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
      if (selectedItem === '엘지') {
        console.log('엘지')
        options = {
          //   styleMap: ["h1[style-name='제목 1'] => h1:fresh", "h2[style-name='제목 2'] => h3:fresh", "p[style-name='표준'] => h4:fresh", "p[style-name='list'] => ol > li > p:fresh"],
          styleMap: [
            //   "p[style-name='heading1'] => h1.title:fresh",
            "p[style-name='TITLE'] => h1.title:fresh",
            "p[style-name='제목1'] => h11.title:fresh",

            "p[style-name='제1조'] => h2.title:fresh",
            "p[style-name='제1.1조'] => ol.level-one > li.one:fresh",
            // "p[style-name='제1.1조'] => ol.level-one:fresh",

            "p[style-name='(가)'] => ol.level-one > li.two:fresh",
            // "p[style-name='(가)'] => ol.level-one > ol.level-two > li.two:fresh",

            // "p[style-name='(가)'] => ol.level-one > ol.level-two > li.level-two-item:fresh",

            "p[style-name='CONTENTS'] => p.contents:fresh",

            "p[style-name='체결일'] => span.date:fresh",
            "p[style-name='목적'] => span.purpose:fresh",
            "p[style-name='당사자1'] => span.party1:fresh",
            "p[style-name='당사자2'] => span.party2:fresh",
            "p[style-name='서문'] => p.opening:fresh",
            "p[style-name='다음'] => span.next:fresh",
            "p[style-name='끝문장'] => span.closing:fresh",
            "p[style-name='첨부1'] => span.annex1:fresh",
            "p[style-name='첨부2'] => span.annex2:fresh",
            "p[style-name='첨부3'] => span.annex3:fresh",
            "p[style-name='첨부4'] => span.annex4:fresh",
            "p[style-name='첨부5'] => span.annex5:fresh",
            "p[style-name='첨부6'] => span.annex6:fresh",

            'p.highlight => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > span.mark-up:fresh',
            'comment-reference => sup',
            "p[style-name='표준'] => h4.heading-side:fresh"
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
            "p[style-name='목적'] => span.purpose:fresh",
            "p[style-name='당사자1'] => span.party1:fresh",
            "p[style-name='당사자2'] => span.party2:fresh",
            // "p[style-name='서문'] => p.opening:fresh",
            "p[style-name='끝문장'] => span.closing:fresh",
            "p[style-name='체결일'] => span.date:fresh",
            "p[style-name='첨부1'] => span.annex1:fresh",
            "p[style-name='첨부2'] => span.annex2:fresh",
            "p[style-name='첨부3'] => span.annex3:fresh",
            "p[style-name='첨부4'] => span.annex4:fresh",
            "p[style-name='첨부5'] => span.annex5:fresh",
            "p[style-name='첨부6'] => span.annex6:fresh",

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
    let subList = []
    let table = []
    let row = []
    let annex = []

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
          if (className === 'two') {
            subList.push({
              tag: tagName,
              depth: className,
              text: text
            })
          } else if (className === 'one') {
            list.push({
              tag: tagName,
              depth: className,
              text: text,
              subText: [...subList].reverse()
            })
            subList = []
          }
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
          } else if (className.includes('annex')) {
            annex.push(text)
            console.log('annex', annex)
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
    setAppendix([...appendix, ...annex.reverse()]) // 배열에 추가

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

    let currentIdx = 0
    let contractList = []
    let contractItem = []
    for (let i = 0; i < contractData.length; i++) {
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
        <title>클립 | 문서업로드</title>
        <meta name="description" content="클립 계약서 업로드 페이지" />
        <meta property="og:title" content="클립 계약서 업로드 페이지" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`flex h-[calc(100vh-68px)] bg-[#F7F9FD] px-8`}>
        <div className="mx-auto grid h-full w-[1440px] grid-cols-5 pt-16">
          <aside className="col-span-1 grid h-full">
            <div className="flex h-full flex-col px-4">
              <Dropdown selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
              <div className="drop-zone-wrapper">
                <div className="flex flex-col gap-x-8">
                  <div onClick={(e) => handleClick(e)} onDrop={(e) => handleDrop(e)} className="drop-zone">
                    {/* <div onDrop={(e) => handleDrop(e)} className="drop-zone"> */}
                    {/* <div className="drop-zone"> */}
                    <span className="drop-zone__prompt">Drop file here or click to upload</span>
                    <input onChange={(e) => handleChange(e)} id="fileInput" type="file" name="myFile" className="drop-zone__input" />
                  </div>
                  <div className="check" id="thumbnails"></div>
                </div>
              </div>
            </div>
          </aside>
          {/* 여기! */}
          <div className="col-span-2 grid space-y-6 overflow-scroll p-8 shadow-lg">
            {finalData.length > 0 ? (
              <>
                {newData.clauseArray.length > 0 && (
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
              {contentArray.length > 0 && (
                <div className="text-xs">
                  {finalData.length === 0 ? (
                    <>
                      {contentArray.map((clause, i) => {
                        return <p key={i}>{clause.text}</p>
                      })}
                    </>
                  ) : (
                    <>
                      {finalData.map((data, i) => {
                        // console.log('data', data)
                        if (data.tag === 'h2') {
                          return (
                            <h2 key={i} className="mt-4 font-semibold underline">
                              제{data.idx}조 {data.text}
                            </h2>
                          )
                        } else if (data.tag === 'span') {
                          return (
                            <p key={i} className={`${data.type}`}>
                              {data.text}
                            </p>
                          )
                        } else {
                          return (
                            // let htmlSample = new DOMParser().parseFromString(sample4, 'text/html')
                            <div key={i} style={{ color: 'black' }} className="text-justify" dangerouslySetInnerHTML={{ __html: data.html }}></div>
                          )
                        }
                      })}
                    </>
                  )}
                </div>
              )}
              <div className="flex flex-col text-sm font-bold">{selectedText.length > 0 && <div className="text-red-600">red</div>}</div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#91A5BE" className={`h-4 w-4 duration-150 ${isOpen === true && 'rotate-90'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>

        {/* <i className={`fa fa-chevron-right text-sm text-[#91A5BE] ${isOpen === true && 'block'}`}></i> */}
      </div>
      <div className={`border-t border-[#E5E8EC] ${isOpen !== true && 'hidden'}`}>
        {items.map((item, index) => (
          <div key={index} className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={(e) => handleItemClick(e.target.id)} id={item.id}>
            <span className={`text-fuchsia-500 opacity-0 ${item.id == selectedItem && 'opacity-100'}`}>• </span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
