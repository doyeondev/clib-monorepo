import React, { useState } from 'react'
import AssetContext from '../Header.context'
import { getContractList, getCategoryList, getContractItem } from '/pages/api/clib'

const AssetProvider = ({ children }) => {
  const [asset, setAsset] = useState([])

  useEffect(() => {
    async function getPageData() {
      setAsset(categories[0].assets)
    }
    getPageData()
  }, [])

  // state 초기화
  //   const initialState = {
  //     view: false,
  //     toggle
  //   };

  return <AssetContext.Provider value={headerState}>{children}</AssetContext.Provider>
}

export default AssetProvider
