import React, { useState } from 'react'
import AssetContext from '../Header.context'
import { getContractList, getCategoryList, getContractItem } from '/pages/api/clib'

const CategoryProvider = ({ children }) => {
  // 타 컴포넌트에서 사용할 함수
  const [assetList, setAssetList] = useState([])
  const [contractList, setContractList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    async function getPageData() {
      const categories = await getCategoryList()
      // console.log('contracts', contracts)
      console.log('categories[0].assets(contracts)', categories[0].assets)
      console.log('categories', categories)

      setCategoryList(categories)
      setAssetList(categories[0].assets)
      setContractList(categories[0].assets)
    }
    getPageData()
  }, [])

  const updateCategory = (e) => {
    console.log('clicked id', e.target.id)
    const newCategory = categoryList.filter((x) => x._id === e.target.id)[0]
    // let newContractList = [...contractList]
    // newContractList = newCategory.assets
    console.log('newCategory', newCategory)

    setContractList(newCategory.assets)
    setCurrentCategory(newCategory)
    // alert(`Add ${newItem}`)
  }

  return <CategoryProvider.Provider value={headerState}>{children}</CategoryProvider.Provider>
}

export default CategoryProvider
