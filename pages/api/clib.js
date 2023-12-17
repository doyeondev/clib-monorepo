export async function getContractList() {
  console.log('[Clib] 계약서 List GET')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractList`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const details = await res.items
  return details
}

export async function getCategoryList() {
  console.log('[Clib] 카테고리 List GET')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibCategoryList`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const details = await res.items

  return details
}

export async function getContractItem(query) {
  console.log('[Clib] 계약서 Item GET')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractItem/${query}`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const detail = await res.items

  return detail
}
