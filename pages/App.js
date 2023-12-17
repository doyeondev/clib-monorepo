import { useState } from 'react'
import Search from '/pages/index'

function App() {
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    async function getPageData() {
      // localStorage.theme = 'light'
      //   location.assign('/')
      // if (sessionStorage.getItem('item_key')) sessionStorage.removeItem('item_key') // remove contract key session

      const apiUrlEndpoint = `https://conan.ai/_functions/clibCategoryList`
      const response = await fetch(apiUrlEndpoint)
      const res = await response.json()
      const details = await res.items
      console.log('details', details)
      setCategoryList(details)
      // const data = fetchedData.contractData
    }
    getPageData()
  }, [])

  return (
    <div>
      <Search categoryList={categoryList} />
    </div>
  )
}

export default App
