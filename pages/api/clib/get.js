export async function get_contractList() {
  console.log('[Clib] 계약서 List GET')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractList`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const data = await res.items
  return data
}

export async function get_contractItem(query) {
  console.log('[Clib] 계약서 Item GET')

  const apiUrlEndpoint = `https://conan.ai/_functions/clibContractItem/${query}`
  const response = await fetch(apiUrlEndpoint)
  const res = await response.json()
  const data = await res.items
}
