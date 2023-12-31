export function cleanAssetArray(asset) {
  console.log('[.../clib] entered cleanAssetArray function')
  const contentArray = asset?.contentArray // [20여개의 조항 객체로 구성된 배열]
  console.log('contentArray', contentArray)
  // let clib_clause = {contract_title: asset["title"], clause_title: "", content_array: [], content_html: "", cIdx: null, source: asset["source"], industry: asset["industry"], partyA: asset["partyA"], partyB: asset["partyB"], url: asset["url"], creator: asset["creator"], clib_category: asset["categories"], clib_contract: asset["contracts"], clib_asset: asset["_id"]}
  // let clib_clause_array = []

  for (let i = 0; i < contentArray?.length; i++) {
    const clause_array = contentArray[i]
    const tag = findTag(clause_array) // array of object의 매칭되는 key값이 있는지 찾아줌
    const spanTag = clause_array.some((x) => x.tag === 'span') // 있으면 true, 없으면 false
    const spanType = { next: clause_array.some((x) => x.type === 'next'), date: clause_array.some((x) => x.type === 'date'), closing: clause_array.some((x) => x.type === 'closing') }

    if (spanTag === true) {
      if (spanType.next === true) {
        const nextIndex = clause_array?.findIndex((x) => x.tag === 'span' && x.type === 'next') // 이 span element가 계약서의 마지막 내용이라고 본다.
        asset.contentArray[i] = asset.contentArray[i].slice(0, nextIndex)
      }
      if (spanType.closing === true) {
        const closingIndex = clause_array?.findIndex((x) => x.tag === 'span' && x.type === 'closing') // 이 span element가 계약서의 마지막 내용이라고 본다.
        // const dateIndex = clause_array?.findIndex((x) => x.tag === 'span' && x.type === 'date') // 이 span element가 계약서의 마지막 내용이라고 본다.
        // const spanIndex = Math.min(dateIndex, closingIndex)
        // console.log('spanIndex', spanIndex)
        asset.contentArray[i] = asset.contentArray[i].slice(0, closingIndex)
      }
    }
  }

  const clauses = getClauseAsset(asset)
  console.log('clauses', clauses)
  //   return { contract_asset: asset, clause_asset: clauses }
  return asset
}

// findTag([Array of Object]) : array of object의 매칭되는 key값이 있는지 찾아줌
const findTag = (clause) => {
  if (clause.some((x) => x.tag === 'h1')) return 'h1'
  else if (clause.some((x) => x.tag === 'h2')) return 'h2'
  else return 'NaN'
}

function getClauseAsset(asset) {
  console.log('[.../clib] entered clib_postClauseList function')
  //   console.log('asset ?? ', asset)
  // const assets = await clib_getContractList(); // a = asset
  // const asset = assets[0] // 1개로 일단 테스트
  // const contentArray = assets[0].contentArray // [20여개의 조항 객체로 구성된 배열]
  const contentArray = asset.contentArray // [20여개의 조항 객체로 구성된 배열]

  let clib_clause = {
    contract_title: asset['title'],
    clause_title: '',
    content_array: [],
    content_html: '',
    cIdx: null,
    source: asset['source'],
    industry: asset['industry'],
    partyA: asset['partyA'],
    partyB: asset['partyB'],
    url: asset['url'],
    creator: asset['creator'],
    clib_category: asset['categories'],
    clib_contract: asset['contracts'],
    clib_asset: asset['_id']
  }
  let clib_clause_array = []

  if (!contentArray) return

  for (let i = 0; i < contentArray.length; i++) {
    const clause_array = contentArray[i]
    const tag = findTag(clause_array) // array of object의 매칭되는 key값이 있는지 찾아줌
    const spanTag = clause_array.some((x) => x.tag === 'span') // 있으면 true, 없으면 false

    // if(tag === "h2" && spanTag === false) {
    if (tag === 'h2') {
      let html = ''
      for (let j = 1; j < clause_array.length; j++) {
        html = html + clause_array[j].html
      }
      clib_clause = { ...clib_clause, ...{ clause_title: clause_array[0].text, content_array: clause_array.slice(1), content_html: html, cIdx: parseInt(clause_array[0].idx) } }
      clib_clause_array.push(clib_clause)
    }
    // else if(tag === "h2" && spanTag === true) {
    //     const spanIndex = clause_array.findIndex((x) => x.tag === "span" && x.type === "date") // 이 span element가 계약서의 마지막 내용이라고 본다.
    //     console.log("spanIndex", spanIndex)

    //     let html = ""
    //     for(let j = 1; j < spanIndex; j++) {
    //         html = html + clause_array[j].html
    //     }
    //     clib_clause = { ...clib_clause, ...{ clause_title: clause_array[0].text, content_array: clause_array.slice(1, spanIndex), content_html: html, cIdx: parseInt(clause_array[0].idx) } }
    //     clib_clause_array.push(clib_clause)
    // }
  }
  return clib_clause_array
}
