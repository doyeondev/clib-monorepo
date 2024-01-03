export async function getContractList() {
  console.log('         [api] get_contractList')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractList`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const details = await res.items
  return details
}

export async function getCategoryList() {
  console.log('         [api] get_categoryList')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibCategoryList`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const details = await res.items

  return details
}

export async function getClauseCategoryList() {
  console.log('         [api] get_clauseCategoryList')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibClauseCategory`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const details = await res.items

  return details
}

export async function getContractItem(query) {
  console.log('         [api] get_contractItem')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractItem/${query}`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const detail = await res.items

  return detail
}

export async function getClibDataset(query1, query2) {
  console.log('         [api] fetch general dataset : ', query1, query2)

  if (query2 !== '') {
    const apiUrlEndpoint = `https://conan.ai/_functions/clibDataset/${query1}/${query2}`
    const response = await fetch(apiUrlEndpoint)
    const res = await response.json()
    const detail = await res.items

    return detail
  } else if (query2 === '') {
    const apiUrlEndpoint = `https://conan.ai/_functions/clibDataset/${query1}`
    const response = await fetch(apiUrlEndpoint)
    const res = await response.json()
    const detail = await res.items

    return detail
  }
}

export async function updateClippedData(data) {
  console.log('         [api] entered updateClippedData (저장하러 들어옴)')
  const apiUrlEndpoint = `https://conan.ai/_functions/saveClippedData`

  const body = JSON.stringify({
    // _id: data._id,
    data: data
  })

  return fetch(apiUrlEndpoint, {
    method: 'post',
    body
  })
    .then((response) => {
      console.log('response', response)
      if (response.ok) {
        return response.json()
      }
      return Promise.reject('fetch to wix function has failed ' + response.status)
    })
    .catch((e) => {
      console.log(`Error :  ${String(e)}`)
    })
}
